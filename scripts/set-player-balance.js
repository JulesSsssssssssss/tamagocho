/**
 * Script pour créer ou mettre à jour le solde d'un joueur
 *
 * Usage:
 *   node scripts/set-player-balance.js [userId] [amount]
 *
 * Exemple:
 *   node scripts/set-player-balance.js test_user_123 500
 */

const mongoose = require('mongoose')

// Schéma Player
const playerSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 100 },
  totalMonstersCreated: { type: Number, default: 0 }
})

const Player = mongoose.model('Player', playerSchema)

async function setPlayerBalance (userId, amount) {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tamagocho'
    await mongoose.connect(mongoUri)
    console.log('✅ Connecté à MongoDB')

    // Convertir amount en nombre
    const coins = parseInt(amount, 10)
    if (isNaN(coins) || coins < 0) {
      console.error('❌ Le montant doit être un nombre positif')
      process.exit(1)
    }

    // Trouver ou créer le joueur
    let player = await Player.findOne({ userId })

    if (player) {
      const oldBalance = player.coins
      player.coins = coins
      await player.save()
      console.log(`✅ Solde mis à jour pour ${userId}`)
      console.log(`   Ancien solde: ${oldBalance} TC`)
      console.log(`   Nouveau solde: ${coins} TC`)
    } else {
      player = new Player({
        userId,
        coins,
        totalMonstersCreated: 0
      })
      await player.save()
      console.log(`✅ Nouveau joueur créé: ${userId}`)
      console.log(`   Solde initial: ${coins} TC`)
    }

    await mongoose.disconnect()
    console.log('✅ Déconnecté de MongoDB')
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

// Récupérer les arguments
const args = process.argv.slice(2)

if (args.length !== 2) {
  console.log('Usage: node scripts/set-player-balance.js [userId] [amount]')
  console.log('Exemple: node scripts/set-player-balance.js test_user_123 500')
  process.exit(1)
}

const [userId, amount] = args
setPlayerBalance(userId, amount)
