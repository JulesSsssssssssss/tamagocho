# 🗂️ Guide d'importation et structure - Tamagotcho

## 📍 Path Aliases

Tous les imports utilisent le préfixe `@/`:

```typescript
// ✅ BON
import { Tamagotchi } from '@/domain'
import { FeedTamagotchiUseCase } from '@/application'

// ❌ MAUVAIS
import { Tamagotchi } from '../../../domain/entities'
```

## 🏗️ Importation par couche

### Domain Layer (`@/domain`)

```typescript
// Importer l'entité
import { Tamagotchi, type ITamagotchiStats } from '@/domain'

// Importer l'interface repository
import type { ITamagotchiRepository } from '@/domain'

// Entités
export { Tamagotchi } from './entities'
export type { ITamagotchiStats } from './entities'
export type { ITamagotchiRepository } from './repositories'
```

**Structure**:
```
src/domain/
├── entities/
│   ├── Tamagotchi.ts
│   └── index.ts (barrel export)
├── repositories/
│   ├── ITamagotchiRepository.ts
│   └── index.ts (barrel export)
└── index.ts (re-export tout)
```

### Application Layer (`@/application`)

```typescript
// Importer les Use Cases
import {
  FeedTamagotchiUseCase,
  PlayWithTamagotchiUseCase,
  SleepTamagotchiUseCase,
  CleanTamagotchiUseCase,
  GetTamagotchiUseCase,
  GetUserTamagotchisUseCase,
  ApplyHealthDecayUseCase
} from '@/application'

// Utilisation
const repository = new TamagotchiRepository()
const useCase = new FeedTamagotchiUseCase(repository)
await useCase.execute(monsterId)
```

**Structure**:
```
src/application/
├── use-cases/
│   ├── FeedTamagotchiUseCase.ts
│   ├── PlayWithTamagotchiUseCase.ts
│   ├── SleepTamagotchiUseCase.ts
│   ├── CleanTamagotchiUseCase.ts
│   ├── GetTamagotchiUseCase.ts
│   ├── GetUserTamagotchisUseCase.ts
│   ├── ApplyHealthDecayUseCase.ts
│   └── index.ts (barrel export)
└── index.ts (re-export tout)
```

### Infrastructure Layer (`@/infrastructure`)

```typescript
// Importer le Repository
import { TamagotchiRepository } from '@/infrastructure'

// Utilisation
const repository = new TamagotchiRepository()
const tamagotchi = await repository.findById(id)
```

**Structure**:
```
src/infrastructure/
├── repositories/
│   ├── TamagotchiRepository.ts
│   └── index.ts
└── index.ts (re-export tout)
```

### Server Actions (`@/actions`)

```typescript
// Importer les actions
import {
  createMonster,
  getMonsters,
  feedMonster,
  playWithMonster,
  sleepMonster,
  cleanMonster,
  getMonsterDetails
} from '@/actions/monsters/monsters.actions'

// Utilisation (côté client)
'use client'
await feedMonster(monsterId)
```

**Structure**:
```
src/actions/
└── monsters/
    └── monsters.actions.ts
```

### Components (`@/components`)

```typescript
// UI components
import { TamagotchiStats } from '@/components/tamagotchi'
import { TamagotchiInfo } from '@/components/tamagotchi'
import { TamagotchiActions } from '@/components/tamagotchi'
import { TamagotchiDetail } from '@/components/tamagotchi'

// Forms
import SignInForm from '@/components/forms/signin-form'
import SignUpForm from '@/components/forms/signup-form'

// UI library
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
```

**Structure**:
```
src/components/
├── tamagotchi/
│   ├── tamagotchi-stats.tsx
│   ├── tamagotchi-info.tsx
│   ├── tamagotchi-actions.tsx
│   ├── tamagotchi-detail.tsx
│   └── index.ts
├── forms/
│   ├── signin-form.tsx
│   ├── signup-form.tsx
│   └── create-monster-form.tsx
├── ui/
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
└── ...
```

### Shared (`@/shared`)

```typescript
// Types
import type { MonsterState, CreateMonsterFormValues } from '@/shared/types/monster'
import { MONSTER_STATES, DEFAULT_MONSTER_LEVEL } from '@/shared/types/monster'

// Utils
import { generateRandomMonsterSvg, updateMonsterEmotion } from '@/shared/utils/generate-monster-svg'

// Validation
import { validateCreateMonsterForm } from '@/shared/validation/create-monster-form-validation'
```

**Structure**:
```
src/shared/
├── types/
│   └── monster.ts
├── utils/
│   └── generate-monster-svg.ts
└── validation/
    └── create-monster-form-validation.ts
```

### Library (`@/lib`)

```typescript
// Auth
import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'

// Utils
import { cn } from '@/lib/utils'
```

**Structure**:
```
src/lib/
├── auth.ts
├── auth-client.ts
└── utils.ts
```

### Database (`@/db`)

```typescript
// Client MongoDB
import { client } from '@/db'

// Models
import Monster from '@/db/models/monster.model'
```

**Structure**:
```
src/db/
├── index.ts (client MongoDB)
└── models/
    └── monster.model.ts
```

## 🔄 Flux d'importation et déjà correct

```
┌─────────────────────────────────┐
│ React Component / Server Action │
└────────────┬────────────────────┘
             │ import from @/application
             ▼
┌─────────────────────────────────┐
│ Use Case (Application Layer)    │
└────────────┬────────────────────┘
             │ import from @/domain
             ▼
┌─────────────────────────────────┐
│ Entity / Interface (Domain)     │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ Use Case (Application Layer)    │
└────────────┬────────────────────┘
             │ inject ITamagotchiRepository
             ▼
┌─────────────────────────────────┐
│ Repository (Infrastructure)     │
└────────────┬────────────────────┘
             │ uses
             ▼
┌─────────────────────────────────┐
│ MongoDB (via @/db)              │
└─────────────────────────────────┘
```

## ✅ Bonnes pratiques d'importation

### ✅ Importer par couche
```typescript
// ✅ BON: Importer les APIs publiques exposées
import { Tamagotchi } from '@/domain'
import { FeedTamagotchiUseCase } from '@/application'
import { TamagotchiRepository } from '@/infrastructure'
```

### ✅ Utiliser les barrel exports
```typescript
// ✅ BON: Utiliser l'index.ts
import { Tamagotchi } from '@/domain' // via index.ts

// ❌ MAUVAIS: Importer directement
import { Tamagotchi } from '@/domain/entities/Tamagotchi'
```

### ✅ Typer les imports
```typescript
// ✅ BON: Séparer les imports types et valeurs
import type { ITamagotchiRepository, ITamagotchiStats } from '@/domain'
import { Tamagotchi } from '@/domain'

// ❌ MAUVAIS: Mélanger
import { Tamagotchi, ITamagotchiRepository } from '@/domain'
```

### ✅ Dépendances unidirectionnelles
```typescript
// ✅ BON: Presentation → Application → Domain
// Presentation peut importer Application et Domain
// Application peut importer Domain
// Domain n'importe rien (sauf modules built-in)

// ❌ MAUVAIS: Domain importe React/Components
import React from 'react' // ❌ NEVER in domain!
```

## 🚫 Imports à éviter

### ❌ Imports circulaires
```typescript
// ❌ MAUVAIS
// a.ts
import { B } from './b'

// b.ts
import { A } from './a' // Circular!
```

### ❌ Imports de détails d'implémentation
```typescript
// ❌ MAUVAIS
import { SOME_CONSTANT } from '@/infrastructure/repositories/internal'

// ✅ BON
// Exporter via index.ts d'abord
```

### ❌ Importer au mauvais niveau
```typescript
// ❌ MAUVAIS: Repository dans un composant
import { TamagotchiRepository } from '@/infrastructure'
function MyComponent() {
  const repo = new TamagotchiRepository() // Non!
}

// ✅ BON: Via Server Action
// src/actions/monsters/monsters.actions.ts
const repo = new TamagotchiRepository()
```

## 📦 Ajouter une nouvelle feature

### 1. Créer l'entité si besoin
```typescript
// src/domain/entities/NewFeature.ts
export class NewFeature { ... }

// src/domain/entities/index.ts
export { NewFeature } from './NewFeature'

// src/domain/index.ts
export { NewFeature } from './entities'
```

### 2. Créer l'interface Repository si besoin
```typescript
// src/domain/repositories/INewFeatureRepository.ts
export interface INewFeatureRepository { ... }

// Mise à jour des index.ts
```

### 3. Créer le Use Case
```typescript
// src/application/use-cases/SomeNewFeatureUseCase.ts
import { NewFeature, type INewFeatureRepository } from '@/domain'

export class SomeNewFeatureUseCase {
  constructor(private readonly repository: INewFeatureRepository) {}
  async execute() { ... }
}

// src/application/use-cases/index.ts
export { SomeNewFeatureUseCase } from './SomeNewFeatureUseCase'

// src/application/index.ts (mise à jour si besoin)
```

### 4. Implémenter le Repository
```typescript
// src/infrastructure/repositories/NewFeatureRepository.ts
import { INewFeatureRepository } from '@/domain'

export class NewFeatureRepository implements INewFeatureRepository {
  ...
}

// Mises à jour des index.ts
```

### 5. Créer les Components si besoin
```typescript
// src/components/features/new-feature-component.tsx
import { SomeNewFeatureUseCase } from '@/application'

// Utiliser via Server Actions
```

### 6. Exposer via Server Actions
```typescript
// src/actions/features/new-feature.actions.ts
'use server'

import { SomeNewFeatureUseCase } from '@/application'
import { NewFeatureRepository } from '@/infrastructure'

const repo = new NewFeatureRepository()

export async function doSomethingNew() {
  const useCase = new SomeNewFeatureUseCase(repo)
  return await useCase.execute()
}
```

---

**Note**: Cette structure garantit une séparation claire des responsabilités et une maintenabilité maximale.
