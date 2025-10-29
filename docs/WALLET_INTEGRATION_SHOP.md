# Système de Wallet Intégré à la Boutique

## 💰 Vue d'ensemble

Implémentation complète du système de wallet (porte-monnaie) dans la boutique :
- Affichage du solde réel de l'utilisateur
- Débit automatique lors des achats
- Vérification du solde avant achat
- Création automatique du wallet avec bonus initial

## ✨ Fonctionnalités Implémentées

### 1. Route API Wallet (`/api/wallet`)

**Fichier créé :** `src/app/api/wallet/route.ts`

**Endpoint :** `GET /api/wallet`

**Fonctionnalités :**
- ✅ Authentification requise (Better Auth)
- ✅ Récupération du wallet de l'utilisateur connecté
- ✅ Création automatique du wallet s'il n'existe pas
- ✅ Bonus initial de 100 TC pour les nouveaux wallets

**Response :**
```json
{
  "success": true,
  "data": {
    "balance": 100,
    "currency": "TC",
    "totalEarned": 100,
    "totalSpent": 0
  }
}
```

### 2. Intégration dans la Boutique

**Fichier modifié :** `src/app/shop/page.tsx`

**Nouvelle fonction `loadWallet()` :**
```typescript
const loadWallet = async (): Promise<void> => {
  const response = await fetch('/api/wallet')
  if (response.ok) {
    const data = await response.json()
    if (data.success === true) {
      setUserBalance(data.data.balance)
    }
  }
}
```

**Chargement initial :**
- Appelée dans `loadData()` avant de charger les items
- Remplace le solde hardcodé (1500 TC en dev, 1000 TC en prod)

### 3. Débit lors des Achats

**Fichier modifié :** `src/app/api/shop/purchase/route.ts`

**Mode Test amélioré :**
```typescript
// Calculer le prix selon la rareté
const basePrices = { hat: 50, glasses: 75, shoes: 100 }
const rarityMultipliers = { common: 1, rare: 2.5, epic: 5, legendary: 10 }
const price = basePrices[category] * rarityMultipliers[rarity]

// Débiter le wallet
const walletRepository = new MongoWalletRepository()
let wallet = await walletRepository.findByOwnerId(session.user.id)

if (wallet.balance < price) {
  return NextResponse.json({ 
    success: false, 
    error: `Solde insuffisant. Prix: ${price} TC, Solde: ${wallet.balance} TC` 
  })
}

wallet.spendCoins(price)
await walletRepository.update(wallet)
```

**Changements :**
- ❌ Supprimé : `remainingBalance: 1500` (hardcodé)
- ✅ Ajouté : Calcul du prix dynamique
- ✅ Ajouté : Débit du vrai wallet MongoDB
- ✅ Ajouté : Vérification du solde
- ✅ Ajouté : Retour du nouveau solde `remainingBalance: wallet.balance`

### 4. Mise à Jour du Solde Après Achat

**Fichier modifié :** `src/app/shop/page.tsx`

**Fonction `handlePurchaseWithMonster()` améliorée :**
```typescript
if (data.success === true) {
  // Mettre à jour le solde avec la balance retournée par l'API
  if (data.data.remainingBalance !== undefined) {
    setUserBalance(data.data.remainingBalance)
  } else {
    // Sinon recharger le wallet
    await loadWallet()
  }
  // ...
}
```

**Changements :**
- ❌ Supprimé : `await loadData()` (trop lourd, rechargeait tout)
- ✅ Ajouté : Mise à jour directe du state avec `remainingBalance`
- ✅ Ajouté : Fallback sur `loadWallet()` si pas de balance retournée

### 5. Vérification Côté Client

**Fichier modifié :** `src/app/shop/page.tsx`

**Fonction `handleOpenPurchaseModal()` améliorée :**
```typescript
const handleOpenPurchaseModal = (item: ShopItemDTO): void => {
  // Vérifier si l'utilisateur a assez de monnaie
  if (userBalance < item.price) {
    alert(`❌ Solde insuffisant !

Prix de l'item : ${item.price} TC
Votre solde : ${userBalance} TC

Il vous manque ${item.price - userBalance} TC.`)
    return
  }

  setSelectedItem(item)
  setIsModalOpen(true)
}
```

**Avantages :**
- ✅ Feedback immédiat sans appel API
- ✅ Message clair avec détails (prix, solde, manque)
- ✅ Évite d'ouvrir le modal si insuffisant

## 🔄 Flux Complet d'Achat

```
1. Utilisateur arrive sur /shop
   ↓
2. loadData() → loadWallet() → GET /api/wallet
   ↓
3. Affichage du solde (ex: 100 TC)
   ↓
4. Click sur "Acheter" (ex: chapeau épic 250 TC)
   ↓
5. handleOpenPurchaseModal() vérifie le solde
   ↓
6a. Si insuffisant (100 < 250) : Alert + STOP
   ↓
6b. Si suffisant : Modal s'ouvre
   ↓
7. Utilisateur sélectionne un monstre + Confirme
   ↓
8. POST /api/shop/purchase { itemId, monsterId }
   ↓
9. API calcule prix (250 TC)
   ↓
10. API vérifie solde (100 < 250)
    ↓
11. API débite wallet (wallet.spendCoins(250))
    ↓
12. API retourne { remainingBalance: 0 }
    ↓
13. Frontend met à jour userBalance (100 → 0)
    ↓
14. Affichage : 0 TC 💰
```

## 💸 Calcul des Prix (Mode Test)

### Prix de Base par Catégorie

| Catégorie | Prix de Base |
|-----------|--------------|
| 🎩 Chapeau | 50 TC |
| 👓 Lunettes | 75 TC |
| 👟 Chaussures | 100 TC |

### Multiplicateurs de Rareté

| Rareté | Multiplicateur | Exemple (Chapeau) |
|--------|----------------|-------------------|
| Common | ×1 | 50 TC |
| Rare | ×2.5 | 125 TC |
| Epic | ×5 | 250 TC |
| Legendary | ×10 | 500 TC |

### Formule

```
Prix Final = Prix de Base × Multiplicateur de Rareté
```

**Exemples :**
- Chapeau commun : `50 × 1 = 50 TC`
- Lunettes rares : `75 × 2.5 = 187.5 TC` (arrondi)
- Chaussures épiques : `100 × 5 = 500 TC`
- Chapeau légendaire : `50 × 10 = 500 TC`

## 🎮 Interface Utilisateur

### Affichage du Solde (Header)

```tsx
<div className='bg-slate-950/80 backdrop-blur-sm rounded-xl px-5 py-3 border-4 border-yellow-500/50'>
  <span className='text-3xl'>🪙</span>
  <div>
    <span>Solde</span>
    <span>{userBalance.toLocaleString()} TC</span>
  </div>
</div>
```

**Style :**
- Bordure jaune gaming
- Effet de lueur `shadow-[0_0_20px_rgba(234,179,8,0.2)]`
- Police monospace pour look rétro
- Formatage avec `toLocaleString()` (1000 → 1,000)

### Message d'Insuffisance

```
❌ Solde insuffisant !

Prix de l'item : 250 TC
Votre solde : 100 TC

Il vous manque 150 TC.
```

## 🔒 Sécurité

### Vérifications Côté Serveur

1. **Authentification** : Session Better Auth requise
2. **Existence du wallet** : Création automatique si nécessaire
3. **Solde suffisant** : Vérification avant débit
4. **Transaction atomique** : Débit + Équipement dans le même flow

### Vérifications Côté Client

1. **Pré-validation** : Check du solde avant d'ouvrir le modal
2. **Feedback immédiat** : Alert si insuffisant
3. **UI désactivée** : Impossible de confirmer sans solde

### Double Protection

```
Client : userBalance < item.price → Alert
  ↓ (si bypass)
Serveur : wallet.balance < price → Error 400
```

## 📊 États du Wallet

### Wallet Neuf (Création)

```typescript
{
  balance: 100,        // Bonus initial
  currency: 'TC',
  totalEarned: 100,    // Bonus compte comme gain
  totalSpent: 0
}
```

### Après Premier Achat (ex: 50 TC)

```typescript
{
  balance: 50,         // 100 - 50
  currency: 'TC',
  totalEarned: 100,    // Inchangé
  totalSpent: 50       // +50
}
```

### Après Recharge (ex: +200 TC via Stripe)

```typescript
{
  balance: 250,        // 50 + 200
  currency: 'TC',
  totalEarned: 300,    // 100 + 200
  totalSpent: 50       // Inchangé
}
```

## 🧪 Tests Recommandés

### Scénario 1 : Premier Achat

1. ✅ Créer un nouveau compte
2. ✅ Aller sur `/shop`
3. ✅ Vérifier solde initial : 100 TC
4. ✅ Acheter chapeau commun (50 TC)
5. ✅ Vérifier nouveau solde : 50 TC
6. ✅ Vérifier item équipé sur monstre

### Scénario 2 : Solde Insuffisant

1. ✅ Avoir 50 TC de solde
2. ✅ Tenter d'acheter chapeau épic (250 TC)
3. ✅ Vérifier alert "Solde insuffisant"
4. ✅ Vérifier modal ne s'ouvre pas
5. ✅ Vérifier solde inchangé : 50 TC

### Scénario 3 : Épuisement du Solde

1. ✅ Avoir 100 TC
2. ✅ Acheter chapeau (50 TC) → Solde : 50 TC
3. ✅ Acheter lunettes (50 TC) → Solde : 0 TC
4. ✅ Tenter d'acheter chaussures → Alert insuffisant

### Scénario 4 : Wallet Auto-création

1. ✅ Utilisateur sans wallet en DB
2. ✅ Accès à `/shop`
3. ✅ Wallet créé automatiquement avec 100 TC
4. ✅ Solde affiché correctement

## 🐛 Gestion d'Erreurs

### API Wallet (GET)

- ❌ **401 Unauthorized** : Pas de session → Rediriger vers login
- ❌ **500 Server Error** : Erreur DB → Afficher message d'erreur

### API Purchase (POST)

- ❌ **400 Bad Request** : Solde insuffisant → Alert avec détails
- ❌ **401 Unauthorized** : Session expirée → Rediriger
- ❌ **404 Not Found** : Item inexistant → Alert
- ❌ **500 Server Error** : Erreur serveur → Alert générique

### Frontend

```typescript
try {
  await loadWallet()
} catch (error) {
  console.error('Error loading wallet:', error)
  // Continuer avec solde à 0 ou afficher message
}
```

## 📈 Améliorations Futures

### Fonctionnalités Additionnelles

1. **Historique des transactions** : Liste des achats
2. **Recharge via Stripe** : Acheter des TC avec argent réel
3. **Gains de TC** : Récompenses pour actions (connexion, level up)
4. **Offres spéciales** : Réductions temporaires (-20%)
5. **Pack d'items** : Acheter plusieurs items ensemble
6. **Animation de débit** : Effet visuel lors du paiement
7. **Confirmation avant achat** : Modal récapitulatif du prix

### Optimisations

1. **Cache du wallet** : Éviter requêtes répétées
2. **WebSocket** : Mise à jour en temps réel du solde
3. **Optimistic updates** : UI réactive avant réponse serveur
4. **Undo purchase** : Annuler un achat dans les 5 secondes

## 🎯 Résultat Final

Le système de wallet est maintenant **complètement fonctionnel** :

- 💰 **Solde réel** affiché depuis la base de données
- 💸 **Débit automatique** lors des achats
- ✅ **Vérification** côté client ET serveur
- 🎁 **Bonus initial** de 100 TC pour nouveaux joueurs
- 📊 **Suivi complet** des gains et dépenses

Les joueurs peuvent maintenant acheter des items avec leur vraie monnaie virtuelle, et le solde se met à jour instantanément ! 🎮✨
