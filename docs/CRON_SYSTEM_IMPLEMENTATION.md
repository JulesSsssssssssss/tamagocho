# 🔄 Système Cron - Mise à jour automatique des monstres

## 📋 Résumé de l'implémentation

J'ai copié EXACTEMENT le système cron du repository de référence (https://github.com/RiusmaX/tamagotcho.git) dans votre projet.

## 📁 Fichiers créés

### 1. Route API Next.js
**Fichier:** `src/app/api/cron/update-monsters/route.ts`
- Route GET/POST pour mettre à jour les états des monstres
- Support de l'authentification via token (optionnel)
- Logging détaillé avec timestamps
- Mise à jour aléatoire des états: `sad`, `angry`, `hungry`, `sleepy`
- Filtrage par `userId` via query params
- Durée maximale d'exécution: 60 secondes

### 2. Documentation
**Fichier:** `src/app/api/cron/update-monsters/README.md`
- Guide complet d'utilisation
- Exemples d'intégration
- Configuration des variables d'environnement
- Documentation des réponses API
- Guide de dépannage

### 3. Hook React
**Fichier:** `src/hooks/use-auto-update-monsters.ts`
- Hook personnalisé pour déclencher les mises à jour
- Intervalle aléatoire configurable (min/max)
- Gestion des états (isUpdating, lastUpdate, updateCount)
- Logging conditionnel (verbose)
- Auto-cleanup au démontage
- Support du déclenchement manuel

### 4. Composant Auto-Updater
**Fichier:** `src/components/monsters/auto-updater.tsx`
- Composant client invisible (ou avec indicateur optionnel)
- Utilise le hook `useAutoUpdateMonsters`
- Hydratation SSR safe
- Indicateur visuel optionnel
- Export ajouté dans `src/components/monsters/index.ts`

## 🔧 Configuration requise

### Variables d'environnement (optionnelles)

```env
# .env.local (pour dev)
CRON_SECRET_TOKEN=votre_secret_token_ici
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_secret_token_ici
```

Si ces variables ne sont pas définies, l'endpoint sera accessible sans authentification.

## 🚀 Utilisation

### Option 1: Intégration automatique (Recommandé)

Ajoutez dans votre layout principal (ex: `src/app/layout.tsx`) :

```tsx
import { MonstersAutoUpdater } from '@/components/monsters'

export default function RootLayout({ children }) {
  // Récupérer l'userId depuis votre session/auth
  const userId = "..." // À adapter selon votre système d'auth

  return (
    <html>
      <body>
        <MonstersAutoUpdater 
          userId={userId}
          minInterval={60000}   // 1 minute minimum
          maxInterval={180000}  // 3 minutes maximum
          enabled={true}
          verbose={true}
          showIndicator={false} // Mettre à true pour voir l'indicateur
        />
        {children}
      </body>
    </html>
  )
}
```

### Option 2: Appel manuel

```bash
# Test simple
curl http://localhost:3000/api/cron/update-monsters

# Avec userId spécifique
curl "http://localhost:3000/api/cron/update-monsters?userId=67216de70b94e56b0fdc5f6f"

# Avec authentification
curl -H "Authorization: Bearer votre_token" \
  "http://localhost:3000/api/cron/update-monsters?userId=67216de70b94e56b0fdc5f6f"
```

### Option 3: Utilisation du hook dans un composant

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function MonsterManager() {
  const { trigger, isUpdating, lastUpdate, nextUpdateIn } = useAutoUpdateMonsters({
    userId: 'your-user-id',
    minInterval: 60000,
    maxInterval: 180000,
    enabled: true,
    verbose: true
  })

  return (
    <div>
      <button onClick={trigger} disabled={isUpdating}>
        {isUpdating ? 'Mise à jour...' : 'Mettre à jour'}
      </button>
      {lastUpdate && (
        <p>{lastUpdate.success ? '✅ Succès' : '❌ Erreur'}</p>
      )}
    </div>
  )
}
```

## 📊 Réponse API

### Succès (200)
```json
{
  "success": true,
  "updated": 3,
  "timestamp": "2025-10-29T15:30:00.000Z",
  "duration": 234,
  "details": [
    {
      "id": "67216de70b94e56b0fdc5f6f",
      "oldState": "hungry",
      "newState": "sleepy"
    }
  ]
}
```

### Aucun monstre (200)
```json
{
  "success": true,
  "updated": 0,
  "message": "Aucun monstre trouvé pour l'utilisateur 67216de70b94e56b0fdc5f6f",
  "timestamp": "2025-10-29T15:30:00.000Z",
  "duration": 123
}
```

### Erreur d'authentification (401)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

## 🔍 Différences avec votre ancien système

### Ancien système (serveur Express séparé)
- ❌ Serveur Express standalone dans `src/app/api/cron/`
- ❌ Fichiers: `server.js`, `db.js`, `index.js`, `package.json`
- ❌ Nécessite un processus Node.js séparé
- ❌ Plus complexe à déployer (besoin d'un service externe)
- ❌ Décroissance automatique des stats (hunger, energy, happiness)

### Nouveau système (Route API Next.js)
- ✅ Route API Next.js native
- ✅ Fichier unique: `route.ts`
- ✅ Intégré dans l'application Next.js
- ✅ Déploiement simplifié (Vercel/Netlify compatible)
- ✅ Changement d'état aléatoire uniquement
- ✅ Hook React pour auto-update depuis le frontend
- ✅ Composant UI pour affichage optionnel

## 🎯 Comportement

### États des monstres
Les monstres changent aléatoirement parmi ces états :
- `sad` (triste)
- `angry` (en colère)
- `hungry` (affamé)
- `sleepy` (endormi)

### Fréquence de mise à jour
- **Par défaut**: Intervalle aléatoire entre 1 et 3 minutes
- **Configurable**: via `minInterval` et `maxInterval`
- **Mode**: Client-side (déclenché par le frontend)

### Champs MongoDB mis à jour
```javascript
{
  state: newState,           // Nouvel état aléatoire
  updatedAt: new Date(),     // Date de dernière modification
  lastCronUpdate: new Date() // Date de dernière mise à jour cron
}
```

## 📝 Logs

Le système produit des logs détaillés :

```
[2025-10-29T15:30:00.000Z] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres pour l'utilisateur 67216de70b94e56b0fdc5f6f...
[2025-10-29T15:30:00.100Z] [CRON-UPDATE-MONSTERS] [INFO] 🔌 Connexion à MongoDB...
[2025-10-29T15:30:00.200Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T15:30:00.300Z] [CRON-UPDATE-MONSTERS] [INFO] 📊 3 monstre(s) trouvé(s)
[2025-10-29T15:30:00.350Z] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 67216de70b94e56b0fdc5f6f → hungry => sleepy
[2025-10-29T15:30:00.450Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Mise à jour terminée: 3 monstre(s) en 234ms
```

## 🔧 Maintenance de l'ancien système

Votre ancien système (serveur Express) est toujours présent dans :
- `src/app/api/cron/server.js`
- `src/app/api/cron/db.js`
- `src/app/api/cron/index.js`
- `src/app/api/cron/package.json`

Vous pouvez le **supprimer** si vous n'en avez plus besoin, ou le garder pour référence.

## ✅ Checklist d'intégration

- [x] Route API créée: `/api/cron/update-monsters`
- [x] Hook React créé: `use-auto-update-monsters`
- [x] Composant créé: `MonstersAutoUpdater`
- [x] Documentation complète dans README.md
- [ ] Ajouter `MonstersAutoUpdater` dans votre layout
- [ ] Configurer les variables d'environnement (optionnel)
- [ ] Tester l'endpoint manuellement
- [ ] Vérifier les logs dans la console
- [ ] Supprimer l'ancien système si non utilisé

## 🚦 Prochaines étapes

1. **Intégration dans le layout**
   - Ouvrez `src/app/layout.tsx`
   - Ajoutez le composant `MonstersAutoUpdater`
   - Récupérez l'`userId` depuis votre système d'auth

2. **Test manuel**
   ```bash
   # Démarrer le serveur
   npm run dev
   
   # Tester l'endpoint
   curl "http://localhost:3000/api/cron/update-monsters?userId=VOTRE_USER_ID"
   ```

3. **Vérification des logs**
   - Ouvrez la console du navigateur
   - Vérifiez les logs `[AUTO-UPDATE]`
   - Vérifiez les logs serveur `[CRON-UPDATE-MONSTERS]`

4. **Nettoyage (optionnel)**
   ```bash
   # Supprimer l'ancien système cron
   rm -rf src/app/api/cron/{server.js,db.js,index.js,package.json,yarn.lock,.gitignore,cron.log}
   ```

## 🎨 Personnalisation

### Changer les intervalles
```tsx
<MonstersAutoUpdater 
  minInterval={30000}   // 30 secondes
  maxInterval={120000}  // 2 minutes
/>
```

### Afficher l'indicateur visuel
```tsx
<MonstersAutoUpdater 
  showIndicator={true}  // Affiche un badge en bas à droite
/>
```

### Désactiver les logs
```tsx
<MonstersAutoUpdater 
  verbose={false}  // Pas de logs
/>
```

## 🛡️ Sécurité

Pour protéger l'endpoint en production :

1. Définir `CRON_SECRET_TOKEN` dans les variables Vercel
2. Définir `NEXT_PUBLIC_CRON_SECRET_TOKEN` (même valeur)
3. L'endpoint vérifiera automatiquement le token

Sans ces variables, l'endpoint est ouvert (OK pour dev).

## 📚 Documentation complète

Consultez `src/app/api/cron/update-monsters/README.md` pour plus de détails.
