/**
 * Script pour corriger les items de fond d'écran existants
 * Ajoute le champ backgroundType manquant
 */

const { MongoClient } = require('mongodb')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tamagocho'

async function fixBackgroundItems() {
  const client = new MongoClient(MONGODB_URI)

  try {
    console.log('🔧 Connexion à MongoDB...')
    await client.connect()
    const db = client.db()
    
    // Essayer différents noms de collection
    const collections = await db.listCollections().toArray()
    console.log('📋 Collections disponibles:', collections.map(c => c.name).join(', '))
    
    const shopCollection = db.collection('shopitems')

    console.log('🔍 Recherche des items de fond d\'écran...')
    
    // Trouver tous les items de catégorie background
    const backgroundItems = await shopCollection.find({ category: 'background' }).toArray()
    
    console.log(`📦 ${backgroundItems.length} fond(s) d'écran trouvé(s)`)

    // Afficher les items trouvés
    for (const item of backgroundItems) {
      console.log(`  - ${item.name} (ID: ${item._id})`)
    }

    // Map des IDs vers leur type de fond
    const backgroundTypeMap = {
      'test_background_rare_day': 'day',
      'test_background_epic_garden': 'garden',
      'test_background_legendary_night': 'night'
    }

    let updated = 0
    
    for (const item of backgroundItems) {
      const backgroundType = backgroundTypeMap[item._id] || 'day' // Par défaut: day
      
      await shopCollection.updateOne(
        { _id: item._id },
        { $set: { backgroundType } }
      )
      console.log(`✅ Mis à jour: ${item.name} -> backgroundType: ${backgroundType}`)
      updated++
    }

    console.log(`\n✨ ${updated} item(s) mis à jour avec succès!`)
    
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
    console.log('🔌 Connexion fermée')
  }
}

fixBackgroundItems()
