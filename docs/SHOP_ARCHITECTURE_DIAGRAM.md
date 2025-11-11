# 🏗️ Architecture du Système de Boutique

## Vue d'ensemble des couches

```
┌─────────────────────────────────────────────────────────────────┐
│                         PRESENTATION                             │
│                      (React Components)                          │
│                                                                   │
│  Pages:                    Components:                           │
│  • /shop/page.tsx         • <ShopItemCard />                    │
│  • /inventory/page.tsx    • <InventoryItemCard />               │
│                           • <RarityBadge />                      │
│  Hooks:                   • <CategoryFilter />                   │
│  • useShop()                                                     │
│  • useInventory()         Routes API:                            │
│  • useWallet()            • GET  /api/shop/items                │
│                           • POST /api/shop/purchase              │
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTP Requests
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         APPLICATION                              │
│                         (Use Cases)                              │
│                                                                   │
│  PurchaseItemUseCase          GetShopItemsUseCase               │
│  ┌──────────────────┐         ┌─────────────────┐               │
│  │ 1. Get item      │         │ 1. Get items    │               │
│  │ 2. Check stock   │         │ 2. Apply filter │               │
│  │ 3. Check wallet  │         │ 3. Return DTOs  │               │
│  │ 4. Deduct coins  │         └─────────────────┘               │
│  │ 5. Add to inv    │                                            │
│  └──────────────────┘         GetPlayerInventoryUseCase         │
│                                ┌─────────────────┐               │
│  EquipItemUseCase              │ 1. Get inv      │               │
│  ┌──────────────────┐         │ 2. Enrich data  │               │
│  │ 1. Get item      │         │ 3. Return DTOs  │               │
│  │ 2. Unequip same  │         └─────────────────┘               │
│  │ 3. Equip new     │                                            │
│  └──────────────────┘                                            │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Interfaces
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                            DOMAIN                                │
│                       (Business Logic)                           │
│                                                                   │
│  Entities:                    Value Objects:                     │
│  ┌──────────────┐            • ItemCategory                      │
│  │  ShopItem    │            • ItemRarity                        │
│  ├──────────────┤                                                │
│  │ - id         │            Business Rules:                     │
│  │ - name       │            • Price = Base × Multiplier         │
│  │ - category   │            • Name: 3-50 chars                  │
│  │ - rarity     │            • Max 150 items                     │
│  │ - price      │            • No duplicates                     │
│  ├──────────────┤            • 1 equipped/category               │
│  │ validate()   │                                                │
│  │ toObject()   │            Repository Interfaces:              │
│  └──────────────┘            • IShopRepository                   │
│                               • IInventoryRepository             │
│  ┌──────────────┐            • IWalletRepository                │
│  │ InventoryItem│                                                │
│  ├──────────────┤                                                │
│  │ - id         │                                                │
│  │ - itemId     │                                                │
│  │ - ownerId    │                                                │
│  │ - isEquipped │                                                │
│  ├──────────────┤                                                │
│  │ equip()      │                                                │
│  │ unequip()    │                                                │
│  └──────────────┘                                                │
│                                                                   │
│  ┌──────────────┐                                                │
│  │  Inventory   │                                                │
│  ├──────────────┤                                                │
│  │ - items      │                                                │
│  │ - ownerId    │                                                │
│  ├──────────────┤                                                │
│  │ addItem()    │                                                │
│  │ hasItem()    │                                                │
│  │ equipItem()  │                                                │
│  └──────────────┘                                                │
│                                                                   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Implements
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                       INFRASTRUCTURE                             │
│                     (Technical Details)                          │
│                                                                   │
│  MongoShopRepository          MongoInventoryRepository           │
│  ┌─────────────────────┐     ┌──────────────────────┐           │
│  │ findAllAvailable()  │     │ findByOwnerId()      │           │
│  │ findById()          │     │ addItem()            │           │
│  │ findByCategory()    │     │ updateItem()         │           │
│  │ findByRarity()      │     │ hasItem()            │           │
│  │ createItem()        │     │ findEquippedItems()  │           │
│  │ updateItem()        │     └──────────────────────┘           │
│  │ deleteItem()        │                                         │
│  └─────────────────────┘     MongoDB Models:                    │
│                                                                   │
│  Mongoose Schemas:            ┌──────────────────┐               │
│  ┌─────────────────────┐     │ InventoryItem    │               │
│  │ ShopItem            │     ├──────────────────┤               │
│  ├─────────────────────┤     │ _id: ObjectId    │               │
│  │ _id: ObjectId       │     │ itemId: String   │               │
│  │ name: String        │     │ ownerId: String  │               │
│  │ category: String    │     │ purchasedAt: Date│               │
│  │ rarity: String      │     │ isEquipped: Bool │               │
│  │ price: Number       │     └──────────────────┘               │
│  │ isAvailable: Bool   │                                         │
│  └─────────────────────┘     Indexes:                           │
│                               • { ownerId: 1 }                   │
│                               • { itemId: 1, ownerId: 1 }        │
└─────────────────────────────────────────────────────────────────┘
```

## Flux de données - Achat d'un item

```
┌─────────────┐
│   User      │
│ Clicks Buy  │
└──────┬──────┘
       │
       ↓
┌──────────────────────────┐
│  ShopItemCard Component  │
│  onPurchase(itemId)      │
└──────────────┬───────────┘
               │
               ↓
┌──────────────────────────┐
│      useShop() Hook      │
│  purchaseItem(itemId)    │
└──────────────┬───────────┘
               │ POST /api/shop/purchase
               ↓
┌──────────────────────────┐
│   API Route Handler      │
│  /api/shop/purchase      │
└──────────────┬───────────┘
               │
               ↓
┌──────────────────────────────────┐
│    PurchaseItemUseCase.execute   │
├──────────────────────────────────┤
│ 1. shopRepo.findItemById()       │
│    ↓ Returns ShopItem or null    │
│                                   │
│ 2. Check item.canBePurchased()   │
│    ↓ Throws if unavailable       │
│                                   │
│ 3. inventoryRepo.hasItem()       │
│    ↓ Throws if already owned     │
│                                   │
│ 4. walletRepo.findByOwnerId()    │
│    ↓ Returns Wallet or null      │
│                                   │
│ 5. wallet.spendCoins(price)      │
│    ↓ Throws if insufficient      │
│                                   │
│ 6. walletRepo.update(wallet)     │
│    ↓ Save to DB                  │
│                                   │
│ 7. InventoryItem.create()        │
│    ↓ New inventory item          │
│                                   │
│ 8. inventoryRepo.addItem()       │
│    ↓ Save to DB                  │
│                                   │
│ 9. Return success + data         │
└──────────────┬───────────────────┘
               │
               ↓
┌──────────────────────────┐
│    API Response          │
│ { success, data }        │
└──────────────┬───────────┘
               │
               ↓
┌──────────────────────────┐
│     useShop() Hook       │
│  - Update local state    │
│  - Show success toast    │
│  - Refetch wallet        │
│  - Refetch inventory     │
└──────────────┬───────────┘
               │
               ↓
┌──────────────────────────┐
│   UI Updates             │
│ - Disable bought item    │
│ - Show new balance       │
│ - Success notification   │
└──────────────────────────┘
```

## Dépendances entre modules

```
┌─────────────────────────────────────────────────────┐
│                   Dependencies Flow                  │
└─────────────────────────────────────────────────────┘

Presentation Layer
    ↓ depends on
Application Layer (Use Cases)
    ↓ depends on
Domain Layer (Entities + Interfaces)
    ↑ implemented by
Infrastructure Layer (Repositories)

RÈGLE: Les flèches pointent toujours vers le Domain
```

## Structure des fichiers

```
src/
├── shared/
│   └── types/
│       ├── shop.ts              # Types partagés
│       └── index.ts             # Barrel export
│
├── domain/
│   ├── entities/
│   │   ├── ShopItem.ts          # Entité item boutique
│   │   ├── InventoryItem.ts     # Entité item inventaire
│   │   └── index.ts             # Barrel export
│   │
│   └── repositories/
│       ├── IShopRepository.ts   # Interface shop + inventory
│       └── IWalletRepository.ts # Interface wallet
│
├── application/
│   └── use-cases/
│       └── shop/
│           ├── PurchaseItem.ts          # Use case achat
│           ├── GetShopItems.ts          # Use case liste
│           ├── GetPlayerInventory.ts    # Use case inventaire
│           ├── EquipItem.ts             # Use case équipement
│           ├── index.ts                 # Barrel export
│           └── README.md                # Documentation
│
├── infrastructure/
│   └── repositories/
│       ├── MongoShopRepository.ts       # Implémentation MongoDB
│       ├── MongoWalletRepository.ts     # Wallet repo
│       └── index.ts                     # Barrel export
│
├── components/              # À créer
│   ├── shop/
│   │   ├── shop-item-card.tsx
│   │   ├── shop-grid.tsx
│   │   ├── category-filter.tsx
│   │   └── rarity-badge.tsx
│   │
│   └── inventory/
│       ├── inventory-item-card.tsx
│       └── inventory-list.tsx
│
├── hooks/                   # À créer
│   ├── use-shop.ts
│   └── use-inventory.ts
│
└── app/
    ├── api/
    │   └── shop/
    │       ├── items/
    │       │   └── route.ts     # GET items
    │       └── purchase/
    │           └── route.ts     # POST achat
    │
    ├── shop/                # À créer
    │   └── page.tsx
    │
    └── inventory/           # À créer
        └── page.tsx

docs/
├── SHOP_SYSTEM.md               # Documentation complète
├── SHOP_IMPLEMENTATION_SUMMARY.md  # Résumé implémentation
└── SHOP_UI_NEXT_STEPS.md        # Guide UI

scripts/
└── seed-shop-items.ts           # Script de peuplement
```

## Principes SOLID appliqués

### Single Responsibility (SRP)
```
ShopItem         → Validation & pricing
PurchaseUseCase  → Orchestration achat
MongoShopRepo    → Persistence MongoDB
```

### Open/Closed (OCP)
```
✅ Ajout nouveau ItemCategory sans modifier le code existant
✅ Nouveaux Use Cases sans toucher aux anciens
✅ Extension via composition (props, injection)
```

### Liskov Substitution (LSP)
```
✅ MongoShopRepository implémente IShopRepository
✅ Toutes les méthodes respectent les contrats
✅ Substitution possible sans casse
```

### Interface Segregation (ISP)
```
IShopRepository      → CRUD items uniquement
IInventoryRepository → Gestion inventaire uniquement
IWalletRepository    → Gestion wallet uniquement
```

### Dependency Inversion (DIP)
```
PurchaseUseCase dépend de:
  - IShopRepository (interface)
  - IInventoryRepository (interface)
  - IWalletRepository (interface)

PAS de dépendance directe à MongoDB ou Next.js
```

---

**Documentation créée par AI - Tamagotcho Shop System**
