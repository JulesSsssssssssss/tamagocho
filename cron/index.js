import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectToDatabase, updateMonstersStates, cleanupExpiredQuests, generateDailyQuests } from './db.js'

dotenv.config({ path: '../.env.local' })

const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())

connectToDatabase()

app.get('/', (req, res) => {
  res.status(200).send('Hello from the cron server!')
})

app.get('/health', (req, res) => {
  res.status(200).send('Server is healthy')
})

// Route pour tester la génération manuelle de quêtes
app.post('/generate-quests', async (req, res) => {
  try {
    console.info('🎯 Manual quest generation triggered via API')
    const result = await generateDailyQuests()
    res.status(200).json({
      success: true,
      message: 'Daily quests generated successfully',
      ...result
    })
  } catch (error) {
    console.error('Error generating quests:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

const server = app.listen(PORT, () => {
  console.info(`Server is running on port ${PORT}`)

  // Background worker: loop forever and run work after a random timeout (1-10s)
  let stopped = false
  let currentTimeout = null

  const worker = async () => {
    /* eslint-disable-next-line no-unmodified-loop-condition */
    while (!stopped) {
      const delay = Math.floor(Math.random() * 60000) + 30000 // 30000..60000 ms
      await new Promise((resolve) => {
        currentTimeout = setTimeout(resolve, delay)
      })
      currentTimeout = null
      if (stopped) break

      try {
        // Replace this with the real work you want the worker to do
        console.info('[worker] run -', new Date().toISOString(), `(delay ${delay}ms)`)
        await updateMonstersStates()

        // À minuit : nettoyer les quêtes expirées et générer de nouvelles quêtes quotidiennes
        const currentHour = new Date().getHours()
        const currentMinute = new Date().getMinutes()

        if (currentHour === 0 && currentMinute < 2) { // Entre minuit et 00:02
          console.info('🕛 Midnight routine - Starting quest renewal...')

          // 1. Nettoyer les quêtes expirées
          console.info('[worker] Cleaning up expired quests...')
          await cleanupExpiredQuests()

          // 2. Générer de nouvelles quêtes pour tous les utilisateurs
          console.info('[worker] Generating new daily quests for all users...')
          const result = await generateDailyQuests()
          console.info(`[worker] Quest generation complete: ${result.generated} quests for ${result.users} users`)
        }
      } catch (err) {
        console.error('[worker] error', err)
      }
    }
    console.info('[worker] stopped')
  }

  // Start the worker (no await; it runs in background)
  worker()

  // Graceful shutdown: stop the loop, clear any pending timeout and close server
  const shutdown = (signal) => {
    console.info(`Received ${signal}, shutting down worker and server...`)
    stopped = true
    if (currentTimeout) {
      clearTimeout(currentTimeout)
      currentTimeout = null
    }
    server.close(() => {
      console.info('HTTP server closed')
      process.exit(0)
    })
    // force exit if server doesn't close in time
    setTimeout(() => process.exit(1), 5000)
  }

  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
})

export default app
