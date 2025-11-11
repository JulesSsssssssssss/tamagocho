import { useMemo } from 'react'
import type { DBMonster, MonsterListItem, MonsterTraits } from '@/shared/types/monster'

/**
 * Hook personnalisé pour transformer les données de monstre DB en format d'affichage
 *
 * Responsabilités (SRP) :
 * - Transformation de DBMonster[] vers MonsterListItem[]
 * - Parsing du JSON stringifié des traits
 * - Mémoïsation pour éviter les re-calculs inutiles
 *
 * @param {DBMonster[]} monsters - Monstres au format base de données
 * @returns {MonsterListItem[]} Monstres au format d'affichage
 *
 * @example
 * ```tsx
 * const monstersList = useMonsterTransform(monsters)
 * return <MonstersList monsters={monstersList} />
 * ```
 */
export function useMonsterTransform (monsters: DBMonster[]): MonsterListItem[] {
  return useMemo(() => {
    return monsters.map(m => {
      // Parse les traits depuis JSON string
      let traits: MonsterTraits
      try {
        traits = JSON.parse(m.traits) as MonsterTraits
      } catch (error) {
        console.error(`Failed to parse traits for monster ${m._id}:`, error)
        // TODO: Utiliser DEFAULT_MONSTER_TRAITS en fallback
        traits = JSON.parse(m.traits) as MonsterTraits
      }

      return {
        id: m._id,
        name: m.name,
        level: m.level,
        traits,
        state: m.state,
        hunger: m.hunger,
        energy: m.energy,
        happiness: m.happiness,
        xp: m.xp,
        xpToNextLevel: m.xpToNextLevel,
        isPublic: false // DBMonster ne contient pas isPublic, par défaut false
      }
    })
  }, [monsters])
}
