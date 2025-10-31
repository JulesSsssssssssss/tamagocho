# Guide de Test Manuel - Système de Redirections

## 🎯 Objectif
Valider que toutes les redirections fonctionnent correctement selon les spécifications de la Feature 2.1.

## 🚀 Prérequis

1. **Serveur démarré**
   ```bash
   npm run dev
   ```

2. **Navigation privée** (pour tester sans session)
   - Chrome: `Cmd+Shift+N` (Mac) / `Ctrl+Shift+N` (Windows)
   - Firefox: `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows)

3. **Console DevTools ouverte**
   - `F12` ou `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
   - Onglets: Console + Network

---

## ✅ Checklist de Test

### 📝 PARTIE 1: Utilisateur NON connecté

#### Test 1.1: Landing Page
- [ ] Ouvrir `http://localhost:3000/` en navigation privée
- [ ] **Attendu**: Landing page s'affiche (Header, Hero, Benefits, etc.)
- [ ] **Attendu**: Aucune redirection
- [ ] **Attendu**: Console sans erreur
- [ ] **Attendu**: Network: `GET / → 200 OK`

#### Test 1.2: Tentative d'accès au Dashboard
- [ ] Toujours en navigation privée
- [ ] Naviguer vers `http://localhost:3000/dashboard`
- [ ] **Attendu**: Redirection automatique vers `/sign-in`
- [ ] **Attendu**: URL devient `http://localhost:3000/sign-in?callbackUrl=/dashboard`
- [ ] **Attendu**: Formulaire de connexion affiché
- [ ] **Attendu**: Network: `GET /dashboard → 307 Redirect`

#### Test 1.3: Tentative d'accès au Shop
- [ ] Naviguer vers `http://localhost:3000/shop`
- [ ] **Attendu**: Redirection vers `/sign-in?callbackUrl=/shop`
- [ ] **Attendu**: Formulaire de connexion affiché

#### Test 1.4: Tentative d'accès au Wallet
- [ ] Naviguer vers `http://localhost:3000/wallet`
- [ ] **Attendu**: Redirection vers `/sign-in?callbackUrl=/wallet`
- [ ] **Attendu**: Formulaire de connexion affiché

#### Test 1.5: Tentative d'accès à /app
- [ ] Naviguer vers `http://localhost:3000/app`
- [ ] **Attendu**: Redirection vers `/sign-in?callbackUrl=/app`
- [ ] **Attendu**: Formulaire de connexion affiché

---

### 📝 PARTIE 2: Connexion / Inscription

#### Test 2.1: Connexion réussie
- [ ] Sur `/sign-in`, remplir le formulaire
  - Email: `test@example.com` (ou votre compte test)
  - Password: `votremotdepasse`
- [ ] Cliquer sur "🎮 Se connecter"
- [ ] **Attendu**: Message de succès ou chargement
- [ ] **Attendu**: Redirection vers `/app`
- [ ] **Attendu**: `/app` redirige vers `/dashboard`
- [ ] **Attendu**: Dashboard affiché avec vos monstres
- [ ] **Attendu**: Console log: `✅ Connexion réussie`
- [ ] **Attendu**: Pas d'erreur 401 ou 500

#### Test 2.2: Inscription réussie
- [ ] Se déconnecter (bouton "Se déconnecter")
- [ ] Retourner sur `/sign-in`
- [ ] Cliquer sur "🆕 Créer un compte"
- [ ] Remplir le formulaire d'inscription
  - Nom: `Test User`
  - Email: `nouveau@example.com`
  - Password: `password123`
- [ ] Cliquer sur "🎆 Créer mon compte"
- [ ] **Attendu**: Inscription réussie
- [ ] **Attendu**: Auto-connexion (BetterAuth)
- [ ] **Attendu**: Redirection vers `/app` → `/dashboard`
- [ ] **Attendu**: Dashboard affiché (avec message de bienvenue)

---

### 📝 PARTIE 3: Utilisateur CONNECTÉ

#### Test 3.1: Landing Page redirige vers Dashboard
- [ ] Étant connecté, naviguer vers `http://localhost:3000/`
- [ ] **Attendu**: Redirection automatique vers `/app`
- [ ] **Attendu**: `/app` redirige vers `/dashboard`
- [ ] **Attendu**: Dashboard affiché
- [ ] **Attendu**: Network: `GET / → 307 Redirect`
- [ ] **Attendu**: Aucun flash de landing page

#### Test 3.2: Sign-in redirige vers Dashboard
- [ ] Étant connecté, naviguer vers `http://localhost:3000/sign-in`
- [ ] **Attendu**: Redirection automatique vers `/app`
- [ ] **Attendu**: Dashboard affiché
- [ ] **Attendu**: Pas de formulaire de connexion affiché

#### Test 3.3: Accès aux routes protégées
- [ ] Naviguer vers `http://localhost:3000/shop`
- [ ] **Attendu**: Shop affiché directement
- [ ] **Attendu**: Aucune redirection vers `/sign-in`
- [ ] **Attendu**: Données chargées (items, solde)

- [ ] Naviguer vers `http://localhost:3000/wallet`
- [ ] **Attendu**: Wallet affiché directement
- [ ] **Attendu**: Solde de Koins visible

- [ ] Naviguer vers `http://localhost:3000/dashboard`
- [ ] **Attendu**: Dashboard affiché directement
- [ ] **Attendu**: Monstres visibles

---

### 📝 PARTIE 4: Déconnexion

#### Test 4.1: Déconnexion depuis le Dashboard
- [ ] Sur `/dashboard`, localiser le bouton "Se déconnecter"
- [ ] Ouvrir la console DevTools
- [ ] Cliquer sur "Se déconnecter"
- [ ] **Attendu**: Console log: `✅ Déconnexion réussie`
- [ ] **Attendu**: Redirection vers `/` (landing page)
- [ ] **Attendu**: Landing page affichée
- [ ] **Attendu**: Aucune erreur "User not authenticated"
- [ ] **Attendu**: Aucune erreur 401 ou 500
- [ ] **Attendu**: Cookie `better-auth.session_token` supprimé (vérifier dans DevTools > Application > Cookies)

#### Test 4.2: Accès aux routes après déconnexion
- [ ] Tenter d'accéder à `/dashboard`
- [ ] **Attendu**: Redirection vers `/sign-in`
- [ ] **Attendu**: Pas d'erreur console
- [ ] **Attendu**: Session bien supprimée

---

### 📝 PARTIE 5: CallbackURL (Retour après connexion)

#### Test 5.1: Retour vers la page demandée
- [ ] Se déconnecter
- [ ] Naviguer vers `http://localhost:3000/shop`
- [ ] **Attendu**: Redirection vers `/sign-in?callbackUrl=/shop`
- [ ] **Attendu**: Paramètre `callbackUrl` visible dans l'URL
- [ ] Se connecter
- [ ] **Attendu**: Après connexion, redirection vers `/shop` (si BetterAuth gère callbackUrl)
- [ ] **Sinon**: Redirection vers `/app` (comportement par défaut)

**Note**: BetterAuth peut gérer automatiquement le `callbackUrl` si configuré. Vérifier la documentation BetterAuth.

---

## 🐛 Erreurs à surveiller

### Console Browser (DevTools)
```
❌ User not authenticated (après déconnexion)
❌ 401 Unauthorized on /api/monsters
❌ Uncaught Error: ...
❌ Warning: Maximum update depth exceeded
❌ Redirection loop detected
```

### Console Server (Terminal)
```
❌ Error: The edge runtime does not support Node.js 'crypto' module
❌ MongoDB connection failed
❌ ⨯ Error: User not authenticated (en boucle)
❌ POST /dashboard 500
```

### Network Tab (DevTools)
```
❌ Status 500 Internal Server Error
❌ Status 404 Not Found
❌ > 5 redirections consécutives (boucle infinie)
❌ Requêtes qui ne se terminent jamais (pending)
```

---

## 📊 Tableau de Validation

| Test | Statut | Notes |
|------|--------|-------|
| 1.1 - Landing page non connecté | ⬜ |  |
| 1.2 - Dashboard → sign-in | ⬜ |  |
| 1.3 - Shop → sign-in | ⬜ |  |
| 1.4 - Wallet → sign-in | ⬜ |  |
| 1.5 - App → sign-in | ⬜ |  |
| 2.1 - Connexion réussie | ⬜ |  |
| 2.2 - Inscription réussie | ⬜ |  |
| 3.1 - Landing → dashboard (connecté) | ⬜ |  |
| 3.2 - Sign-in → dashboard (connecté) | ⬜ |  |
| 3.3 - Accès routes protégées | ⬜ |  |
| 4.1 - Déconnexion → landing | ⬜ |  |
| 4.2 - Dashboard après déconnexion | ⬜ |  |
| 5.1 - CallbackURL fonctionnel | ⬜ |  |

---

## 🎯 Critères de Réussite

Pour valider la tâche 4, **TOUS** les tests doivent passer :
- ✅ Toutes les cases cochées
- ✅ Aucune erreur dans la console (browser + server)
- ✅ Redirections fluides (pas de flash de contenu)
- ✅ Status HTTP appropriés (200, 307)
- ✅ Expérience utilisateur cohérente

---

## 🔧 En cas de problème

### Problème: Boucle de redirection infinie
**Solution**: Vérifier que le middleware ne redirige pas les routes publiques (`/`, `/sign-in`)

### Problème: Erreur "User not authenticated" après déconnexion
**Solution**: Vérifier que `router.push('/')` redirige bien avant les appels API

### Problème: Middleware ne fonctionne pas
**Solution**: Vérifier que `src/middleware.ts` existe et que le matcher est correct

### Problème: Session persiste après déconnexion
**Solution**: Vérifier que `authClient.signOut()` est bien appelé et que les cookies sont supprimés

---

## 📝 Rapport de Test

Après avoir complété tous les tests, remplir ce rapport :

**Date**: _____________  
**Testeur**: _____________  
**Environnement**: Local / Production  

**Résultats**:
- Tests passés: ____ / 13
- Tests échoués: ____
- Blockers identifiés: ____________

**Commentaires**:
_____________________________________________
_____________________________________________

**Signature**: ____________
