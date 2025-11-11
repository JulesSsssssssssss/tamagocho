---
sidebar_position: 4
---

# Infrastructure Layer

La **Infrastructure Layer** contient les **implémentations techniques** : accès à la base de données, API externes, etc.

## 📦 Structure

```
src/infrastructure/
└── repositories/
    ├── TamagotchiRepository.ts
    └── index.ts
```

## 🗄️ TamagotchiRepository

Implémentation MongoDB du repository Tamagotchi.

### Configuration

```typescript
import { MonsterModel } from '@/db/models/Monster'
import type { ITamagotchiRepository } from '@/domain/repositories/ITamagotchiRepository'
import { Tamagotchi } from '@/domain/entities/Tamagotchi'

export class TamagotchiRepository implements ITamagotchiRepository {
  // Implémentation...
}
```

### Méthodes

#### `save(tamagotchi: Tamagotchi): Promise<void>`

Sauvegarde ou met à jour un Tamagotchi en base de données.

```typescript
async save(tamagotchi: Tamagotchi): Promise<void> {
  await MonsterModel.findByIdAndUpdate(
    tamagotchi.id,
    {
      health: tamagotchi.health,
      hunger: tamagotchi.hunger,
      happiness: tamagotchi.happiness,
      energy: tamagotchi.energy,
      level: tamagotchi.level,
      experience: tamagotchi.experience,
      isAlive: tamagotchi.isAlive,
      lastFed: tamagotchi.lastFed,
      lastPlayed: tamagotchi.lastPlayed,
      lastSlept: tamagotchi.lastSlept,
      lastCleaned: tamagotchi.lastCleaned,
    },
    { new: true }
  )
}
```

**Mapping** : Transforme l'entité Domain en document MongoDB

---

#### `findById(id: string): Promise<Tamagotchi | null>`

Récupère un Tamagotchi par son ID.

```typescript
async findById(id: string): Promise<Tamagotchi | null> {
  const doc = await MonsterModel.findById(id)
  
  if (!doc) return null
  
  return this.toDomain(doc)
}
```

**Mapping inverse** : Transforme le document MongoDB en entité Domain

---

#### `findByUserId(userId: string): Promise<Tamagotchi[]>`

Récupère tous les Tamagotchis d'un utilisateur.

```typescript
async findByUserId(userId: string): Promise<Tamagotchi[]> {
  const docs = await MonsterModel.find({ userId })
  
  return docs.map(doc => this.toDomain(doc))
}
```

---

#### `applyDecayToAll(): Promise<void>`

Applique la dégradation naturelle à tous les Tamagotchis vivants.

```typescript
async applyDecayToAll(): Promise<void> {
  const docs = await MonsterModel.find({ isAlive: true })
  
  for (const doc of docs) {
    const tamagotchi = this.toDomain(doc)
    tamagotchi.decayHealth()
    await this.save(tamagotchi)
  }
}
```

**Optimisation possible** : Utiliser `bulkWrite()` pour améliorer les performances

---

### Méthode de mapping

```typescript
private toDomain(doc: any): Tamagotchi {
  return new Tamagotchi(
    doc._id.toString(),
    doc.name,
    doc.userId,
    doc.health,
    doc.hunger,
    doc.happiness,
    doc.energy,
    doc.level,
    doc.experience,
    doc.isAlive,
    doc.createdAt,
    doc.lastFed,
    doc.lastPlayed,
    doc.lastSlept,
    doc.lastCleaned
  )
}
```

---

## 🗃️ MongoDB Models

### MonsterModel

Schéma Mongoose pour la collection `monsters`.

```typescript
import mongoose from 'mongoose'

const MonsterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  
  // Stats
  health: { type: Number, default: 100, min: 0, max: 100 },
  hunger: { type: Number, default: 0, min: 0, max: 100 },
  happiness: { type: Number, default: 50, min: 0, max: 100 },
  energy: { type: Number, default: 100, min: 0, max: 100 },
  
  // Progression
  level: { type: Number, default: 1, min: 1 },
  experience: { type: Number, default: 0, min: 0 },
  
  // État
  isAlive: { type: Boolean, default: true },
  
  // Timestamps d'actions
  lastFed: { type: Date },
  lastPlayed: { type: Date },
  lastSlept: { type: Date },
  lastCleaned: { type: Date },
}, {
  timestamps: true, // createdAt, updatedAt automatiques
})

export const MonsterModel = mongoose.models.Monster || 
  mongoose.model('Monster', MonsterSchema)
```

---

## 🔄 Connexion MongoDB

Configuration dans `src/db/index.ts` :

```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose
    })
  }
  
  cached.conn = await cached.promise
  return cached.conn
}
```

**Optimisation** : Cache la connexion pour éviter les reconnexions multiples

---

## ✅ Règles de l'Infrastructure Layer

1. **Implémente les interfaces du Domain** : Respecte les contrats
2. **Gère les détails techniques** : MongoDB, API, fichiers, etc.
3. **Mapping Domain ↔ Persistence** : Convertit entre entités et documents
4. **Gestion d'erreurs** : Gère les erreurs de connexion/requêtes
5. **Indépendance** : Peut être remplacée (ex: passer de MongoDB à PostgreSQL)

---

Prochaine étape : [Presentation Layer](/docs/architecture/presentation) 🚀
