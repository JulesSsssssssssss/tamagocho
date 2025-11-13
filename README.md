# 🎮 Tamagotcho

> Un jeu Tamagotchi moderne avec génération de monstres uniques, système de progression et architecture Clean Code

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.20-green?style=flat-square&logo=mongodb)](https://www.mongodb.com/)

## 📋 Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Technologies](#-technologies)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Système de jeu](#-système-de-jeu)
- [Documentation](#-documentation)
- [Scripts](#-scripts)
- [Contributions](#-contributions)

## 🌟 À propos

**Tamagotcho** est une application web moderne qui réinvente le concept classique du Tamagotchi. Créez votre monstre unique généré procéduralement, prenez-en soin et faites-le évoluer dans un univers pixel art captivant.

Ce projet a été développé dans le cadre d'un projet scolaire à **My Digital School**, en mettant l'accent sur les principes **SOLID**, l'architecture **Clean Code** et les bonnes pratiques de développement.

### 🎯 Objectifs du projet

- Appliquer une architecture Clean Architecture (Domain → Application → Infrastructure → Presentation)
- Respecter les principes SOLID (SRP, OCP, LSP, ISP, DIP)
- Créer une expérience utilisateur moderne et engageante
- Implémenter un système de jeu complet avec progression
- Utiliser des technologies modernes (Next.js 15, React 19, TypeScript strict)

## ✨ Fonctionnalités

### 🎨 Création de monstres
- **Génération SVG procédurale** : Chaque monstre est unique
- **Aperçu en temps réel** : Visualisez votre création avant validation
- **Nom personnalisé** : Donnez un nom à votre compagnon

### 🎮 Interactions
- **Nourrir** 🍖 : Réduit la faim, augmente la santé
- **Jouer** 🎯 : Augmente le bonheur, gagne de l'expérience
- **Dormir** 💤 : Restaure l'énergie complètement
- **Nettoyer** 🧹 : Maintient l'hygiène et le bonheur

### 📊 Système de progression
- **Niveaux et expérience** : Gagnez de l'XP en jouant
- **Stats dynamiques** : Health, Hunger, Happiness, Energy
- **États émotionnels** : 😊 Happy, 😢 Sad, 😋 Hungry, 😴 Sleepy, 💀 Dead
- **Dégradation naturelle** : Vos monstres ont besoin d'attention constante

### 🏪 Boutique & Économie
- **Système de pièces** : Gagnez des coins en jouant
- **Articles achetables** : Nourriture, accessoires, items spéciaux
- **Intégration Stripe** : Paiements sécurisés pour coins premium
- **Inventaire** : Gérez vos items achetés

### 🎯 Quêtes journalières
- **Défis quotidiens** : Objectifs renouvelés chaque jour
- **Récompenses** : Coins et expérience bonus
- **Suivi de progression** : Visualisez vos accomplissements

### 🔐 Authentification
- **Better Auth** : Système d'authentification moderne
- **Sign Up / Sign In** : Création de compte sécurisée
- **Session persistante** : Restez connecté
- **Gestion de profil** : Wallet, monstres, statistiques

## 🏗️ Architecture

Le projet suit une **Clean Architecture** stricte avec séparation des responsabilités :

```
┌─────────────────────────────────────────────────────┐
│              Presentation Layer                      │
│   (React Components, Pages, Server Actions)         │
│                                                      │
│   - Components UI (Tamagotchi, Shop, Wallet)        │
│   - Server Actions (monsters.actions.ts)            │
│   - Pages Next.js (App Router)                      │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│             Application Layer                        │
│              (Use Cases)                             │
│                                                      │
│   - FeedTamagotchiUseCase                           │
│   - PlayWithTamagotchiUseCase                       │
│   - SleepTamagotchiUseCase                          │
│   - CleanTamagotchiUseCase                          │
│   - GetTamagotchiUseCase                            │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│            Infrastructure Layer                      │
│        (Repositories, External APIs)                │
│                                                      │
│   - TamagotchiRepository (MongoDB)                  │
│   - Stripe Integration                              │
│   - Better Auth                                     │
└──────────────┬──────────────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────────────┐
│               Domain Layer                           │
│           (Business Logic)                           │
│                                                      │
│   - Tamagotchi Entity                               │
│   - Value Objects                                   │
│   - Domain Interfaces                               │
└─────────────────────────────────────────────────────┘
```

### 📁 Structure des dossiers

```
src/
├── domain/               # Logique métier pure (entités, interfaces)
│   ├── entities/        # Tamagotchi, Monster
│   └── services/        # Services métier
├── application/         # Use Cases (orchestration métier)
│   └── use-cases/       # FeedTamagotchi, PlayWithTamagotchi...
├── infrastructure/      # Implémentations techniques
│   ├── repositories/    # TamagotchiRepository (MongoDB)
│   └── api/            # Intégrations externes (Stripe)
├── components/          # Composants React UI
│   ├── tamagotchi/     # Composants spécifiques monstres
│   ├── shop/           # Composants boutique
│   └── wallet/         # Composants portefeuille
├── actions/            # Server Actions Next.js
├── app/                # Pages Next.js (App Router)
└── lib/                # Utilitaires partagés
```

## 🛠️ Technologies

### Framework & Runtime
- **[Next.js 15.5.4](https://nextjs.org/)** - Framework React avec App Router et Turbopack
- **[React 19.1.0](https://reactjs.org/)** - Librairie UI avec Server Components
- **[TypeScript](https://www.typescriptlang.org/)** - Strict mode activé

### Styling
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **Palette personnalisée** - Moccaccino, Lochinvar, Fuchsia Blue
- **Design pixel art** - Thème gaming rétro moderne

### Base de données
- **[MongoDB 6.20](https://www.mongodb.com/)** - Base de données NoSQL
- **[Mongoose 8.19](https://mongoosejs.com/)** - ODM pour MongoDB

### Authentification & Paiements
- **[Better Auth 1.3](https://www.better-auth.com/)** - Système d'authentification moderne
- **[Stripe](https://stripe.com/)** - Paiements sécurisés

### Validation & Formulaires
- **[Zod 4.1](https://zod.dev/)** - Validation de schémas TypeScript-first
- **[React Hook Form 7.65](https://react-hook-form.com/)** - Gestion de formulaires performante

### Outils de développement
- **[ts-standard](https://github.com/standard/ts-standard)** - Linter TypeScript
- **Turbopack** - Bundler ultra-rapide
- **ESLint** - Analyse de code statique

## 📦 Installation

### Prérequis

- **Node.js** 18+ et npm
- **MongoDB** (local ou Atlas)
- **Compte Stripe** (pour les paiements)

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/JulesSsssssssssss/tamagocho.git
   cd tamagocho
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   
   Créez un fichier `.env.local` à la racine :
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/tamagotcho
   
   # Better Auth
   BETTER_AUTH_SECRET=votre_secret_auth
   BETTER_AUTH_URL=http://localhost:3000
   
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Initialiser la base de données**
   ```bash
   npm run db:indexes
   ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

6. **Accéder à l'application**
   
   Ouvrez [http://localhost:3000](http://localhost:3000)

## 🚀 Utilisation

### Créer votre premier monstre

1. **Créer un compte** : Accédez à `/sign-in` et créez votre profil
2. **Dashboard** : Cliquez sur "Créer un monstre"
3. **Personnalisation** : Donnez un nom et voyez l'aperçu SVG unique
4. **Validation** : Votre monstre apparaît dans votre collection

### Prendre soin de votre monstre

- **Surveillez les stats** : Les barres colorées indiquent les besoins
- **Actions régulières** : Nourrissez, jouez, faites dormir
- **États émotionnels** : Réagissez selon l'humeur affichée
- **Progression** : Gagnez de l'XP en jouant pour monter de niveau

### Gagner des coins

- **Jouer** : +5 coins par interaction de jeu
- **Quêtes** : Complétez les défis quotidiens
- **Achats** : Utilisez Stripe pour acheter des coins premium

### Boutique

- **Nourriture** : Items pour réduire la faim
- **Accessoires** : Cosmétiques pour personnaliser
- **Items spéciaux** : Bonus d'expérience, santé instantanée

## 🎮 Système de jeu

### Stats (0-100)
| Stat | Description | Augmente par | Diminue par |
|------|-------------|--------------|-------------|
| **Health** | Santé vitale | Feed, Level Up | Hunger, Low Energy, Time |
| **Hunger** | Faim | Time | Feed |
| **Happiness** | Bonheur | Play, Clean | Time, Neglect |
| **Energy** | Énergie | Sleep | Play, Time |

### États émotionnels

- 🙂 **Happy** : Happiness > 70
- 😢 **Sad** : Happiness < 30
- 😋 **Hungry** : Hunger > 70
- 😴 **Sleepy** : Energy < 30
- 💀 **Dead** : Health = 0 (permanent)

### Progression

- **Expérience** : +10 XP par partie
- **Formule niveau** : `XP requis = 50 × niveau`
- **Récompense level-up** : +20 Health max

### Dégradation naturelle (tick)

Toutes les 30 secondes :
- Hunger : +5
- Energy : -3
- Si Hunger > 80 : -5 Health
- Si Energy < 20 : -3 Health
- Si Happiness < 30 : -2 Health

### Système CRON

Un serveur CRON (`cron/index.js`) applique la dégradation automatiquement :
```bash
cd cron
npm install
npm start
```

## 📚 Documentation

Une documentation complète est disponible dans le dossier `/docs` :

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Détails de l'architecture Clean
- **[RESUME.md](docs/RESUME.md)** - Résumé de l'implémentation
- **[COMMANDS.md](docs/COMMANDS.md)** - Liste des commandes utiles
- **[STRIPE_IMPLEMENTATION.md](docs/STRIPE_IMPLEMENTATION.md)** - Guide Stripe
- **[DAILY_QUESTS_SYSTEM.md](docs/DAILY_QUESTS_SYSTEM.md)** - Système de quêtes
- **[INVENTORY_SYSTEM_IMPLEMENTATION.md](docs/INVENTORY_SYSTEM_IMPLEMENTATION.md)** - Inventaire
- **[LEVEL_SYSTEM_IMPLEMENTATION.md](docs/LEVEL_SYSTEM_IMPLEMENTATION.md)** - Niveaux
- **[TESTING.md](docs/TESTING.md)** - Guide de test

### Documentation interactive

Générez et lancez la documentation Docusaurus :
```bash
npm run build:docs
npm run dev:docs
```

Accédez à [http://localhost:3001](http://localhost:3001)

## 🔧 Scripts

```bash
# Développement
npm run dev              # Lance le serveur avec Turbopack
npm run dev:docs         # Lance la documentation

# Build
npm run build            # Build production
npm run build:turbo      # Build avec Turbopack
npm run build:with-docs  # Build + documentation

# Qualité
npm run lint             # Lint et auto-fix TypeScript

# Base de données
npm run db:indexes       # Initialise les index MongoDB

# Production
npm start                # Lance le serveur de production
```

## 🎨 Design System

### Palette de couleurs

```css
/* Primary */
--moccaccino-500: #f7533c;  /* Boutons principaux */

/* Secondary */
--lochinvar-500: #469086;   /* Accents secondaires */

/* Tertiary */
--fuchsia-blue-500: #8f72e0; /* Accents tertiaires */
```

### Variants de composants

- **Sizes** : `sm` | `md` | `lg` | `xl`
- **Variants** : `primary` | `ghost` | `underline` | `outline`
- **States** : `default` | `hover` | `active` | `disabled`

## 🧪 Tests

Bien que ce soit un projet scolaire, des tests sont recommandés :

```bash
# À venir
npm test              # Tests unitaires
npm run test:e2e      # Tests end-to-end
npm run test:coverage # Couverture de code
```

## 🤝 Contributions

Ce projet est un projet scolaire, mais les suggestions sont bienvenues :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de code

- **SOLID** : Respecter les 5 principes
- **Clean Code** : Fonctions < 20 lignes, noms descriptifs
- **TypeScript** : Strict mode, pas de `any`
- **Linting** : `npm run lint` doit passer

## 📝 Licence

Ce projet est développé dans le cadre d'un projet scolaire à **My Digital School**.

## 👨‍💻 Auteur

**Jules Ruberti**
- GitHub: [@JulesSsssssssssss](https://github.com/JulesSsssssssssss)
- École: My Digital School

## 🙏 Remerciements

- **My Digital School** - Formation et encadrement
- **Communauté Next.js** - Framework et documentation
- **Stripe** - Intégration paiements
- **Tamagotchi original** - Inspiration du concept

---

<p align="center">
  Fait avec ❤️ et ☕ pour My Digital School
</p>
