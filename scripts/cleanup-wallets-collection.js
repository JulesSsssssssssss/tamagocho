/**
 * Script de nettoyage : Supprimer la collection 'wallets'
 *
 * Cette collection n'est plus utilisée car nous utilisons maintenant
 * Player.coins comme source unique de vérité pour la monnaie.
 *
 * Usage: node scripts/cleanup-wallets-collection.js
 */

const mongoose = require('mongoose')

async function cleanupWallets () {
  try {
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tamagocho'
    await mongoose.connect(mongoUri)
    console.log('✅ Connecté à MongoDB')

    // Vérifier si la collection existe
    const collections = await mongoose.connection.db.listCollections({ name: 'wallets' }).toArray()

    if (collections.length === 0) {
      console.log('ℹ️  La collection "wallets" n\'existe pas (déjà supprimée ou jamais créée)')
    } else {
      // Compter les documents avant suppression
      const count = await mongoose.connection.db.collection('wallets').countDocuments()
      console.log(`📊 Collection "wallets" trouvée avec ${count} document(s)`)

      // Supprimer la collection
      await mongoose.connection.db.dropCollection('wallets')
      console.log('🗑️  Collection "wallets" supprimée avec succès !')
    }

    await mongoose.disconnect()
    console.log('✅ Déconnecté de MongoDB')
  } catch (error) {
    console.error('❌ Erreur:', error)
    process.exit(1)
  }
}

cleanupWallets()
