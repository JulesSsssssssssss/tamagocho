#!/bin/bash

# 🎮 Tamagotcho - Commandes utiles

## 🚀 Développement

### Installer les dépendances
```
npm install

yarn install
```

### Démarrer le serveur de développement
```
npm run dev

yarn dev
```

### Builder l'application
```
npm run build

yarn build
```

### Linting et vérification
```
npm run lint

yarn lint
```

### Linting avec auto-fix
```
npm run lint -- --fix

yarn lint --fix
```

## 🗄️ Base de données

### Connexion MongoDB (en dehors du projet)
# Utiliser MongoDB Compass ou commandes mongo shell
mongo mongodb+srv://user:password@host/database

### Vérifier la connexion
# Dans la console Next.js, vous verrez "Connected to MongoDB database"

## 🐛 Debugging

### Logs du serveur
# Visibles dans le terminal de npm run dev

### Logs du navigateur
# Ouvrir DevTools (F12) > Console tab

### Variables d'environnement
# Vérifier .env.local pour:
# - MONGODB_URI
# - GITHUB_CLIENT_ID
# - GITHUB_CLIENT_SECRET

## 📁 Structure importante

```
src/
├── domain/              # Logique métier (NO external deps)
├── application/         # Use Cases (orchestration)
├── infrastructure/      # Repositories (DB)
├── components/          # UI React
├── actions/            # Server Actions
└── app/                # Pages & Routes
```

## ✅ Checklist avant commit

- [ ] `npm run build` compile sans erreurs
- [ ] `npm run lint` passe sans erreurs
- [ ] Tests manuels passés
- [ ] Pas de `console.log` de debug
- [ ] Pas de `any` types
- [ ] Commentaires pertinents si besoin
- [ ] Noms descriptifs et clairs
- [ ] SOLID principles respectés

## 🎯 Ressources du projet

- IMPLEMENTATION.md - Architecture détaillée
- TESTING.md - Guide de test complet
- RESUME.md - Résumé du projet
- .github/copilot-instructions.md - Règles de codage SOLID

## 🔑 Endpoints clés

### Authentication
- POST `/api/auth/sign-up/email`
- POST `/api/auth/sign-in/email`
- GET `/api/auth/session`

### Pages
- `/` - Accueil
- `/sign-in` - Sign In / Sign Up
- `/dashboard` - Dashboard (protégé)

### Server Actions
- `createMonster(monsterData)` - Créer un monstre
- `getMonsters()` - Récupérer les monstres
- `feedMonster(monsterId)` - Nourrir
- `playWithMonster(monsterId)` - Jouer
- `sleepMonster(monsterId)` - Dormir
- `cleanMonster(monsterId)` - Nettoyer
- `getMonsterDetails(monsterId)` - Détails

## 📊 Dépendances principales

```json
{
  "next": "15.5.4",
  "react": "19.x",
  "typescript": "5.x",
  "mongoose": "^8.x",
  "better-auth": "^1.x",
  "tailwindcss": "^4.x",
  "shadcn-ui": "latest"
}
```

## 🚨 Erreurs communes

### "Port already in use"
```bash
# Tuer le processus sur le port
lsof -ti:3000 | xargs kill -9
# Ou utiliser le port 3002 (automatique)
```

### "Connexion MongoDB échouée"
```bash
# Vérifier MONGODB_URI dans .env.local
# Vérifier la connexion internet
# Vérifier les credentials
```

### "Invalid origin" Better Auth
```bash
# Ajouter le port à trustedOrigins dans src/lib/auth.ts
# Ou configurer NEXT_PUBLIC_APP_URL
```

## 🎓 Apprendre plus

### Architecture Clean
- Clean Architecture par Robert C. Martin
- Hexagonal Architecture (Ports & Adapters)

### Principes SOLID
- Single Responsibility Principle
- Open/Closed Principle
- Liskov Substitution Principle
- Interface Segregation Principle
- Dependency Inversion Principle

### Ressources
- Next.js Docs: https://nextjs.org/docs
- MongoDB Docs: https://docs.mongodb.com
- TypeScript: https://www.typescriptlang.org/docs
- Better Auth: https://better-auth.dev

---

**Note**: Ce projet démontre comment construire une application scalable, maintenable et type-safe en suivant les meilleurs principes d'architecture moderne.
