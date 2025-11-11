# Système d'Items Pixel Art - Boutique

## 📋 Résumé de l'implémentation

### Composants créés

#### 1. **PixelItem** (`src/components/shop/pixel-item.tsx`)
Composant de rendu pixel art pour les items de la boutique.

**Responsabilités (SRP):**
- Dessiner les items en pixel art (chapeau, lunettes, chaussures)
- Animer les items selon leur rareté
- Style rétro gaming cohérent avec PixelMonster

**Caractéristiques:**
- ✅ Rendu canvas avec `imageRendering: 'pixelated'`
- ✅ 3 types d'items : `hat`, `glasses`, `shoes`
- ✅ 4 niveaux de rareté : `common`, `rare`, `epic`, `legendary`
- ✅ Animation de flottement (intensité variable selon la rareté)
- ✅ Effets de brillance (étincelles) pour `epic` et `legendary`
- ✅ Couleurs dynamiques selon la rareté

**Props:**
```typescript
interface PixelItemProps {
  category: ItemCategory      // 'hat' | 'glasses' | 'shoes'
  rarity: ItemRarity          // 'common' | 'rare' | 'epic' | 'legendary'
  animated?: boolean          // true par défaut
}
```

#### 2. **ItemCard** (`src/components/shop/item-card.tsx`)
Carte d'affichage complète pour un item de boutique.

**Responsabilités (SRP):**
- Afficher les détails d'un item (nom, prix, rareté, description)
- Intégrer le rendu pixel art via `PixelItem`
- Gérer l'interaction d'achat
- Indiquer si l'item est achetable (fonds suffisants)

**Caractéristiques:**
- ✅ Badge de rareté avec couleur dynamique
- ✅ Affichage du prix en TamaCoins (TC)
- ✅ Bouton d'achat avec états (loading, disabled, insuffisant)
- ✅ Effets visuels au hover (brillance, scale)
- ✅ Pixels décoratifs dans les coins
- ✅ Message d'erreur si fonds insuffisants

**Props:**
```typescript
interface ItemCardProps {
  item: ShopItemDTO           // Données de l'item
  userBalance: number         // Solde de l'utilisateur
  onPurchase: (itemId: string) => Promise<void>  // Callback d'achat
  disabled?: boolean          // false par défaut
}
```

#### 3. **Barrel Export** (`src/components/shop/index.ts`)
Export centralisé des composants de la boutique.

**Usage:**
```typescript
import { ItemCard, PixelItem } from '@/components/shop'
```

### Intégration dans la page Shop

La page `/shop` (`src/app/shop/page.tsx`) a été mise à jour pour utiliser `ItemCard` :

**Fonctionnalités:**
- ✅ Affichage en grille responsive (1-4 colonnes selon l'écran)
- ✅ Filtrage par catégorie (Tous, Chapeaux, Lunettes, Chaussures)
- ✅ Filtrage par rareté (Tous, Commun, Rare, Épique, Légendaire)
- ✅ Gestion de l'achat avec feedback visuel
- ✅ Message de succès après achat
- ✅ Style pixel art cohérent avec le reste de l'app

## 🎨 Design Pixel Art

### Implémentation des items

#### Chapeau (Hat)
```
- Bord large du chapeau
- Base du chapeau (pyramide inversée)
- Décoration (ruban/accent)
- Détails brillants
```

#### Lunettes (Glasses)
```
- 2 verres (carrés arrondis)
- Pont central
- 2 branches
- Reflets sur les verres
```

#### Chaussures (Shoes)
```
- Paire de chaussures (gauche + droite)
- Semelles
- Corps des chaussures
- Lacets/détails
- Brillance sur les semelles
```

### Couleurs par rareté

| Rareté | Couleur primaire | Accent | Highlight | Animation |
|--------|-----------------|--------|-----------|-----------|
| **Commun** | `#9CA3AF` (gray-400) | `#6B7280` | `#D1D5DB` | Flottement léger (2px) |
| **Rare** | `#3B82F6` (blue-500) | `#1D4ED8` | `#93C5FD` | Flottement moyen (4px) |
| **Épique** | `#8B5CF6` (purple-500) | `#6D28D9` | `#C4B5FD` | Flottement fort (6px) + étincelles |
| **Légendaire** | `#F59E0B` (amber-500) | `#D97706` | `#FCD34D` | Flottement très fort (8px) + étincelles dorées |

## 🏗️ Architecture Clean Code

### Principes SOLID appliqués

#### Single Responsibility Principle (SRP)
- ✅ `PixelItem` : Uniquement le rendu pixel art
- ✅ `ItemCard` : Uniquement l'affichage de la carte
- ✅ Page Shop : Uniquement l'orchestration et le layout

#### Open/Closed Principle (OCP)
- ✅ Ajout de nouveaux items via props (pas de modification du composant)
- ✅ Extension des raretés possible sans toucher au code existant

#### Dependency Inversion Principle (DIP)
- ✅ `ItemCard` reçoit `onPurchase` en callback (ne connaît pas l'implémentation)
- ✅ `PixelItem` est indépendant de la logique métier

### Séparation des responsabilités

```
Presentation Layer (UI)
├── PixelItem.tsx          ─→ Rendu visuel pur
├── ItemCard.tsx           ─→ Composant UI complet
└── page.tsx               ─→ Orchestration + Layout

Domain Layer
└── ShopItem.ts            ─→ Entité métier (déjà existant)

Application Layer
└── use-cases/shop/        ─→ Logique métier (déjà existant)
```

## 🚀 Utilisation

### Importer et utiliser ItemCard

```tsx
import { ItemCard } from '@/components/shop'
import type { ShopItemDTO } from '@/application/use-cases/shop'

function ShopPage() {
  const [items, setItems] = useState<ShopItemDTO[]>([])
  const [userBalance, setUserBalance] = useState(1000)

  const handlePurchase = async (itemId: string) => {
    // Logique d'achat
    await fetch('/api/shop/purchase', {
      method: 'POST',
      body: JSON.stringify({ itemId })
    })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          userBalance={userBalance}
          onPurchase={handlePurchase}
        />
      ))}
    </div>
  )
}
```

### Utiliser PixelItem seul

```tsx
import { PixelItem } from '@/components/shop'

function Preview() {
  return (
    <div className="w-32 h-32">
      <PixelItem 
        category="hat" 
        rarity="legendary" 
        animated 
      />
    </div>
  )
}
```

## 📝 Prochaines étapes

### Phase 2 : Attribution aux monstres (À FAIRE)

1. **Système d'inventaire**
   - Créer `InventoryList` pour afficher les items possédés
   - Créer `MonsterEquipment` pour gérer les items équipés

2. **Association item ↔ monstre**
   - Modal de sélection du monstre lors de l'achat
   - UI pour équiper/déséquiper un item
   - Affichage des items sur le `PixelMonster`

3. **Persistance**
   - Sauvegarder les items équipés dans MongoDB
   - Charger les items équipés au chargement du monstre

4. **Rendu des items sur le monstre**
   - Modifier `PixelMonster` pour dessiner les items équipés
   - Positionner correctement chapeau, lunettes, chaussures
   - Gérer les superpositions (z-index)

### Phase 3 : Améliorations

- [ ] Système de preview 3D (rotation de l'item)
- [ ] Effets sonores à l'achat
- [ ] Animations de transition
- [ ] Marketplace (revendre des items)
- [ ] Items limités dans le temps
- [ ] Combos d'items (bonus si set complet)

## 🐛 Tests à effectuer

- [ ] Vérifier le rendu de chaque type d'item (hat, glasses, shoes)
- [ ] Tester chaque niveau de rareté (common → legendary)
- [ ] Vérifier les animations et étincelles
- [ ] Tester l'achat avec fonds suffisants
- [ ] Tester l'achat avec fonds insuffisants
- [ ] Vérifier le responsive (mobile → desktop)
- [ ] Tester les filtres (catégorie + rareté)

## 📚 Références

- Design inspiré de : Tamagotchi, Pokémon, Neopets
- Style pixel art : 8-bit gaming, rétro arcade
- Architecture : Clean Architecture (Uncle Bob), SOLID principles
