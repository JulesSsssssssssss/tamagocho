---
sidebar_position: 2
---

# Server Actions

Les **Server Actions** sont des fonctions serveur de Next.js qui orchestrent les use cases.

## 📍 Localisation

```
src/actions/monsters/monsters.actions.ts
```

---

## 🐾 Actions Monsters

### createMonster

Crée un nouveau monstre pour l'utilisateur connecté.

```typescript
'use server'

export async function createMonster(
  monsterData: CreateMonsterFormValues
): Promise<void>
```

**Paramètres** :
- `monsterData.name` : Nom du monstre (3-20 caractères)
- `monsterData.type` : Type du monstre (optionnel)

**Comportement** :
1. Vérifie l'authentification
2. Valide les données avec Zod
3. Connecte à MongoDB
4. Crée le monstre avec stats initiales
5. Redirige vers `/creature/[id]`

**Exemple** :

```typescript
await createMonster({ 
  name: 'Pikachu', 
  type: 'Electric' 
})
// ➡️ Redirige vers /creature/507f1f77bcf86cd799439011
```

**Erreurs** :
- Lève une erreur si non authentifié
- Lève une erreur si validation échoue

---

### getMonsters

Récupère tous les monstres de l'utilisateur connecté.

```typescript
'use server'

export async function getMonsters(): Promise<DBMonster[]>
```

**Retourne** : Array de `DBMonster`

**Comportement** :
1. Vérifie l'authentification
2. Connecte à MongoDB
3. Récupère tous les monstres de l'utilisateur

**Exemple** :

```typescript
const monsters = await getMonsters()
// [
//   { _id: '...', name: 'Pikachu', health: 85, ... },
//   { _id: '...', name: 'Charmander', health: 92, ... }
// ]
```

---

### getMonsterById

Récupère un monstre spécifique par son ID.

```typescript
'use server'

export async function getMonsterById(
  id: string
): Promise<DBMonster | null>
```

**Paramètres** :
- `id` : ID MongoDB du monstre

**Retourne** : `DBMonster` ou `null` si introuvable

**Exemple** :

```typescript
const monster = await getMonsterById('507f1f77bcf86cd799439011')
// { _id: '507f1f77bcf86cd799439011', name: 'Pikachu', ... }
```

---

### feedMonster

Nourrit un monstre (réduit la faim).

```typescript
'use server'

export async function feedMonster(
  formData: FormData
): Promise<void>
```

**Paramètres** :
- `formData.get('id')` : ID du monstre

**Comportement** :
1. Récupère l'ID depuis FormData
2. Instancie le repository
3. Exécute `FeedTamagotchiUseCase` avec `amount = 25`
4. Revalide le cache de la page créature

**Exemple** :

```tsx
<form action={feedMonster}>
  <input type="hidden" name="id" value={monsterId} />
  <Button type="submit">🍖 Nourrir</Button>
</form>
```

---

### playWithMonster

Joue avec un monstre (augmente bonheur, réduit énergie, ajoute XP).

```typescript
'use server'

export async function playWithMonster(
  formData: FormData
): Promise<void>
```

**Paramètres** :
- `formData.get('id')` : ID du monstre

**Comportement** :
1. Récupère l'ID depuis FormData
2. Instancie le repository
3. Exécute `PlayWithTamagotchiUseCase` avec `duration = 20`
4. Revalide le cache

**Exemple** :

```tsx
<form action={playWithMonster}>
  <input type="hidden" name="id" value={monsterId} />
  <Button type="submit">🎮 Jouer</Button>
</form>
```

---

### sleepMonster

Fait dormir un monstre (restaure l'énergie).

```typescript
'use server'

export async function sleepMonster(
  formData: FormData
): Promise<void>
```

**Paramètres** :
- `formData.get('id')` : ID du monstre

**Comportement** :
1. Récupère l'ID depuis FormData
2. Instancie le repository
3. Exécute `SleepTamagotchiUseCase` avec `hours = 5`
4. Revalide le cache

**Exemple** :

```tsx
<form action={sleepMonster}>
  <input type="hidden" name="id" value={monsterId} />
  <Button type="submit">😴 Dormir</Button>
</form>
```

---

### cleanMonster

Nettoie un monstre (augmente légèrement la santé).

```typescript
'use server'

export async function cleanMonster(
  formData: FormData
): Promise<void>
```

**Paramètres** :
- `formData.get('id')` : ID du monstre

**Comportement** :
1. Récupère l'ID depuis FormData
2. Instancie le repository
3. Exécute `CleanTamagotchiUseCase`
4. Revalide le cache

**Exemple** :

```tsx
<form action={cleanMonster}>
  <input type="hidden" name="id" value={monsterId} />
  <Button type="submit">🧹 Nettoyer</Button>
</form>
```

---

## 🔄 Revalidation du cache

Toutes les actions utilisent `revalidatePath()` pour invalider le cache Next.js :

```typescript
import { revalidatePath } from 'next/cache'

export async function feedMonster(formData: FormData) {
  const id = formData.get('id') as string
  
  // ... logique ...
  
  revalidatePath(`/creature/${id}`) // ✅ Rafraîchit la page
  revalidatePath('/dashboard') // ✅ Rafraîchit le dashboard
}
```

---

## ✅ Avantages des Server Actions

1. **Simplicité** : Pas besoin d'API Route explicite
2. **Type-safe** : TypeScript de bout en bout
3. **Sécurisé** : Code côté serveur uniquement
4. **Optimisé** : Next.js gère le cache automatiquement
5. **Progressive Enhancement** : Fonctionne sans JavaScript

---

## 🔒 Sécurité

Les Server Actions s'exécutent **côté serveur uniquement** :

```typescript
'use server' // ⚠️ IMPORTANT : Ne jamais oublier cette directive

export async function deleteMonster(id: string) {
  // Ce code ne s'exécute JAMAIS côté client
  // Impossible d'inspecter dans les DevTools
}
```

---

## 📝 Bonnes pratiques

1. **Toujours valider les entrées** avec Zod
2. **Vérifier l'authentification** avant toute action
3. **Revalider les chemins** après modification
4. **Gérer les erreurs** avec try/catch
5. **Logger les actions** pour audit

---

Prochaine étape : [Use Cases](/docs/api/use-cases) 🚀
