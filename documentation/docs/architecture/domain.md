---
sidebar_position: 2
---

# Domain Layer

La **Domain Layer** contient la logique métier pure du projet. Elle est **indépendante de tout framework** et représente le cœur de l'application.

## 📦 Structure

```
src/domain/
├── entities/
│   ├── Tamagotchi.ts       # Entité principale
│   └── index.ts
└── repositories/
    ├── ITamagotchiRepository.ts
    └── index.ts
```

## 🎯 Entité Tamagotchi

### Propriétés

```typescript
class Tamagotchi {
  id: string
  name: string
  userId: string
  
  // Stats (0-100)
  health: number
  hunger: number
  happiness: number
  energy: number
  
  // Progression
  level: number
  experience: number
  
  // Métadonnées
  isAlive: boolean
  createdAt: Date
  lastFed?: Date
  lastPlayed?: Date
  lastSlept?: Date
  lastCleaned?: Date
}
```

### Méthodes principales

#### `feed(amount: number): void`
Nourrit le Tamagotchi en réduisant la faim.

```typescript
feed(amount: number): void {
  this.hunger = Math.max(0, this.hunger - amount)
  this.lastFed = new Date()
}
```

**Paramètres** :
- `amount` : Quantité de nourriture (généralement 20-30)

**Effets** :
- Réduit la faim de `amount`
- Met à jour `lastFed`

---

#### `play(duration: number): void`
Joue avec le Tamagotchi, augmente le bonheur mais réduit l'énergie.

```typescript
play(duration: number): void {
  this.happiness = Math.min(100, this.happiness + duration)
  this.energy = Math.max(0, this.energy - (duration / 2))
  this.experience += 10
  this.lastPlayed = new Date()
  this.checkLevelUp()
}
```

**Paramètres** :
- `duration` : Durée du jeu (généralement 15-25)

**Effets** :
- Augmente le bonheur de `duration`
- Réduit l'énergie de `duration / 2`
- Ajoute 10 XP
- Vérifie le level-up

---

#### `sleep(hours: number): void`
Fait dormir le Tamagotchi pour restaurer l'énergie.

```typescript
sleep(hours: number): void {
  this.energy = Math.min(100, this.energy + (hours * 10))
  this.lastSlept = new Date()
}
```

**Paramètres** :
- `hours` : Durée du sommeil (généralement 3-8)

**Effets** :
- Restaure l'énergie de `hours * 10`
- Met à jour `lastSlept`

---

#### `clean(): void`
Nettoie le Tamagotchi, améliore légèrement la santé.

```typescript
clean(): void {
  this.health = Math.min(100, this.health + 5)
  this.lastCleaned = new Date()
}
```

**Effets** :
- Augmente la santé de 5
- Met à jour `lastCleaned`

---

#### `decayHealth(): void`
Applique la **dégradation naturelle** des stats avec le temps.

```typescript
decayHealth(): void {
  // Augmentation naturelle de la faim
  this.hunger = Math.min(100, this.hunger + 5)
  
  // Diminution de l'énergie
  this.energy = Math.max(0, this.energy - 3)
  
  // Calcul de la santé basé sur les stats
  if (this.hunger > 70) {
    this.health = Math.max(0, this.health - 5)
  }
  
  if (this.energy < 30) {
    this.health = Math.max(0, this.health - 3)
  }
  
  if (this.happiness < 30) {
    this.health = Math.max(0, this.health - 2)
  }
  
  // Vérification de la mort
  if (this.health <= 0) {
    this.isAlive = false
  }
}
```

**Appelé automatiquement** toutes les 30 secondes via `/api/tamagotchis/tick`

**Effets** :
- Augmente la faim de 5
- Réduit l'énergie de 3
- Réduit la santé si faim &gt; 70 (-5)
- Réduit la santé si énergie &lt; 30 (-3)
- Réduit la santé si bonheur &lt; 30 (-2)
- Marque comme mort si santé &lt;= 0

---

#### `checkLevelUp(): void`
Vérifie et applique le level-up si l'XP est suffisante.

```typescript
private checkLevelUp(): void {
  const xpNeeded = this.level * 50
  
  if (this.experience >= xpNeeded) {
    this.level++
    this.experience -= xpNeeded
    this.health = Math.min(100, this.health + 20) // Bonus de santé
  }
}
```

**Formule** : XP nécessaire = `niveau * 50`

**Effets** :
- Augmente le niveau de 1
- Soustrait l'XP dépensée
- Bonus de +20 santé

---

## 🔌 Interface Repository

```typescript
interface ITamagotchiRepository {
  save(tamagotchi: Tamagotchi): Promise<void>
  findById(id: string): Promise<Tamagotchi | null>
  findByUserId(userId: string): Promise<Tamagotchi[]>
  applyDecayToAll(): Promise<void>
}
```

Cette interface définit le **contrat** que doivent respecter les implémentations de repository (MongoDB, PostgreSQL, etc.).

## ✅ Règles de la Domain Layer

1. **Aucune dépendance externe** : Pas d'import React, Next.js, MongoDB, etc.
2. **Logique métier pure** : Uniquement des calculs et règles de jeu
3. **Immuabilité** : Les méthodes modifient l'état interne de manière contrôlée
4. **Validation** : Les stats sont toujours entre 0 et 100
5. **Testabilité** : Facilement testable en isolation

---

Prochaine étape : [Application Layer](/docs/architecture/application) 🚀
