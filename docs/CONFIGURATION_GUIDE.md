# 📋 Guide des Configurations - Tamagotcho

## Vue d'ensemble

Tous les fichiers de configuration sont centralisés dans `src/config/` pour **éliminer les valeurs magiques** du code et faciliter la maintenance.

## Structure des fichiers

```
src/config/
├── index.ts                    # Barrel export (point d'entrée)
├── rewards.ts                  # Configuration des récompenses en Koins
├── accessories.config.ts       # Catalogue des accessoires (chapeaux, lunettes, chaussures)
├── backgrounds.config.ts       # Catalogue des arrière-plans
├── quests.config.ts           # Configuration des quêtes journalières
├── monsters.config.ts         # Configuration des monstres (stats, prix, limites)
├── shop.config.ts             # Configuration de la boutique (prix, labels, couleurs)
├── wallet.config.ts           # Configuration du portefeuille (Koins, packages)
├── game.config.ts             # Configuration globale du jeu (temps, UI, messages)
└── pricing.ts                 # Configuration Stripe (déjà existante)
```

## 🎯 Utilisation

### Import recommandé

```typescript
// ✅ Import depuis le barrel export
import { REWARDS_CONFIG, SHOP_CONFIG, MONSTERS_CONFIG } from '@/config'

// ✅ Import spécifique si besoin
import { calculateMonsterPrice } from '@/config/monsters.config'
import { DAILY_QUESTS_CATALOG } from '@/config/quests.config'
```

### ❌ À éviter

```typescript
// ❌ Valeurs en dur dans le code
const reward = 10 // Quelle action ? Pourquoi 10 ?

// ❌ Constantes éparpillées
const FEED_REWARD = 10 // Dans un fichier
const PLAY_REWARD = 10 // Dans un autre fichier
```

## 📦 Détail des configurations

### 1. `rewards.ts` - Récompenses en Koins

Centralise **tous les montants de Koins** gagnés par action.

```typescript
import { MONSTER_ACTION_REWARDS, calculateLevelUpReward } from '@/config'

// Récompenser pour avoir nourri un monstre
const coins = MONSTER_ACTION_REWARDS.FEED // 10 Koins

// Récompenser un level up
const levelUpReward = calculateLevelUpReward(5) // 50 + (5 × 50) = 300 Koins
```

**Sections :**
- `MONSTER_ACTION_REWARDS` : Feed, Play, Sleep, Clean, Heal
- `LOGIN_REWARDS` : Daily login, streaks, bonus initial
- `PROGRESSION_REWARDS` : Level up, survival
- `MISC_REWARDS` : Quêtes, événements

---

### 2. `accessories.config.ts` - Catalogue des accessoires

Définit **tous les items équipables** (chapeaux, lunettes, chaussures).

```typescript
import { ACCESSORIES_CATALOG, getAccessoriesByCategory } from '@/config'

// Récupérer tous les chapeaux
const hats = getAccessoriesByCategory('hat')

// Utiliser le catalogue complet
console.log(ACCESSORIES_CATALOG) // 12 items (4 par catégorie)
```

**Structure d'un accessoire :**
```typescript
{
  name: 'Casquette Basique',
  description: 'Une simple casquette pour protéger du soleil',
  category: 'hat',
  rarity: 'common',
  imageUrl: '/items/hats/basic-cap.png'
}
```

---

### 3. `backgrounds.config.ts` - Arrière-plans

Définit **tous les backgrounds** disponibles.

```typescript
import { BACKGROUNDS_CATALOG, getBackgroundByType } from '@/config'

// Récupérer le background "jardin"
const garden = getBackgroundByType('garden')

// Labels et descriptions
const label = BACKGROUND_TYPE_LABELS.night // "Toit - Nuit"
const description = BACKGROUND_TYPE_DESCRIPTIONS.night // "Un toit urbain..."
```

**Types disponibles :** `day`, `garden`, `night`

---

### 4. `quests.config.ts` - Quêtes journalières

Définit **toutes les quêtes quotidiennes** et leur système de récompense.

```typescript
import { DAILY_QUESTS_CATALOG, generateDailyQuests } from '@/config'

// Générer 3 quêtes aléatoires (1 facile, 1 moyenne, 1 difficile)
const todayQuests = generateDailyQuests()

// Bonus pour toutes les quêtes complétées
const bonus = ALL_QUESTS_BONUS // 150 Koins
```

**Structure d'une quête :**
```typescript
{
  id: 'quest_feed_3',
  type: 'FEED_MONSTERS',
  title: 'Nourrir 3 monstres',
  description: 'Donne à manger à 3 de tes créatures',
  target: 3,
  reward: 30,
  difficulty: 'easy',
  icon: '🍕'
}
```

---

### 5. `monsters.config.ts` - Configuration des monstres

Centralise **toutes les constantes** liées aux monstres.

```typescript
import { 
  calculateMonsterPrice, 
  MONSTER_BASE_STATS, 
  MONSTER_ACTIONS 
} from '@/config'

// Calculer le prix du 3ème monstre
const price = calculateMonsterPrice(2) // 50 Koins

// Stats de départ
const initialHappiness = MONSTER_BASE_STATS.INITIAL_HAPPINESS // 50

// Restauration de faim
const hungerRestore = MONSTER_ACTIONS.FEED_HUNGER_RESTORE // 20
```

**Sections :**
- `MONSTER_PRICING` : Prix de création, free monsters
- `MONSTER_BASE_STATS` : Stats initiales (level, XP, happiness, etc.)
- `MONSTER_STAT_LIMITS` : Min/max, seuils critiques
- `MONSTER_LEVELING` : Système d'XP et de niveaux
- `MONSTER_DECAY` : Décroissance des stats au fil du temps
- `MONSTER_ACTIONS` : Effets des actions (feed, play, sleep, clean)
- `PLAYER_LIMITS` : Limites par joueur (max monstres, longueur nom)

---

### 6. `shop.config.ts` - Configuration de la boutique

Centralise **prix, labels, couleurs** de la boutique.

```typescript
import { calculateItemPrice, RARITY_COLORS, CATEGORY_LABELS } from '@/config'

// Calculer le prix d'un chapeau épique
const price = calculateItemPrice('hat', 'epic') // 50 × 5 = 250 Koins

// Récupérer les couleurs pour une rareté
const colors = RARITY_COLORS.legendary // "border-yellow-500 text-yellow-500"

// Labels français
const label = CATEGORY_LABELS.hat // "Chapeau"
```

**Sections :**
- Prix et multiplicateurs
- Labels français (catégories, raretés, backgrounds)
- Couleurs Tailwind pour l'UI
- Limites de l'inventaire
- Configuration de l'équipement

---

### 7. `wallet.config.ts` - Configuration du portefeuille

Centralise **Koins de départ et packages achetables**.

```typescript
import { INITIAL_WALLET, COIN_PACKAGES, getPackageByAmount } from '@/config'

// Koins de départ
const startingCoins = INITIAL_WALLET.INITIAL_COINS // 100

// Récupérer le package de 50 Koins
const package50 = getPackageByAmount(50) // { amount: 50, price: 1, productId: '...' }

// Trouver le meilleur rapport qualité/prix
const bestValue = getBestValuePackage()
```

---

### 8. `game.config.ts` - Configuration globale

Centralise **paramètres généraux** du jeu.

```typescript
import { TIME_INTERVALS, ERROR_MESSAGES, GAME_EMOJIS } from '@/config'

// Intervalles de temps
const oneHour = TIME_INTERVALS.ONE_HOUR // 3600000 ms
const updateInterval = TIME_INTERVALS.MONSTER_UPDATE_INTERVAL // 1 heure

// Messages d'erreur standardisés
const errorMsg = ERROR_MESSAGES.INSUFFICIENT_FUNDS // "Pas assez de Koins !"

// Emojis standardisés
const coinEmoji = GAME_EMOJIS.COIN // "💰"
```

**Sections :**
- Intervalles de temps
- Paramètres du jeu (nom, version, debug)
- Configuration des notifications
- Configuration de l'UI (animations, canvas)
- Pagination
- Messages d'erreur/succès standardisés
- Emojis du jeu

---

## 🎨 Principes de conception

### 1. Single Source of Truth
Chaque valeur n'existe qu'à **un seul endroit**.

```typescript
// ✅ BON
import { MONSTER_ACTION_REWARDS } from '@/config'
const reward = MONSTER_ACTION_REWARDS.FEED

// ❌ MAUVAIS
const reward = 10 // Dupliqué partout dans le code
```

### 2. Typage strict
Toutes les configs sont **fortement typées**.

```typescript
export const RARITY_PRICE_MULTIPLIER: Record<ItemRarity, number> = {
  common: 1,
  rare: 2.5,
  epic: 5,
  legendary: 10
} as const // Immuable
```

### 3. Fonctions utilitaires
Des **helpers** pour les calculs complexes.

```typescript
// Au lieu de dupliquer la formule partout
export function calculateMonsterPrice(count: number): number {
  if (count < 2) return 0
  return 50 + ((count - 2) * 50)
}
```

### 4. Documentation inline
Chaque constante est **documentée**.

```typescript
/**
 * Koins gagnés pour nourrir un monstre
 */
FEED: 10
```

---

## 🔄 Migration du code existant

### Avant
```typescript
// src/actions/monsters.actions.ts
const coinsReward = 10 // Valeur magique
await addCoins(coinsReward)
```

### Après
```typescript
// src/actions/monsters.actions.ts
import { MONSTER_ACTION_REWARDS } from '@/config'

const coinsReward = MONSTER_ACTION_REWARDS.FEED
await addCoins(coinsReward)
```

---

## 📊 Tableau récapitulatif

| Fichier | Contenu | Usage principal |
|---------|---------|-----------------|
| `rewards.ts` | Montants de Koins | Actions, level up, quêtes |
| `accessories.config.ts` | Catalogue d'accessoires | Seed boutique, affichage items |
| `backgrounds.config.ts` | Catalogue de backgrounds | Seed boutique, UI backgrounds |
| `quests.config.ts` | Quêtes journalières | Système de quêtes |
| `monsters.config.ts` | Stats et limites monstres | Création, actions, level up |
| `shop.config.ts` | Prix, labels, couleurs | UI boutique, calculs prix |
| `wallet.config.ts` | Koins de départ, packages | Stripe, portefeuille |
| `game.config.ts` | Paramètres globaux | UI, messages, temps |
| `pricing.ts` | Produits Stripe | Paiements |

---

## ✅ Checklist d'utilisation

Avant d'ajouter une valeur en dur dans le code :

- [ ] Cette valeur existe-t-elle déjà dans `src/config/` ?
- [ ] Si non, dans quel fichier de config devrait-elle aller ?
- [ ] La valeur est-elle documentée (JSDoc) ?
- [ ] La valeur est-elle typée correctement ?
- [ ] Y a-t-il un helper pour calculer cette valeur ?

---

## 🚀 Prochaines étapes

1. **Migrer le code existant** pour utiliser les configs
2. **Remplacer les imports** de `src/shared/types/coins.ts` par `src/config/rewards.ts`
3. **Utiliser les catalogues** dans les scripts de seed
4. **Centraliser les messages** dans `game.config.ts`

---

## 📝 Notes importantes

- **Immuabilité** : Utiliser `as const` pour toutes les configs
- **Barrel export** : Toujours importer depuis `@/config`
- **Pas de logique métier** : Les configs sont des données, pas de la logique
- **Versionning** : Documenter les changements de valeurs (breaking changes)

---

**Dernière mise à jour** : 6 novembre 2025
**Auteur** : Architecture Tamagotcho
