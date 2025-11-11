/**
 * Script pour vérifier le solde d'un joueur
 *
 * Usage: node scripts/check-player-balance.js
 */

const mongoose = require('mongoose')

// Schéma Player simplifié
const playerSchema = new mongoose.Schema({
  userId: String,
  coins: Number,
  totalMonstersCreated: Number
})

const Player = mongoose.model('Player', playerSchema)

async function checkBalance () {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tamagocho'
    await mongoose.connect(mongoUri)
    console.log('✅ Connecté à MongoDB')

    // Récupérer tous les players
    const players = await Player.find({})

    console.log('\n📊 Soldes des joueurs:')
    console.log('━'.repeat(50))

    if (players.length === 0) {
      console.log('❌ Aucun joueur trouvé dans la base de données')
    } else {
      for (const player of players) {
        console.log(`👤 User ID: ${player.userId}`)
        console.log(`💰 Coins: ${player.coins} TC`)
        console.log(`🎮 Monstres créés: ${player.totalMonstersCreated}`)
        console.log('─'.repeat(50))
      }
    }

    await mongoose.disconnect()
    console.log('✅ Déconnecté de MongoDB')
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

checkBalance()
