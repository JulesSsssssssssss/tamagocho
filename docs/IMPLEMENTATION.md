# 🎮 Architecture Tamagotcho - Implémentation Complète

## 📋 Vue d'ensemble

Tamagotcho est une application Next.js 15.5.4 utilisant une **architecture Clean Architecture complète** avec les principes SOLID. L'application permet aux utilisateurs de créer, élever et interagir avec des créatures virtuelles (Tamagotchis).

## 🏗️ Architecture en couches

### Layer 1: Domain (Couche métier)
**Localisation**: `src/domain/`

#### Entités
- **`Tamagotchi.ts`** - Entité centrale avec logique métier pure
  - ✅ Aucune dépendance externe (React, Next.js, DB)
  - ✅ Méthodes métier: `feed()`, `play()`, `sleep()`, `clean()`, `decayHealth()`
  - ✅ Gestion d'état: Happy, Sad, Angry, Hungry, Sleepy
  - ✅ Système d'expérience et de niveaux
  - ✅ Stats: Health, Hunger, Happiness, Energy
  
```typescript
// Exemple d'utilisation
const tamagotchi = new Tamagotchi(id, name, draw, state)
tamagotchi.feed() // Met à jour hunger, health
tamagotchi.play()  // Augmente happiness, réduit energy
```

#### Interfaces/Repositories
- **`ITamagotchiRepository.ts`** - Contrat d'interface pour accès aux données
  - `findById()`, `findByOwnerId()`, `save()`, `update()`, `delete()`, `findAll()`

### Layer 2: Application (Couche Use Cases)
**Localisation**: `src/application/use-cases/`

Chaque cas d'utilisation orchestre la logique métier via l'injection de dépendance:

```typescript
export class FeedTamagotchiUseCase {
  constructor(private readonly repository: ITamagotchiRepository) {}
  async execute(tamagotchiId: string): Promise<Tamagotchi> {
    const tamagotchi = await this.repository.findById(tamagotchiId)
    tamagotchi.feed()
    return await this.repository.update(tamagotchi)
  }
}
```

**Use Cases disponibles**:
- `FeedTamagotchiUseCase` - Nourrir le monstre
- `PlayWithTamagotchiUseCase` - Jouer avec
- `SleepTamagotchiUseCase` - Endormir
- `CleanTamagotchiUseCase` - Nettoyer
- `GetTamagotchiUseCase` - Récupérer un monstre
- `GetUserTamagotchisUseCase` - Récupérer les monstres d'un utilisateur
- `ApplyHealthDecayUseCase` - Appliquer la dégradation des stats

### Layer 3: Infrastructure (Couche technique)
**Localisation**: `src/infrastructure/repositories/`

#### TamagotchiRepository
- ✅ Implémente `ITamagotchiRepository`
- ✅ Communique avec MongoDB via Mongoose
- ✅ Mappe les documents MongoDB vers les entités Tamagotchi
- ✅ Gère la persistance et les requêtes

```typescript
export class TamagotchiRepository implements ITamagotchiRepository {
  async findById(id: string): Promise<Tamagotchi | null>
  async findByOwnerId(ownerId: string): Promise<Tamagotchi[]>
  async save(tamagotchi: Tamagotchi): Promise<Tamagotchi>
  async update(tamagotchi: Tamagotchi): Promise<Tamagotchi>
  // ...
}
```

### Layer 4: Presentation (Couche UI)
**Localisation**: `src/components/`, `src/app/`, `src/actions/`

#### Server Actions
**Fichier**: `src/actions/monsters/monsters.actions.ts`
- Consomme les Use Cases
- Crée les instances de Repository
- Gère l'authentification

```typescript
export async function createMonster(monsterData): Promise<void> {
  const useCase = new CreateMonsterUseCase(repository)
  await useCase.execute(monsterData)
}
```

#### React Components
**Fichier**: `src/components/tamagotchi/`

1. **`tamagotchi-stats.tsx`** - Affiche les barres de santé, faim, bonheur, énergie
2. **`tamagotchi-info.tsx`** - Affiche nom, niveau, expérience
3. **`tamagotchi-actions.tsx`** - Boutons d'interaction (Feed, Play, Sleep, Clean)
4. **`tamagotchi-detail.tsx`** - Vue complète d'un monstre avec SVG et stats

```tsx
<TamagotchiDetail monsterId={monsterId} />
```

## 🔐 Authentification

**Framework**: Better Auth avec MongoDB

**Fichiers**:
- `src/lib/auth.ts` - Configuration serveur
- `src/lib/auth-client.ts` - Client fetch
- `src/app/api/auth/[...all]/route.ts` - Route handler

**Fonctionnalités**:
- ✅ Sign up avec email/password
- ✅ Sign in avec email/password
- ✅ Session gestion
- ✅ Validation de formulaire côté client

## 📊 Gestion des données

### MongoDB Schema
**Fichier**: `src/db/models/monster.model.ts`

```typescript
{
  _id: ObjectId
  ownerId: string
  name: string
  draw: string (SVG)
  state: MonsterState
  stats: {
    health: number
    hunger: number
    happiness: number
    energy: number
  }
  level: number
  experience: number
  lastActionAt: Date
  createdAt: Date
  isDead: boolean
}
```

## 🎨 Système de génération SVG

**Fichier**: `src/shared/utils/generate-monster-svg.ts`

Features:
- ✅ Génération procédurale unique par monstre
- ✅ Accessoires variés: cornes, oreilles, piques, taches, rayures, etc.
- ✅ Expression faciale basée sur l'émotion
- ✅ Persistance de la configuration (ne régénère pas les accessoires à chaque changement d'émotion)

```typescript
const { svg, config } = generateRandomMonsterSvg()
const updatedSvg = updateMonsterEmotion(config, 'happy')
```

## 🧪 Types et Validation

**Fichier**: `src/shared/types/monster.ts`
```typescript
type MonsterState = 'happy' | 'sad' | 'angry' | 'hungry' | 'sleepy'

interface CreateMonsterFormValues {
  name: string
  draw: string
  emotion: MonsterState
}
```

## 🚀 Flux de données

```
┌─────────────────────────────────────────────────────┐
│ User Action (Button Click)                          │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Server Action (monsters.actions.ts)                 │
│ - Authentification                                  │
│ - Création du Repository                            │
│ - Appel du Use Case                                 │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Use Case (FeedTamagotchiUseCase)                    │
│ - Récupération du Tamagotchi                        │
│ - Appel de la méthode métier (feed())               │
│ - Sauvegarde via Repository                         │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Domain (Tamagotchi Entity)                          │
│ - Logique métier pure (feed())                      │
│ - Mise à jour des stats                             │
│ - Validation des états                              │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Infrastructure (TamagotchiRepository)               │
│ - Mapping vers Mongoose                             │
│ - Sauvegarde en MongoDB                             │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
            Database (MongoDB)
```

## 📁 Structure du projet

```
src/
├── domain/                          # Logique métier pure
│   ├── entities/
│   │   ├── Tamagotchi.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── ITamagotchiRepository.ts
│   │   └── index.ts
│   └── index.ts
├── application/                     # Use Cases
│   ├── use-cases/
│   │   ├── FeedTamagotchiUseCase.ts
│   │   ├── PlayWithTamagotchiUseCase.ts
│   │   ├── SleepTamagotchiUseCase.ts
│   │   ├── CleanTamagotchiUseCase.ts
│   │   ├── GetTamagotchiUseCase.ts
│   │   ├── GetUserTamagotchisUseCase.ts
│   │   ├── ApplyHealthDecayUseCase.ts
│   │   └── index.ts
│   └── index.ts
├── infrastructure/                  # Implémentations techniques
│   ├── repositories/
│   │   ├── TamagotchiRepository.ts
│   │   └── index.ts
│   └── index.ts
├── components/                      # UI Components
│   ├── tamagotchi/
│   │   ├── tamagotchi-stats.tsx
│   │   ├── tamagotchi-info.tsx
│   │   ├── tamagotchi-actions.tsx
│   │   ├── tamagotchi-detail.tsx
│   │   └── index.ts
│   ├── forms/
│   │   ├── signin-form.tsx
│   │   ├── signup-form.tsx
│   │   └── create-monster-form.tsx
│   ├── ui/                          # ShadCN Components
│   └── ...
├── actions/                         # Server Actions
│   └── monsters/
│       └── monsters.actions.ts
├── shared/
│   ├── types/
│   │   └── monster.ts
│   ├── utils/
│   │   └── generate-monster-svg.ts
│   └── validation/
│       └── create-monster-form-validation.ts
├── lib/
│   ├── auth.ts                      # Better Auth config
│   └── auth-client.ts
├── db/
│   ├── index.ts                     # MongoDB client
│   └── models/
│       └── monster.model.ts
└── app/
    ├── page.tsx                     # Accueil
    ├── layout.tsx
    ├── metadata.ts
    ├── dashboard/
    │   └── page.tsx
    ├── sign-in/
    │   └── page.tsx
    └── api/
        ├── auth/
        │   └── [..all]/route.ts
        └── tamagotchis/
            └── tick/route.ts
```

## ✅ Respect des principes SOLID

### S - Single Responsibility
- ✅ Chaque classe a une seule raison de changer
- ✅ Tamagotchi = logique métier
- ✅ Repository = accès aux données
- ✅ Use Case = orchestration

### O - Open/Closed
- ✅ Extensible via composition
- ✅ Nouvelles interactions sans modifier Tamagotchi
- ✅ Nouveaux types d'objets sans changer le code

### L - Liskov Substitution
- ✅ Repository implémente l'interface
- ✅ Use Cases dépendent de l'interface, pas de l'implémentation

### I - Interface Segregation
- ✅ ITamagotchiRepository minimal et focalisé
- ✅ Props interfaces spécifiques par composant

### D - Dependency Inversion
- ✅ Use Cases dépendent de ITamagotchiRepository
- ✅ Injection du Repository
- ✅ Pas de couplage fort avec MongoDB

## 🚀 Points clés d'implémentation

1. **Domain-Driven**: La logique métier est entièrement séparée de l'infrastructure
2. **Type-Safe**: TypeScript strict avec interfaces explicites
3. **Testable**: Chaque couche peut être testée indépendamment
4. **Maintenable**: Structure claire et prévisible
5. **Scalable**: Facile d'ajouter de nouveaux Use Cases

## 🎯 Prochaines étapes

1. Implémenter le système de "ticks" pour la dégradation automatique des stats
2. Ajouter des tests unitaires pour la couche Domain
3. Implémenter des sauvegardes auto toutes les N minutes
4. Ajouter des achievements/quêtes
5. Implémenter un système de partage/trading

## 📝 Notes de développement

- **Architecture**: Clean Architecture + SOLID Principles
- **Framework**: Next.js 15.5.4 avec Turbopack
- **BD**: MongoDB avec Mongoose ODM
- **Auth**: Better Auth
- **UI**: React 19 + ShadCN UI + Tailwind CSS
- **Linting**: ts-standard
- **Validation**: Zod (préparé pour utilisation)
