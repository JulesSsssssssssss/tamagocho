# 🔄 Mise à jour : Items rattachés aux créatures

## Changements effectués

### ✅ Modification du modèle de données

**Avant :** Les items étaient rattachés à l'utilisateur (`ownerId`)  
**Après :** Les items sont rattachés à une créature spécifique (`monsterId`) + `ownerId` pour les requêtes

### 📋 Détails des modifications

#### 1. **Types partagés** (`src/shared/types/shop.ts`)

```typescript
export interface IInventoryItemProps {
  id: string
  itemId: string
  monsterId: string  // ✅ AJOUTÉ - ID de la créature propriétaire
  ownerId: string    // Conservé pour filtrer tous les items du joueur
  purchasedAt: Date
  isEquipped: boolean
}
```

#### 2. **Entité Domain** (`src/domain/entities/InventoryItem.ts`)

**Changements :**
- Ajout du champ `monsterId` dans la classe `InventoryItem`
- Mise à jour de `Inventory` pour inclure `monsterId`
- Factory method `create()` prend maintenant `monsterId` + `ownerId`
- Validation vérifie que l'item appartient bien à la créature

```typescript
InventoryItem.create(
  id,
  itemId,
  monsterId,  // ✅ NOUVEAU
  ownerId
)
```

#### 3. **Repository Interface** (`src/domain/repositories/IShopRepository.ts`)

**Nouvelles méthodes :**
```typescript
interface IInventoryRepository {
  findByMonsterId(monsterId: string): Promise<InventoryItem[]>  // ✅ NOUVEAU
  findByOwnerId(ownerId: string): Promise<InventoryItem[]>      // Conservé
  hasItem(monsterId: string, shopItemId: string): Promise<boolean>  // ✅ Modifié
  findEquippedItems(monsterId: string): Promise<InventoryItem[]>    // ✅ Modifié
  // ... autres méthodes
}
```

#### 4. **MongoDB Schema** (`src/infrastructure/repositories/MongoShopRepository.ts`)

**Schéma mis à jour :**
```typescript
const inventoryItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, ref: 'ShopItem' },
  monsterId: { type: String, required: true, ref: 'Monster' },  // ✅ NOUVEAU
  ownerId: { type: String, required: true },
  purchasedAt: { type: Date, default: Date.now },
  isEquipped: { type: Boolean, default: false }
})

// Index optimisés
inventoryItemSchema.index({ monsterId: 1 })     // ✅ NOUVEAU
inventoryItemSchema.index({ ownerId: 1 })
inventoryItemSchema.index({ itemId: 1, monsterId: 1 })  // ✅ Modifié
```

#### 5. **Use Cases**

**PurchaseItem** (`src/application/use-cases/shop/PurchaseItem.ts`)
```typescript
export interface PurchaseItemInput {
  userId: string
  monsterId: string  // ✅ NOUVEAU - Créature qui recevra l'item
  itemId: string
}
```

**GetPlayerInventory** (`src/application/use-cases/shop/GetPlayerInventory.ts`)
```typescript
// Maintenant prend monsterId au lieu de userId
async execute(monsterId: string): Promise<InventoryItemDTO[]>

// Nouvelle méthode pour tous les items du joueur
async getAllPlayerItems(userId: string): Promise<InventoryItemDTO[]>
```

**EquipItem** (`src/application/use-cases/shop/EquipItem.ts`)
```typescript
export interface EquipItemInput {
  monsterId: string  // ✅ Modifié (était userId)
  inventoryItemId: string
}
```

#### 6. **Routes API**

**POST /api/shop/purchase**
```typescript
// Body
{
  "monsterId": "monster_123",  // ✅ NOUVEAU
  "itemId": "item_abc"
}
```

**GET /api/inventory/[monsterId]** ✅ NOUVEAU
```typescript
// Récupère l'inventaire d'une créature spécifique
GET /api/inventory/monster_123
```

**POST /api/inventory/equip**
```typescript
// Body
{
  "monsterId": "monster_123",  // ✅ Modifié
  "inventoryItemId": "inv_abc"
}
```

**POST /api/inventory/unequip**
```typescript
// Body
{
  "monsterId": "monster_123",  // ✅ Modifié
  "inventoryItemId": "inv_abc"
}
```

## 🎯 Logique métier

### Règles importantes

1. **Un item appartient à UNE créature**
   - Chaque `InventoryItem` a un `monsterId` unique
   - Une créature peut avoir plusieurs items

2. **Le joueur possède plusieurs créatures**
   - `ownerId` est conservé pour filtrer tous les items d'un joueur
   - Requête possible : "Tous les items de toutes mes créatures"

3. **Équipement par créature**
   - Un seul item de chaque catégorie équipé **par créature**
   - Chapeau équipé sur Monster A ≠ Chapeau équipé sur Monster B

4. **Achat d'item**
   - Le joueur achète l'item (débit du wallet)
   - L'item est donné à une créature spécifique
   - Pas de duplication : une créature ne peut pas avoir 2 fois le même item

## 📊 Stockage MongoDB

### Collection: InventoryItem

```javascript
{
  _id: "inv_123",
  itemId: "item_abc",           // Référence ShopItem
  monsterId: "monster_xyz",     // ✅ Référence Monster
  ownerId: "user_123",          // ID utilisateur
  purchasedAt: ISODate("2025-10-29"),
  isEquipped: false
}
```

### Exemples de requêtes

```javascript
// Inventaire d'une créature
db.inventoryitems.find({ monsterId: "monster_xyz" })

// Tous les items d'un joueur (toutes créatures)
db.inventoryitems.find({ ownerId: "user_123" })

// Items équipés d'une créature
db.inventoryitems.find({ 
  monsterId: "monster_xyz", 
  isEquipped: true 
})

// Vérifier si une créature possède un item
db.inventoryitems.findOne({ 
  monsterId: "monster_xyz",
  itemId: "item_abc" 
})
```

## 🔄 Migration des données (si nécessaire)

Si vous avez déjà des items dans la DB sans `monsterId` :

```javascript
// Script de migration MongoDB
db.inventoryitems.updateMany(
  { monsterId: { $exists: false } },
  { $set: { monsterId: "default_monster_id" } }
)

// Ou supprimer les anciennes données
db.inventoryitems.deleteMany({ monsterId: { $exists: false } })
```

## ✅ Vérification

Toutes les modifications sont compatibles entre elles :
- ✅ Domain Layer mis à jour
- ✅ Application Layer mis à jour
- ✅ Infrastructure Layer mis à jour
- ✅ Routes API mises à jour
- ✅ Schéma MongoDB mis à jour

## 🚀 Utilisation

### Acheter un item pour une créature

```typescript
const result = await fetch('/api/shop/purchase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monsterId: 'monster_123',
    itemId: 'item_hat_common'
  })
})
```

### Récupérer l'inventaire d'une créature

```typescript
const response = await fetch('/api/inventory/monster_123')
const { data } = await response.json()
// data = Array<InventoryItemDTO>
```

### Équiper un item sur une créature

```typescript
await fetch('/api/inventory/equip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    monsterId: 'monster_123',
    inventoryItemId: 'inv_abc'
  })
})
```

### Afficher les items équipés sur une créature

```typescript
// Dans votre composant React
function MonsterWithItems({ monsterId }) {
  const [items, setItems] = useState([])
  
  useEffect(() => {
    async function loadInventory() {
      const res = await fetch(`/api/inventory/${monsterId}`)
      const { data } = await res.json()
      setItems(data.filter(item => item.isEquipped))
    }
    loadInventory()
  }, [monsterId])
  
  return (
    <div>
      <Monster id={monsterId} />
      {items.map(item => (
        <ItemOverlay key={item.id} item={item} />
      ))}
    </div>
  )
}
```

## 📝 Notes importantes

1. **Chaque accessoire est maintenant clairement rattaché à une créature spécifique**
2. **Les accessoires sont bien stockés dans MongoDB (collection `inventoryitems`)**
3. **Vous pouvez équiper et retirer les accessoires via les routes API**
4. **Un joueur peut avoir plusieurs créatures avec des items différents**

---

**Mise à jour effectuée le 29 octobre 2025** ✅
