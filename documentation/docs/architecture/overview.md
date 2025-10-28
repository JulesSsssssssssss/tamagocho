---
sidebar_position: 1
---

# Vue d'ensemble de l'architecture

## Architecture Clean Architecture

Le projet Tamagotcho suit l'**architecture Clean Architecture** qui organise le code en couches concentriques, chacune ayant des responsabilités claires.

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│    (Components, Pages, Hooks)           │
├─────────────────────────────────────────┤
│       Application Layer                 │
│    (Use Cases, DTOs)                    │
├─────────────────────────────────────────┤
│         Domain Layer                    │
│    (Entities, Interfaces)               │
├─────────────────────────────────────────┤
│      Infrastructure Layer               │
│    (Repositories, DB, API)              │
└─────────────────────────────────────────┘
```

## Principes SOLID appliqués

### ✅ Single Responsibility Principle (SRP)
Chaque classe/composant a **une seule responsabilité** :
- Les composants React gèrent uniquement l'UI
- Les use cases orchestrent la logique métier
- Les repositories gèrent la persistance

### ✅ Open/Closed Principle (OCP)
Le code est **ouvert à l'extension, fermé à la modification** :
- Utilisation de props pour les variations
- Patterns Strategy pour l'extensibilité
- Types union pour les variants

### ✅ Liskov Substitution Principle (LSP)
Les interfaces sont **respectées sans surprises** :
- Contrats d'interface clairs
- Polymorphisme cohérent

### ✅ Interface Segregation Principle (ISP)
**Interfaces minimales et focalisées** :
- Props spécifiques par composant
- Pas de dépendances inutiles

### ✅ Dependency Inversion Principle (DIP)
**Dépendre d'abstractions, pas de concrétions** :
- Injection de dépendances
- Interfaces pour les services
- Inversion de contrôle

## Structure des dossiers

```
src/
├── domain/               # 🎯 Logique métier pure
│   ├── entities/         # Entités (Tamagotchi, Monster)
│   └── repositories/     # Interfaces de repositories
│
├── application/          # 🔄 Use Cases
│   └── use-cases/        # Actions métier orchestrées
│
├── infrastructure/       # 🔧 Implémentations techniques
│   └── repositories/     # Repositories MongoDB
│
├── components/           # 🎨 UI React
│   ├── creature/         # Composants créature
│   ├── dashboard/        # Composants dashboard
│   └── ui/               # Composants réutilisables
│
└── app/                  # 📄 Pages Next.js
    ├── api/              # API routes
    ├── creature/         # Pages créature
    └── dashboard/        # Page dashboard
```

## Flux de données

```
User Action (UI)
      ↓
Server Action
      ↓
Use Case
      ↓
Domain Entity
      ↓
Repository Interface
      ↓
Infrastructure Repository
      ↓
Database (MongoDB)
```

## Règle de dépendance

**RÈGLE ABSOLUE** : Les dépendances pointent toujours vers l'intérieur

```
Presentation → Application → Domain
Infrastructure → Application → Domain

❌ JAMAIS: Domain → Application
❌ JAMAIS: Domain → Infrastructure
❌ JAMAIS: Application → Presentation
```

## Points clés

1. **Séparation des préoccupations** : Chaque couche a son rôle
2. **Testabilité** : Les use cases sont facilement testables
3. **Maintenabilité** : Code organisé et prévisible
4. **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités
5. **Indépendance** : Le domaine ne dépend d'aucun framework

---

Prochaine étape : Explorez la [couche Domain](/docs/architecture/domain) ! 🚀
