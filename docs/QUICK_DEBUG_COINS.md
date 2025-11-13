# 🔧 Debug rapide : Coins ne s'ajoutent pas

## ✅ Code vérifié - Tout semble OK !

Votre code de webhook et de checkout est correct. Le problème vient probablement d'un détail de configuration.

## 🎯 Actions à faire MAINTENANT

### 1️⃣ Vérifier les logs Stripe Dashboard (PRIORITÉ 1)

1. **Aller sur** : https://dashboard.stripe.com/test/webhooks
2. **Cliquer sur votre webhook** (celui pointant vers Vercel)
3. **Regarder "Recent deliveries"**

**Ce que vous devez voir** :
```
✅ 200 OK - checkout.session.completed
```

**Si vous voyez** :
- ❌ **400** → Problème de signature (mauvais STRIPE_WEBHOOK_SECRET)
- ❌ **500** → Erreur dans le code du webhook
- ❌ **Rien** → Le webhook n'est pas appelé

### 2️⃣ Cliquer sur l'événement et voir les détails

Dans "Recent deliveries", cliquez sur le dernier événement.

**Section "Request body"** - Vérifiez que `metadata` contient :
```json
{
  "metadata": {
    "userId": "cm3pxxx...",
    "koinsAmount": "10"
  }
}
```

**Section "Response"** - Doit montrer :
```
Status: 200 OK
Body: ok
```

### 3️⃣ Test direct dans MongoDB

Vérifiez que votre joueur existe et a bien des coins :

**Option A : Via MongoDB Compass**
1. Ouvrir MongoDB Compass
2. Se connecter à votre base
3. Collection `players`
4. Chercher votre document avec votre `userId`
5. Vérifier le champ `coins`

**Option B : Via mongosh**
```bash
mongosh "VOTRE_MONGODB_URI"

# Remplacez USER_ID par votre vrai ID
db.players.findOne({ userId: "cm3pxxx..." })
```

**Résultat attendu** :
```json
{
  "_id": ObjectId("..."),
  "userId": "cm3pxxx...",
  "coins": 110,  // ← Devrait avoir augmenté
  "totalMonstersCreated": 1
}
```

### 4️⃣ Si les coins sont dans MongoDB mais pas affichés

**Problème de cache Next.js !**

**Solution rapide** : Ajoutez ces lignes dans votre page wallet :

```typescript
// src/app/wallet/page.tsx (en haut du fichier)
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

Ou forcez un rechargement :

```typescript
// Dans le composant
import { useRouter } from 'next/navigation'

export default function WalletPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Rafraîchir toutes les 3 secondes
    const interval = setInterval(() => {
      router.refresh()
    }, 3000)
    
    return () => clearInterval(interval)
  }, [])
  
  // ... reste du code
}
```

### 5️⃣ Test avec un paiement test

**Faire un nouvel achat avec ces étapes** :

1. **Avant l'achat** : Notez vos coins actuels (ex: 100 TC)

2. **Faire l'achat** :
   - Carte de test : `4242 4242 4242 4242`
   - Date : `12/34`
   - CVC : `123`

3. **Immédiatement après**, ouvrez 3 onglets :
   
   **Onglet 1 : Stripe Dashboard**
   - https://dashboard.stripe.com/test/webhooks
   - Vérifier que l'événement est bien reçu (200 OK)
   
   **Onglet 2 : MongoDB**
   - Rafraîchir et vérifier le champ `coins`
   
   **Onglet 3 : Votre app**
   - Rafraîchir la page (F5)
   - Vérifier l'affichage

4. **Notez les résultats** :
   - [ ] Stripe montre 200 OK
   - [ ] MongoDB montre les nouveaux coins
   - [ ] L'interface affiche les nouveaux coins

## 🐛 Problèmes fréquents

### Problème 1 : Metadata vides

**Symptôme** : Dans Stripe Dashboard, `metadata` est `{}`

**Cause** : `session.user.id` est undefined

**Debug** : Ajoutez ces logs dans `checkout/sessions/route.ts` :

```typescript
console.log('🔍 Session user:', session.user)
console.log('🔍 User ID:', session.user.id)
```

**Solution** : Vérifiez que Better Auth retourne bien un `user.id`

### Problème 2 : Prix ne correspond pas

**Symptôme** : "No matching package found for amount"

**Debug** : Vérifiez dans Stripe Dashboard → Products que les prix sont :
- 0.50 EUR (pour 10 coins)
- 1.00 EUR (pour 50 coins)
- etc.

**Important** : Le prix doit être EXACTEMENT le même (0.5 ≠ 0.50 en comparaison)

### Problème 3 : Player non trouvé

**Symptôme** : "Player found: No" dans les logs

**Cause** : Le `userId` ne correspond à aucun joueur

**Solution** : Le webhook crée automatiquement le joueur, mais vérifiez que `session.user.id` est cohérent partout.

### Problème 4 : Coins s'ajoutent dans MongoDB mais pas dans l'UI

**Symptôme** : MongoDB montre 110 coins, mais l'interface affiche 100

**Cause** : Cache Next.js

**Solution** :
```typescript
// src/app/wallet/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0
```

## 🚨 Test d'urgence

Si rien ne fonctionne, testez manuellement l'ajout de coins :

```typescript
// Créez ce fichier temporaire : src/app/api/test-add-coins/route.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Player from '@/db/models/player.model'
import { connectMongooseToDatabase } from '@/db'

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  
  if (!session) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }
  
  await connectMongooseToDatabase()
  
  const player = await Player.findOne({ userId: session.user.id })
  
  if (!player) {
    return Response.json({ error: 'Player not found' }, { status: 404 })
  }
  
  player.coins = (player.coins ?? 0) + 10
  await player.save()
  
  return Response.json({ 
    success: true, 
    newBalance: player.coins 
  })
}
```

Puis testez en appelant :
```bash
curl -X POST https://votre-app.vercel.app/api/test-add-coins
```

Si ça fonctionne → Le problème est dans le webhook  
Si ça ne fonctionne pas → Le problème est dans le modèle Player ou MongoDB

## 📞 Que m'envoyer pour vous aider

1. **Screenshot de Stripe Dashboard** :
   - Webhooks → Recent deliveries → Dernier événement
   
2. **Screenshot de MongoDB** :
   - Document `players` avec votre userId
   
3. **Réponse à ces questions** :
   - [ ] Les metadata contiennent-elles bien `userId` et `koinsAmount` ?
   - [ ] Le webhook retourne-t-il 200 OK ?
   - [ ] MongoDB montre-t-il les nouveaux coins ?
   - [ ] L'interface affiche-t-elle les nouveaux coins après F5 ?

---

**Suivez ces étapes et dites-moi où vous bloquez !** 🎯
