# 🛍️ Shop System - Quick Start Guide

## Installation & Setup

### 1. Peupler la boutique avec des items

```bash
# Exécuter le script de seed
npm run seed:shop
```

Cela créera 12 items dans la collection MongoDB `ShopItem`:
- 4 chapeaux (Common → Legendary)
- 4 lunettes (Common → Legendary)  
- 4 chaussures (Common → Legendary)

### 2. Vérifier dans MongoDB

```bash
# Se connecter à MongoDB
mongosh

# Lister les items
db.shopitems.find().pretty()
```

## Utilisation des Use Cases

### Exemple 1: Récupérer tous les items de la boutique

```typescript
import { MongoShopRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { GetShopItemsUseCase } from '@/application/use-cases/shop'

const shopRepo = new MongoShopRepository()
const getShopItems = new GetShopItemsUseCase(shopRepo)

// Tous les items disponibles
const allItems = await getShopItems.execute({ availableOnly: true })

// Filtrer par catégorie
const hats = await getShopItems.execute({ category: 'hat' })

// Filtrer par rareté
const legendaryItems = await getShopItems.execute({ rarity: 'legendary' })
```

### Exemple 2: Acheter un item

```typescript
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { MongoWalletRepository } from '@/infrastructure/repositories/MongoWalletRepository'
import { PurchaseItemUseCase } from '@/application/use-cases/shop'

const shopRepo = new MongoShopRepository()
const inventoryRepo = new MongoInventoryRepository()
const walletRepo = new MongoWalletRepository()

const purchaseUseCase = new PurchaseItemUseCase(
  shopRepo,
  inventoryRepo,
  walletRepo
)

const result = await purchaseUseCase.execute({
  userId: 'user_123',
  itemId: 'item_abc'
})

if (result.success) {
  console.log('✅ Achat réussi!')
  console.log('ID inventaire:', result.inventoryItemId)
  console.log('Solde restant:', result.remainingBalance, 'TC')
} else {
  console.error('❌ Erreur:', result.error)
  // Exemples d'erreurs:
  // - "Insufficient funds. Required: 250 TC, Available: 100 TC"
  // - "You already own Chapeau de Magicien"
  // - "Item Casquette Premium is not available for purchase"
}
```

### Exemple 3: Consulter son inventaire

```typescript
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { GetPlayerInventoryUseCase } from '@/application/use-cases/shop'

const shopRepo = new MongoShopRepository()
const inventoryRepo = new MongoInventoryRepository()

const getInventory = new GetPlayerInventoryUseCase(inventoryRepo, shopRepo)

// Inventaire complet
const allItems = await getInventory.execute('user_123')

// Items équipés uniquement
const equipped = await getInventory.getEquippedItems('user_123')

// Items d'une catégorie
const myHats = await getInventory.getItemsByCategory('user_123', 'hat')
```

### Exemple 4: Équiper un item

```typescript
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { EquipItemUseCase } from '@/application/use-cases/shop'

const shopRepo = new MongoShopRepository()
const inventoryRepo = new MongoInventoryRepository()

const equipUseCase = new EquipItemUseCase(inventoryRepo, shopRepo)

const result = await equipUseCase.execute({
  userId: 'user_123',
  inventoryItemId: 'inv_abc'
})

if (result.success) {
  console.log('✅ Item équipé!')
  // Note: Les autres items de la même catégorie sont automatiquement déséquipés
}
```

## Routes API disponibles

### GET /api/shop/items

Récupérer les items de la boutique

**Query params:**
- `category` (optional): `hat` | `glasses` | `shoes`
- `rarity` (optional): `common` | `rare` | `epic` | `legendary`
- `availableOnly` (optional): `true` | `false`

**Exemples:**
```bash
# Tous les items
curl http://localhost:3000/api/shop/items

# Uniquement les chapeaux
curl http://localhost:3000/api/shop/items?category=hat

# Items légendaires
curl http://localhost:3000/api/shop/items?rarity=legendary

# Chapeaux rares disponibles
curl http://localhost:3000/api/shop/items?category=hat&rarity=rare&availableOnly=true
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "item_123",
      "name": "Casquette Basique",
      "description": "Une simple casquette pour protéger du soleil",
      "category": "hat",
      "rarity": "common",
      "price": 50,
      "imageUrl": "/items/hats/basic-cap.png",
      "isAvailable": true
    }
  ],
  "count": 1
}
```

### POST /api/shop/purchase

Acheter un item (nécessite authentification)

**Body:**
```json
{
  "itemId": "item_123"
}
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "inventoryItemId": "inv_xyz",
    "remainingBalance": 450
  },
  "message": "Item purchased successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Insufficient funds. Required: 250 TC, Available: 100 TC"
}
```

## Règles métier importantes

### Prix des items

Le prix est calculé automatiquement selon:
```
Prix = Prix de base (catégorie) × Multiplicateur (rareté)
```

| Catégorie  | Prix de base |
|------------|--------------|
| Chapeau    | 50 TC        |
| Lunettes   | 75 TC        |
| Chaussures | 100 TC       |

| Rareté    | Multiplicateur |
|-----------|----------------|
| Common    | x1             |
| Rare      | x2.5           |
| Epic      | x5             |
| Legendary | x10            |

**Exemples:**
- Chapeau Common = 50 × 1 = **50 TC**
- Lunettes Rare = 75 × 2.5 = **187 TC**
- Chaussures Legendary = 100 × 10 = **1000 TC**

### Limites d'inventaire

- Maximum **150 items** au total
- Maximum **50 items** par catégorie
- **Pas de doublons** (un item ne peut être acheté qu'une fois)

### Équipement

- **Un seul item par catégorie** peut être équipé en même temps
- Équiper un nouveau chapeau déséquipe automatiquement l'ancien
- Les items équipés sont visibles sur le Tamagotchi (à implémenter dans l'UI)

## Tests manuels

### 1. Créer un wallet de test

```typescript
const walletRepo = new MongoWalletRepository()
const wallet = await walletRepo.create('test_user_123')
// Wallet créé avec 100 TC de bonus
```

### 2. Acheter un item commun (50 TC)

```typescript
const result = await purchaseUseCase.execute({
  userId: 'test_user_123',
  itemId: 'id_casquette_basique'
})
// Success: remainingBalance = 50 TC
```

### 3. Essayer d'acheter un item trop cher

```typescript
const result = await purchaseUseCase.execute({
  userId: 'test_user_123',
  itemId: 'id_chaussures_legendary' // 1000 TC
})
// Error: Insufficient funds
```

### 4. Essayer d'acheter le même item deux fois

```typescript
const result = await purchaseUseCase.execute({
  userId: 'test_user_123',
  itemId: 'id_casquette_basique' // Déjà acheté
})
// Error: You already own Casquette Basique
```

## Gestion des erreurs

Toutes les erreurs métier sont typées:

```typescript
import {
  ItemNotFoundError,
  ItemNotAvailableError,
  InsufficientFundsError,
  ItemAlreadyOwnedError,
  WalletNotFoundError
} from '@/application/use-cases/shop'

try {
  await purchaseUseCase.execute(...)
} catch (error) {
  if (error instanceof InsufficientFundsError) {
    // Afficher un message pour recharger le wallet
  } else if (error instanceof ItemAlreadyOwnedError) {
    // Rediriger vers l'inventaire
  }
  // etc.
}
```

## Prochaines étapes UI

1. **Page Boutique** (`/shop`)
   - Grille de cards avec les items
   - Filtres par catégorie et rareté
   - Bouton "Acheter" avec confirmation
   - Affichage du solde actuel

2. **Page Inventaire** (`/inventory`)
   - Liste des items possédés
   - Toggle équiper/déséquiper
   - Badge "Équipé" sur les items actifs

3. **Intégration Tamagotchi**
   - Afficher les items équipés sur le personnage
   - Animations d'équipement
   - Preview avant achat

## Support & Questions

Pour toute question sur l'implémentation:
1. Consulter `docs/SHOP_SYSTEM.md` (documentation complète)
2. Consulter `docs/SHOP_IMPLEMENTATION_SUMMARY.md` (résumé)
3. Voir les exemples dans les use cases

---

**Happy Shopping! 🛍️✨**
