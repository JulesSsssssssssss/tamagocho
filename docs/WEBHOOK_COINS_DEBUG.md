# 🔍 Diagnostic : Coins ne s'ajoutent pas après paiement Stripe

## Symptôme
✅ Le paiement Stripe fonctionne (checkout.session.completed reçu)  
❌ Les coins ne s'ajoutent pas au wallet du joueur

## 🧪 Checklist de diagnostic

### 1️⃣ Vérifier que le webhook est bien reçu

**Sur Stripe Dashboard** :
- Aller sur **Developers** → **Webhooks**
- Cliquer sur votre webhook
- Vérifier les **Recent deliveries**
- Le statut doit être **200 OK** ✅

**Si 400/500** : Le webhook ne s'exécute pas correctement

### 2️⃣ Vérifier les logs Vercel

**Option A : Via le Dashboard**
1. Aller sur https://vercel.com/dashboard
2. Sélectionner votre projet
3. **Deployments** → Cliquer sur le dernier déploiement
4. Onglet **Functions**
5. Chercher `/api/webhook/stripe`
6. Cliquer pour voir les logs

**Option B : Via CLI**
```bash
# Installer Vercel CLI si pas déjà fait
npm i -g vercel

# Se connecter
vercel login

# Voir les logs en temps réel
vercel logs --follow
```

**Chercher dans les logs** :
```
✅ Checkout session completed
🔍 Looking for userId: ...
🔍 Player found: Yes (coins: ...)
💰 Adding X Koins to user ...
✅ Wallet updated successfully. New balance: ...
```

### 3️⃣ Problèmes possibles

#### ❌ Problème 1 : userId non présent dans metadata

**Symptôme dans les logs** :
```
⚠️ No userId found in metadata
```

**Cause** : Les metadata ne sont pas transmises lors de la création de la session Stripe

**Solution** : Vérifier la création de la session checkout

Fichier à vérifier : `src/app/api/checkout/route.ts` ou équivalent

```typescript
// AVANT (❌ MAUVAIS)
const session = await stripe.checkout.sessions.create({
  line_items: [...],
  mode: 'payment',
  success_url: '...',
  cancel_url: '...',
  // metadata manquantes !
})

// APRÈS (✅ BON)
const session = await stripe.checkout.sessions.create({
  line_items: [...],
  mode: 'payment',
  success_url: '...',
  cancel_url: '...',
  metadata: {
    userId: session.user.id, // ID de l'utilisateur connecté
    koinsAmount: '10' // Montant de coins acheté
  }
})
```

#### ❌ Problème 2 : Package pricing non trouvé

**Symptôme dans les logs** :
```
⚠️ No matching package found for amount: 0.5
Available packages: [...]
```

**Cause** : Le prix payé ne correspond à aucun package dans `pricingTable`

**Solution** : Vérifier que les prix dans Stripe correspondent exactement

```typescript
// pricing.ts
export const pricingTable: Record<number, PricingPackage> = {
  10: { productId: '...', price: 0.5 },  // ← Ce prix doit EXACTEMENT correspondre
  50: { productId: '...', price: 1 },
  // ...
}
```

**Vérifier sur Stripe** :
- Dashboard → **Products** → Vérifier les prix
- Les prix doivent être **exactement** 0.50 EUR, 1.00 EUR, etc.

#### ❌ Problème 3 : Player non sauvegardé

**Symptôme dans les logs** :
```
✅ Wallet updated successfully. New balance: 110
```
Mais le wallet ne change pas dans l'interface

**Cause** : Problème de sauvegarde MongoDB ou cache côté client

**Solution A** : Vérifier que MongoDB reçoit bien la mise à jour

```bash
# Connexion à MongoDB
mongosh "VOTRE_MONGODB_URI"

# Vérifier les players
db.players.find({ userId: "VOTRE_USER_ID" })

# Vous devriez voir le nouveau montant de coins
```

**Solution B** : Forcer le rafraîchissement côté client

Dans votre composant Wallet, ajoutez un rafraîchissement :

```typescript
// src/components/wallet/wallet-display.tsx
useEffect(() => {
  const interval = setInterval(() => {
    // Recharger les données du wallet
    router.refresh()
  }, 2000) // Toutes les 2 secondes

  return () => clearInterval(interval)
}, [])
```

#### ❌ Problème 4 : Webhook appelé mais Player.coins n'augmente pas

**Cause possible** : Le champ `coins` n'est pas bien sauvegardé

**Solution** : Vérifier le modèle Player

```typescript
// src/db/models/player.model.ts
const playerSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  coins: { type: Number, default: 0 }, // ← Assurez-vous que c'est bien Number
  totalMonstersCreated: { type: Number, default: 0 }
})
```

**Et dans le webhook, forcer le type** :

```typescript
// AVANT (peut causer des bugs)
player.coins = currentCoins + koinsToAdd

// APRÈS (force le type Number)
player.coins = Number(currentCoins) + Number(koinsToAdd)
await player.save()
```

### 4️⃣ Test manuel dans MongoDB

Si rien ne fonctionne, testez manuellement :

```bash
# Connexion à MongoDB
mongosh "VOTRE_MONGODB_URI"

# Mise à jour manuelle
db.players.updateOne(
  { userId: "VOTRE_USER_ID" },
  { $inc: { coins: 10 } }
)

# Vérifier
db.players.findOne({ userId: "VOTRE_USER_ID" })
```

Si ça fonctionne manuellement → Le problème est dans le webhook  
Si ça ne fonctionne pas → Le problème est dans le modèle ou la connexion MongoDB

## 🛠️ Solution rapide : Ajouter des logs exhaustifs

Ajoutez ces logs dans votre webhook pour diagnostiquer :

```typescript
// src/app/api/webhook/stripe/route.ts
case 'checkout.session.completed': {
  console.log('========================================')
  console.log('✅ CHECKPOINT 1: Event received')
  
  const userId = event?.data?.object?.metadata?.userId
  console.log('✅ CHECKPOINT 2: userId =', userId)
  
  if (!userId) {
    console.error('❌ STOP: No userId in metadata')
    console.error('Full metadata:', event?.data?.object?.metadata)
    break
  }
  
  await connectMongooseToDatabase()
  console.log('✅ CHECKPOINT 3: MongoDB connected')
  
  let player = await Player.findOne({ userId })
  console.log('✅ CHECKPOINT 4: Player =', player ? 'FOUND' : 'NOT FOUND')
  
  if (!player) {
    player = await Player.create({ userId, coins: 0, totalMonstersCreated: 0 })
    console.log('✅ CHECKPOINT 5: Player created')
  }
  
  const amountPaid = (event?.data?.object?.amount_total ?? 0) / 100
  console.log('✅ CHECKPOINT 6: Amount paid =', amountPaid)
  
  const entry = Object.entries(pricingTable).find(([_, pkg]) => pkg.price === amountPaid)
  console.log('✅ CHECKPOINT 7: Package found =', entry ? 'YES' : 'NO')
  
  if (!entry) {
    console.error('❌ STOP: No package matching price', amountPaid)
    console.error('Available:', Object.entries(pricingTable).map(([k, v]) => `${k} coins = ${v.price} EUR`))
    break
  }
  
  const koinsToAdd = Number(entry[0])
  const currentCoins = Number(player.coins ?? 0)
  console.log('✅ CHECKPOINT 8: Current coins =', currentCoins)
  console.log('✅ CHECKPOINT 9: Adding =', koinsToAdd)
  
  player.coins = currentCoins + koinsToAdd
  console.log('✅ CHECKPOINT 10: New coins =', player.coins)
  
  await player.save()
  console.log('✅ CHECKPOINT 11: Player saved to DB')
  
  // Vérification post-save
  const savedPlayer = await Player.findOne({ userId })
  console.log('✅ CHECKPOINT 12: DB verification, coins =', savedPlayer?.coins)
  
  console.log('========================================')
  break
}
```

## 📋 Checklist de vérification

- [ ] Le webhook reçoit bien `checkout.session.completed` (Stripe Dashboard)
- [ ] Le webhook renvoie **200 OK** (pas 400/500)
- [ ] Les logs Vercel montrent "Checkout session completed"
- [ ] Les logs montrent "Looking for userId: ..." avec un ID valide
- [ ] Les logs montrent "Player found: Yes"
- [ ] Les logs montrent "Adding X Koins to user ..."
- [ ] Les logs montrent "Wallet updated successfully"
- [ ] MongoDB contient bien le nouveau montant de coins
- [ ] Le client rafraîchit correctement les données

## 🚀 Si tout est OK mais ça ne marche toujours pas

**Problème de cache Next.js** :

1. **Forcer le revalidate** dans la page wallet :

```typescript
// src/app/wallet/page.tsx
export const revalidate = 0 // Désactive le cache
export const dynamic = 'force-dynamic'
```

2. **Utiliser un state dynamique** :

```typescript
'use client'
import { useEffect, useState } from 'react'

export default function WalletPage() {
  const [coins, setCoins] = useState(0)
  
  useEffect(() => {
    async function fetchCoins() {
      const res = await fetch('/api/player/coins', { cache: 'no-store' })
      const data = await res.json()
      setCoins(data.coins)
    }
    
    fetchCoins()
    
    // Rafraîchir toutes les 5 secondes
    const interval = setInterval(fetchCoins, 5000)
    return () => clearInterval(interval)
  }, [])
  
  return <div>Coins: {coins}</div>
}
```

---

**Suivez cette checklist et envoyez-moi les logs Vercel pour que je puisse vous aider à identifier le problème exact !** 🔍
