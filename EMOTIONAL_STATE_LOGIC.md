# Logique des États Émotionnels du Tamagotchi

## 📊 Système Dynamique d'État

L'état émotionnel du monstre est **automatiquement calculé** en fonction de ses 3 statistiques (hunger, energy, happiness) après chaque interaction.

---

## 🎭 États Disponibles

| État | Emoji | Condition |
|------|-------|-----------|
| **happy** 😄 | Heureux | Toutes les stats ≥ 80% |
| **hungry** 😋 | Affamé | Hunger est la stat la plus basse |
| **sleepy** 😴 | Somnolent | Energy est la stat la plus basse |
| **sad** 😢 | Triste | Happiness est la stat la plus basse |
| **angry** 😤 | En colère | Une stat < 20% (CRITIQUE) |

---

## 🧮 Algorithme de Calcul

### Fonction `calculateMonsterState(hunger, energy, happiness)`

```typescript
function calculateMonsterState(
  hunger: number,
  energy: number,
  happiness: number
): MonsterState {
  // 1. CAS CRITIQUE (priorité absolue)
  if (hunger < 20 || energy < 20 || happiness < 20) {
    return 'angry' // 😤 Une stat est dangereusement basse !
  }

  // 2. CAS OPTIMAL
  if (hunger >= 80 && energy >= 80 && happiness >= 80) {
    return 'happy' // 😄 Tout va bien !
  }

  // 3. CAS NORMAL : Identifier la stat la plus basse
  const minStat = Math.min(hunger, energy, happiness)

  // Priorité en cas d'égalité : hunger > energy > happiness
  if (hunger === minStat) return 'hungry'  // 😋 Besoin de nourriture
  if (energy === minStat) return 'sleepy'  // 😴 Besoin de repos
  if (happiness === minStat) return 'sad'  // 😢 Besoin d'attention
  
  return 'happy' // Fallback
}
```

---

## 📐 Exemples de Calcul

### Exemple 1 : Monstre en pleine forme
```
hunger: 100, energy: 100, happiness: 100
→ État: happy 😄
Toutes les stats ≥ 80
```

### Exemple 2 : Monstre affamé
```
hunger: 30, energy: 70, happiness: 60
→ État: hungry 😋
hunger (30) est la plus basse
```

### Exemple 3 : Monstre fatigué
```
hunger: 80, energy: 40, happiness: 70
→ État: sleepy 😴
energy (40) est la plus basse
```

### Exemple 4 : Monstre triste
```
hunger: 70, energy: 65, happiness: 35
→ État: sad 😢
happiness (35) est la plus basse
```

### Exemple 5 : Monstre en colère (critique)
```
hunger: 15, energy: 50, happiness: 60
→ État: angry 😤
hunger < 20 → cas critique !
```

### Exemple 6 : Égalité entre stats
```
hunger: 40, energy: 40, happiness: 60
→ État: hungry 😋
hunger et energy sont égales (40), hunger a la priorité
```

---

## 🎮 Impact des Actions

### 🍖 Nourrir (Feed)
- **Effet** : +20 hunger
- **Exemple** :
  ```
  Avant : hunger=30, energy=70, happiness=60 → hungry 😋
  Après : hunger=50, energy=70, happiness=60 → sleepy 😴
  (maintenant energy est la plus basse)
  ```

### 🎾 Jouer (Play)
- **Effet** : +20 happiness, -10 energy
- **Exemple** :
  ```
  Avant : hunger=70, energy=80, happiness=40 → sad 😢
  Après : hunger=70, energy=70, happiness=60 → happy 😄
  (toutes les stats ≥ 60, équilibrées)
  ```

### 😴 Dormir (Sleep)
- **Effet** : +30 energy
- **Exemple** :
  ```
  Avant : hunger=60, energy=30, happiness=60 → sleepy 😴
  Après : hunger=60, energy=60, happiness=60 → happy 😄
  (toutes les stats équilibrées)
  ```

### 🧼 Nettoyer (Clean)
- **Effet** : +15 happiness
- **Exemple** :
  ```
  Avant : hunger=80, energy=85, happiness=50 → sad 😢
  Après : hunger=80, energy=85, happiness=65 → happy 😄
  (toutes les stats > 60)
  ```

---

## 🔄 Scénarios Complexes

### Scénario 1 : Négligence Totale
```
État initial : 100/100/100 → happy 😄

Après 1h sans interaction :
- Décrémentation naturelle → 80/80/80 → happy 😄

Après 2h :
- Décrémentation → 60/60/60 → happy 😄 (limite)

Après 3h :
- Décrémentation → 40/40/40 → hungry 😋 (priorité hunger)

Après 4h :
- Décrémentation → 20/20/20 → hungry 😋

Après 5h :
- Décrémentation → 10/10/10 → angry 😤 (CRITIQUE !)
```

### Scénario 2 : Interaction Optimale
```
État critique : 15/15/15 → angry 😤

Action 1 : Nourrir
→ 35/15/15 → angry 😤 (energy et happiness toujours < 20)

Action 2 : Dormir
→ 35/45/15 → angry 😤 (happiness toujours < 20)

Action 3 : Nettoyer
→ 35/45/30 → sleepy 😴 (plus de critique, energy la plus basse)

Action 4 : Dormir
→ 35/75/30 → hungry 😋 (hunger maintenant la plus basse)

Action 5 : Nourrir
→ 55/75/30 → sad 😢 (happiness maintenant la plus basse)

Action 6 : Jouer
→ 55/65/50 → happy 😄 (toutes > 50, équilibré)
```

---

## 🎯 Priorités en Cas d'Égalité

Si plusieurs stats ont la même valeur minimale, l'ordre de priorité est :

1. **hunger** (faim) → `hungry` 😋
2. **energy** (énergie) → `sleepy` 😴
3. **happiness** (bonheur) → `sad` 😢

**Pourquoi cet ordre ?**
- La faim est un besoin vital primaire
- L'énergie est nécessaire pour survivre
- Le bonheur vient après les besoins de base

---

## ⚠️ Seuils Critiques

### Zone Rouge (< 20%)
- **État** : `angry` 😤
- **Risque** : Monstre en danger
- **Action** : Intervention urgente requise !

### Zone Orange (20-39%)
- **État** : Dépend de la stat la plus basse
- **Risque** : Situation préoccupante
- **Action** : Attention recommandée

### Zone Jaune (40-79%)
- **État** : Dépend de la stat la plus basse
- **Risque** : Situation normale
- **Action** : Interactions régulières

### Zone Verte (≥ 80%)
- **État** : `happy` 😄
- **Risque** : Aucun
- **Action** : Tout va bien !

---

## 🔧 Implémentation Technique

### Localisation
- **Fichier** : `src/actions/monsters/monsters.actions.ts`
- **Fonction** : `calculateMonsterState(hunger, energy, happiness)`

### Appels
La fonction est appelée automatiquement après chaque action :
- ✅ `feedMonster()` → recalcule l'état
- ✅ `playWithMonster()` → recalcule l'état
- ✅ `sleepMonster()` → recalcule l'état
- ✅ `cleanMonster()` → recalcule l'état

### Persistance
- L'état est sauvegardé dans MongoDB
- Le cache Next.js est revalidé (`revalidatePath`)
- L'interface se met à jour automatiquement

---

## 📱 Affichage Visuel

Le badge d'état s'affiche sur :
1. **Card du monstre** (dashboard) : Badge en haut à droite
2. **Avatar du monstre** (page détail) : Badge sur l'image

Les emojis et labels changent automatiquement :
- 😄 "Heureux"
- 😋 "Affamé"
- 😴 "Somnolent"
- 😢 "Triste"
- 😤 "Fâché"

---

## 🎓 Conseils pour le Joueur

### Pour garder un monstre `happy` 😄 :
1. Maintenir toutes les stats ≥ 80%
2. Interactions régulières et équilibrées
3. Ne jamais laisser une stat descendre sous 20%

### Pour récupérer d'un état `angry` 😤 :
1. Identifier la(les) stat(s) < 20%
2. Prioriser les actions pour cette stat
3. Équilibrer progressivement les autres stats

### Stratégie optimale :
- Nourrir régulièrement (maintient hunger)
- Alterner jouer et dormir (balance happiness/energy)
- Nettoyer pour des boosts de happiness

---

## 🔮 Évolutions Futures Possibles

- 📉 Décrémentation automatique des stats avec le temps
- 🎚️ Ajustement des seuils selon le niveau
- 🏆 Système de récompenses pour maintenir `happy`
- 💀 Système de mort si stats trop basses trop longtemps
- 🌟 États spéciaux (excited, bored, scared)
- 📊 Historique des changements d'état

---

**Dernière mise à jour** : 27 octobre 2025  
**Version** : 1.0.0
