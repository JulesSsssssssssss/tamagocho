# Plan de Test - Système de Redirections

**Date**: 31 octobre 2025  
**Feature**: Finalisation de la Base - Redirections  
**Status**: En cours de test

## 📋 Scénarios à tester

### ✅ Scénario 1: Utilisateur NON connecté visite `/`
**Action**: Accéder à `http://localhost:3000/`  
**Résultat attendu**:
- Affiche la landing page (Header, Hero, Benefits, Monsters, Actions, Newsletter, Footer)
- Aucune redirection
- Pas d'erreur console

**Test**:
```bash
# En navigation privée ou après déconnexion
curl -I http://localhost:3000/
# Attendre: Status 200 OK
```

---

### ✅ Scénario 2: Utilisateur CONNECTÉ visite `/`
**Action**: Accéder à `http://localhost:3000/` avec une session active  
**Résultat attendu**:
- Redirection automatique vers `/app`
- `/app` redirige vers `/dashboard`
- Dashboard affiché avec les monstres de l'utilisateur
- Status HTTP: 307 (Temporary Redirect)

**Test**:
```bash
# Après connexion
# Naviguer vers http://localhost:3000/
# Vérifier redirection automatique
```

---

### ✅ Scénario 3: Utilisateur NON connecté tente d'accéder à `/dashboard`
**Action**: Accéder à `http://localhost:3000/dashboard` sans session  
**Résultat attendu**:
- Middleware détecte l'absence de cookie `better-auth.session_token`
- Redirection vers `/sign-in?callbackUrl=/dashboard`
- Page de connexion affichée
- Status HTTP: 307 (Temporary Redirect)

**Test**:
```bash
# En navigation privée
curl -I http://localhost:3000/dashboard
# Attendre: Status 307, Location: /sign-in
```

---

### ✅ Scénario 4: Utilisateur NON connecté tente d'accéder à `/shop`
**Action**: Accéder à `http://localhost:3000/shop` sans session  
**Résultat attendu**:
- Middleware redirige vers `/sign-in?callbackUrl=/shop`
- Page de connexion affichée
- Après connexion → retour automatique sur `/shop`

**Test**:
```bash
# En navigation privée
curl -I http://localhost:3000/shop
# Attendre: Status 307, Location: /sign-in?callbackUrl=/shop
```

---

### ✅ Scénario 5: Utilisateur NON connecté tente d'accéder à `/wallet`
**Action**: Accéder à `http://localhost:3000/wallet` sans session  
**Résultat attendu**:
- Middleware redirige vers `/sign-in?callbackUrl=/wallet`
- Page de connexion affichée

---

### ✅ Scénario 6: Utilisateur NON connecté tente d'accéder à `/creature`
**Action**: Accéder à `http://localhost:3000/creature` sans session  
**Résultat attendu**:
- Middleware redirige vers `/sign-in?callbackUrl=/creature`
- Page de connexion affichée

---

### ✅ Scénario 7: Utilisateur NON connecté tente d'accéder à `/app`
**Action**: Accéder à `http://localhost:3000/app` sans session  
**Résultat attendu**:
- Middleware redirige vers `/sign-in?callbackUrl=/app`
- Page de connexion affichée

---

### ✅ Scénario 8: Utilisateur se connecte depuis `/sign-in`
**Action**: Remplir le formulaire de connexion et soumettre  
**Résultat attendu**:
- Connexion réussie
- Redirection vers `/app` (callbackURL configuré)
- `/app` redirige vers `/dashboard`
- Dashboard affiché avec session active

**Test**:
```typescript
// Vérifier dans signin-form.tsx
authClient.signIn.email({
  email: '...',
  password: '...',
  callbackURL: '/app' // ✅ Doit être '/app'
})
```

---

### ✅ Scénario 9: Utilisateur s'inscrit depuis `/sign-in`
**Action**: Basculer sur "Créer un compte" et s'inscrire  
**Résultat attendu**:
- Inscription réussie
- Auto-connexion activée (BetterAuth config)
- Redirection vers `/app` (callbackURL configuré)
- Dashboard affiché

**Test**:
```typescript
// Vérifier dans signup-form.tsx
authClient.signUp.email({
  email: '...',
  password: '...',
  name: '...',
  callbackURL: '/app' // ✅ Doit être '/app'
})
```

---

### ✅ Scénario 10: Utilisateur CONNECTÉ visite `/sign-in`
**Action**: Accéder à `http://localhost:3000/sign-in` avec une session active  
**Résultat attendu**:
- Vérification de session dans `sign-in/page.tsx`
- Redirection automatique vers `/app`
- Évite la double connexion

**Test**:
```tsx
// Vérifier dans src/app/sign-in/page.tsx
if (session !== null && session !== undefined) {
  redirect('/app') // ✅ Doit rediriger
}
```

---

### ✅ Scénario 11: Utilisateur se déconnecte depuis `/dashboard`
**Action**: Cliquer sur le bouton "Se déconnecter"  
**Résultat attendu**:
- Session supprimée via `authClient.signOut()`
- Cookie `better-auth.session_token` invalidé
- Redirection vers `/` (landing page)
- Landing page affichée
- Aucune erreur "User not authenticated"

**Test**:
```typescript
// Vérifier dans dashboard-content.tsx
authClient.signOut({
  fetchOptions: {
    onSuccess: () => {
      router.push('/') // ✅ Doit rediriger vers /
    }
  }
})
```

---

### ✅ Scénario 12: Utilisateur connecté avec callbackUrl
**Action**: 
1. Non connecté tente d'accéder `/shop`
2. Redirigé vers `/sign-in?callbackUrl=/shop`
3. Se connecte

**Résultat attendu**:
- Connexion réussie
- Redirection vers `/shop` (callbackUrl prioritaire sur callbackURL par défaut)
- Shop affiché avec session active

**Note**: BetterAuth gère automatiquement le paramètre `callbackUrl` dans l'URL

---

## 🔒 Vérifications de sécurité

### Middleware Edge Runtime
- ✅ Pas d'import MongoDB/Node.js
- ✅ Utilise uniquement les cookies
- ✅ Fonction synchrone (pas async dans Edge)
- ✅ Matcher exclut les assets statiques

### Server Components
- ✅ Double vérification session (defense in depth)
- ✅ Redirection si session null/undefined
- ✅ Appels DB uniquement si session valide

### Client Components
- ✅ Gestion d'erreur dans les callbacks
- ✅ Router.push() au lieu de window.location
- ✅ Pas de state race conditions

---

## 🧪 Commandes de test

### Test manuel complet
```bash
# 1. Démarrer le serveur
npm run dev

# 2. Ouvrir navigation privée
# Chrome: Cmd+Shift+N
# Firefox: Cmd+Shift+P

# 3. Tester chaque scénario dans l'ordre
# - Scénario 1: http://localhost:3000/
# - Scénario 3: http://localhost:3000/dashboard
# - Scénario 4: http://localhost:3000/shop
# - Scénario 8: Se connecter
# - Scénario 2: http://localhost:3000/ (après connexion)
# - Scénario 10: http://localhost:3000/sign-in (après connexion)
# - Scénario 11: Se déconnecter

# 4. Vérifier la console pour les erreurs
```

### Test avec curl
```bash
# Test redirection landing page (non connecté)
curl -I http://localhost:3000/

# Test redirection routes protégées (non connecté)
curl -I http://localhost:3000/dashboard
curl -I http://localhost:3000/shop
curl -I http://localhost:3000/wallet

# Vérifier les headers
# Location: /sign-in ou /sign-in?callbackUrl=...
```

---

## 📊 Résultats attendus

| Scénario | Statut | Route | Redirection | Notes |
|----------|--------|-------|-------------|-------|
| 1 | ✅ | `/` (non connecté) | Aucune | Landing page |
| 2 | ✅ | `/` (connecté) | → `/app` → `/dashboard` | Auto redirect |
| 3 | ✅ | `/dashboard` (non connecté) | → `/sign-in?callbackUrl=/dashboard` | Middleware |
| 4 | ✅ | `/shop` (non connecté) | → `/sign-in?callbackUrl=/shop` | Middleware |
| 5 | ✅ | `/wallet` (non connecté) | → `/sign-in?callbackUrl=/wallet` | Middleware |
| 6 | ✅ | `/creature` (non connecté) | → `/sign-in?callbackUrl=/creature` | Middleware |
| 7 | ✅ | `/app` (non connecté) | → `/sign-in?callbackUrl=/app` | Middleware |
| 8 | ✅ | Connexion | → `/app` → `/dashboard` | callbackURL |
| 9 | ✅ | Inscription | → `/app` → `/dashboard` | callbackURL |
| 10 | ✅ | `/sign-in` (connecté) | → `/app` → `/dashboard` | Évite double login |
| 11 | ✅ | Déconnexion | → `/` | Landing page |
| 12 | ✅ | Avec callbackUrl | → URL demandée | Retour après login |

---

## 🐛 Erreurs à surveiller

### Console Browser
- ❌ `User not authenticated` après déconnexion
- ❌ `401 Unauthorized` sur `/api/monsters`
- ❌ `Uncaught Error` dans React
- ❌ Boucles de redirection infinies

### Console Server
- ❌ `Edge runtime does not support Node.js 'crypto' module`
- ❌ `MongoDB connection failed`
- ❌ `Session not found` répétés

### Network
- ❌ Status 500 Internal Server Error
- ❌ Status 404 Not Found
- ❌ Redirections > 5 fois (boucle)

---

## ✅ Critères de validation

Pour valider la tâche 4, tous les scénarios doivent :
1. ✅ Rediriger correctement (bonnes URLs)
2. ✅ Pas d'erreurs console (browser + server)
3. ✅ Pas de boucles de redirection
4. ✅ Status HTTP appropriés (200, 307)
5. ✅ Expérience utilisateur fluide (pas de flash)

---

## 🎯 Prochaines étapes

Une fois tous les tests passés :
- [ ] Marquer la tâche 4 comme complétée
- [ ] Passer à la tâche 5 (Gestion des erreurs de session)
- [ ] Documenter les résultats dans un rapport final
