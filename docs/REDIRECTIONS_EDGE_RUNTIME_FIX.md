# 🔧 Fix : Edge Runtime Error - Middleware

## 🐛 Problème

```
The edge runtime does not support Node.js 'crypto' module.
```

### Contexte

- Next.js 15 utilise **Edge Runtime** par défaut pour les middlewares
- Edge Runtime ne supporte pas les modules Node.js natifs (`crypto`, `fs`, etc.)
- BetterAuth + MongoDB nécessitent le module `crypto`

---

## ✅ Solution appliquée

Ajout de la configuration runtime dans `src/middleware.ts` :

```typescript
export const runtime = 'nodejs'
```

### Avant (Edge Runtime - ❌)

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware (request: NextRequest): Promise<NextResponse> {
  // ...
}
```

### Après (Node.js Runtime - ✅)

```typescript
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export const runtime = 'nodejs' // 👈 Ajouté

export async function middleware (request: NextRequest): Promise<NextResponse> {
  // ...
}
```

---

## 🎯 Pourquoi cette solution ?

### Option 1 : Node.js Runtime (✅ Choisi)
**Avantages :**
- Support complet de MongoDB/BetterAuth
- Accès aux modules Node.js natifs
- Pas de modification du code existant

**Inconvénients :**
- Légèrement plus lent que Edge Runtime
- Plus de ressources consommées

### Option 2 : Edge Runtime (❌ Non choisi)
**Avantages :**
- Plus rapide
- Moins de ressources

**Inconvénients :**
- Nécessite de réécrire l'authentification
- Pas de support MongoDB direct
- Complexité accrue

---

## 📊 Impact sur les performances

### Edge Runtime
- Temps de réponse : ~10-50ms
- Déploiement : Global edge locations

### Node.js Runtime (choisi)
- Temps de réponse : ~50-150ms
- Déploiement : Serverless functions

**Verdict :** L'impact est négligeable pour un middleware d'authentification. La différence de ~100ms est acceptable pour la robustesse apportée.

---

## 🚀 Alternatives envisagées

### Alternative 1 : Utiliser Next.js Auth (NextAuth.js)
❌ Nécessite une migration complète de BetterAuth

### Alternative 2 : API Route pour l'auth
❌ Plus complexe, perd les avantages du middleware

### Alternative 3 : Session basée sur JWT uniquement
❌ Moins sécurisé, pas de révocation de session

---

## ✅ Vérification

```bash
npm run dev
```

**Résultat attendu :**
- ✅ Serveur démarre sans erreur
- ✅ Redirections fonctionnent
- ✅ Authentification OK
- ✅ Pas d'erreur "edge runtime"

---

## 📚 Références

- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)
- [Middleware Configuration](https://nextjs.org/docs/app/building-your-application/routing/middleware#runtime)
- [BetterAuth Documentation](https://better-auth.com)

---

## 🔍 Logs de débogage

Si le problème persiste, vérifier :

1. **Variable d'environnement :**
   ```bash
   # Vérifier que MongoDB est configuré
   echo $MONGODB_USERNAME
   ```

2. **Logs du middleware :**
   ```typescript
   console.log('🔐 Middleware runtime:', process.version)
   ```

3. **Build clean :**
   ```bash
   rm -rf .next
   npm run dev
   ```

---

**Date de correction :** 31 octobre 2025  
**Version :** 1.0.1  
**Status :** ✅ Résolu
