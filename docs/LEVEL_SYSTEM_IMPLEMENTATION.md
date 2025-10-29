# 🎮 Implémentation du Système de Niveaux

## 📋 Vue d'ensemble

Ce document décrit l'implémentation du système de progression par niveaux et XP (expérience) dans le projet Tamagotcho.

---

## ⚙️ Fonctionnement du système

### 1️⃣ Gain d'XP
- **Chaque action réussie** (nourrir, jouer, dormir, nettoyer) rapporte **+10 XP**
- Les constantes sont définies dans `src/shared/types/monster.ts` :
  - `XP_GAIN_PER_ACTION = 10`
  - `XP_PER_LEVEL = 100`

### 2️⃣ Calcul du niveau
La formule utilisée est :
```typescript
level = Math.floor(xp / 100) + 1
```

**Tableaux de progression** :
| XP | Niveau |
|----|--------|
| 0-99 | 1 |
| 100-199 | 2 |
| 200-299 | 3 |
| 300-399 | 4 |
| ... | ... |

### 3️⃣ XP requis pour le prochain niveau
```typescript
xpToNextLevel = level * 100
```

**Exemple** :
- Niveau 1 → 100 XP requis
- Niveau 2 → 200 XP requis
- Niveau 3 → 300 XP requis

---

## 🔧 Modifications apportées

### 1. Imports ajoutés (`monsters.actions.ts`)
```typescript
import { XP_GAIN_PER_ACTION, XP_PER_LEVEL } from '@/shared/types/monster'
```

### 2. Fonction `calculateLevelFromXp()`
Nouvelle fonction utilitaire pour calculer le niveau et l'XP requis :

```typescript
/**
 * Calcule le niveau en fonction de l'XP actuel
 * Formule : Niveau = floor(xp / 100) + 1
 */
function calculateLevelFromXp (xp: number): { 
  level: number
  xpToNextLevel: number 
} {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpToNextLevel = level * XP_PER_LEVEL
  return { level, xpToNextLevel }
}
```

### 3. Mise à jour des actions

Toutes les actions (`feedMonster`, `playWithMonster`, `sleepMonster`, `cleanMonster`) ont été mises à jour pour :

1. **Récupérer l'XP actuel**
```typescript
const currentXp = Number(monster.xp ?? 0)
```

2. **Ajouter les points d'XP**
```typescript
const newXp = currentXp + XP_GAIN_PER_ACTION
```

3. **Recalculer le niveau**
```typescript
const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)
```

4. **Mettre à jour les champs du monstre**
```typescript
monster.xp = newXp
monster.level = newLevel
monster.xpToNextLevel = newXpToNextLevel
```

5. **Sauvegarder** (appel automatique à `monster.save()`)

---

## 📊 Schéma MongoDB

Les champs suivants sont déjà présents dans le modèle `Monster` :

```typescript
{
  level: {
    type: Number,
    default: 1
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  xpToNextLevel: {
    type: Number,
    default: 100
  }
}
```

---

## 🎯 Exemple de progression

### Scénario : Nouveau monstre

**État initial** :
- XP : 0
- Niveau : 1
- XP requis : 100

**Actions effectuées** :
1. Nourrir → XP : 10, Niveau : 1
2. Jouer → XP : 20, Niveau : 1
3. Dormir → XP : 30, Niveau : 1
4. ... (x7 autres actions)
5. Action 10 → XP : 100, **Niveau : 2** ✨

**Passage au niveau 2** :
- XP : 100
- Niveau : 2
- XP requis : 200

---

## 🧪 Tests manuels recommandés

### Test 1 : Vérification du gain d'XP
1. Créer un nouveau monstre
2. Effectuer une action (ex: nourrir)
3. Vérifier dans les logs : `xp: 10, level: 1`
4. Répéter 9 fois
5. À la 10ème action → `xp: 100, level: 2` ✅

### Test 2 : Passage de niveau
1. Monstre avec 95 XP, niveau 1
2. Effectuer 1 action → `xp: 105, level: 2` ✅

### Test 3 : Persistance en base
1. Effectuer des actions
2. Rafraîchir la page
3. Vérifier que l'XP et le niveau sont conservés ✅

---

## 📝 Logs de débogage

Les logs suivants ont été ajoutés pour faciliter le débogage :

```typescript
console.log('📊 After [action] - ..., xp:', monster.xp, 'level:', monster.level)
```

**Exemple de sortie** :
```
📊 Before feeding - hunger: 30, state: hungry
📊 After feeding - hunger: 50, state: happy, xp: 10, level: 1
✅ Monster saved successfully
```

---

## 🔗 Fichiers modifiés

| Fichier | Changements |
|---------|-------------|
| `src/actions/monsters/monsters.actions.ts` | ✅ Ajout de `calculateLevelFromXp()` |
| | ✅ Mise à jour de `feedMonster()` |
| | ✅ Mise à jour de `playWithMonster()` |
| | ✅ Mise à jour de `sleepMonster()` |
| | ✅ Mise à jour de `cleanMonster()` |
| `src/shared/types/monster.ts` | ⚠️ Constantes déjà présentes |
| `src/db/models/monster.model.ts` | ⚠️ Schéma déjà à jour |

---

## ✅ Checklist d'implémentation

- [x] Import des constantes `XP_GAIN_PER_ACTION` et `XP_PER_LEVEL`
- [x] Fonction `calculateLevelFromXp()` créée
- [x] `feedMonster()` met à jour l'XP et le niveau
- [x] `playWithMonster()` met à jour l'XP et le niveau
- [x] `sleepMonster()` met à jour l'XP et le niveau
- [x] `cleanMonster()` met à jour l'XP et le niveau
- [x] Logs de débogage ajoutés
- [x] Aucune erreur TypeScript

---

## 🚀 Prochaines étapes

### Améliorations possibles :
1. **Notification visuelle** lors du level-up (animation, toast)
2. **Récompenses** au passage de niveau (boost de stats, items)
3. **Limite de niveau** (ex: niveau max 100)
4. **Système de prestige** (reset au niveau 1 avec bonus)
5. **Leaderboard** (classement des monstres par niveau)

### Système de bonus de niveau (optionnel) :
```typescript
// Exemple : +20 de santé max à chaque niveau
if (newLevel > monster.level) {
  monster.hunger = Math.min(100, monster.hunger + 20)
  monster.energy = Math.min(100, monster.energy + 20)
  monster.happiness = Math.min(100, monster.happiness + 20)
}
```

---

## 📚 Références

- Système inspiré du repository : `RiusmaX/tamagotcho`
- Formule de calcul : Niveau linéaire (100 XP par niveau)
- Clean Architecture : Logique métier dans les actions, UI dans les composants

---

**Date de mise à jour** : 29 octobre 2025  
**Auteur** : GitHub Copilot  
**Version** : 1.0
