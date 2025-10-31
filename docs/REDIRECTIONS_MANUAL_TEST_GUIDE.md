# 🧪 Guide de Test Manuel - Système de Redirections

Ce guide vous permet de tester manuellement toutes les fonctionnalités de redirection implémentées.

---

## 🎯 Objectif

Vérifier que le système de redirections fonctionne correctement selon la **Feature 2.1** des spécifications.

---

## 🚀 Pré-requis

1. **Serveur lancé :**
   ```bash
   npm run dev
   ```

2. **Base de données connectée :**
   - MongoDB doit être accessible
   - Vérifier la connexion dans les logs

3. **Compte de test :**
   - Email : `test@tamagocho.com`
   - Mot de passe : `Test123456!`
   - Ou créer un nouveau compte

---

## 📋 Tests à effectuer

### Test 1 : Redirection intelligente sur `/` (non connecté)

**Objectif :** Vérifier qu'un utilisateur non connecté reste sur la landing page

**Étapes :**
1. ✅ Ouvrir un **navigateur en mode privé** (incognito)
2. ✅ Visiter : http://localhost:3000/
3. ✅ **Résultat attendu :** La landing page s'affiche (Header + Hero + Benefits + etc.)
4. ✅ **Pas de redirection**

**✅ Test réussi si :** Vous restez sur la landing page

---

### Test 2 : Redirection intelligente sur `/` (connecté)

**Objectif :** Vérifier qu'un utilisateur connecté est redirigé vers `/app`

**Étapes :**
1. ✅ Se connecter sur http://localhost:3000/sign-in
2. ✅ Une fois connecté, visiter : http://localhost:3000/
3. ✅ **Résultat attendu :** 
   - Redirection automatique vers `/app`
   - Puis redirection vers `/dashboard`
   - Affichage du dashboard avec vos monstres

**✅ Test réussi si :** URL finale = `http://localhost:3000/dashboard`

---

### Test 3 : Protection des routes (non connecté)

**Objectif :** Vérifier que les routes protégées redirigent vers `/sign-in`

**Étapes :**
1. ✅ Ouvrir un **navigateur en mode privé**
2. ✅ Visiter : http://localhost:3000/dashboard
3. ✅ **Résultat attendu :**
   - Redirection vers `/sign-in?callbackUrl=/dashboard`
   - Affichage du formulaire de connexion

**Répéter avec ces URLs :**
- http://localhost:3000/wallet
- http://localhost:3000/shop
- http://localhost:3000/creature/test

**✅ Test réussi si :** Toutes redirigent vers `/sign-in` avec le bon `callbackUrl`

---

### Test 4 : CallbackUrl après connexion

**Objectif :** Vérifier que la redirection post-connexion revient au bon endroit

**Étapes :**
1. ✅ Ouvrir un **navigateur en mode privé**
2. ✅ Visiter : http://localhost:3000/wallet
3. ✅ **Résultat attendu :** Redirection vers `/sign-in?callbackUrl=/wallet`
4. ✅ Se connecter avec vos identifiants
5. ✅ **Résultat attendu après connexion :**
   - Redirection automatique vers `/wallet`
   - Affichage de la page Wallet

**✅ Test réussi si :** URL finale = `http://localhost:3000/wallet`

---

### Test 5 : Pages d'auth si déjà connecté

**Objectif :** Vérifier qu'un utilisateur connecté ne peut pas accéder à `/sign-in`

**Étapes :**
1. ✅ Se connecter sur http://localhost:3000/sign-in
2. ✅ Une fois connecté, essayer de visiter : http://localhost:3000/sign-in
3. ✅ **Résultat attendu :**
   - Redirection automatique vers `/app`
   - Puis vers `/dashboard`
   - Impossible de voir le formulaire de connexion

**✅ Test réussi si :** Vous êtes redirigé vers le dashboard

---

### Test 6 : Connexion réussie

**Objectif :** Vérifier la redirection après connexion depuis `/sign-in`

**Étapes :**
1. ✅ Ouvrir un **navigateur en mode privé**
2. ✅ Visiter : http://localhost:3000/sign-in
3. ✅ Remplir le formulaire de connexion
4. ✅ Cliquer sur "Se connecter"
5. ✅ **Résultat attendu :**
   - Message "✅ Connexion réussie" dans la console
   - Redirection automatique vers `/app`
   - Puis vers `/dashboard`

**✅ Test réussi si :** URL finale = `http://localhost:3000/dashboard`

---

### Test 7 : Inscription réussie

**Objectif :** Vérifier la redirection après inscription depuis `/sign-in`

**Étapes :**
1. ✅ Ouvrir un **navigateur en mode privé**
2. ✅ Visiter : http://localhost:3000/sign-in
3. ✅ Cliquer sur "🆕 Créer un compte"
4. ✅ Remplir le formulaire d'inscription
5. ✅ Cliquer sur "Créer mon compte"
6. ✅ **Résultat attendu :**
   - Message "✅ Inscription réussie" dans la console
   - Redirection automatique vers `/app`
   - Puis vers `/dashboard`

**✅ Test réussi si :** URL finale = `http://localhost:3000/dashboard`

---

### Test 8 : Message d'erreur de session expirée

**Objectif :** Vérifier l'affichage du message d'erreur

**Étapes :**
1. ✅ Visiter manuellement : http://localhost:3000/sign-in?error=session_expired
2. ✅ **Résultat attendu :**
   - Bannière rouge affichée au-dessus du formulaire
   - Message : "⏰ Votre session a expiré. Veuillez vous reconnecter."

**Répéter avec ces erreurs :**
- `?error=unauthorized` → "🔒 Vous devez être connecté..."
- `?error=authentication_failed` → "❌ Échec de l'authentification..."

**✅ Test réussi si :** Les 3 messages s'affichent correctement

---

### Test 9 : CallbackUrl dans le message d'erreur

**Objectif :** Vérifier que le callbackUrl est affiché dans le message

**Étapes :**
1. ✅ Visiter : http://localhost:3000/sign-in?error=session_expired&callbackUrl=/wallet
2. ✅ **Résultat attendu :**
   - Bannière d'erreur affichée
   - Sous le message principal : "Vous serez redirigé vers : /wallet"

**✅ Test réussi si :** Le callbackUrl est visible

---

### Test 10 : Déconnexion

**Objectif :** Vérifier la redirection après déconnexion

**Étapes :**
1. ✅ Se connecter sur http://localhost:3000/sign-in
2. ✅ Aller sur le dashboard
3. ✅ Cliquer sur le bouton "Se déconnecter"
4. ✅ **Résultat attendu :**
   - Session terminée
   - Redirection vers `/` (landing page)

**✅ Test réussi si :** Vous êtes sur la landing page et non connecté

---

### Test 11 : Navigation entre routes protégées

**Objectif :** Vérifier la navigation fluide quand connecté

**Étapes :**
1. ✅ Se connecter
2. ✅ Visiter successivement :
   - http://localhost:3000/dashboard
   - http://localhost:3000/wallet
   - http://localhost:3000/shop
3. ✅ **Résultat attendu :**
   - Toutes les pages s'affichent
   - Aucune redirection vers `/sign-in`

**✅ Test réussi si :** Navigation fluide sans redirection

---

## 📊 Tableau récapitulatif

| # | Test | Résultat | Notes |
|---|------|----------|-------|
| 1 | `/` non connecté | ⬜ | Reste sur landing |
| 2 | `/` connecté | ⬜ | Redirige vers /app |
| 3 | Routes protégées non connecté | ⬜ | Redirige vers /sign-in |
| 4 | CallbackUrl post-connexion | ⬜ | Revient à la page voulue |
| 5 | `/sign-in` si connecté | ⬜ | Redirige vers /app |
| 6 | Connexion réussie | ⬜ | Redirige vers /app |
| 7 | Inscription réussie | ⬜ | Redirige vers /app |
| 8 | Messages d'erreur | ⬜ | Affichés correctement |
| 9 | CallbackUrl dans erreur | ⬜ | Visible |
| 10 | Déconnexion | ⬜ | Redirige vers / |
| 11 | Navigation protégée | ⬜ | Fluide |

**Cochez ✅ quand le test est réussi**

---

## 🐛 En cas de problème

### Problème 1 : Pas de redirection

**Vérifier :**
1. Le serveur est bien lancé : `npm run dev`
2. MongoDB est connecté (vérifier les logs)
3. Le fichier `src/middleware.ts` existe
4. Vider le cache du navigateur (Cmd+Shift+R ou Ctrl+Shift+R)

### Problème 2 : Erreur 500

**Vérifier :**
1. Les logs du serveur pour voir l'erreur exacte
2. La connexion MongoDB
3. Les variables d'environnement `.env.local`

### Problème 3 : Redirection en boucle

**Vérifier :**
1. Les cookies du navigateur
2. Essayer en mode privé
3. Vérifier les logs du middleware

### Problème 4 : Message d'erreur non affiché

**Vérifier :**
1. L'URL contient bien `?error=...`
2. Le paramètre `error` est correct
3. Inspecter la page avec DevTools

---

## 🔍 Outils de debug

### Console du navigateur

Ouvrir la console (F12) pour voir :
- Les logs de connexion/inscription
- Les erreurs JavaScript
- Les requêtes réseau (onglet Network)

### Logs du serveur

Dans le terminal où `npm run dev` tourne :
- Logs du middleware
- Erreurs de session
- Requêtes HTTP

### Network tab

Dans DevTools → Network :
- Voir les redirections (status 307)
- Vérifier les cookies
- Voir les headers

---

## ✅ Validation finale

**Le système est OK si :**

1. ✅ Tous les tests du tableau sont cochés
2. ✅ Aucune erreur dans la console
3. ✅ Navigation fluide
4. ✅ Messages d'erreur clairs

---

## 📝 Rapport de test

**Date :** _________________

**Testeur :** _________________

**Résultats :**
- Tests réussis : _____ / 11
- Tests échoués : _____ / 11

**Bugs trouvés :**
_______________________________________
_______________________________________
_______________________________________

**Commentaires :**
_______________________________________
_______________________________________
_______________________________________

---

**Bon courage ! 🚀**
