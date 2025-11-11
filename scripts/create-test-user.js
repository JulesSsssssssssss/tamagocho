#!/usr/bin/env node

/**
 * Script pour créer un utilisateur de test dans MongoDB
 * Usage: node scripts/create-test-user.js
 */

const fs = require('fs')
const path = require('path')
const { MongoClient, ServerApiVersion } = require('mongodb')
const crypto = require('crypto')

// Charger les variables d'environnement depuis .env.local
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
}

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DATABASE_NAME}${process.env.MONGODB_PARAMS}&appName=${process.env.MONGODB_APP_NAME}`
const dbName = process.env.MONGODB_DATABASE_NAME || 'tamagocho-db'

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 5000,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

/**
 * Hache un mot de passe avec bcrypt-like (simple pour test)
 */
function hashPassword (password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

async function createTestUser () {
  try {
    await client.connect()
    console.log('✅ Connecté à MongoDB\n')

    const db = client.db(dbName)
    const usersCollection = db.collection('user')

    // Données de l'utilisateur test
    const testEmail = 'test@tamagocho.com'
    const testPassword = 'Test123456!'
    const testName = 'Test User'

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await usersCollection.findOne({ email: testEmail })
    if (existingUser !== null) {
      console.log('⚠️  L\'utilisateur test existe déjà')
      console.log('📧 Email:', testEmail)
      console.log('🆔 ID:', existingUser._id)
      console.log('\n💡 Vous pouvez vous connecter avec:')
      console.log('   Email:', testEmail)
      console.log('   Password:', testPassword)
      return
    }

    // Créer l'utilisateur
    const userId = crypto.randomUUID()
    const now = new Date()

    const user = {
      id: userId,
      email: testEmail,
      emailVerified: false,
      name: testName,
      createdAt: now,
      updatedAt: now,
      image: null
    }

    await usersCollection.insertOne(user)
    console.log('✅ Utilisateur test créé avec succès!')
    console.log('📧 Email:', testEmail)
    console.log('👤 Nom:', testName)
    console.log('🆔 ID:', userId)

    // Créer un account pour l'authentification email/password
    const accountsCollection = db.collection('account')
    const account = {
      id: crypto.randomUUID(),
      userId,
      accountId: testEmail,
      providerId: 'credential',
      password: hashPassword(testPassword), // Note: BetterAuth utilise bcrypt, ceci est juste pour test
      createdAt: now,
      updatedAt: now
    }

    await accountsCollection.insertOne(account)
    console.log('✅ Compte d\'authentification créé')

    console.log('\n🎉 Tout est prêt!')
    console.log('\n💡 Connectez-vous avec:')
    console.log('   Email:', testEmail)
    console.log('   Password:', testPassword)
    console.log('\n⚠️  IMPORTANT: Ce mot de passe est hashé avec SHA256, pas bcrypt.')
    console.log('   La connexion pourrait ne pas fonctionner si BetterAuth utilise bcrypt.')
    console.log('   Utilisez plutôt le formulaire d\'inscription pour créer un vrai utilisateur.')
  } catch (error) {
    console.error('❌ Erreur:', error)
  } finally {
    await client.close()
  }
}

createTestUser()
