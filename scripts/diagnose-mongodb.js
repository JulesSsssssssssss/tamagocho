#!/usr/bin/env node

/**
 * Script de diagnostic MongoDB
 * Vérifie la connexion et liste les collections
 *
 * Usage: node scripts/diagnose-mongodb.js
 * Assurez-vous que les variables d'environnement sont définies dans .env.local
 */

// Charger les variables d'environnement depuis .env.local
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  })
  console.log('✅ Variables d\'environnement chargées depuis .env.local\n')
} else {
  console.log('⚠️  Fichier .env.local non trouvé\n')
}

const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME}`

const dbName = process.env.MONGODB_DATABASE_NAME || 'tamagocho-db'

console.log('🔍 Diagnostic MongoDB\n')
console.log('📋 Configuration:')
console.log('  - Host:', process.env.MONGODB_HOST)
console.log('  - Database:', dbName)
console.log('  - Username:', process.env.MONGODB_USERNAME)
console.log('  - App Name:', process.env.MONGODB_APP_NAME)
console.log('\n🔗 Tentative de connexion...\n')

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function diagnose () {
  try {
    // Connexion
    await client.connect()
    console.log('✅ Connexion réussie!\n')

    // Ping
    await client.db('admin').command({ ping: 1 })
    console.log('✅ Ping réussi!\n')

    // Lister les bases de données
    const adminDb = client.db('admin')
    const dbs = await adminDb.admin().listDatabases()
    console.log('📁 Bases de données disponibles:')
    dbs.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`)
    })

    // Lister les collections de la base de données cible
    console.log(`\n📦 Collections dans "${dbName}":`)
    const db = client.db(dbName)
    const collections = await db.listCollections().toArray()

    if (collections.length === 0) {
      console.log('  ⚠️  Aucune collection trouvée')
    } else {
      for (const collection of collections) {
        const count = await db.collection(collection.name).countDocuments()
        console.log(`  - ${collection.name}: ${count} document(s)`)
      }
    }

    // Vérifier les collections BetterAuth
    console.log('\n🔐 Collections BetterAuth attendues:')
    const expectedCollections = ['user', 'session', 'account', 'verification']
    for (const collName of expectedCollections) {
      const exists = collections.some(c => c.name === collName)
      if (exists) {
        const count = await db.collection(collName).countDocuments()
        console.log(`  ✅ ${collName}: ${count} document(s)`)
      } else {
        console.log(`  ❌ ${collName}: collection manquante`)
      }
    }

    console.log('\n✅ Diagnostic terminé avec succès!')
  } catch (error) {
    console.error('\n❌ Erreur lors du diagnostic:', error.message)
    if (error.code) {
      console.error('   Code d\'erreur:', error.code)
    }
  } finally {
    await client.close()
  }
}

diagnose()
