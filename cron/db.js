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

/**
 * Nettoie les quêtes expirées de tous les utilisateurs
 */
async function cleanupExpiredQuests () {
  try {
    const now = new Date()

    const result = await mongoose.connection.db.collection('quests').deleteMany({
      expiresAt: { $lt: now }
    })

    console.info(`🧹 Cleaned up ${result.deletedCount} expired quests`)
    return result.deletedCount
  } catch (error) {
    console.error('Error cleaning up expired quests:', error)
    return 0
  }
}

/**
 * Configuration des types de quêtes disponibles
 * (Synchronisé avec src/config/quests.config.ts)
 */
const QUEST_TYPES_CONFIG = [
  { type: 'FEED_MONSTER', description: 'Nourris 5 fois ton monstre aujourd\'hui', target: 5, reward: 20, difficulty: 1 },
  { type: 'LEVEL_UP_MONSTER', description: 'Fais évoluer un monstre d\'un niveau', target: 1, reward: 50, difficulty: 3 },
  { type: 'INTERACT_MONSTERS', description: 'Interagis avec 3 monstres différents', target: 3, reward: 30, difficulty: 2 },
  { type: 'BUY_ITEM', description: 'Achète un accessoire dans la boutique', target: 1, reward: 40, difficulty: 2 },
  { type: 'MAKE_MONSTER_PUBLIC', description: 'Rends un monstre public', target: 1, reward: 15, difficulty: 1 },
  { type: 'PLAY_WITH_MONSTER', description: 'Joue avec ton monstre 3 fois', target: 3, reward: 25, difficulty: 1 },
  { type: 'SLEEP_MONSTER', description: 'Fais dormir ton monstre 2 fois', target: 2, reward: 20, difficulty: 1 },
  { type: 'CLEAN_MONSTER', description: 'Nettoie ton monstre 3 fois', target: 3, reward: 25, difficulty: 1 },
  { type: 'VISIT_GALLERY', description: 'Visite la galerie 5 fois', target: 5, reward: 15, difficulty: 1 },
  { type: 'EQUIP_ITEM', description: 'Équipe 2 accessoires différents', target: 2, reward: 30, difficulty: 2 }
]

/**
 * Génère 3 quêtes équilibrées (1 facile, 1 moyenne, 1 difficile)
 */
function generateBalancedQuests () {
  const easy = QUEST_TYPES_CONFIG.filter(q => q.difficulty === 1)
  const medium = QUEST_TYPES_CONFIG.filter(q => q.difficulty === 2)
  const hard = QUEST_TYPES_CONFIG.filter(q => q.difficulty === 3)

  const selectedQuests = []
  const usedTypes = new Set() // Pour éviter les doublons

  // Sélectionner une quête facile aléatoire
  if (easy.length > 0) {
    const randomEasy = easy[Math.floor(Math.random() * easy.length)]
    selectedQuests.push(randomEasy)
    usedTypes.add(randomEasy.type)
  }

  // Sélectionner une quête moyenne aléatoire (différente de la facile)
  if (medium.length > 0) {
    const availableMedium = medium.filter(q => !usedTypes.has(q.type))
    if (availableMedium.length > 0) {
      const randomMedium = availableMedium[Math.floor(Math.random() * availableMedium.length)]
      selectedQuests.push(randomMedium)
      usedTypes.add(randomMedium.type)
    } else {
      // Fallback: si toutes les moyennes sont déjà utilisées, prendre n'importe quelle moyenne
      const randomMedium = medium[Math.floor(Math.random() * medium.length)]
      selectedQuests.push(randomMedium)
      usedTypes.add(randomMedium.type)
    }
  }

  // Sélectionner une quête difficile aléatoire (différente des précédentes)
  if (hard.length > 0) {
    const availableHard = hard.filter(q => !usedTypes.has(q.type))
    if (availableHard.length > 0) {
      const randomHard = availableHard[Math.floor(Math.random() * availableHard.length)]
      selectedQuests.push(randomHard)
      usedTypes.add(randomHard.type)
    } else {
      // Fallback: si toutes les difficiles sont déjà utilisées, prendre n'importe quelle difficile
      const randomHard = hard[Math.floor(Math.random() * hard.length)]
      selectedQuests.push(randomHard)
      usedTypes.add(randomHard.type)
    }
  }

  return selectedQuests
}

/**
 * Génère de nouvelles quêtes quotidiennes pour tous les utilisateurs
 * Appelé à minuit pour renouveler les quêtes
 */
async function generateDailyQuests () {
  try {
    console.info('🎯 Starting daily quest generation...')

    // Récupérer tous les utilisateurs uniques (via la collection users ou players)
    const users = await mongoose.connection.db.collection('user').find({}).toArray()

    if (!users || users.length === 0) {
      console.info('⚠️ No users found in database')
      return { generated: 0, users: 0 }
    }

    console.info(`👥 Found ${users.length} users`)

    let totalGenerated = 0

    for (const user of users) {
      const userId = user.id || user._id.toString()

      // Supprimer les anciennes quêtes de cet utilisateur (expirées ou non)
      await mongoose.connection.db.collection('quests').deleteMany({
        userId
      })

      // Générer 3 nouvelles quêtes équilibrées
      const questsToGenerate = generateBalancedQuests()

      // Date d'expiration : demain à minuit
      const now = new Date()
      const expiresAt = new Date(now)
      expiresAt.setDate(expiresAt.getDate() + 1)
      expiresAt.setHours(0, 0, 0, 0)

      // Insérer les nouvelles quêtes
      const questDocuments = questsToGenerate.map(quest => ({
        userId,
        type: quest.type,
        description: quest.description,
        target: quest.target,
        progress: 0,
        progressDetails: {},
        reward: quest.reward,
        claimed: false,
        createdAt: now,
        expiresAt
      }))

      if (questDocuments.length > 0) {
        await mongoose.connection.db.collection('quests').insertMany(questDocuments)
        totalGenerated += questDocuments.length
        console.info(`✅ Generated ${questDocuments.length} quests for user ${userId}`)
      }
    }

    console.info(`🎉 Successfully generated ${totalGenerated} quests for ${users.length} users`)
    return { generated: totalGenerated, users: users.length }
  } catch (error) {
    console.error('❌ Error generating daily quests:', error)
    return { generated: 0, users: 0, error: error.message }
  }
}

export {
  connectToDatabase,
  updateMonstersStates,
  cleanupExpiredQuests,
  generateDailyQuests
}
