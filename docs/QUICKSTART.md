# ⚡ Quick Start - Tamagotcho

## 🚀 Démarrage en 2 minutes

### 1. Prérequis
```bash
✅ Node.js 18+
✅ npm ou pnpm
✅ MongoDB (local ou Atlas)
```

### 2. Installation
```bash
# Cloner le repo
git clone <repo>
cd tamagocho

# Installer les dépendances
npm install
```

### 3. Configuration
```bash
# Créer .env.local
cp .env.example .env.local

# Éditer .env.local avec:
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/tamagocho-db
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
```

### 4. Démarrer
```bash
# Mode développement
npm run dev

# Accéder à http://localhost:3000 (ou 3002 si port occupé)
```

## 👤 Test Account

```
Email: test@example.com
Password: password123
```

Ou créer un nouveau compte directement.

## 🎮 Premiers pas

1. **Créer un compte** - Page sign-in
2. **Créer un monstre** - Dashboard > "Créer une créature"
3. **Nourrir le monstre** - Cliquer sur les boutons (Feed, Play, Sleep, Clean)
4. **Observer les stats** - Barres mettent à jour en temps réel
5. **Niveau up** - Jouer pour augmenter l'expérience

## 📁 Fichiers importants

```
src/
├── domain/              # Logique métier (Tamagotchi entity)
├── application/         # Use Cases
├── infrastructure/      # Repository MongoDB
├── components/          # UI React
└── actions/            # Server Actions

Documentation:
├── IMPLEMENTATION.md    # Architecture détaillée
├── IMPORTS_GUIDE.md    # Guide d'importation
├── TESTING.md          # Guide de test
└── STATUS.md           # État du projet
```

## 🛠️ Commandes essentielles

```bash
# Développement
npm run dev                 # Start dev server
npm run build              # Build production
npm run lint               # Linting
npm run lint -- --fix      # Linting avec auto-fix

# Tests
npm test                   # Run tests (si configuré)
```

## 🐛 Troubleshooting

### Port occupé
```bash
# Le serveur va automatiquement utiliser 3002 ou 3003
# Ou tuer le processus:
lsof -ti:3000 | xargs kill -9
```

### Connexion MongoDB échouée
```bash
# Vérifier:
✅ MONGODB_URI dans .env.local
✅ Credentials corrects
✅ IP whitelist en MongoDB Atlas
✅ Connexion internet OK
```

### Erreur de linting
```bash
npm run lint -- --fix
npm run build
```

## 📚 Documentation complète

| Fichier | Contenu |
|---------|---------|
| IMPLEMENTATION.md | Architecture Clean + layers |
| TESTING.md | Guide de test complet |
| IMPORTS_GUIDE.md | Patterns d'importation |
| COMMANDS.md | Toutes les commandes |
| STATUS.md | État du projet |
| ARCHITECTURE_VISUAL.md | Diagrammes ASCII |
| README.md | Présentation générale |

## 🎯 Architecture en 30 secondes

```
User Action
    ↓
React Component
    ↓
Server Action
    ↓
Use Case
    ↓
Domain Entity (Logique métier)
    ↓
Repository
    ↓
MongoDB
```

## ✅ Vérifications rapides

```bash
# Vérifier le build
npm run build

# Vérifier le linting
npm run lint

# Vérifier les types
npx tsc --noEmit
```

## 🌟 Highlights du code

### Domain Layer (Métier pur)
```typescript
// src/domain/entities/Tamagotchi.ts
const tamagotchi = new Tamagotchi(id, name, draw, 'happy')
tamagotchi.feed()      // Logique métier
tamagotchi.play()
```

### Application Layer (Orchestration)
```typescript
// src/application/use-cases/FeedTamagotchiUseCase.ts
const useCase = new FeedTamagotchiUseCase(repository)
await useCase.execute(monsterId)
```

### Infrastructure (Persistance)
```typescript
// src/infrastructure/repositories/TamagotchiRepository.ts
const repo = new TamagotchiRepository()
await repo.save(tamagotchi)
```

### Server Actions (Interface)
```typescript
// src/actions/monsters/monsters.actions.ts
export async function feedMonster(monsterId: string) {
  await new FeedTamagotchiUseCase(repository).execute(monsterId)
}
```

## 🔐 Sécurité

✅ Authentification Better Auth
✅ Sessions sécurisées
✅ Validation côté serveur
✅ Vérification ownerId
✅ TypeScript strict mode
✅ No SQL injection (Mongoose)

## 🚀 Déploiement (Vercel)

```bash
# Build
npm run build

# Push to Vercel
vercel deploy

# Configurer variables en prod:
✅ MONGODB_URI
✅ GITHUB_CLIENT_ID
✅ GITHUB_CLIENT_SECRET
✅ NEXT_PUBLIC_APP_URL
```

## 💡 Conseils

1. **Comprendre l'architecture**: Lire IMPLEMENTATION.md
2. **Ajouter une feature**: Voir IMPORTS_GUIDE.md > "Ajouter"
3. **Déboguer**: Voir COMMANDS.md > "Debugging"
4. **Tester**: Voir TESTING.md pour checklist

## 📞 Support

### Problèmes courants
- Port occupé → Auto-switch vers 3002/3003
- MongoDB → Vérifier credentials
- Auth → Vérifier trustedOrigins dans src/lib/auth.ts

### Documentation
- Voir les fichiers .md du projet
- Voir .github/copilot-instructions.md pour SOLID

## 🎉 C'est prêt !

L'application est fonctionnelle et prête pour:
- ✅ Tests utilisateur
- ✅ Déploiement
- ✅ Nouvelles fonctionnalités
- ✅ Production

---

**Besoin d'aide?**
- Vérifier STATUS.md
- Lire TESTING.md
- Voir ARCHITECTURE_VISUAL.md

**Bon codage!** 🚀
