# 📁 Configuration Files - Tamagotcho

Ce dossier centralise **toutes les configurations** du jeu pour éliminer les valeurs "magiques" du code.

## 🎯 Principe

**Single Source of Truth** : Chaque valeur n'existe qu'à un seul endroit, facilement modifiable.

## 📦 Fichiers disponibles

| Fichier | Description | Constantes principales |
|---------|-------------|------------------------|
| **`index.ts`** | Point d'entrée (barrel export) | - |
| **`rewards.ts`** | Récompenses en Koins | `MONSTER_ACTION_REWARDS`, `LOGIN_REWARDS`, `PROGRESSION_REWARDS` |
| **`accessories.config.ts`** | Catalogue des accessoires | `HATS_CATALOG`, `GLASSES_CATALOG`, `SHOES_CATALOG` |
| **`backgrounds.config.ts`** | Catalogue des arrière-plans | `BACKGROUNDS_CATALOG`, `BACKGROUND_TYPE_LABELS` |
| **`quests.config.ts`** | Quêtes journalières | `DAILY_QUESTS_CATALOG`, `generateDailyQuests()` |
| **`monsters.config.ts`** | Configuration des monstres | `MONSTER_BASE_STATS`, `MONSTER_LEVELING`, `calculateMonsterPrice()` |
| **`shop.config.ts`** | Configuration de la boutique | `RARITY_COLORS`, `CATEGORY_LABELS`, `calculateItemPrice()` |
| **`wallet.config.ts`** | Portefeuille et packages | `INITIAL_WALLET`, `COIN_PACKAGES` |
| **`game.config.ts`** | Configuration globale | `TIME_INTERVALS`, `ERROR_MESSAGES`, `GAME_EMOJIS` |
| **`pricing.ts`** | Produits Stripe | `pricingTable` |

## 🚀 Utilisation rapide

### Import recommandé

```typescript
// ✅ Importer depuis le barrel export
import { 
  REWARDS_CONFIG, 
  SHOP_CONFIG, 
  MONSTERS_CONFIG,
  calculateMonsterPrice 
} from '@/config'
```

### Exemples pratiques

```typescript
// Récompenser une action
import { MONSTER_ACTION_REWARDS } from '@/config'
const reward = MONSTER_ACTION_REWARDS.FEED // 10 Koins

// Calculer le prix d'un monstre
import { calculateMonsterPrice } from '@/config'
const price = calculateMonsterPrice(2) // 50 Koins (3ème monstre)

// Récupérer un accessoire
import { getAccessoriesByCategory } from '@/config'
const hats = getAccessoriesByCategory('hat')

// Générer des quêtes du jour
import { generateDailyQuests } from '@/config'
const quests = generateDailyQuests() // [easy, medium, hard]

// Messages standardisés
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config'
toast.error(ERROR_MESSAGES.INSUFFICIENT_FUNDS)
toast.success(SUCCESS_MESSAGES.MONSTER_FED)
```

## 📖 Documentation complète

Consulte le guide détaillé : **[`docs/CONFIGURATION_GUIDE.md`](../docs/CONFIGURATION_GUIDE.md)**

## ✅ Checklist avant d'ajouter une valeur

- [ ] La valeur existe-t-elle déjà dans une config ?
- [ ] Dans quel fichier devrait-elle aller ?
- [ ] Est-elle documentée avec JSDoc ?
- [ ] Est-elle typée correctement ?
- [ ] Y a-t-il un helper pour la calculer ?

## 🔧 Maintenance

Lors de la modification d'une valeur :

1. ✅ Modifier uniquement dans le fichier de config
2. ✅ Documenter la raison (commentaire)
3. ✅ Vérifier les impacts (rechercher les usages)
4. ⚠️ Attention aux breaking changes (montants de récompenses, prix)

---

**Dernière mise à jour** : 6 novembre 2025
