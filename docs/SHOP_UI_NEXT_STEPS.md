# 🎯 NEXT STEPS - Implémentation UI de la Boutique

## ✅ Ce qui est FAIT

### Backend complet
- ✅ Domain Layer (Entités + Repositories interfaces)
- ✅ Application Layer (4 Use Cases)
- ✅ Infrastructure Layer (MongoDB repositories)
- ✅ Routes API Next.js (`/api/shop/*`)
- ✅ Script de seed (12 items pré-configurés)
- ✅ Documentation complète

### Architecture
- ✅ Clean Architecture respectée
- ✅ Principes SOLID appliqués
- ✅ TypeScript strict mode
- ✅ Gestion d'erreurs typées
- ✅ Validation métier robuste

## 🎨 CE QU'IL RESTE À FAIRE - Frontend

### Phase 1: Composants de base

#### 1.1 Badge de rareté
```typescript
// src/components/shop/rarity-badge.tsx
interface RarityBadgeProps {
  rarity: ItemRarity
}

// Affiche un badge coloré selon la rareté
// Utilise RARITY_COLORS et RARITY_LABELS
```

#### 1.2 Card d'item boutique
```typescript
// src/components/shop/shop-item-card.tsx
interface ShopItemCardProps {
  item: ShopItemDTO
  userBalance: number
  onPurchase: (itemId: string) => void
}

// Features:
// - Affichage image item (ou placeholder)
// - Nom + description
// - Badge de rareté
// - Prix avec icône TC
// - Bouton "Acheter"
//   - Disabled si solde insuffisant
//   - Disabled si déjà possédé (à implémenter)
// - Animation hover
```

#### 1.3 Card d'item inventaire
```typescript
// src/components/inventory/inventory-item-card.tsx
interface InventoryItemCardProps {
  item: InventoryItemDTO
  onToggleEquip: (id: string) => void
}

// Features:
// - Affichage image item
// - Nom + catégorie
// - Badge "Équipé" si isEquipped
// - Bouton toggle équiper/déséquiper
// - Animation équipement
```

### Phase 2: Filtres et navigation

#### 2.1 Filtre par catégorie
```typescript
// src/components/shop/category-filter.tsx
interface CategoryFilterProps {
  selected?: ItemCategory
  onChange: (category?: ItemCategory) => void
}

// Boutons: Tous | Chapeaux | Lunettes | Chaussures
// Style: Active state pour selected
```

#### 2.2 Filtre par rareté
```typescript
// src/components/shop/rarity-filter.tsx
interface RarityFilterProps {
  selected?: ItemRarity
  onChange: (rarity?: ItemRarity) => void
}

// Boutons avec couleurs: Common | Rare | Epic | Legendary
```

### Phase 3: Grilles et listes

#### 3.1 Grille boutique
```typescript
// src/components/shop/shop-grid.tsx
interface ShopGridProps {
  items: ShopItemDTO[]
  userBalance: number
  ownedItemIds: string[]
  onPurchase: (itemId: string) => void
}

// Grid responsive (1-2-3-4 colonnes selon viewport)
// Empty state si pas d'items
// Loading state
```

#### 3.2 Liste inventaire
```typescript
// src/components/inventory/inventory-list.tsx
interface InventoryListProps {
  items: InventoryItemDTO[]
  onToggleEquip: (id: string) => void
}

// Grouper par catégorie
// Trier par date d'achat (récent d'abord)
// Empty state si inventaire vide
```

### Phase 4: Hooks personnalisés

#### 4.1 Hook boutique
```typescript
// src/hooks/use-shop.ts
export function useShop() {
  const [items, setItems] = useState<ShopItemDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<GetShopItemsFilter>({})

  const fetchItems = async () => {
    // GET /api/shop/items avec filtres
  }

  const purchaseItem = async (itemId: string) => {
    // POST /api/shop/purchase
  }

  return {
    items,
    loading,
    error,
    filters,
    setFilters,
    purchaseItem,
    refetch: fetchItems
  }
}
```

#### 4.2 Hook inventaire
```typescript
// src/hooks/use-inventory.ts
export function useInventory() {
  const [items, setItems] = useState<InventoryItemDTO[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInventory = async () => {
    // GET /api/inventory
  }

  const equipItem = async (inventoryItemId: string) => {
    // POST /api/inventory/equip
  }

  const unequipItem = async (inventoryItemId: string) => {
    // POST /api/inventory/unequip
  }

  return {
    items,
    loading,
    equipItem,
    unequipItem,
    equippedItems: items.filter(i => i.isEquipped),
    refetch: fetchInventory
  }
}
```

#### 4.3 Hook wallet (réutiliser l'existant si disponible)
```typescript
// src/hooks/use-wallet.ts
export function useWallet() {
  const [balance, setBalance] = useState(0)
  // ...
}
```

### Phase 5: Pages principales

#### 5.1 Page Boutique
```typescript
// src/app/shop/page.tsx
export default function ShopPage() {
  const { items, loading, filters, setFilters, purchaseItem } = useShop()
  const { balance } = useWallet()
  const { items: inventory } = useInventory()

  return (
    <div>
      <header>
        <h1>Boutique</h1>
        <WalletDisplay balance={balance} />
      </header>

      <filters>
        <CategoryFilter {...} />
        <RarityFilter {...} />
      </filters>

      <ShopGrid
        items={items}
        userBalance={balance}
        ownedItemIds={inventory.map(i => i.itemId)}
        onPurchase={purchaseItem}
      />
    </div>
  )
}
```

#### 5.2 Page Inventaire
```typescript
// src/app/inventory/page.tsx
export default function InventoryPage() {
  const { items, loading, equipItem, unequipItem } = useInventory()

  return (
    <div>
      <header>
        <h1>Mon Inventaire</h1>
        <p>{items.length} / 150 items</p>
      </header>

      <tabs>
        <Tab>Tous</Tab>
        <Tab>Chapeaux</Tab>
        <Tab>Lunettes</Tab>
        <Tab>Chaussures</Tab>
      </tabs>

      <InventoryList
        items={filteredItems}
        onToggleEquip={(id) => {
          const item = items.find(i => i.id === id)
          item?.isEquipped ? unequipItem(id) : equipItem(id)
        }}
      />
    </div>
  )
}
```

### Phase 6: Modals et confirmations

#### 6.1 Modal confirmation achat
```typescript
// src/components/shop/purchase-modal.tsx
interface PurchaseModalProps {
  item: ShopItemDTO | null
  userBalance: number
  onConfirm: () => void
  onCancel: () => void
}

// Affiche:
// - Image + nom item
// - Prix
// - Solde actuel → Solde après achat
// - Boutons Annuler / Confirmer
```

#### 6.2 Toast notifications
```typescript
// Utiliser une lib comme sonner ou react-hot-toast

// Succès achat
toast.success('Casquette Basique achetée!')

// Erreur solde insuffisant
toast.error('Solde insuffisant')

// Item équipé
toast.success('Chapeau de Magicien équipé')
```

### Phase 7: Intégration Tamagotchi

#### 7.1 Affichage items équipés
```typescript
// src/components/tamagotchi/tamagotchi-with-items.tsx
interface TamagotchiWithItemsProps {
  monster: MonsterData
  equippedItems: InventoryItemDTO[]
}

// Overlay des images d'items sur le Tamagotchi
// Position selon catégorie:
// - Hat: dessus de la tête
// - Glasses: sur les yeux
// - Shoes: en bas
```

#### 7.2 Preview achat
```typescript
// Dans PurchaseModal, montrer le Tamagotchi avec l'item
<TamagotchiPreview
  monster={currentMonster}
  previewItem={itemToPreview}
/>
```

## 📋 Checklist d'implémentation

### Étape 1: Setup initial
- [ ] Créer le dossier `src/components/shop/`
- [ ] Créer le dossier `src/components/inventory/`
- [ ] Créer le dossier `src/hooks/`
- [ ] Installer lib toast (optionnel): `npm i sonner`

### Étape 2: Composants atomiques
- [ ] `<RarityBadge />`
- [ ] `<CategoryIcon />` (icônes pour hat/glasses/shoes)
- [ ] `<PriceDisplay />` (prix avec icône TC)

### Étape 3: Composants composés
- [ ] `<ShopItemCard />`
- [ ] `<InventoryItemCard />`
- [ ] `<CategoryFilter />`
- [ ] `<RarityFilter />`

### Étape 4: Hooks
- [ ] `useShop()`
- [ ] `useInventory()`
- [ ] Intégrer avec `useWallet()` existant

### Étape 5: Layouts
- [ ] `<ShopGrid />`
- [ ] `<InventoryList />`

### Étape 6: Pages
- [ ] `/shop/page.tsx`
- [ ] `/inventory/page.tsx`
- [ ] Ajouter liens dans navigation

### Étape 7: Modals & Feedbacks
- [ ] `<PurchaseModal />`
- [ ] Toast notifications
- [ ] Loading states
- [ ] Error states

### Étape 8: Intégration
- [ ] Afficher items sur Tamagotchi
- [ ] Animations équipement
- [ ] Preview avant achat

### Étape 9: Polish
- [ ] Responsive design
- [ ] Animations smooth
- [ ] Accessibility (ARIA labels)
- [ ] Tests E2E

## 🎨 Suggestions de style

### Couleurs des raretés (déjà définies)
```css
Common:    #9CA3AF  /* gray-400 */
Rare:      #3B82F6  /* blue-500 */
Epic:      #8B5CF6  /* purple-500 */
Legendary: #F59E0B  /* amber-500 */
```

### Palette projet (Tamagotcho)
```css
Primary:   moccaccino-500 (#f7533c)
Secondary: lochinvar-500 (#469086)
Tertiary:  fuchsia-blue-500 (#8f72e0)
```

### Icônes suggérées
- Hat: 🎩
- Glasses: 👓
- Shoes: 👟
- Coins: 🪙 ou custom SVG

## 🚀 Commande pour démarrer

```bash
# 1. Peupler la boutique
npm run seed:shop

# 2. Lancer le dev server
npm run dev

# 3. Ouvrir http://localhost:3000/shop
```

## 📚 Ressources utiles

- **Documentation**: `docs/SHOP_SYSTEM.md`
- **Exemples**: `src/application/use-cases/shop/README.md`
- **Types**: `src/shared/types/shop.ts`
- **Routes API**: `src/app/api/shop/*/route.ts`

---

**Bonne chance pour l'UI ! 🎨✨**
