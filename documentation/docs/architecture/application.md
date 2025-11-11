---
sidebar_position: 3
---

# Application Layer

La **Application Layer** orchestre les use cases en utilisant la logique métier du Domain.

## 📦 Structure

```
src/application/
└── use-cases/
    ├── FeedTamagotchiUseCase.ts
    ├── PlayWithTamagotchiUseCase.ts
    ├── SleepTamagotchiUseCase.ts
    ├── CleanTamagotchiUseCase.ts
    ├── GetTamagotchiUseCase.ts
    ├── GetUserTamagotchisUseCase.ts
    ├── ApplyHealthDecayUseCase.ts
    └── index.ts
```

## 🎯 Use Cases

Chaque use case encapsule **une action métier complète**.

### FeedTamagotchiUseCase

Nourrit un Tamagotchi spécifique.

```typescript
class FeedTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(id: string, foodAmount: number): Promise<void> {
    const tamagotchi = await this.repository.findById(id)
    
    if (!tamagotchi) {
      throw new Error('Tamagotchi not found')
    }
    
    if (!tamagotchi.isAlive) {
      throw new Error('Cannot feed a dead Tamagotchi')
    }
    
    tamagotchi.feed(foodAmount)
    await this.repository.save(tamagotchi)
  }
}
```

**Paramètres** :
- `id` : ID du Tamagotchi
- `foodAmount` : Quantité de nourriture (20-30)

**Étapes** :
1. Récupère le Tamagotchi
2. Vérifie qu'il existe et est vivant
3. Applique l'action `feed()`
4. Sauvegarde en base

---

### PlayWithTamagotchiUseCase

Joue avec un Tamagotchi pour augmenter son bonheur.

```typescript
class PlayWithTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(id: string, duration: number): Promise<void> {
    const tamagotchi = await this.repository.findById(id)
    
    if (!tamagotchi) {
      throw new Error('Tamagotchi not found')
    }
    
    if (!tamagotchi.isAlive) {
      throw new Error('Cannot play with a dead Tamagotchi')
    }
    
    tamagotchi.play(duration)
    await this.repository.save(tamagotchi)
  }
}
```

**Paramètres** :
- `id` : ID du Tamagotchi
- `duration` : Durée du jeu (15-25)

**Effets** :
- Augmente le bonheur
- Réduit l'énergie
- Ajoute de l'XP
- Peut déclencher un level-up

---

### SleepTamagotchiUseCase

Fait dormir un Tamagotchi pour restaurer son énergie.

```typescript
class SleepTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(id: string, hours: number): Promise<void> {
    const tamagotchi = await this.repository.findById(id)
    
    if (!tamagotchi) {
      throw new Error('Tamagotchi not found')
    }
    
    if (!tamagotchi.isAlive) {
      throw new Error('Cannot make a dead Tamagotchi sleep')
    }
    
    tamagotchi.sleep(hours)
    await this.repository.save(tamagotchi)
  }
}
```

**Paramètres** :
- `id` : ID du Tamagotchi
- `hours` : Heures de sommeil (3-8)

---

### CleanTamagotchiUseCase

Nettoie un Tamagotchi.

```typescript
class CleanTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(id: string): Promise<void> {
    const tamagotchi = await this.repository.findById(id)
    
    if (!tamagotchi) {
      throw new Error('Tamagotchi not found')
    }
    
    if (!tamagotchi.isAlive) {
      throw new Error('Cannot clean a dead Tamagotchi')
    }
    
    tamagotchi.clean()
    await this.repository.save(tamagotchi)
  }
}
```

---

### GetTamagotchiUseCase

Récupère un Tamagotchi par son ID.

```typescript
class GetTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(id: string): Promise<Tamagotchi | null> {
    return await this.repository.findById(id)
  }
}
```

---

### GetUserTamagotchisUseCase

Récupère tous les Tamagotchis d'un utilisateur.

```typescript
class GetUserTamagotchisUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(userId: string): Promise<Tamagotchi[]> {
    return await this.repository.findByUserId(userId)
  }
}
```

---

### ApplyHealthDecayUseCase

Applique la dégradation naturelle à tous les Tamagotchis.

```typescript
class ApplyHealthDecayUseCase {
  constructor(private repository: ITamagotchiRepository) {}

  async execute(): Promise<void> {
    await this.repository.applyDecayToAll()
  }
}
```

**Usage** : Appelé toutes les 30 secondes par `/api/tamagotchis/tick`

---

## 🔄 Injection de dépendances

Les use cases reçoivent le repository via le **constructeur** (Dependency Injection).

```typescript
// Instanciation
const repository = new TamagotchiRepository()
const useCase = new FeedTamagotchiUseCase(repository)

// Exécution
await useCase.execute(tamagotchiId, 25)
```

## ✅ Règles de l'Application Layer

1. **Orchestration** : Coordonne le Domain et l'Infrastructure
2. **Pas de logique métier** : Délègue au Domain
3. **Validation des entrées** : Vérifie que le Tamagotchi existe et est vivant
4. **Gestion d'erreurs** : Lève des exceptions explicites
5. **Dépend du Domain** : Utilise les interfaces, pas les implémentations

---

Prochaine étape : [Infrastructure Layer](/docs/architecture/infrastructure) 🚀
