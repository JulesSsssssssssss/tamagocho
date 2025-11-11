---
sidebar_position: 5
---

# Presentation Layer

La **Presentation Layer** contient les composants React, pages Next.js et hooks. C'est la couche **visible par l'utilisateur**.

## 📦 Structure

```
src/
├── components/           # Composants React
│   ├── creature/         # Composants créature
│   ├── dashboard/        # Composants dashboard
│   ├── forms/            # Formulaires
│   ├── monsters/         # Cartes de monstres
│   └── ui/               # Composants réutilisables
│
├── app/                  # Pages Next.js (App Router)
│   ├── page.tsx          # Page d'accueil
│   ├── dashboard/        # Dashboard utilisateur
│   ├── creature/[id]/    # Page détail créature
│   └── api/              # API Routes
│
└── hooks/                # Custom React hooks
    ├── use-creature-data.ts
    ├── use-auto-refresh.ts
    └── use-monster-creation.ts
```

---

## 🎨 Composants Creature

### CreatureHeader

Affiche le nom, niveau et avatar de la créature.

```tsx
interface CreatureHeaderProps {
  name: string
  level: number
  experience: number
}

export function CreatureHeader({ 
  name, 
  level, 
  experience 
}: CreatureHeaderProps) {
  const xpNeeded = level * 50
  const xpProgress = (experience / xpNeeded) * 100

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-4xl font-bold">{name}</h1>
      <div className="flex items-center gap-2">
        <span>Niveau {level}</span>
        <div className="w-32 h-2 bg-gray-200 rounded">
          <div 
            className="h-full bg-blue-500 rounded" 
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">
          {experience}/{xpNeeded} XP
        </span>
      </div>
    </div>
  )
}
```

---

### CreatureStats

Affiche les barres de stats (santé, faim, bonheur, énergie).

```tsx
interface CreatureStatsProps {
  health: number
  hunger: number
  happiness: number
  energy: number
}

export function CreatureStats({
  health,
  hunger,
  happiness,
  energy
}: CreatureStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <StatBar label="Santé" value={health} color="red" />
      <StatBar label="Faim" value={hunger} color="orange" />
      <StatBar label="Bonheur" value={happiness} color="yellow" />
      <StatBar label="Énergie" value={energy} color="blue" />
    </div>
  )
}
```

---

### CreatureActions

Boutons d'action (Nourrir, Jouer, Dormir, Nettoyer).

```tsx
interface CreatureActionsProps {
  monsterId: string
  isAlive: boolean
}

export function CreatureActions({ 
  monsterId, 
  isAlive 
}: CreatureActionsProps) {
  if (!isAlive) {
    return <p className="text-red-500">💀 Cette créature est morte</p>
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <form action={feedMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button type="submit">🍖 Nourrir</Button>
      </form>
      
      <form action={playWithMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button type="submit">🎮 Jouer</Button>
      </form>
      
      <form action={sleepMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button type="submit">😴 Dormir</Button>
      </form>
      
      <form action={cleanMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button type="submit">🧹 Nettoyer</Button>
      </form>
    </div>
  )
}
```

**Note** : Utilise les **Server Actions** Next.js pour appeler les use cases

---

## 📄 Pages Next.js

### Page Créature

```tsx
// app/creature/[id]/page.tsx
import { getMonsterById } from '@/actions/monsters/monsters.actions'
import { CreatureHeader } from '@/components/creature/creature-header'
import { CreatureStats } from '@/components/creature/creature-stats'
import { CreatureActions } from '@/components/creature/creature-actions'

export default async function CreaturePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const monster = await getMonsterById(params.id)

  if (!monster) {
    return <div>Créature non trouvée</div>
  }

  return (
    <div className="container mx-auto p-8">
      <CreatureHeader 
        name={monster.name}
        level={monster.level}
        experience={monster.experience}
      />
      
      <CreatureStats
        health={monster.health}
        hunger={monster.hunger}
        happiness={monster.happiness}
        energy={monster.energy}
      />
      
      <CreatureActions
        monsterId={monster._id.toString()}
        isAlive={monster.isAlive}
      />
    </div>
  )
}
```

**Rendu** : Server Component (RSC) avec hydratation côté client

---

### Page Dashboard

```tsx
// app/dashboard/page.tsx
import { getMonsters } from '@/actions/monsters/monsters.actions'
import { MonsterCard } from '@/components/monsters/monster-card'

export default async function DashboardPage() {
  const monsters = await getMonsters()

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Mes Créatures</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {monsters.map(monster => (
          <MonsterCard key={monster._id.toString()} monster={monster} />
        ))}
      </div>
    </div>
  )
}
```

---

## 🪝 Custom Hooks

### useAutoRefresh

Déclenche automatiquement le tick de dégradation toutes les 30 secondes.

```tsx
import { useEffect } from 'react'

export function useAutoRefresh(intervalMs: number = 30000) {
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch('/api/tamagotchis/tick', { method: 'POST' })
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}
```

**Usage** :
```tsx
function CreaturePage() {
  useAutoRefresh() // Tick toutes les 30s
  // ...
}
```

---

### useCreatureData

Hook pour récupérer et rafraîchir les données d'une créature.

```tsx
import { useState, useEffect } from 'react'

export function useCreatureData(id: string) {
  const [creature, setCreature] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    setLoading(true)
    const data = await getMonsterById(id)
    setCreature(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [id])

  return { creature, loading, refresh }
}
```

---

## 🔄 Server Actions

Les **Server Actions** orchestrent les use cases côté serveur.

```typescript
// src/actions/monsters/monsters.actions.ts
'use server'

import { FeedTamagotchiUseCase } from '@/application/use-cases/FeedTamagotchiUseCase'
import { TamagotchiRepository } from '@/infrastructure/repositories/TamagotchiRepository'
import { revalidatePath } from 'next/cache'

export async function feedMonster(formData: FormData) {
  const id = formData.get('id') as string
  
  const repository = new TamagotchiRepository()
  const useCase = new FeedTamagotchiUseCase(repository)
  
  await useCase.execute(id, 25) // Nourrit de 25
  
  revalidatePath(`/creature/${id}`)
}
```

**Avantages** :
- Code côté serveur sécurisé
- Pas besoin d'API Route explicite
- Revalidation automatique du cache Next.js

---

## ✅ Règles de la Presentation Layer

1. **Aucune logique métier** : Délègue aux Server Actions / Use Cases
2. **Composants focalisés** : Un composant = une responsabilité visuelle
3. **Props typées** : Interfaces TypeScript strictes
4. **Server Components par défaut** : Client Components uniquement si nécessaire
5. **Accessibility** : Utiliser les balises sémantiques HTML

---

Prochaine étape : [Fonctionnalités](/docs/features/monsters) 🚀
