---
sidebar_position: 1
---

# Système de Monstres

Le système de monstres (Tamagotchis) est le cœur de l'application.

## 🐾 Création de Monstre

### Formulaire de création

Les utilisateurs peuvent créer un nouveau monstre via un formulaire.

```tsx
<CreateMonsterForm />
```

**Champs** :
- `name` : Nom du monstre (requis, 3-20 caractères)
- `type` : Type de monstre (optionnel)

### Validation

Utilise **Zod** + **React Hook Form** :

```typescript
const createMonsterSchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(20, 'Le nom ne peut pas dépasser 20 caractères'),
  type: z.string().optional(),
})
```

### Server Action

```typescript
'use server'

export async function createMonster(data: CreateMonsterFormValues) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Non authentifié')
  }

  await connectDB()
  
  const monster = await MonsterModel.create({
    name: data.name,
    userId: session.user.id,
    health: 100,
    hunger: 0,
    happiness: 50,
    energy: 100,
    level: 1,
    experience: 0,
    isAlive: true,
  })

  redirect(`/creature/${monster._id}`)
}
```

---

## 📊 Stats du Monstre

Chaque monstre possède 4 stats principales (0-100) :

### 💚 Santé (Health)

- **Valeur initiale** : 100
- **Diminue si** :
  - Faim > 70 : -5 par tick
  - Énergie < 30 : -3 par tick
  - Bonheur < 30 : -2 par tick
- **Augmente si** :
  - Nettoyage : +5
  - Level-up : +20

**⚠️ Si santé = 0** : Le monstre meurt (`isAlive = false`)

---

### 🍖 Faim (Hunger)

- **Valeur initiale** : 0
- **Augmente** : +5 tous les 30 secondes (tick naturel)
- **Diminue** : Action "Nourrir" (-20 à -30)

**Indicateur** :
- < 30 : Rassasié 😊
- 30-70 : Normal 😐
- > 70 : Affamé 😋 (pénalité de santé)

---

### 😊 Bonheur (Happiness)

- **Valeur initiale** : 50
- **Augmente** : Action "Jouer" (+15 à +25)
- **Diminue** : Inactivité prolongée

**Indicateur** :
- > 70 : Heureux 🙂
- 30-70 : Normal 😐
- < 30 : Triste 😢 (pénalité de santé)

---

### ⚡ Énergie (Energy)

- **Valeur initiale** : 100
- **Augmente** : Action "Dormir" (+30 à +80 selon heures)
- **Diminue** :
  - Tick naturel : -3
  - Action "Jouer" : -(durée/2)

**Indicateur** :
- > 70 : Énergique ⚡
- 30-70 : Normal 😐
- < 30 : Fatigué 😴 (pénalité de santé)

---

## 🎮 Actions disponibles

### 🍖 Nourrir

- **Effet** : Réduit la faim de 25
- **Temps de recharge** : Aucun
- **Condition** : Monstre vivant

```typescript
await feedMonster(monsterId)
```

---

### 🎮 Jouer

- **Effets** :
  - Augmente le bonheur de 20
  - Réduit l'énergie de 10
  - Ajoute 10 XP
  - Peut déclencher un level-up
- **Temps de recharge** : Aucun
- **Condition** : Monstre vivant, énergie > 10

```typescript
await playWithMonster(monsterId)
```

---

### 😴 Dormir

- **Effet** : Restaure l'énergie de 50 (5 heures)
- **Temps de recharge** : Aucun
- **Condition** : Monstre vivant

```typescript
await sleepMonster(monsterId)
```

---

### 🧹 Nettoyer

- **Effet** : Augmente légèrement la santé (+5)
- **Temps de recharge** : Aucun
- **Condition** : Monstre vivant

```typescript
await cleanMonster(monsterId)
```

---

## 📈 Système de Progression

### Niveaux

- **Niveau initial** : 1
- **XP nécessaire** : `niveau * 50`
  - Niveau 1 → 2 : 50 XP
  - Niveau 2 → 3 : 100 XP
  - Niveau 3 → 4 : 150 XP
  - etc.

### Gain d'XP

- **Jouer** : +10 XP par action

### Récompenses de Level-Up

- Niveau augmenté de 1
- XP réinitialisée (surplus conservé)
- **Bonus** : +20 santé

---

## ⏱️ Système de Tick (Dégradation)

Un **tick** est déclenché automatiquement toutes les **30 secondes**.

### Effets du tick

```typescript
// Augmentation naturelle
hunger += 5
energy -= 3

// Pénalités de santé
if (hunger > 70) health -= 5
if (energy < 30) health -= 3
if (happiness < 30) health -= 2

// Vérification de mort
if (health <= 0) isAlive = false
```

### Implémentation

```tsx
// Hook côté client
function useAutoRefresh() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch('/api/tamagotchis/tick', { method: 'POST' })
    }, 30000)

    return () => clearInterval(interval)
  }, [])
}
```

---

## 💀 Mort du Monstre

Un monstre meurt quand sa **santé atteint 0**.

**Conséquences** :
- `isAlive = false`
- Plus d'actions possibles
- Affichage visuel différent (grisé, icône 💀)
- Le monstre reste dans la base mais inactif

**Ressuscitation** : Non implémentée (pourrait être une future fonctionnalité)

---

## 🎨 Affichage des Stats

Les stats sont affichées avec des **barres de progression colorées** :

```tsx
<StatBar 
  label="Santé" 
  value={health} 
  color="red" 
  max={100} 
/>
```

**Couleurs** :
- Santé : Rouge
- Faim : Orange
- Bonheur : Jaune
- Énergie : Bleu

---

Prochaine étape : [Authentification](/docs/features/authentication) 🚀
