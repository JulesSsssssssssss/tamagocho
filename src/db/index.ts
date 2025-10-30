import { MongoClient, ServerApiVersion } from 'mongodb'
import mongoose from 'mongoose'

// Construction de l'URI MongoDB
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME as string}:${process.env.MONGODB_PASSWORD as string}@${process.env.MONGODB_HOST as string}/${process.env.MONGODB_DATABASE_NAME as string}${process.env.MONGODB_PARAMS as string}&appName=${process.env.MONGODB_APP_NAME as string}`

// Nom de la base de données (doit correspondre à celui dans l'URI)
const dbName = process.env.MONGODB_DATABASE_NAME ?? 'tamagocho-db'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 30000, // Augmenté à 30 secondes pour Vercel
  connectTimeoutMS: 30000,
  socketTimeoutMS: 30000,
  maxPoolSize: 10,
  minPoolSize: 5,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Variable pour tracker la connexion
let isConnected = false
let isMongooseConnected = false

async function connectMongooseToDatabase (): Promise<void> {
  if (isMongooseConnected) {
    console.log('✅ Mongoose already connected')
    return
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 30000,
      connectTimeoutMS: 30000
    })
    isMongooseConnected = true
    console.log('✅ Mongoose connected to MongoDB database')
  } catch (error) {
    console.error('❌ Error connecting Mongoose to the database:', error)
    throw error
  }
}

async function connectToDatabase (): Promise<void> {
  if (isConnected) {
    console.log('✅ Already connected to MongoDB')
    return
  }

  try {
    await client.connect()
    // Vérifier la connexion avec un ping
    await client.db('admin').command({ ping: 1 })
    isConnected = true
    console.log('✅ Connected to MongoDB database:', dbName)
  } catch (error) {
    console.error('❌ Error connecting to the database:', error)
    throw error
  }
}

// Assurer la connexion au démarrage
connectToDatabase().catch(console.error)

export { client, connectToDatabase, connectMongooseToDatabase, dbName }
