# Architecture Tamagotchi - Implémentation Complète

## 📋 Vue d'ensemble

Ce projet implémente la logique complète d'un Tamagotchi virtuel en suivant les principes SOLID et l'architecture Clean Architecture.

## 🏗️ Architecture en couches

### 1. **Domain Layer** (`src/domain/`)
Logique métier pure, indépendante de tout framework.

#### Entités
- **`Tamagotchi.ts`** : Classe principale représentant le monstre virtuel
  - Statut: `health`, `hunger`, `happiness`, `energy`
  - Actions: `feed()`, `play()`, `sleep()`, `clean()`
  - Dégradation naturelle: `decayHealth()`
  - Gestion des niveaux et expérience
  - Détection de mort

#### Interfaces (Contrats)
- **`ITamagotchiRepository.ts`** : Interface pour la persistance des données

### 2. **Application Layer** (`src/application/`)
Use cases orchestrant la logique métier.

#### Use Cases
- **`FeedTamagotchiUseCase.ts`** : Nourrir le monstre
- **`PlayWithTamagotchiUseCase.ts`** : Jouer avec le monstre
- **`SleepTamagotchiUseCase.ts`** : Faire dormir le monstre
- **`CleanTamagotchiUseCase.ts`** : Nettoyer le monstre
- **`GetTamagotchiUseCase.ts`** : Récupérer un monstre
- **`GetUserTamagotchisUseCase.ts`** : Lister les monstres d'un utilisateur
- **`ApplyHealthDecayUseCase.ts`** : Appliquer la dégradation naturelle

### 3. **Infrastructure Layer** (`src/infrastructure/`)
Implémentations techniques (base de données, APIs externes).

#### Repositories
- **`TamagotchiRepository.ts`** : Implémentation MongoDB du repository
  - Méthodes CRUD
  - Mapping entre document Mongoose et entité Tamagotchi

### 4. **Presentation Layer** (`src/components/`)
Composants React et pages.

#### Composants Tamagotchi
- **`tamagotchi-info.tsx`** : Affiche le nom, niveau et expérience
- **`tamagotchi-stats.tsx`** : Barre de progression des stats
- **`tamagotchi-actions.tsx`** : Boutons d'actions (Nourrir, Jouer, Dormir, Nettoyer)
- **`tamagotchi-detail.tsx`** : Vue complète d'un monstre

### 5. **Server Actions** (`src/actions/`)
Orchestration des use cases côté serveur.

- **`createMonster()`** : Crée un nouveau monstre
- **`getMonsters()`** : Récupère les monstres d'un utilisateur
- **`feedMonster()`** : Exécute FeedTamagotchiUseCase
- **`playWithMonster()`** : Exécute PlayWithTamagotchiUseCase
- **`sleepMonster()`** : Exécute SleepTamagotchiUseCase
- **`cleanMonster()`** : Exécute CleanTamagotchiUseCase
- **`getMonsterDetails()`** : Récupère les détails d'un monstre

## 🎮 Système de Mécanique de Jeu

### Stats
- **Santé** (0-100) : Réduite par la faim, le manque d'énergie, et le manque de bonheur
- **Faim** (0-100) : Augmente naturellement, réduite en nourrissant
- **Bonheur** (0-100) : Augmenté en jouant, réduit par l'inactivité
- **Énergie** (0-100) : Réduite en jouant, restaurée en dormant

### États
- 🙂 **Happy** : Bonheur > 70
- 😢 **Sad** : Bonheur < 30
- 😤 **Angry** : États passionnels (à développer)
- 😋 **Hungry** : Faim > 70
- 😴 **Sleepy** : Énergie < 30
- 💀 **Dead** : Santé <= 0

### Progression
- **Expérience** : Gagnée en jouant (+10 XP par jeu)
- **Niveaux** : Chaque niveau demande 50 * niveau XP
- **Récompenses** : +20 santé par level-up

### Dégradation Naturelle
La santé du monstre diminue naturellement:
- Faim excessive : -5 santé
- Manque d'énergie : -3 santé
- Manque de bonheur : -2 santé
- Hausse de la faim et baisse de l'énergie tous les ticks

## 🔄 Système de Ticks

Une API endpoint déclenche la dégradation naturelle tous les 30 secondes:

```
POST /api/tamagotchis/tick
```

Un hook client `useAutoRefresh()` appelle régulièrement cette route.

## 🔌 Flux de Données

```
UI Component 
    ↓
Server Action (feedMonster)
    ↓
Use Case (FeedTamagotchiUseCase)
    ↓
Repository (TamagotchiRepository)
    ↓
Database (MongoDB)
```

## 📂 Structure des Fichiers

```
src/
├── domain/
│   ├── entities/
│   │   ├── Tamagotchi.ts
│   │   └── index.ts
│   ├── repositories/
│   │   ├── ITamagotchiRepository.ts
│   │   └── index.ts
│   └── index.ts
├── application/
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
├── infrastructure/
│   ├── repositories/
│   │   ├── TamagotchiRepository.ts
│   │   └── index.ts
│   └── index.ts
├── components/
│   ├── tamagotchi/
│   │   ├── tamagotchi-info.tsx
│   │   ├── tamagotchi-stats.tsx
│   │   ├── tamagotchi-actions.tsx
│   │   ├── tamagotchi-detail.tsx
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── dashboard-content.tsx
│   │   └── create-monster-modal.tsx
│   └── ...
├── actions/
│   ├── monsters/
│   │   └── monsters.actions.ts
│   └── ...
└── app/
    ├── api/
    │   └── tamagotchis/
    │       └── tick/
    │           └── route.ts
    └── ...
```

## ✅ Principes SOLID Appliqués

### Single Responsibility Principle (SRP)
- Chaque use case = une responsabilité
- Chaque composant = une responsabilité UI
- Entités = logique métier uniquement

### Open/Closed Principle (OCP)
- Use cases extensibles sans modification
- Nouveaux comportements via injections de dépendances

### Liskov Substitution Principle (LSP)
- Repository respecte le contrat ITamagotchiRepository
- Substitution possible sans casser les attentes

### Interface Segregation Principle (ISP)
- ITamagotchiRepository = interface minimale
- Props des composants = strictement nécessaires

### Dependency Inversion Principle (DIP)
- Code dépend d'abstractions (ITamagotchiRepository)
- Injections de dépendances dans les use cases

## 🚀 Prochaines Étapes

1. **Tests unitaires** : Jest + React Testing Library
2. **Animations** : Framer Motion pour les transitions
3. **Persistance du temps** : Gestion du temps écoulé même en ligne
4. **Multiplayer** : WebSockets pour l'interaction multi-joueurs
5. **Shop** : Système d'accessoires pour le personnage
6. **Breeding** : Reproduction de monstres
7. **Battles** : Système de combat Tamagotchi

## 🛠️ Commandes

```bash
# Développement
npm run dev

# Build production
npm run build

# Linting
npm run lint
```

## 📝 Notes Techniques

- **Framework** : Next.js 15.5.4 avec App Router
- **Base de données** : MongoDB + Mongoose
- **Styling** : Tailwind CSS 4
- **Linting** : ts-standard (TypeScript)
- **Authentification** : Better Auth

## ✨ Résumé

L'application implémente une architecture Clean Architecture complète avec séparation des responsabilités selon SOLID. Le domaine métier (Tamagotchi) est totalement indépendant de tout détail technique, permettant réutilisation et testabilité maximales.
