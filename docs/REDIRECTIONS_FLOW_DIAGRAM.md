# 🔀 Diagramme de Flux - Système de Redirections

## Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                     SYSTÈME DE REDIRECTIONS                      │
│                          Tamagotcho                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Flux 1 : Utilisateur NON CONNECTÉ visite `/`

```
┌──────────────┐
│ Utilisateur  │
│ visite  /    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  vérifie session │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Session = null   │
│ Route = /        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  RESTE SUR /     │
│ (landing page)   │
└──────────────────┘
```

---

## 🎯 Flux 2 : Utilisateur CONNECTÉ visite `/`

```
┌──────────────┐
│ Utilisateur  │
│ visite  /    │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  vérifie session │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Session OK ✅    │
│ Route = /        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ vers /app        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Page /app        │
│ redirige vers    │
│ /dashboard       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Affichage du    │
│    Dashboard     │
└──────────────────┘
```

---

## 🎯 Flux 3 : Utilisateur NON CONNECTÉ visite `/dashboard`

```
┌──────────────┐
│ Utilisateur  │
│ visite       │
│ /dashboard   │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  vérifie session │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Session = null   │
│ Route protégée   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ vers /sign-in    │
│ ?callbackUrl=    │
│  /dashboard      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Formulaire de   │
│   connexion      │
└──────────────────┘
```

---

## 🎯 Flux 4 : Connexion réussie avec callbackUrl

```
┌──────────────┐
│ Utilisateur  │
│ visite       │
│ /sign-in?    │
│ callbackUrl= │
│  /wallet     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│  Formulaire      │
│  affiche         │
│  callbackUrl     │
│  récupéré        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Utilisateur      │
│ remplit le form  │
│ et soumet        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ authClient       │
│ .signIn.email()  │
│ callbackURL:     │
│  /wallet         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Connexion OK ✅  │
│ Session créée    │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ automatique vers │
│ /wallet          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Affichage de    │
│    /wallet       │
└──────────────────┘
```

---

## 🎯 Flux 5 : Utilisateur CONNECTÉ visite `/sign-in`

```
┌──────────────┐
│ Utilisateur  │
│ connecté     │
│ visite       │
│ /sign-in     │
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  vérifie session │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Session OK ✅    │
│ Route = /sign-in │
│ isAuthPage = ✅  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ vers /app        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Page /app        │
│ redirige vers    │
│ /dashboard       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Affichage du    │
│    Dashboard     │
└──────────────────┘
```

---

## 🎯 Flux 6 : Session expirée sur route protégée

```
┌──────────────┐
│ Utilisateur  │
│ avec session │
│ expirée      │
│ visite /wallet│
└──────┬───────┘
       │
       ▼
┌──────────────────┐
│   Middleware     │
│  vérifie session │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ ERREUR ❌        │
│ Session expired  │
│ ou invalide      │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Catch dans       │
│ middleware       │
│ try/catch        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ vers /sign-in    │
│ ?error=          │
│  session_expired │
│ &callbackUrl=    │
│  /wallet         │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Formulaire de   │
│   connexion      │
│  + Bannière      │
│  d'erreur rouge  │
│  "Session        │
│   expirée"       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Utilisateur se   │
│ reconnecte       │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ REDIRECTION      │
│ vers /wallet     │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│  Affichage de    │
│    /wallet       │
└──────────────────┘
```

---

## 🔄 Matrice de décision du Middleware

```
┌─────────────────────────────────────────────────────────────────┐
│                    MIDDLEWARE DECISION TREE                      │
└─────────────────────────────────────────────────────────────────┘

Route visitée : ___________
Session : [✅ Connecté] [❌ Non connecté]

┌──────────────────┬─────────────────┬─────────────────────────┐
│      Route       │   Non connecté  │       Connecté          │
├──────────────────┼─────────────────┼─────────────────────────┤
│        /         │  ✅ Reste       │  → /app → /dashboard    │
├──────────────────┼─────────────────┼─────────────────────────┤
│    /sign-in      │  ✅ Affiche     │  → /app → /dashboard    │
├──────────────────┼─────────────────┼─────────────────────────┤
│    /sign-up      │  ✅ Affiche     │  → /app → /dashboard    │
├──────────────────┼─────────────────┼─────────────────────────┤
│      /app        │  → /sign-in     │  ✅ → /dashboard        │
├──────────────────┼─────────────────┼─────────────────────────┤
│   /dashboard     │  → /sign-in     │  ✅ Affiche             │
│                  │  ?callbackUrl=  │                         │
│                  │   /dashboard    │                         │
├──────────────────┼─────────────────┼─────────────────────────┤
│    /wallet       │  → /sign-in     │  ✅ Affiche             │
│                  │  ?callbackUrl=  │                         │
│                  │    /wallet      │                         │
├──────────────────┼─────────────────┼─────────────────────────┤
│     /shop        │  → /sign-in     │  ✅ Affiche             │
│                  │  ?callbackUrl=  │                         │
│                  │     /shop       │                         │
├──────────────────┼─────────────────┼─────────────────────────┤
│  /creature/:id   │  → /sign-in     │  ✅ Affiche             │
│                  │  ?callbackUrl=  │                         │
│                  │  /creature/:id  │                         │
└──────────────────┴─────────────────┴─────────────────────────┘
```

---

## 🎨 Légende

```
┌─────────────────────────────────────────┐
│              SYMBOLES                   │
├─────────────────────────────────────────┤
│  ✅  = Action autorisée                 │
│  ❌  = Accès refusé                     │
│  →   = Redirection                      │
│  ▼   = Flux descendant                  │
│  │   = Continuation                     │
└─────────────────────────────────────────┘
```

---

## 📦 Composants impliqués

```
┌────────────────────────────────────────────────────────────────┐
│                      STACK TECHNIQUE                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  1. Middleware (src/middleware.ts)                             │
│     • Détection session                                        │
│     • Règles de redirection                                    │
│     • Gestion erreurs                                          │
│                                                                │
│  2. Pages                                                      │
│     • src/app/page.tsx (landing)                               │
│     • src/app/app/page.tsx (alias)                             │
│     • src/app/sign-in/page.tsx (auth)                          │
│     • src/app/dashboard/page.tsx (protected)                   │
│                                                                │
│  3. Formulaires                                                │
│     • src/components/forms/signin-form.tsx                     │
│     • src/components/forms/signup-form.tsx                     │
│                                                                │
│  4. Auth                                                       │
│     • src/lib/auth.ts (BetterAuth)                             │
│     • src/lib/auth-client.ts (Client)                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Points clés

### 1. Middleware = Point central

Toutes les requêtes passent par le middleware.
C'est le **seul** endroit qui gère les redirections automatiques.

### 2. CallbackUrl = Navigation intelligente

Le paramètre `callbackUrl` permet de revenir où l'utilisateur voulait aller.

### 3. Alias /app

`/app` est un alias vers `/dashboard` pour respecter les specs.

### 4. Gestion d'erreurs robuste

Try/catch dans le middleware pour gérer les sessions expirées/corrompues.

---

**Date :** 31 octobre 2025  
**Version :** 1.0.0
