# 🔀 Système de Redirections - Implémentation Complète

## 📝 Vue d'ensemble

Ce document décrit l'implémentation complète du système de redirections conformément à la **Feature 2.1** des spécifications du projet Tamagotcho.

---

## ✅ Fonctionnalités implémentées

### 1. Redirection intelligente sur `/`

**Règles :**
- ✅ **Non connecté** → Reste sur `/` (landing page)
- ✅ **Connecté** → Redirection vers `/app` (puis `/dashboard`)

**Implémentation :**
- Middleware : `src/middleware.ts` (lignes 38-50)
- Vérifie la session utilisateur
- Redirige selon l'état d'authentification

---

### 2. Redirections post-connexion

**Règles :**
- ✅ `/sign-in` → `/app` après connexion réussie
- ✅ `/sign-up` → `/app` après inscription réussie
- ✅ Support du paramètre `callbackUrl` pour redirection personnalisée

**Implémentation :**
- Formulaire SignIn : `src/components/forms/signin-form.tsx`
  - Récupère `callbackUrl` depuis l'URL (ligne 13)
  - Utilise `/app` par défaut
  - Passe à `authClient.signIn.email()` (ligne 47)

- Formulaire SignUp : `src/components/forms/signup-form.tsx`
  - Récupère `callbackUrl` depuis l'URL (ligne 14)
  - Utilise `/app` par défaut
  - Passe à `authClient.signUp.email()` (ligne 61)

---

### 3. Protection des routes

**Routes protégées :**
- `/app` → Redirection vers `/sign-in` si non authentifié
- `/dashboard` → Redirection vers `/sign-in` si non authentifié
- `/creature/*` → Redirection vers `/sign-in` si non authentifié
- `/shop` → Redirection vers `/sign-in` si non authentifié
- `/wallet` → Redirection vers `/sign-in` si non authentifié

**Implémentation :**
- Middleware : `src/middleware.ts` (lignes 60-67)
- Vérifie l'authentification
- Ajoute `callbackUrl` pour revenir après connexion

---

### 4. Redirection des pages d'auth si déjà connecté

**Règles :**
- ✅ `/sign-in` → `/app` si déjà connecté
- ✅ `/sign-up` → `/app` si déjà connecté

**Implémentation :**
- Middleware : `src/middleware.ts` (lignes 52-56)

---

### 5. Gestion des erreurs

**Messages d'erreur :**
- ✅ `session_expired` : Session expirée
- ✅ `unauthorized` : Accès non autorisé
- ✅ `authentication_failed` : Échec d'authentification

**Implémentation :**
- Page SignIn : `src/app/sign-in/page.tsx`
  - Récupère le paramètre `error` de l'URL (ligne 23)
  - Affiche un message approprié (lignes 26-30)
  - Affiche le `callbackUrl` prévu (lignes 38-42)

- Middleware : gestion des erreurs (lignes 75-92)
  - Catch les erreurs de session
  - Redirige vers `/sign-in?error=session_expired&callbackUrl=...`

---

## 🏗️ Architecture

### Structure des fichiers

```
src/
├── middleware.ts                      # ⭐ Middleware principal
├── app/
│   ├── page.tsx                       # Landing page (non modifiée)
│   ├── app/
│   │   └── page.tsx                   # ⭐ Alias vers /dashboard
│   ├── sign-in/
│   │   └── page.tsx                   # ⭐ Page de connexion (avec gestion erreurs)
│   ├── dashboard/
│   │   └── page.tsx                   # Dashboard (protection existante)
│   └── ...
└── components/
    └── forms/
        ├── signin-form.tsx            # ⭐ Formulaire connexion (callbackUrl)
        └── signup-form.tsx            # ⭐ Formulaire inscription (callbackUrl)
```

### Flux de redirection

#### Scénario 1 : Utilisateur non connecté visite `/dashboard`

```
1. Requête: GET /dashboard
2. Middleware détecte: non authentifié
3. Middleware redirige: /sign-in?callbackUrl=/dashboard
4. Page SignIn affiche le formulaire
5. Utilisateur se connecte
6. authClient redirige vers: callbackUrl (/dashboard)
7. Middleware autorise l'accès
8. Affichage de /dashboard
```

#### Scénario 2 : Utilisateur connecté visite `/`

```
1. Requête: GET /
2. Middleware détecte: authentifié
3. Middleware redirige: /app
4. Route /app redirige: /dashboard
5. Affichage de /dashboard
```

#### Scénario 3 : Utilisateur connecté visite `/sign-in`

```
1. Requête: GET /sign-in
2. Middleware détecte: authentifié + page d'auth
3. Middleware redirige: /app
4. Route /app redirige: /dashboard
5. Affichage de /dashboard
```

#### Scénario 4 : Session expirée sur une route protégée

```
1. Requête: GET /wallet
2. Middleware détecte: session expirée (catch error)
3. Middleware redirige: /sign-in?error=session_expired&callbackUrl=/wallet
4. Page SignIn affiche message d'erreur + callbackUrl
5. Utilisateur se reconnecte
6. Redirection vers /wallet
```

---

## 🔧 Middleware - Détails techniques

### Fichier : `src/middleware.ts`

#### Imports et types

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
```

#### Fonction principale

```typescript
export async function middleware (request: NextRequest): Promise<NextResponse>
```

#### Logique de décision

1. **Récupération de la session**
   ```typescript
   const session = await auth.api.getSession({
     headers: request.headers
   })
   const isAuthenticated = session !== null && session !== undefined
   ```

2. **Classification des routes**
   ```typescript
   const isAuthPage = pathname.startsWith('/sign-in') || 
                     pathname.startsWith('/sign-up')
   const isProtectedRoute = pathname.startsWith('/app') || 
                           pathname.startsWith('/dashboard') || ...
   ```

3. **Application des règles**
   - Règle 1 : Redirection intelligente `/`
   - Règle 2 : Pages d'auth si connecté
   - Règle 3 : Routes protégées si non connecté
   - Règle 4 : Alias `/app` → `/dashboard`

4. **Gestion des erreurs**
   - Try/catch global
   - Redirection sécurisée en cas d'erreur
   - Logging pour debug

#### Configuration matcher

```typescript
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)'
  ]
}
```

**Exclut :**
- Routes API (`/api/*`)
- Fichiers statiques (`/_next/static`, `/_next/image`)
- Assets publics (`/favicon.ico`, `/public/*`)
- Extensions de fichiers (`.png`, `.jpg`, etc.)

---

## 📦 Composants mis à jour

### 1. SignInForm

**Fichier :** `src/components/forms/signin-form.tsx`

**Changements :**
- Import `useSearchParams` de Next.js
- Récupération du `callbackUrl` depuis l'URL
- Valeur par défaut : `/app`
- Passage à `authClient.signIn.email()`

**Code clé :**
```typescript
const searchParams = useSearchParams()
const callbackUrl = searchParams.get('callbackUrl') ?? '/app'

void authClient.signIn.email({
  email: credentials.email,
  password: credentials.password,
  callbackURL: callbackUrl
}, { ... })
```

### 2. SignUpForm

**Fichier :** `src/components/forms/signup-form.tsx`

**Changements :** Identiques à SignInForm

### 3. Page SignIn

**Fichier :** `src/app/sign-in/page.tsx`

**Changements :**
- Ajout du paramètre `searchParams` (Next.js 15)
- Récupération de `error` et `callbackUrl`
- Affichage conditionnel du message d'erreur
- Messages d'erreur personnalisés

**Code clé :**
```typescript
async function SignInPage ({
  searchParams
}: {
  searchParams: Promise<{ error?: string, callbackUrl?: string }>
}): Promise<React.ReactNode> {
  const params = await searchParams
  const errorType = params.error
  const callbackUrl = params.callbackUrl

  const errorMessages: Record<string, string> = {
    session_expired: '⏰ Votre session a expiré...',
    unauthorized: '🔒 Vous devez être connecté...',
    authentication_failed: '❌ Échec de l\'authentification...'
  }

  const errorMessage = errorType !== undefined ? 
    errorMessages[errorType] : undefined
  
  // ... Affichage du banner d'erreur
}
```

### 4. Page `/app`

**Fichier :** `src/app/app/page.tsx`

**Nouveau fichier :**
- Alias vers `/dashboard`
- Redirection automatique
- Simplifie le flux post-connexion

**Code :**
```typescript
export default async function AppPage (): Promise<never> {
  redirect('/dashboard')
}
```

---

## 🧪 Tests

### Script de test automatisé

**Fichier :** `test-redirections-feature.sh`

**Utilisation :**
```bash
./test-redirections-feature.sh
```

**Tests couverts :**
1. ✅ Landing page accessible sans connexion
2. ✅ Routes protégées redirigent vers `/sign-in`
3. ✅ Pages d'auth accessibles sans connexion
4. ✅ Paramètres d'erreur et callbackUrl fonctionnent

### Tests manuels recommandés

1. **Utilisateur non connecté :**
   - [ ] Visiter `/` → Affiche landing page
   - [ ] Visiter `/dashboard` → Redirige vers `/sign-in?callbackUrl=/dashboard`
   - [ ] Visiter `/wallet` → Redirige vers `/sign-in?callbackUrl=/wallet`

2. **Utilisateur connecté :**
   - [ ] Visiter `/` → Redirige vers `/app` puis `/dashboard`
   - [ ] Visiter `/sign-in` → Redirige vers `/app` puis `/dashboard`
   - [ ] Visiter `/dashboard` → Affiche le dashboard
   - [ ] Se déconnecter → Redirige vers `/`

3. **Flux de connexion :**
   - [ ] Connexion depuis `/sign-in` → Redirige vers `/app`
   - [ ] Connexion depuis `/sign-in?callbackUrl=/wallet` → Redirige vers `/wallet`
   - [ ] Inscription depuis `/sign-up` → Redirige vers `/app`

4. **Gestion des erreurs :**
   - [ ] Session expirée → Affiche message d'erreur
   - [ ] Erreur d'authentification → Affiche message approprié
   - [ ] CallbackUrl préservé dans les redirections

---

## 📊 Conformité avec les specs

### Feature 2.1 - Redirections

| Règle | Spec | Implémenté | Fichier |
|-------|------|------------|---------|
| `/` non connecté → reste sur `/` | ✅ | ✅ | `middleware.ts` |
| `/` connecté → `/app` | ✅ | ✅ | `middleware.ts` |
| `/sign-in` → `/app` après connexion | ✅ | ✅ | `signin-form.tsx` |
| `/sign-up` → `/app` après inscription | ✅ | ✅ | `signup-form.tsx` |
| Routes protégées → `/sign-in` si non auth | ✅ | ✅ | `middleware.ts` |
| Gestion session expirée | ✅ | ✅ | `middleware.ts`, `page.tsx` |

### Feature 2.1 - Navigation

| Règle | Spec | Implémenté | Fichier |
|-------|------|------------|---------|
| Vérifier redirections fonctionnent | ✅ | ✅ | Script de test |
| Gérer cas d'erreur | ✅ | ✅ | `middleware.ts`, `page.tsx` |

---

## 🔒 Principes SOLID appliqués

### Single Responsibility (SRP)

- **Middleware** : Gestion des redirections uniquement
- **SignInForm** : Formulaire de connexion uniquement
- **Page SignIn** : Affichage de la page avec erreurs

### Open/Closed (OCP)

- **Messages d'erreur** : Extensibles via dictionnaire
- **Routes protégées** : Facile d'ajouter de nouvelles routes

### Dependency Inversion (DIP)

- **auth** : Injecté via module
- **authClient** : Abstraction de l'authentification

---

## 🚀 Déploiement

### Variables d'environnement requises

Aucune nouvelle variable nécessaire. Le système utilise :
- Configuration existante de BetterAuth
- Configuration MongoDB existante

### Build

```bash
npm run build
```

### Démarrage

```bash
npm run dev
```

---

## 📝 Changelog

### Version 1.0.0 - Implémentation initiale

**Ajouts :**
- ✅ Middleware de gestion des redirections
- ✅ Page `/app` alias vers `/dashboard`
- ✅ Gestion des erreurs dans `/sign-in`
- ✅ Support du `callbackUrl` dans les formulaires
- ✅ Script de test automatisé

**Modifications :**
- ✅ `signin-form.tsx` : Ajout du `callbackUrl`
- ✅ `signup-form.tsx` : Ajout du `callbackUrl`
- ✅ `sign-in/page.tsx` : Ajout de la gestion des erreurs

**Fichiers créés :**
- `src/middleware.ts`
- `src/app/app/page.tsx`
- `test-redirections-feature.sh`
- `docs/REDIRECTIONS_IMPLEMENTATION.md`

---

## 🛠️ Maintenance

### Ajouter une nouvelle route protégée

1. Modifier `src/middleware.ts`
2. Ajouter la route dans `isProtectedRoute`
3. Tester avec le script

### Ajouter un nouveau message d'erreur

1. Modifier `src/app/sign-in/page.tsx`
2. Ajouter l'entrée dans `errorMessages`
3. Utiliser dans la redirection du middleware

### Débugger les redirections

1. Vérifier les logs du middleware
2. Utiliser les DevTools Network pour voir les redirections
3. Tester avec le script automatisé

---

## ✅ Checklist de vérification

- [x] Middleware créé et configuré
- [x] Redirection intelligente sur `/` implémentée
- [x] Redirections post-connexion fonctionnelles
- [x] Protection des routes en place
- [x] Gestion des erreurs implémentée
- [x] Page `/app` créée
- [x] Formulaires mis à jour
- [x] Script de test créé
- [x] Documentation complète
- [x] Conformité avec les specs

---

## 📚 Ressources

- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [Better Auth Documentation](https://better-auth.com)
- [Spécifications Feature 2.1](../specs/...)

---

**Date de création :** 31 octobre 2025  
**Auteur :** Copilot + Jules Ruberti  
**Version :** 1.0.0
