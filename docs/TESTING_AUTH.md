# 🔧 Guide de Test - Connexion/Inscription

## 🎯 Corrections Appliquées

### 1. Gestion des erreurs améliorée
- ✅ Logs détaillés avec emojis (🔄, ✅, ❌)
- ✅ Extraction du contexte complet d'erreur
- ✅ Messages spécifiques par code HTTP:
  - 401: Email ou mot de passe incorrect
  - 409: Email déjà utilisé
  - 400: Données invalides
  - 500: Erreur serveur

### 2. Connexion MongoDB pour BetterAuth
- ✅ Appel explicite à `connectToDatabase()` avant init
- ✅ Auto-connexion après inscription (`autoSignIn: true`)
- ✅ Utilisation de `crypto.randomUUID()` pour les IDs

## 📋 Tests à Effectuer

### Test 1: Inscription d'un nouvel utilisateur

1. **Ouvrez** http://localhost:3000/sign-in
2. **Cliquez** sur "🆕 Créer un compte"
3. **Remplissez** le formulaire:
   ```
   Nom: Test User
   Email: test@example.com
   Mot de passe: Test123456!
   ```
4. **Cliquez** sur "S'inscrire"

**Console navigateur (F12) - Logs attendus:**
```
🔄 Tentative d'inscription... { ... }
✅ Inscription réussie: { ... }
```

**Console serveur - Logs attendus:**
```
✅ Connected to MongoDB database: tamagocho
POST /api/auth/sign-up/email 200
```

**Vérification MongoDB:**
```bash
node scripts/diagnose-mongodb.js
```

Devrait afficher:
```
✅ user: 1 document(s)  # <-- CHANGÉ de 0 à 1 ✅
✅ session: 1 document(s)
✅ account: 1 document(s)
```

### Test 2: Connexion avec l'utilisateur créé

1. **Restez** sur http://localhost:3000/sign-in
2. **Remplissez**:
   ```
   Email: test@example.com
   Mot de passe: Test123456!
   ```
3. **Cliquez** sur "Se connecter"

**Console navigateur - Logs attendus:**
```
🔄 Tentative de connexion... { ... }
✅ Connexion réussie: { ... }
```

**Redirection attendue:**
- Vers `/dashboard` ✅

### Test 3: Connexion avec mauvais mot de passe

1. **Essayez** avec un mauvais mot de passe
2. **Logs attendus:**
   ```
   ❌ Erreur de connexion: { ... }
   📝 Message d'erreur affiché: Email ou mot de passe incorrect
   ```

## 🐛 Si l'erreur "{}" persiste

### Vérifier les logs détaillés

Dans la console navigateur, vous devriez voir:
```javascript
❌ Erreur de connexion: {
  error: { ... },  // <-- Objet d'erreur complet
  fullContext: { ... }  // <-- Contexte complet
}
```

### Vérifier la connexion MongoDB

**Dans le terminal serveur**, au démarrage:
```
✅ Connected to MongoDB database: tamagocho
```

Si vous voyez:
```
❌ Error connecting to the database: ...
```

→ Problème de connexion MongoDB, vérifiez `.env.local`

### Activer les logs BetterAuth

Temporairement, ajoutez dans `src/lib/auth.ts`:
```typescript
export const auth = betterAuth({
  // ... config existante
  logger: {
    disabled: false,
    level: 'debug'
  }
})
```

## 🔍 Diagnostic Avancé

### Vérifier que BetterAuth utilise MongoDB

Ajoutez temporairement dans `src/app/api/auth/[...all]/route.ts`:
```typescript
import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Log de debug
console.log('🔐 BetterAuth route initialisée')
console.log('📊 Database adapter:', auth.options.database)

export const { POST, GET } = toNextJsHandler(auth)
```

### Vérifier la création de session

Après inscription réussie, vérifiez:
```bash
node scripts/diagnose-mongodb.js
```

**Collections à vérifier:**
- `user`: Devrait contenir votre utilisateur
- `session`: Devrait contenir une session active
- `account`: Devrait contenir les credentials

### Tester avec curl (si nécessaire)

```bash
# Test inscription
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl-test@example.com",
    "password": "CurlTest123!",
    "name": "Curl Test"
  }' \
  -v

# Test connexion
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl-test@example.com",
    "password": "CurlTest123!"
  }' \
  -v
```

## 📊 Checklist Complète

- [ ] Serveur Next.js démarré (`npm run dev`)
- [ ] Console navigateur ouverte (F12)
- [ ] Variables `.env.local` correctes
- [ ] MongoDB accessible
- [ ] Inscription testée
- [ ] Script diagnostic exécuté après inscription
- [ ] Collection `user` contient au moins 1 document
- [ ] Connexion testée
- [ ] Redirection vers dashboard fonctionne

## 🎯 Résultat Attendu

**Après inscription:**
```
✅ Utilisateur créé dans MongoDB
✅ Session créée automatiquement (autoSignIn)
✅ Redirection vers /dashboard
✅ Dashboard affiche l'email de l'utilisateur
```

**Erreurs possibles résolues:**
- ❌ `Sign in error: {}` → ✅ Message d'erreur détaillé
- ❌ Pas d'utilisateur dans MongoDB → ✅ Utilisateur créé
- ❌ Pas de logs → ✅ Logs avec emojis
