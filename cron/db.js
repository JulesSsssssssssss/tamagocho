import { mongoose } from 'mongoose'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME}`

/**
 * Calcule l'état émotionnel du monstre en fonction de ses statistiques
 * Même logique que dans monsters.actions.ts
 */
function calculateMonsterState (hunger, energy, happiness) {
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

async function connectToDatabase () {
  try {
    console.info(uri)
    await mongoose.connect(uri)
    console.info('Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('Error connecting to the database:', error)
  }
}

async function updateMonstersStates () {
  try {
    const monsters = await mongoose.connection.db.collection('monsters').find({}).toArray()
    console.info(`🔄 Updating ${monsters.length} monsters...`)

    for (const monster of monsters) {
      // Décroissance des stats (réduit chaque stat de 1 à 5 points)
      const hungerDecay = Math.floor(Math.random() * 5) + 1
      const energyDecay = Math.floor(Math.random() * 5) + 1
      const happinessDecay = Math.floor(Math.random() * 3) + 1 // Bonheur décroît plus lentement

      const newHunger = Math.max(0, (monster.hunger || 50) - hungerDecay)
      const newEnergy = Math.max(0, (monster.energy || 50) - energyDecay)
      const newHappiness = Math.max(0, (monster.happiness || 50) - happinessDecay)

      // Calculer le nouvel état basé sur les stats
      const newState = calculateMonsterState(newHunger, newEnergy, newHappiness)

      // Mettre à jour le monstre
      await mongoose.connection.db.collection('monsters').updateOne(
        { _id: monster._id },
        {
          $set: {
            hunger: newHunger,
            energy: newEnergy,
            happiness: newHappiness,
            state: newState
          }
        }
      )

      console.info(`✅ Monster ${monster.name} (${monster._id}): hunger ${monster.hunger || 50}→${newHunger}, energy ${monster.energy || 50}→${newEnergy}, happiness ${monster.happiness || 50}→${newHappiness}, state: ${newState}`)
    }
  } catch (error) {
    console.error('Error updating monsters states:', error)
  }
}

export {
  connectToDatabase,
  updateMonstersStates
}
