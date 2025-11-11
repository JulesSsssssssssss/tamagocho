# 🎮 Système d'Items - Guide Complet des 4 Actions

## 📋 Vue d'ensemble

Ce document présente les 4 actions disponibles pour gérer les accessoires dans le système Tamagotchi, entièrement basées sur MongoDB (aucun localStorage).

### ✅ Actions disponibles

1. **Acheter un accessoire depuis la boutique**
2. **Équiper un accessoire sur un monstre**
3. **Retirer un accessoire d'un monstre**
4. **Visualiser les accessoires possédés**

---

## 🛒 Action 1 : Acheter un accessoire

### Endpoint
```http
POST /api/shop/purchase
```

### Body
```json
{
  "monsterId": "675e123abc456def789",
  "itemId": "675d987zyx123abc456",
  "price": 100
}
```

### Réponse succès
```json
{
  "success": true,
  "message": "Item purchased successfully",
  "inventoryItemId": "675e999abc123def456"
}
```

### Exemple d'utilisation (client)
```typescript
async function purchaseItem(monsterId: string, itemId: string, price: number) {
  const response = await fetch('/api/shop/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monsterId, itemId, price })
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log('✅ Item acheté !', data.inventoryItemId)
  } else {
    console.error('❌ Erreur:', data.error)
  }
}
```

### Comportement
- Vérifie que le joueur a assez de coins
- Débite le wallet du joueur
- Ajoute l'item à l'inventaire MongoDB (collection `inventoryitems`)
- Rattache l'item au monstre spécifié (`monsterId`)
- Nécessite une session authentifiée

---

## 🎯 Action 2 : Équiper un accessoire

### Endpoint
```http
POST /api/inventory/equip
```

### Body
```json
{
  "monsterId": "675e123abc456def789",
  "inventoryItemId": "675e999abc123def456"
}
```

### Réponse succès
```json
{
  "success": true,
  "message": "Item equipped successfully"
}
```

### Exemple d'utilisation (client)
```typescript
async function equipItem(monsterId: string, inventoryItemId: string) {
  const response = await fetch('/api/inventory/equip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monsterId, inventoryItemId })
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log('✅ Item équipé !')
  } else {
    console.error('❌ Erreur:', data.error)
  }
}
```

### Comportement
- Vérifie que l'item appartient au monstre
- Équipe l'item (met `isEquipped: true` dans MongoDB)
- **Déséquipe automatiquement** les autres items de la même catégorie
- Un seul chapeau, une seule paire de lunettes, une seule paire de chaussures à la fois

---

## 🗑️ Action 3 : Retirer un accessoire (NOUVEAU)

### Endpoint
```http
POST /api/inventory/remove
```

### Body
```json
{
  "monsterId": "675e123abc456def789",
  "inventoryItemId": "675e999abc123def456"
}
```

### Réponse succès
```json
{
  "success": true,
  "message": "Item removed from inventory successfully"
}
```

### Exemple d'utilisation (client)
```typescript
async function removeItem(monsterId: string, inventoryItemId: string) {
  const response = await fetch('/api/inventory/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ monsterId, inventoryItemId })
  })
  
  const data = await response.json()
  
  if (data.success) {
    console.log('✅ Item retiré de l\'inventaire !')
  } else {
    console.error('❌ Erreur:', data.error)
  }
}
```

### Comportement
- Vérifie que l'item appartient bien au monstre
- **Supprime définitivement** l'item de MongoDB (collection `inventoryitems`)
- L'item disparaît de l'inventaire (pas de récupération possible)
- Différent de "déséquiper" : ici l'item est complètement retiré

### Use Case associé
```typescript
import { RemoveItemFromInventoryUseCase } from '@/application/use-cases/shop'
import { MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'

const inventoryRepo = new MongoInventoryRepository()
const removeUseCase = new RemoveItemFromInventoryUseCase(inventoryRepo)

const result = await removeUseCase.execute({
  monsterId: 'monster_123',
  inventoryItemId: 'inv_item_456'
})
```

---

## 👀 Action 4A : Visualiser les accessoires d'un monstre

### Endpoint
```http
GET /api/inventory/[monsterId]
```

### Paramètres
- `monsterId` : ID du monstre dans l'URL

### Exemple URL
```
GET /api/inventory/675e123abc456def789
```

### Réponse succès
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "675e999abc123def456",
      "itemId": "675d987zyx123abc456",
      "monsterId": "675e123abc456def789",
      "ownerId": "user_123",
      "name": "Chapeau de pirate",
      "description": "Un chapeau de pirate légendaire",
      "category": "hat",
      "rarity": "legendary",
      "imageUrl": "/items/pirate-hat.png",
      "isEquipped": true,
      "purchasedAt": "2025-10-30T10:30:00Z"
    },
    {
      "id": "675e888bcd456ghi789",
      "itemId": "675d876wvu987xyz654",
      "monsterId": "675e123abc456def789",
      "ownerId": "user_123",
      "name": "Lunettes de soleil",
      "description": "Des lunettes stylées",
      "category": "glasses",
      "rarity": "rare",
      "imageUrl": "/items/sunglasses.png",
      "isEquipped": false,
      "purchasedAt": "2025-10-29T15:20:00Z"
    }
  ]
}
```

### Exemple d'utilisation (client)
```typescript
async function getMonsterInventory(monsterId: string) {
  const response = await fetch(`/api/inventory/${monsterId}`)
  const data = await response.json()
  
  if (data.success) {
    console.log(`📦 ${data.count} items dans l'inventaire`)
    data.data.forEach(item => {
      console.log(`${item.isEquipped ? '✅' : '⬜'} ${item.name} (${item.category})`)
    })
  }
}
```

---

## 👀 Action 4B : Visualiser TOUS les accessoires d'un joueur (NOUVEAU)

### Endpoint
```http
GET /api/inventory/owner/[ownerId]
```

### Paramètres
- `ownerId` : ID du joueur/utilisateur dans l'URL

### Exemple URL
```
GET /api/inventory/owner/user_123
```

### Réponse succès
```json
{
  "success": true,
  "count": 12,
  "data": [
    {
      "id": "675e999abc123def456",
      "itemId": "675d987zyx123abc456",
      "monsterId": "675e123abc456def789",  // Monstre A
      "ownerId": "user_123",
      "name": "Chapeau de pirate",
      "category": "hat",
      "rarity": "legendary",
      "isEquipped": true,
      "purchasedAt": "2025-10-30T10:30:00Z"
    },
    {
      "id": "675e777xyz789abc123",
      "itemId": "675d765tsr654pqr321",
      "monsterId": "675e456def789ghi012",  // Monstre B
      "ownerId": "user_123",
      "name": "Bottes en cuir",
      "category": "shoes",
      "rarity": "epic",
      "isEquipped": false,
      "purchasedAt": "2025-10-28T08:15:00Z"
    }
    // ... tous les items de tous les monstres du joueur
  ]
}
```

### Exemple d'utilisation (client)
```typescript
async function getAllOwnerItems(ownerId: string) {
  const response = await fetch(`/api/inventory/owner/${ownerId}`)
  const data = await response.json()
  
  if (data.success) {
    console.log(`📦 ${data.count} items possédés au total`)
    
    // Grouper par monstre
    const itemsByMonster = data.data.reduce((acc, item) => {
      if (!acc[item.monsterId]) acc[item.monsterId] = []
      acc[item.monsterId].push(item)
      return acc
    }, {})
    
    Object.entries(itemsByMonster).forEach(([monsterId, items]) => {
      console.log(`🐾 Monstre ${monsterId}: ${items.length} items`)
    })
  }
}
```

### Use Case associé
```typescript
import { GetAllOwnerItemsUseCase } from '@/application/use-cases/shop'
import { MongoShopRepository, MongoInventoryRepository } from '@/infrastructure/repositories/MongoShopRepository'

const shopRepo = new MongoShopRepository()
const inventoryRepo = new MongoInventoryRepository()
const getAllOwnerItemsUseCase = new GetAllOwnerItemsUseCase(inventoryRepo, shopRepo)

const allItems = await getAllOwnerItemsUseCase.execute('user_123')
console.log(`Total items: ${allItems.length}`)
```

---

## 🔄 Déséquiper un item (bonus)

### Endpoint
```http
POST /api/inventory/unequip
```

### Body
```json
{
  "monsterId": "675e123abc456def789",
  "inventoryItemId": "675e999abc123def456"
}
```

### Différence avec "Retirer"
- **Déséquiper** : met `isEquipped: false`, l'item reste dans l'inventaire
- **Retirer** : supprime complètement l'item de MongoDB

---

## 📊 Structure MongoDB

### Collection `shopitems`
```javascript
{
  "_id": ObjectId("675d987zyx123abc456"),
  "name": "Chapeau de pirate",
  "description": "Un chapeau de pirate légendaire",
  "category": "hat",
  "rarity": "legendary",
  "price": 500,
  "imageUrl": "/items/pirate-hat.png",
  "isAvailable": true,
  "createdAt": ISODate("2025-10-20T00:00:00Z")
}
```

### Collection `inventoryitems`
```javascript
{
  "_id": ObjectId("675e999abc123def456"),
  "itemId": "675d987zyx123abc456",  // Référence à shopitems
  "monsterId": "675e123abc456def789", // Référence à monsters
  "ownerId": "user_123",              // Référence à users
  "purchasedAt": ISODate("2025-10-30T10:30:00Z"),
  "isEquipped": true
}
```

**Index MongoDB** :
- `{ monsterId: 1 }` - Recherche rapide par monstre
- `{ ownerId: 1 }` - Recherche rapide par propriétaire
- `{ itemId: 1, monsterId: 1 }` - Vérifier doublons

---

## 🎯 Résumé des 4 actions

| Action | Endpoint | Méthode | Collection MongoDB |
|--------|----------|---------|-------------------|
| **Acheter** | `/api/shop/purchase` | POST | INSERT dans `inventoryitems` |
| **Équiper** | `/api/inventory/equip` | POST | UPDATE `isEquipped: true` |
| **Retirer** | `/api/inventory/remove` | POST | DELETE de `inventoryitems` |
| **Visualiser (monstre)** | `/api/inventory/[monsterId]` | GET | SELECT par `monsterId` |
| **Visualiser (joueur)** | `/api/inventory/owner/[ownerId]` | GET | SELECT par `ownerId` |

---

## 🧪 Tests rapides

### Test 1 : Acheter et équiper
```bash
# Acheter un item
curl -X POST http://localhost:3000/api/shop/purchase \
  -H "Content-Type: application/json" \
  -d '{"monsterId":"675e123abc456def789","itemId":"675d987zyx123abc456","price":100}'

# Équiper l'item acheté
curl -X POST http://localhost:3000/api/inventory/equip \
  -H "Content-Type: application/json" \
  -d '{"monsterId":"675e123abc456def789","inventoryItemId":"675e999abc123def456"}'
```

### Test 2 : Visualiser et retirer
```bash
# Voir l'inventaire du monstre
curl http://localhost:3000/api/inventory/675e123abc456def789

# Retirer un item
curl -X POST http://localhost:3000/api/inventory/remove \
  -H "Content-Type: application/json" \
  -d '{"monsterId":"675e123abc456def789","inventoryItemId":"675e999abc123def456"}'
```

### Test 3 : Voir tous les items du joueur
```bash
curl http://localhost:3000/api/inventory/owner/user_123
```

---

## 📚 Architecture Clean

### Use Cases créés
- `GetShopItemsUseCase` - Lister les items de la boutique
- `GetPlayerInventoryUseCase` - Inventaire d'un monstre
- `GetAllOwnerItemsUseCase` ✨ **NOUVEAU** - Tous les items d'un joueur
- `EquipItemUseCase` - Équiper un item
- `UnequipItemUseCase` - Déséquiper un item
- `RemoveItemFromInventoryUseCase` ✨ **NOUVEAU** - Retirer définitivement

### Repositories
- `MongoShopRepository` - Gestion des items de boutique
- `MongoInventoryRepository` - Gestion de l'inventaire joueur

### Domain Entities
- `ShopItem` - Item de la boutique
- `InventoryItem` - Item dans l'inventaire d'un monstre

---

## 🚀 Prochaines étapes recommandées

1. ✅ **Créer les composants UI React** pour ces 4 actions
2. ✅ **Ajouter des animations** lors de l'équipement/retrait
3. ✅ **Implémenter un système de drag & drop** pour équiper
4. ✅ **Afficher visuellement les items équipés** sur le monstre
5. ✅ **Ajouter un filtre par catégorie/rareté** dans l'inventaire

---

## ⚠️ Notes importantes

- **Tout est en MongoDB** - Aucune donnée en localStorage
- **Authentification requise** pour acheter des items
- **Validation côté serveur** pour tous les endpoints
- **Un seul item équipé par catégorie** (logique automatique)
- **Suppression définitive** avec `/remove` (pas de corbeille)

---

**Documentation générée le 30 octobre 2025**  
**Version du système : 2.0 (MongoDB Full)**
