/**
 * API Route pour mettre à jour automatiquement les états des monstres
 *
 * Cette route peut être appelée :
 * - Automatiquement par le frontend via le composant MonstersAutoUpdater
 * - Manuellement via curl/Postman pour tester
 * - Par un service externe de ping (optionnel)
 *
 * @endpoint GET/POST /api/cron/update-monsters
 */
import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { client } from '@/db'

const MONSTER_STATES = ['sad', 'angry', 'hungry', 'sleepy'] as const

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 secondes max d'exécution

/**
 * Logger avec timestamp pour un meilleur suivi
 */
function log (level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>): void {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [CRON-UPDATE-MONSTERS] [${level.toUpperCase()}]`

  if (data !== undefined) {
    console[level](`${prefix} ${message}`, data)
  } else {
    console[level](`${prefix} ${message}`)
  }
}

/**
 * Calcule l'état émotionnel du monstre en fonction de ses statistiques
 * Même logique que dans monsters.actions.ts
 */
function calculateMonsterState (hunger: number, energy: number, happiness: number): string {
  // Cas critique : une stat est très basse (< 20) → angry
  if (hunger < 20 || energy < 20 || happiness < 20) {
    return 'angry'
  }

  // Cas optimal : toutes les stats sont élevées (>= 80) → happy
  if (hunger >= 80 && energy >= 80 && happiness >= 80) {
    return 'happy'
  }

  // Trouver la stat la plus basse
  const minStat = Math.min(hunger, energy, happiness)

  // Priorité : hunger > energy > happiness si égalité
  if (hunger === minStat) {
    return 'hungry'
  }
  if (energy === minStat) {
    return 'sleepy'
  }
  if (happiness === minStat) {
    return 'sad'
  }

  // Fallback
  return 'happy'
}

export async function GET (request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()

  // Récupérer l'userId depuis les query params
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')

  log('info', `🚀 Démarrage de la mise à jour des monstres${userId !== null ? ` pour l'utilisateur ${userId}` : ''}...`)

  try {
    // 1. Sécurité optionnelle : vérifier un token secret
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.CRON_SECRET_TOKEN

    if ((expectedToken ?? '') !== '') {
      if (authHeader !== `Bearer ${expectedToken ?? ''}`) {
        log('warn', '🔒 Tentative d\'accès non autorisée', {
          ip: request.headers.get('x-forwarded-for') ?? 'unknown',
          userAgent: request.headers.get('user-agent') ?? 'unknown'
        })

        return NextResponse.json(
          { error: 'Unauthorized', message: 'Invalid or missing token' },
          { status: 401 }
        )
      }
    }

    // 2. Connexion à MongoDB
    log('info', '🔌 Connexion à MongoDB...')
    const db = client.db()
    const monstersCollection = db.collection('monsters')
    log('info', '✅ Connecté à MongoDB')

    // 3. Récupération des monstres (filtrés par userId si fourni)
    log('info', '📊 Récupération des monstres...')
    // Le champ dans MongoDB s'appelle 'ownerId' (pas 'userId') et est un ObjectId
    const query = (userId !== null) ? { ownerId: new ObjectId(userId) } : {}
    const monsters = await monstersCollection.find(query).toArray()
    log('info', `📊 ${monsters.length} monstre(s) trouvé(s)`, { query })

    if (monsters.length === 0) {
      const message = userId !== null
        ? `Aucun monstre trouvé pour l'utilisateur ${userId}`
        : 'Aucun monstre à mettre à jour'
      log('warn', `⚠️ ${message}`)
      return NextResponse.json({
        success: true,
        updated: 0,
        message,
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime
      })
    }

    // 4. Mise à jour des monstres avec dégradation des stats
    log('info', '🔄 Démarrage de la mise à jour...')
    let updatedCount = 0
    const updates: Array<{ id: string, oldStats: { hunger: number, energy: number, happiness: number, state: string }, newStats: { hunger: number, energy: number, happiness: number, state: string } }> = []

    for (const monster of monsters) {
      // Récupérer les stats actuelles (par défaut 50 si undefined)
      const currentHunger = (monster.hunger as number | undefined) ?? 50
      const currentEnergy = (monster.energy as number | undefined) ?? 50
      const currentHappiness = (monster.happiness as number | undefined) ?? 50
      const currentState = (monster.state as string | undefined) ?? 'unknown'

      // Décroissance des stats (réduit chaque stat de 1 à 5 points)
      const hungerDecay = Math.floor(Math.random() * 5) + 1
      const energyDecay = Math.floor(Math.random() * 5) + 1
      const happinessDecay = Math.floor(Math.random() * 3) + 1 // Bonheur décroît plus lentement

      const newHunger = Math.max(0, currentHunger - hungerDecay)
      const newEnergy = Math.max(0, currentEnergy - energyDecay)
      const newHappiness = Math.max(0, currentHappiness - happinessDecay)

      // Calculer le nouvel état basé sur les stats
      const newState = calculateMonsterState(newHunger, newEnergy, newHappiness)

      await monstersCollection.updateOne(
        { _id: monster._id },
        {
          $set: {
            hunger: newHunger,
            energy: newEnergy,
            happiness: newHappiness,
            state: newState,
            updatedAt: new Date(),
            lastCronUpdate: new Date()
          }
        }
      )

      updatedCount++
      updates.push({
        id: String(monster._id),
        oldStats: { hunger: currentHunger, energy: currentEnergy, happiness: currentHappiness, state: currentState },
        newStats: { hunger: newHunger, energy: newEnergy, happiness: newHappiness, state: newState }
      })

      log('info', `✨ Monstre ${String(monster._id)}: hunger ${currentHunger}→${newHunger}, energy ${currentEnergy}→${newEnergy}, happiness ${currentHappiness}→${newHappiness}, state: ${currentState}→${newState}`)
    }

    // 5. Logs finaux
    const duration = Date.now() - startTime
    log('info', `✅ Mise à jour terminée: ${updatedCount} monstre(s) en ${duration}ms`)

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      timestamp: new Date().toISOString(),
      duration,
      details: updates
    })
  } catch (error) {
    const duration = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined

    log('error', '❌ Erreur lors de la mise à jour des monstres', {
      message: errorMessage,
      stack: errorStack,
      duration
    })

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: errorMessage,
        timestamp: new Date().toISOString(),
        duration
      },
      { status: 500 }
    )
  }
}

// Support pour POST aussi (pour compatibilité)
export async function POST (request: NextRequest): Promise<NextResponse> {
  return await GET(request)
}
