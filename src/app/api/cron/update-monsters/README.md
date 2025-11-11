# API Cron - Mise à jour automatique des monstres

Cette API permet de mettre à jour automatiquement et aléatoirement les états des monstres dans la base de données.

## 📍 Endpoint

```
GET/POST /api/cron/update-monsters
```

## 🔒 Sécurité (Optionnelle)

Pour sécuriser l'endpoint, définissez la variable d'environnement :

```env
# .env.local (pour dev) ou Vercel Environment Variables (pour prod)
CRON_SECRET_TOKEN=votre_token_secret_ici

# Pour le frontend (si vous utilisez le composant auto-updater)
NEXT_PUBLIC_CRON_SECRET_TOKEN=votre_token_secret_ici
```

Si `CRON_SECRET_TOKEN` n'est pas défini, l'endpoint sera accessible sans authentification.

## 🚀 Utilisation

### 1. Intégration automatique dans Next.js (Recommandé)

Ajoutez le composant `MonstersAutoUpdater` dans votre layout principal :

```tsx
// src/app/layout.tsx
import { MonstersAutoUpdater } from '@/components/monsters/auto-updater'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Mise à jour automatique (intervalle aléatoire 1-3 min) */}
        <MonstersAutoUpdater 
          minInterval={60000}   // 1 minute minimum
          maxInterval={180000}  // 3 minutes maximum
          enabled={true}        // Activé
          verbose={true}        // Logs dans la console
          showIndicator={false} // Pas d'indicateur visuel
        />
        
        {children}
      </body>
    </html>
  )
}
```

### 2. Appel manuel via curl

```bash
# Sans authentification
curl http://localhost:3000/api/cron/update-monsters

# Avec authentification
curl -H "Authorization: Bearer votre_token_secret" \
  http://localhost:3000/api/cron/update-monsters
```

### 3. Test dans le navigateur

Ouvrez simplement : `http://localhost:3000/api/cron/update-monsters`

### 4. Utilisation du hook React

```tsx
'use client'

import { useAutoUpdateMonsters } from '@/hooks/use-auto-update-monsters'

export function MyComponent() {
  const { trigger, isUpdating, lastUpdate, nextUpdateIn } = useAutoUpdateMonsters({
    minInterval: 60000,   // 1 minute minimum
    maxInterval: 180000,  // 3 minutes maximum
    enabled: true,
  })

  return (
    <div>
      <button onClick={trigger} disabled={isUpdating}>
        {isUpdating ? 'Mise à jour...' : 'Mettre à jour maintenant'}
      </button>
      
      {lastUpdate && (
        <p>
          {lastUpdate.success 
            ? `✅ ${lastUpdate.updated} monstre(s) mis à jour` 
            : `❌ Erreur: ${lastUpdate.error}`
          }
        </p>
      )}
      
      {nextUpdateIn && (
        <p className="text-sm text-gray-500">
          Prochaine mise à jour dans {Math.round(nextUpdateIn / 1000)}s
        </p>
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
  "updated": 5,
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 234,
  "details": [
    {
      "id": "507f1f77bcf86cd799439011",
      "oldState": "hungry",
      "newState": "sleepy"
    }
  ]
}
```

### Erreur (401 - Non autorisé)

```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing token"
}
```

### Erreur (500 - Erreur serveur)

```json
{
  "success": false,
  "error": "Internal server error",
  "message": "Connection to database failed",
  "timestamp": "2025-10-29T12:34:56.789Z",
  "duration": 123
}
```

## 📝 Logs

Tous les logs sont préfixés avec `[CRON-UPDATE-MONSTERS]` pour un filtrage facile :

```
[2025-10-29T12:34:56.789Z] [CRON-UPDATE-MONSTERS] [INFO] 🚀 Démarrage de la mise à jour des monstres...
[2025-10-29T12:34:56.790Z] [CRON-UPDATE-MONSTERS] [INFO] 🔌 Connexion à MongoDB...
[2025-10-29T12:34:56.891Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Connecté à MongoDB
[2025-10-29T12:34:56.892Z] [CRON-UPDATE-MONSTERS] [INFO] 📊 5 monstre(s) trouvé(s)
[2025-10-29T12:34:56.893Z] [CRON-UPDATE-MONSTERS] [INFO] ✨ Monstre 507f... → hungry => sleepy
[2025-10-29T12:34:57.012Z] [CRON-UPDATE-MONSTERS] [INFO] ✅ Mise à jour terminée: 5 monstre(s) en 223ms
```

## 🎯 États possibles des monstres

Les états sont tirés aléatoirement parmi :
- `sad` (triste)
- `angry` (en colère)
- `hungry` (affamé)
- `sleepy` (endormi)

## ⚙️ Configuration

| Variable | Type | Description | Défaut |
|----------|------|-------------|--------|
| `minInterval` | number | Intervalle minimum entre mises à jour (ms) | 60000 (1 min) |
| `maxInterval` | number | Intervalle maximum entre mises à jour (ms) | 180000 (3 min) |
| `enabled` | boolean | Active/désactive les mises à jour auto | true |
| `verbose` | boolean | Active les logs détaillés | true |
| `showIndicator` | boolean | Affiche un indicateur visuel | false |

## 🔧 Dépannage

### Les mises à jour ne fonctionnent pas

1. Vérifiez les logs dans la console du navigateur
2. Vérifiez les logs Vercel (si déployé)
3. Testez l'endpoint manuellement : `/api/cron/update-monsters`
4. Vérifiez la connexion MongoDB

### Erreur 401 Unauthorized

Vérifiez que `NEXT_PUBLIC_CRON_SECRET_TOKEN` correspond à `CRON_SECRET_TOKEN`

### Les logs n'apparaissent pas

Assurez-vous que `verbose={true}` dans le composant `MonstersAutoUpdater`
