# 🛍️ Système de Boutique - Documentation

## Vue d'ensemble

Le système de boutique permet aux joueurs d'acheter des items cosmétiques (chapeaux, lunettes, chaussures) avec les coins (TC) accumulés dans leur wallet.

## Architecture Clean Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (Components React - À venir)                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│                      (Use Cases)                         │
│  • PurchaseItemUseCase                                   │
│  • GetShopItemsUseCase                                   │
│  • GetPlayerInventoryUseCase                             │
│  • EquipItemUseCase / UnequipItemUseCase                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      Domain Layer                        │
│                     (Business Logic)                     │
│  Entities:                                               │
│  • ShopItem (validation, pricing)                        │
│  • InventoryItem (equip/unequip)                         │
│  • Inventory (aggregate)                                 │
│  Repositories Interfaces:                                │
│  • IShopRepository                                       │
│  • IInventoryRepository                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Infrastructure Layer                    │
│                  (Technical Details)                     │
│  • MongoShopRepository                                   │
│  • MongoInventoryRepository                              │
└─────────────────────────────────────────────────────────┘
```

## 📦 Structure des fichiers

```
src/
├── shared/types/
│   └── shop.ts                    # Types, enums, constantes
├── domain/
│   ├── entities/
│   │   ├── ShopItem.ts            # Entité item de boutique
│   │   └── InventoryItem.ts       # Entité item d'inventaire + Inventory
│   └── repositories/
│       └── IShopRepository.ts     # Interfaces repositories
├── application/use-cases/shop/
│   ├── PurchaseItem.ts            # Achat d'item
│   ├── GetShopItems.ts            # Liste des items boutique
│   ├── GetPlayerInventory.ts     # Inventaire du joueur
│   ├── EquipItem.ts               # Équiper/déséquiper
│   └── index.ts                   # Barrel export
└── infrastructure/repositories/
    └── MongoShopRepository.ts     # Implémentation MongoDB

scripts/
└── seed-shop-items.ts             # Script de peuplement
```

## 🎯 Fonctionnalités

### 1. Catégories d'items

- **Hat** (Chapeau) - Prix de base: 50 TC
- **Glasses** (Lunettes) - Prix de base: 75 TC
- **Shoes** (Chaussures) - Prix de base: 100 TC

### 2. Système de rareté

| Rareté    | Multiplicateur | Couleur  |
|-----------|----------------|----------|
| Common    | x1             | Gris     |
| Rare      | x2.5           | Bleu     |
| Epic      | x5             | Violet   |
| Legendary | x10            | Orange   |

**Calcul du prix**: `Prix = Prix de base × Multiplicateur de rareté`

Exemple: 
- Chapeau Common = 50 TC
- Chapeau Rare = 125 TC
- Chapeau Epic = 250 TC
- Chapeau Legendary = 500 TC

### 3. Règles métier

#### ShopItem (Entité Domain)
- ✅ Nom: 3-50 caractères
- ✅ Prix: 1-999,999 TC (entier)
- ✅ Description obligatoire
- ✅ État disponible/indisponible
- ✅ Calcul automatique du prix selon catégorie/rareté

#### InventoryItem (Entité Domain)
- ✅ Lien vers le ShopItem
- ✅ Date d'achat
- ✅ État équipé/non équipé
- ✅ Un seul item par catégorie peut être équipé

#### Inventory (Agrégat)
- ✅ Max 150 items total par joueur
- ✅ Max 50 items par catégorie
- ✅ Pas de doublons (un item ne peut être acheté qu'une fois)

## 🔄 Use Cases

### 1. PurchaseItemUseCase

**Input:**
```typescript
{
  userId: string
  itemId: string
}
```

**Flow:**
1. Récupérer l'item de la boutique
2. Vérifier disponibilité
3. Vérifier non-possession
4. Récupérer le wallet
5. Vérifier le solde
6. Débiter le wallet
7. Ajouter à l'inventaire

**Erreurs possibles:**
- `ItemNotFoundError` - Item inexistant
- `ItemNotAvailableError` - Item indisponible
- `ItemAlreadyOwnedError` - Déjà possédé
- `WalletNotFoundError` - Wallet inexistant
- `InsufficientFundsError` - Solde insuffisant

### 2. GetShopItemsUseCase

**Filtres:**
```typescript
{
  category?: 'hat' | 'glasses' | 'shoes'
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  availableOnly?: boolean
}
```

**Output:** Liste de `ShopItemDTO`

### 3. GetPlayerInventoryUseCase

**Input:** `userId: string`

**Output:** Liste de `InventoryItemDTO` (enrichie avec données boutique)

### 4. EquipItemUseCase

**Input:**
```typescript
{
  userId: string
  inventoryItemId: string
}
```

**Flow:**
1. Récupérer l'item d'inventaire
2. Récupérer la catégorie depuis la boutique
3. Déséquiper les autres items de la même catégorie
4. Équiper l'item sélectionné

## 🗄️ Modèles MongoDB

### Collection: ShopItem

```javascript
{
  _id: ObjectId,
  name: String,           // 3-50 caractères
  description: String,    // Requis
  category: String,       // 'hat' | 'glasses' | 'shoes'
  rarity: String,         // 'common' | 'rare' | 'epic' | 'legendary'
  price: Number,          // Entier, 1-999,999
  imageUrl: String,       // Optionnel
  isAvailable: Boolean,   // Default: true
  createdAt: Date
}
```

### Collection: InventoryItem

```javascript
{
  _id: ObjectId,
  itemId: String,         // Référence ShopItem._id
  ownerId: String,        // ID utilisateur
  purchasedAt: Date,
  isEquipped: Boolean     // Default: false
}

// Index
{ ownerId: 1 }
{ itemId: 1, ownerId: 1 }
```

## 🚀 Utilisation

### Peupler la boutique

```bash
npm run seed:shop
# ou
node scripts/seed-shop-items.ts
```

### Exemple d'utilisation des Use Cases

```typescript
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'
import { MongoWalletRepository } from '@/infrastructure/repositories/MongoWalletRepository'
import { PurchaseItemUseCase, GetShopItemsUseCase } from '@/application/use-cases/shop'

// Initialiser les repositories
const shopRepo = new MongoShopRepository()
const inventoryRepo = new MongoInventoryRepository()
const walletRepo = new MongoWalletRepository()

// Use case: Voir les items disponibles
const getShopItems = new GetShopItemsUseCase(shopRepo)
const items = await getShopItems.execute({ availableOnly: true })

// Use case: Acheter un item
const purchaseItem = new PurchaseItemUseCase(shopRepo, inventoryRepo, walletRepo)
const result = await purchaseItem.execute({
  userId: 'user123',
  itemId: 'item_abc'
})

if (result.success) {
  console.log('Achat réussi!')
  console.log('Nouveau solde:', result.remainingBalance)
} else {
  console.error('Erreur:', result.error)
}
```

## 🎨 Prochaines étapes (UI à implémenter)

1. **Page Boutique** (`/shop`)
   - Grille d'items avec filtres (catégorie, rareté)
   - Affichage du prix et de la rareté
   - Bouton d'achat avec confirmation
   - Message d'erreur si solde insuffisant

2. **Page Inventaire** (`/inventory`)
   - Liste des items possédés
   - Toggle équiper/déséquiper
   - Indicateur visuel des items équipés
   - Filtres par catégorie

3. **Composants UI**
   - `<ShopItemCard />` - Carte d'item boutique
   - `<InventoryItemCard />` - Carte d'item inventaire
   - `<ItemCategoryFilter />` - Filtre par catégorie
   - `<RarityBadge />` - Badge de rareté

4. **Intégration Tamagotchi**
   - Afficher les items équipés sur le Tamagotchi
   - Animations lors de l'équipement
   - Preview avant achat

## ✅ Principes SOLID appliqués

- **S (SRP)**: Chaque classe a une seule responsabilité
  - `ShopItem`: Logique métier des items
  - `PurchaseItemUseCase`: Orchestration de l'achat
  - `MongoShopRepository`: Persistence MongoDB

- **O (OCP)**: Extensible sans modification
  - Ajout de nouvelles catégories via types union
  - Nouveaux use cases sans modifier les existants

- **L (LSP)**: Substitution respectée
  - Toutes les implémentations respectent les interfaces

- **I (ISP)**: Interfaces ségrégées
  - `IShopRepository` et `IInventoryRepository` séparés
  - Chaque interface focalisée sur une responsabilité

- **D (DIP)**: Dépendance aux abstractions
  - Use cases dépendent des interfaces
  - Infrastructure implémente les interfaces du Domain

## 🧪 Tests à implémenter

- [ ] Tests unitaires des entités (ShopItem, InventoryItem)
- [ ] Tests des use cases avec mocks
- [ ] Tests d'intégration avec MongoDB
- [ ] Tests E2E du flow d'achat complet
