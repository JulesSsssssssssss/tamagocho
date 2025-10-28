# 🧪 Guide de test - Tamagotcho

## Démarrage

```bash
npm run dev
```

Le serveur démarrera sur http://localhost:3000 (ou le prochain port disponible)

## 🧑‍💻 Flux de test complet

### 1. **Accueil** 
- URL: `http://localhost:3000`
- ✅ Vérifier: Page de landing affichée avec présentation
- ✅ Vérifier: Bouton "Se connecter" visible
- ✅ Vérifier: Bouton "Créer un compte" visible

### 2. **Création de compte** 
- Cliquer sur "Créer un compte"
- URL: `http://localhost:3000/sign-in`
- ✅ Remplir le formulaire:
  - Nom d'utilisateur: `testuser`
  - Email: `test@example.com`
  - Mot de passe: `password123`
- ✅ Vérifier: Message de validation sur les champs vides
- ✅ Vérifier: Message de validation email invalide
- ✅ Cliquer "Créer mon compte"
- ✅ Attendre redirection vers dashboard

### 3. **Dashboard initial**
- URL: `http://localhost:3000/dashboard`
- ✅ Vérifier: Greeting avec le nom d'utilisateur
- ✅ Vérifier: Bouton "Créer une créature" visible
- ✅ Vérifier: "Aucun monstre trouvé" affiché

### 4. **Créer un monstre**
- Cliquer "Créer une créature"
- ✅ Vérifier: Modal s'ouvre
- Remplir le formulaire:
  - Nom: `Pikachu`
  - Vérifier SVG affiché dans l'aperçu
  - Cliquer boutons émotions (Happy, Sad, Angry, Hungry, Sleepy)
  - ✅ Vérifier: Le SVG change d'expression
- Cliquer "Régénérer" pour nouveau design
  - ✅ Vérifier: Accessoires changent (cornes, oreilles, etc.)
  - ✅ Vérifier: Expression reste selon émotion sélectionnée
- Cliquer "Créer"
- ✅ Attendre fermeture modal
- ✅ Vérifier: Le monstre apparaît dans la liste

### 5. **Interagir avec le monstre**
- Cliquer sur la carte du monstre ou bouton "Voir"
- URL: `http://localhost:3000/dashboard/[monsterId]`
- ✅ Vérifier: Affichage complet:
  - Nom et niveau
  - Barre d'expérience
  - SVG du monstre
  - Barres de stats (Santé, Faim, Bonheur, Énergie)

### 6. **Actions de jeu**
- ✅ Cliquer "🍖 Nourrir"
  - Faim devrait diminuer, Santé augmenter
- ✅ Cliquer "🎮 Jouer"
  - Bonheur augmente, Énergie diminue
  - Expérience augmente
- ✅ Cliquer "😴 Dormir"
  - Énergie augmente, Santé augmente
  - Faim augmente légèrement
- ✅ Cliquer "🧼 Nettoyer"
  - Santé augmente, Bonheur augmente

- ✅ Vérifier: L'émotion change selon les stats:
  - Faim > 80 → "hungry"
  - Energy < 30 → "sleepy"
  - Happiness < 30 → "sad"
  - Sinon → "happy"

### 7. **Système de niveaux**
- Cliquer "Jouer" plusieurs fois
- ✅ Vérifier: Expérience augmente
- ✅ Vérifier: Au seuil (level * 50), le niveau monte
- ✅ Vérifier: Santé +20 au level up

### 8. **Déconnexion**
- Cliquer "Logout" en bas du dashboard
- ✅ Redirection vers home
- ✅ Session fermée

### 9. **Connexion**
- Aller sur `/sign-in`
- Remplir les identifiants:
  - Email: `test@example.com`
  - Mot de passe: `password123`
- ✅ Cliquer "Se connecter"
- ✅ Redirection dashboard
- ✅ Monstre créé précédemment présent

## 🐛 Debugging

### Logs utiles
```
Ouvrir DevTools (F12) > Console
```

- Erreurs d'authentification
- Erreurs de création/modification de monstre
- Stack traces de serveur

### Variables d'environnement
Vérifier `.env.local`:
```
MONGODB_URI=mongodb+srv://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

### Reset complet (DANGER ⚠️)
```bash
# Supprimer les monstres MongoDB
# Supprimer les utilisateurs MongoDB
# Puis recréer un compte
```

## ✅ Checklist de test

- [ ] Création de compte avec validation
- [ ] Connexion avec identifiants corrects
- [ ] Erreur avec identifiants incorrects
- [ ] Création de monstre avec SVG unique
- [ ] Changement d'émotion sans changer accessoires
- [ ] Actions de jeu (Feed, Play, Sleep, Clean)
- [ ] Mise à jour des stats
- [ ] Changement d'émotion automatique
- [ ] Système de niveaux
- [ ] Déconnexion et reconnexion
- [ ] Monstre persiste après rechargement de page
- [ ] Build compile sans erreurs (`npm run build`)
- [ ] Linting passe (`npm run lint`)

## 📊 Commandes utiles

```bash
# Développement
npm run dev

# Build production
npm run build

# Linting
npm run lint

# Linting avec fix
npm run lint -- --fix
```

## 🎯 Architecture validée

- ✅ Domain Entity (Tamagotchi) avec logique métier pure
- ✅ Application Use Cases (Feed, Play, Sleep, Clean)
- ✅ Infrastructure Repository (MongoDB)
- ✅ Server Actions orchestrant les Use Cases
- ✅ React Components consommant les Server Actions
- ✅ Principes SOLID appliqués systématiquement

## 🚀 État de production

L'application est prête pour:
- ✅ Tests utilisateur
- ✅ Déploiement sur Vercel
- ✅ Ajout de nouvelles fonctionnalités
- ✅ Tests d'intégration
- ✅ Tests unitaires du Domain
