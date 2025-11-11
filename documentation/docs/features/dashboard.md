---
sidebar_position: 3
---

# Dashboard

Le **Dashboard** est la page principale où l'utilisateur visualise tous ses monstres.

## 📍 Route

```
/dashboard
```

**Protection** : Route protégée, nécessite authentification.

---

## 🎨 Composants

### DashboardPage

Page principale du dashboard.

```tsx
// app/dashboard/page.tsx
import { auth } from '@/lib/auth'
import { getMonsters } from '@/actions/monsters/monsters.actions'
import { MonsterCard } from '@/components/monsters/monster-card'
import { CreateMonsterButton } from '@/components/dashboard/create-monster-button'

export default async function DashboardPage() {
  const session = await auth()
  const monsters = await getMonsters()

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Mes Créatures</h1>
        <CreateMonsterButton />
      </div>

      {monsters.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monsters.map(monster => (
            <MonsterCard key={monster._id.toString()} monster={monster} />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

### MonsterCard

Carte affichant un résumé de monstre.

```tsx
interface MonsterCardProps {
  monster: DBMonster
}

export function MonsterCard({ monster }: MonsterCardProps) {
  const isLowHealth = monster.health < 30
  const isDead = !monster.isAlive

  return (
    <Link href={`/creature/${monster._id}`}>
      <div className={cn(
        'border rounded-lg p-6 hover:shadow-lg transition',
        isDead && 'opacity-50 grayscale'
      )}>
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full" />
        </div>

        {/* Nom et niveau */}
        <h3 className="text-2xl font-bold text-center mb-2">
          {monster.name}
          {isDead && ' 💀'}
        </h3>
        <p className="text-center text-gray-500 mb-4">
          Niveau {monster.level}
        </p>

        {/* Stats résumées */}
        <div className="space-y-2">
          <MiniStatBar label="Santé" value={monster.health} color="red" />
          <MiniStatBar label="Faim" value={monster.hunger} color="orange" />
          <MiniStatBar label="Bonheur" value={monster.happiness} color="yellow" />
          <MiniStatBar label="Énergie" value={monster.energy} color="blue" />
        </div>

        {/* Alerte */}
        {isLowHealth && !isDead && (
          <div className="mt-4 bg-red-100 text-red-700 p-2 rounded text-sm">
            ⚠️ Santé critique !
          </div>
        )}

        {isDead && (
          <div className="mt-4 bg-gray-100 text-gray-700 p-2 rounded text-sm">
            💀 Cette créature est morte
          </div>
        )}
      </div>
    </Link>
  )
}
```

---

### EmptyState

Affichage quand aucun monstre n'existe.

```tsx
export function EmptyState() {
  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">🐣</div>
      <h2 className="text-2xl font-bold mb-2">
        Vous n'avez pas encore de créature
      </h2>
      <p className="text-gray-500 mb-6">
        Créez votre première créature pour commencer l'aventure !
      </p>
      <CreateMonsterButton />
    </div>
  )
}
```

---

### CreateMonsterButton

Bouton pour créer un nouveau monstre.

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreateMonsterModal } from '@/components/monsters/create-monster-modal'

export function CreateMonsterButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        ➕ Créer une créature
      </Button>

      <CreateMonsterModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  )
}
```

---

## 📊 Tri et Filtres

### Tri par niveau

```tsx
const sortedMonsters = monsters.sort((a, b) => b.level - a.level)
```

### Filtre vivant/mort

```tsx
const aliveMonsters = monsters.filter(m => m.isAlive)
const deadMonsters = monsters.filter(m => !m.isAlive)
```

### Filtre par santé critique

```tsx
const criticalMonsters = monsters.filter(m => m.health < 30 && m.isAlive)
```

---

## 🔔 Notifications

### Alertes visuelles

Le dashboard affiche des **badges** pour attirer l'attention :

- 🚨 **Santé critique** (< 30) : Badge rouge
- 😋 **Affamé** (faim > 70) : Badge orange
- 😴 **Fatigué** (énergie < 30) : Badge bleu

```tsx
{monster.health < 30 && (
  <Badge variant="destructive">Santé critique</Badge>
)}
```

---

## 📱 Responsive Design

Le dashboard s'adapte à toutes les tailles d'écran :

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cartes de monstres */}
</div>
```

- **Mobile** : 1 colonne
- **Tablette** : 2 colonnes
- **Desktop** : 3 colonnes

---

## ⚡ Performance

### Server Components

Le dashboard utilise des **React Server Components** pour un chargement rapide :

```tsx
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Données chargées côté serveur
  const monsters = await getMonsters()
  
  return (/* JSX */)
}
```

**Avantages** :
- Pas de waterfall requests
- Rendu côté serveur
- SEO optimisé

---

### Revalidation

Le dashboard se rafraîchit automatiquement après chaque action :

```typescript
// Dans les Server Actions
export async function feedMonster(formData: FormData) {
  // ... logique ...
  revalidatePath('/dashboard')
}
```

---

## 🎯 Actions rapides

### Depuis le dashboard

Possibilité d'ajouter des **actions rapides** directement sur les cartes :

```tsx
<MonsterCard monster={monster}>
  <QuickActions monsterId={monster._id} />
</MonsterCard>
```

```tsx
function QuickActions({ monsterId }: { monsterId: string }) {
  return (
    <div className="flex gap-2 mt-4">
      <form action={feedMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button size="sm">🍖</Button>
      </form>
      
      <form action={playWithMonster}>
        <input type="hidden" name="id" value={monsterId} />
        <Button size="sm">🎮</Button>
      </form>
    </div>
  )
}
```

---

## 📈 Statistiques globales

Affichage de statistiques d'ensemble :

```tsx
function DashboardStats({ monsters }: { monsters: DBMonster[] }) {
  const totalMonsters = monsters.length
  const aliveMonsters = monsters.filter(m => m.isAlive).length
  const totalLevel = monsters.reduce((sum, m) => sum + m.level, 0)
  const avgLevel = totalMonsters > 0 ? totalLevel / totalMonsters : 0

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <StatCard label="Total" value={totalMonsters} icon="🐾" />
      <StatCard label="Vivants" value={aliveMonsters} icon="💚" />
      <StatCard label="Niveau moyen" value={avgLevel.toFixed(1)} icon="⭐" />
    </div>
  )
}
```

---

Prochaine étape : [API Reference](/docs/api/endpoints) 🚀
