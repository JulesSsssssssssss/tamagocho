---
sidebar_position: 3
---

# Use Cases Reference

Référence complète de tous les use cases de l'application.

## 📚 Vue d'ensemble

Les **Use Cases** sont dans `src/application/use-cases/` et orchestrent la logique métier.

Chaque use case :
- Prend un `ITamagotchiRepository` en dépendance
- Exécute UNE action métier
- Valide les entrées
- Délègue au Domain
- Persiste les changements

---

## 🍖 FeedTamagotchiUseCase

Nourrit un Tamagotchi pour réduire sa faim.

### Signature

```typescript
class FeedTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(id: string, foodAmount: number): Promise<void>
}
```

### Paramètres

- `id` : ID du Tamagotchi à nourrir
- `foodAmount` : Quantité de nourriture (recommandé: 20-30)

### Comportement

1. Récupère le Tamagotchi depuis le repository
2. Vérifie qu'il existe
3. Vérifie qu'il est vivant (`isAlive = true`)
4. Appelle `tamagotchi.feed(foodAmount)`
5. Sauvegarde via `repository.save()`

### Erreurs

- `Error('Tamagotchi not found')` : ID invalide
- `Error('Cannot feed a dead Tamagotchi')` : Monstre mort

### Exemple

```typescript
const repository = new TamagotchiRepository()
const useCase = new FeedTamagotchiUseCase(repository)

await useCase.execute('507f1f77bcf86cd799439011', 25)
// ✅ Faim réduite de 25
```

---

## 🎮 PlayWithTamagotchiUseCase

Joue avec un Tamagotchi pour augmenter son bonheur et gagner de l'XP.

### Signature

```typescript
class PlayWithTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(id: string, duration: number): Promise<void>
}
```

### Paramètres

- `id` : ID du Tamagotchi
- `duration` : Durée du jeu (recommandé: 15-25)

### Comportement

1. Récupère le Tamagotchi
2. Vérifie qu'il existe et est vivant
3. Appelle `tamagotchi.play(duration)`
   - Bonheur +`duration`
   - Énergie -`duration/2`
   - XP +10
   - Vérifie level-up
4. Sauvegarde

### Effets secondaires

Peut déclencher un **level-up** si l'XP est suffisante.

### Exemple

```typescript
await useCase.execute('507f1f77bcf86cd799439011', 20)
// ✅ Bonheur +20
// ✅ Énergie -10
// ✅ XP +10
// ⭐ Possible level-up
```

---

## 😴 SleepTamagotchiUseCase

Fait dormir un Tamagotchi pour restaurer son énergie.

### Signature

```typescript
class SleepTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(id: string, hours: number): Promise<void>
}
```

### Paramètres

- `id` : ID du Tamagotchi
- `hours` : Heures de sommeil (recommandé: 3-8)

### Comportement

1. Récupère le Tamagotchi
2. Vérifie qu'il existe et est vivant
3. Appelle `tamagotchi.sleep(hours)`
   - Énergie +`hours * 10`
4. Sauvegarde

### Formule

```
Énergie restaurée = hours * 10
```

### Exemple

```typescript
await useCase.execute('507f1f77bcf86cd799439011', 5)
// ✅ Énergie +50 (5 * 10)
```

---

## 🧹 CleanTamagotchiUseCase

Nettoie un Tamagotchi pour améliorer sa santé.

### Signature

```typescript
class CleanTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(id: string): Promise<void>
}
```

### Paramètres

- `id` : ID du Tamagotchi

### Comportement

1. Récupère le Tamagotchi
2. Vérifie qu'il existe et est vivant
3. Appelle `tamagotchi.clean()`
   - Santé +5
4. Sauvegarde

### Exemple

```typescript
await useCase.execute('507f1f77bcf86cd799439011')
// ✅ Santé +5
```

---

## 🔍 GetTamagotchiUseCase

Récupère un Tamagotchi par son ID.

### Signature

```typescript
class GetTamagotchiUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(id: string): Promise<Tamagotchi | null>
}
```

### Paramètres

- `id` : ID du Tamagotchi

### Comportement

Délègue directement au `repository.findById()`

### Retour

- `Tamagotchi` : Si trouvé
- `null` : Si introuvable

### Exemple

```typescript
const tamagotchi = await useCase.execute('507f1f77bcf86cd799439011')

if (tamagotchi) {
  console.log(tamagotchi.name, tamagotchi.health)
}
```

---

## 📋 GetUserTamagotchisUseCase

Récupère tous les Tamagotchis d'un utilisateur.

### Signature

```typescript
class GetUserTamagotchisUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(userId: string): Promise<Tamagotchi[]>
}
```

### Paramètres

- `userId` : ID de l'utilisateur

### Comportement

Délègue directement au `repository.findByUserId()`

### Retour

Array de `Tamagotchi` (peut être vide)

### Exemple

```typescript
const monsters = await useCase.execute('user123')
// [Tamagotchi, Tamagotchi, ...]
```

---

## ⏱️ ApplyHealthDecayUseCase

Applique la dégradation naturelle à tous les Tamagotchis vivants.

### Signature

```typescript
class ApplyHealthDecayUseCase {
  constructor(private repository: ITamagotchiRepository)
  
  async execute(): Promise<void>
}
```

### Paramètres

Aucun

### Comportement

1. Récupère tous les Tamagotchis vivants
2. Pour chacun :
   - Appelle `tamagotchi.decayHealth()`
     - Faim +5
     - Énergie -3
     - Santé réduite si stats critiques
     - Vérifie la mort
   - Sauvegarde

### Usage

Appelé automatiquement toutes les **30 secondes** via `/api/tamagotchis/tick`

### Exemple

```typescript
// Appelé par le endpoint API
await useCase.execute()
// ✅ Tous les Tamagotchis vivants ont été dégradés
```

---

## 🔄 Flux d'exécution type

```
Server Action
     ↓
Instanciation Repository
     ↓
Instanciation Use Case
     ↓
use execute()
     ↓
Repository → Domain Entity
     ↓
Modification Entity
     ↓
Repository → Persistence
```

### Exemple complet

```typescript
// Server Action
export async function feedMonster(formData: FormData) {
  const id = formData.get('id') as string
  
  // 1. Instanciation
  const repository = new TamagotchiRepository()
  const useCase = new FeedTamagotchiUseCase(repository)
  
  // 2. Exécution
  await useCase.execute(id, 25)
  
  // 3. Revalidation
  revalidatePath(`/creature/${id}`)
}
```

---

## ✅ Conventions

1. **Un use case = une action métier**
2. **Injection du repository** via constructeur
3. **Méthode `execute()`** pour déclencher l'action
4. **Validation des inputs** dans le use case
5. **Erreurs explicites** avec messages clairs
6. **Pas de logique métier** : déléguer au Domain

---

## 🧪 Tests

Les use cases sont facilement testables avec des **mocks** :

```typescript
describe('FeedTamagotchiUseCase', () => {
  it('should reduce hunger', async () => {
    // Mock repository
    const mockRepo: ITamagotchiRepository = {
      findById: jest.fn().mockResolvedValue(tamagotchi),
      save: jest.fn(),
      // ...
    }
    
    const useCase = new FeedTamagotchiUseCase(mockRepo)
    await useCase.execute('123', 25)
    
    expect(mockRepo.save).toHaveBeenCalled()
    expect(tamagotchi.hunger).toBe(0) // Était à 25
  })
})
```

---

Fin de la documentation des Use Cases ! 🚀
