'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import type { CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'
import type { DBMonster, MonsterState } from '@/shared/types/monster'
import { XP_GAIN_PER_ACTION, XP_PER_LEVEL } from '@/shared/types/monster'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

/**
 * Calcule l'état émotionnel du monstre en fonction de ses statistiques
 *
 * Logique :
 * - Si toutes les stats >= 80 : 'happy' 😄
 * - Sinon, identifie la stat la plus basse :
 *   - hunger la plus basse : 'hungry' 😋
 *   - energy la plus basse : 'sleepy' 😴
 *   - happiness la plus basse : 'sad' 😢
 * - Si plusieurs stats égales au minimum : priorité hunger > energy > happiness
 * - Si une stat < 20 : 'angry' 😤 (cas critique)
 *
 * @param hunger - Niveau de faim (0-100)
 * @param energy - Niveau d'énergie (0-100)
 * @param happiness - Niveau de bonheur (0-100)
 * @returns L'état émotionnel approprié
 */
function calculateMonsterState (
  hunger: number,
  energy: number,
  happiness: number
): MonsterState {
  // Cas critique : une stat est très basse (< 20) → angry
  if (hunger < 20 || energy < 20 || happiness < 20) {
    return 'angry'
  }

  // Cas optimal : toutes les stats sont élevées (>= 80) → happy
  if (hunger >= 80 && energy >= 80 && happiness >= 80) {
    return 'happy'
  }

  // Trouver la stat la plus basse
  const minStat = Math.min(hunger, energy, happiness)

  // Priorité : hunger > energy > happiness si égalité
  if (hunger === minStat) {
    return 'hungry'
  }
  if (energy === minStat) {
    return 'sleepy'
  }
  if (happiness === minStat) {
    return 'sad'
  }

  // Fallback (ne devrait jamais arriver)
  return 'happy'
}

/**
 * Calcule le niveau en fonction de l'XP actuel
 * Formule : Niveau = floor(xp / 100) + 1
 * - Niveau 1 : 0-99 XP
 * - Niveau 2 : 100-199 XP
 * - Niveau 3 : 200-299 XP
 * etc.
 *
 * @param xp - XP actuel du monstre
 * @returns Object contenant le niveau et l'XP requis pour le prochain niveau
 */
function calculateLevelFromXp (xp: number): { level: number, xpToNextLevel: number } {
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpToNextLevel = level * XP_PER_LEVEL
  return { level, xpToNextLevel }
}

async function getCurrentSession (): Promise<any> {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }
  return session
}

export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  await connectMongooseToDatabase()

  const session = await getCurrentSession()

  // Conversion des traits en JSON string (MongoDB attend une string)
  const traitsJson = typeof monsterData.traits === 'string'
    ? monsterData.traits
    : JSON.stringify(monsterData.traits)

  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: traitsJson,
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()
  revalidatePath('/dashboard')
}

export async function getMonsters (): Promise<DBMonster[]> {
  try {
    await connectMongooseToDatabase()

    const session = await getCurrentSession()
    const { user } = session

    const monsters = await Monster.find({ ownerId: user.id }).exec()
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

export async function getMonsterById (id: string): Promise<DBMonster | null> {
  try {
    await connectMongooseToDatabase()

    const session = await getCurrentSession()
    const { user } = session

    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).exec()
    return JSON.parse(JSON.stringify(monster))
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}

/**
 * Nourrir un monstre
 * Augmente hunger de 20 points, recalcule l'état émotionnel
 */
export async function feedMonster (monsterId: string): Promise<void> {
  try {
    console.log('🍽️ feedMonster called with ID:', monsterId)
    await connectMongooseToDatabase()
    const session = await getCurrentSession()

    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      console.error('❌ Monster not found:', monsterId)
      throw new Error('Monster not found')
    }

    console.log('📊 Before feeding - hunger:', monster.hunger, 'state:', monster.state)

    // Augmenter hunger (max 100)
    const currentHunger = Number(monster.hunger)
    const oldHunger = isNaN(currentHunger) ? 0 : currentHunger
    monster.hunger = Math.min(100, oldHunger + 20)
    monster.lastFed = new Date()

    // ⭐ Ajouter de l'XP seulement si la stat a réellement augmenté
    const statIncreased = monster.hunger > oldHunger
    if (statIncreased) {
      const currentXp = Number(monster.xp ?? 0)
      const newXp = currentXp + XP_GAIN_PER_ACTION
      const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

      monster.xp = newXp
      monster.level = newLevel
      monster.xpToNextLevel = newXpToNextLevel
    }

    // Recalculer l'état émotionnel en fonction des stats
    const hunger = Number(monster.hunger)
    const energy = Number(monster.energy)
    const happiness = Number(monster.happiness)
    monster.state = calculateMonsterState(
      isNaN(hunger) ? 0 : hunger,
      isNaN(energy) ? 0 : energy,
      isNaN(happiness) ? 0 : happiness
    )

    console.log('📊 After feeding - hunger:', monster.hunger, 'state:', monster.state, 'xp:', monster.xp, 'level:', monster.level, 'gainedXP:', statIncreased)

    await monster.save()
    console.log('✅ Monster saved successfully')
    revalidatePath('/creature/[...id]', 'page')
  } catch (error) {
    console.error('Error feeding monster:', error)
    throw error
  }
}

/**
 * Jouer avec un monstre
 * Augmente happiness de 20 points, diminue energy de 10 points, recalcule l'état
 */
export async function playWithMonster (monsterId: string): Promise<void> {
  try {
    console.log('🎮 playWithMonster called with ID:', monsterId)
    await connectMongooseToDatabase()
    const session = await getCurrentSession()

    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      console.error('❌ Monster not found:', monsterId)
      throw new Error('Monster not found')
    }

    console.log('📊 Before playing - happiness:', monster.happiness, 'energy:', monster.energy, 'state:', monster.state)

    // Augmenter happiness, diminuer energy
    const currentHappiness = Number(monster.happiness)
    const currentEnergy = Number(monster.energy)
    const oldHappiness = isNaN(currentHappiness) ? 0 : currentHappiness
    monster.happiness = Math.min(100, oldHappiness + 20)
    monster.energy = Math.max(0, isNaN(currentEnergy) ? 0 : currentEnergy - 10)
    monster.lastPlayed = new Date()

    // ⭐ Ajouter de l'XP seulement si happiness a réellement augmenté
    const statIncreased = monster.happiness > oldHappiness
    if (statIncreased) {
      const currentXp = Number(monster.xp ?? 0)
      const newXp = currentXp + XP_GAIN_PER_ACTION
      const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

      monster.xp = newXp
      monster.level = newLevel
      monster.xpToNextLevel = newXpToNextLevel
    }

    // Recalculer l'état émotionnel en fonction des stats
    const hunger = Number(monster.hunger)
    const energy = Number(monster.energy)
    const happiness = Number(monster.happiness)
    monster.state = calculateMonsterState(
      isNaN(hunger) ? 0 : hunger,
      isNaN(energy) ? 0 : energy,
      isNaN(happiness) ? 0 : happiness
    )

    console.log('📊 After playing - happiness:', monster.happiness, 'energy:', monster.energy, 'state:', monster.state, 'xp:', monster.xp, 'level:', monster.level, 'gainedXP:', statIncreased)

    await monster.save()
    console.log('✅ Monster saved successfully')
    revalidatePath('/creature/[...id]', 'page')
  } catch (error) {
    console.error('Error playing with monster:', error)
    throw error
  }
}

/**
 * Faire dormir un monstre
 * Augmente energy de 30 points, recalcule l'état
 */
export async function sleepMonster (monsterId: string): Promise<void> {
  try {
    console.log('😴 sleepMonster called with ID:', monsterId)
    await connectMongooseToDatabase()
    const session = await getCurrentSession()

    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      console.error('❌ Monster not found:', monsterId)
      throw new Error('Monster not found')
    }

    console.log('📊 Before sleeping - energy:', monster.energy, 'state:', monster.state)

    // Augmenter energy
    const currentEnergy = Number(monster.energy)
    const oldEnergy = isNaN(currentEnergy) ? 0 : currentEnergy
    monster.energy = Math.min(100, oldEnergy + 30)
    monster.lastSlept = new Date()

    // ⭐ Ajouter de l'XP seulement si energy a réellement augmenté
    const statIncreased = monster.energy > oldEnergy
    if (statIncreased) {
      const currentXp = Number(monster.xp ?? 0)
      const newXp = currentXp + XP_GAIN_PER_ACTION
      const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

      monster.xp = newXp
      monster.level = newLevel
      monster.xpToNextLevel = newXpToNextLevel
    }

    // Recalculer l'état émotionnel en fonction des stats
    const hunger = Number(monster.hunger)
    const energy = Number(monster.energy)
    const happiness = Number(monster.happiness)
    monster.state = calculateMonsterState(
      isNaN(hunger) ? 0 : hunger,
      isNaN(energy) ? 0 : energy,
      isNaN(happiness) ? 0 : happiness
    )

    console.log('📊 After sleeping - energy:', monster.energy, 'state:', monster.state, 'xp:', monster.xp, 'level:', monster.level, 'gainedXP:', statIncreased)

    await monster.save()
    console.log('✅ Monster saved successfully')
    revalidatePath('/creature/[...id]', 'page')
  } catch (error) {
    console.error('Error making monster sleep:', error)
    throw error
  }
}

/**
 * Nettoyer un monstre
 * Augmente happiness de 15 points, recalcule l'état
 */
export async function cleanMonster (monsterId: string): Promise<void> {
  try {
    console.log('🧼 cleanMonster called with ID:', monsterId)
    await connectMongooseToDatabase()
    const session = await getCurrentSession()

    const monster = await Monster.findOne({
      ownerId: session.user.id,
      _id: monsterId
    }).exec()

    if (monster === null) {
      console.error('❌ Monster not found:', monsterId)
      throw new Error('Monster not found')
    }

    console.log('📊 Before cleaning - happiness:', monster.happiness, 'state:', monster.state)

    // Augmenter happiness
    const currentHappiness = Number(monster.happiness)
    const oldHappiness = isNaN(currentHappiness) ? 0 : currentHappiness
    monster.happiness = Math.min(100, oldHappiness + 15)
    monster.lastCleaned = new Date()

    // ⭐ Ajouter de l'XP seulement si happiness a réellement augmenté
    const statIncreased = monster.happiness > oldHappiness
    if (statIncreased) {
      const currentXp = Number(monster.xp ?? 0)
      const newXp = currentXp + XP_GAIN_PER_ACTION
      const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

      monster.xp = newXp
      monster.level = newLevel
      monster.xpToNextLevel = newXpToNextLevel
    }

    // Recalculer l'état émotionnel en fonction des stats
    const hunger = Number(monster.hunger)
    const energy = Number(monster.energy)
    const happiness = Number(monster.happiness)
    monster.state = calculateMonsterState(
      isNaN(hunger) ? 0 : hunger,
      isNaN(energy) ? 0 : energy,
      isNaN(happiness) ? 0 : happiness
    )

    console.log('📊 After cleaning - happiness:', monster.happiness, 'state:', monster.state, 'xp:', monster.xp, 'level:', monster.level, 'gainedXP:', statIncreased)

    await monster.save()
    console.log('✅ Monster saved successfully')
    revalidatePath('/creature/[...id]', 'page')
  } catch (error) {
    console.error('Error cleaning monster:', error)
    throw error
  }
}
