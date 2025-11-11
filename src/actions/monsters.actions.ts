'use server'

import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { auth } from '@/lib/auth'
import type { CreateMonsterFormValues } from '@/shared/types/forms/create-monster-form'
import type { DBMonster } from '@/shared/types/monster'
import { XP_GAIN_PER_ACTION, XP_LOSS_PER_WRONG_ACTION, XP_PER_LEVEL } from '@/shared/types/monster'
import { calculateMonsterPrice, calculateCoinsReward } from '@/shared/types/coins'
import { getPlayerData, deductCoins, incrementMonstersCreated, addCoins } from './player.actions'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { Types } from 'mongoose'
import { type MonsterAction } from '@/hooks/monsters'

/**
 * Crée un nouveau monstre pour l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Calcule le prix du monstre en fonction du nombre déjà créé
 * 3. Vérifie et déduit les pièces nécessaires
 * 4. Crée un nouveau document Monster dans MongoDB
 * 5. Incrémente le compteur de monstres créés
 * 6. Revalide le cache de la page dashboard
 *
 * Système de tarification :
 * - Monstre 1-2 : Gratuit
 * - Monstre 3 : 50 pièces
 * - Monstre 4 : 100 pièces
 * - Et ainsi de suite (+50 pièces par monstre)
 *
 * Responsabilité unique : orchestrer la création d'un monstre
 * en coordonnant l'authentification, le paiement, la persistence et le cache.
 *
 * @async
 * @param {CreateMonsterFormValues} monsterData - Données validées du monstre à créer
 * @returns {Promise<void>} Promise résolue une fois le monstre créé
 * @throws {Error} Si l'utilisateur n'est pas authentifié ou n'a pas assez de pièces
 *
 * @example
 * await createMonster({
 *   name: "Pikachu",
 *   traits: {...},
 *   state: "happy",
 *   level: 1
 * })
 */
export async function createMonster (monsterData: CreateMonsterFormValues): Promise<void> {
  // Connexion à la base de données
  await connectMongooseToDatabase()

  // Vérification de l'authentification
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  // Récupérer les données du joueur
  const playerData = await getPlayerData()

  // Calculer le prix du monstre
  const price = calculateMonsterPrice(playerData.totalMonstersCreated)

  // Vérifier et déduire les pièces si nécessaire
  if (price > 0) {
    await deductCoins(price)
  }

  // Création et sauvegarde du monstre
  const monster = new Monster({
    ownerId: session.user.id,
    name: monsterData.name,
    traits: JSON.stringify(monsterData.traits),
    state: monsterData.state,
    level: monsterData.level
  })

  await monster.save()

  // Incrémenter le compteur de monstres créés
  await incrementMonstersCreated()

  // Revalidation du cache pour rafraîchir le dashboard
  revalidatePath('/dashboard')
}

/**
 * Récupère tous les monstres de l'utilisateur authentifié
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Récupère tous les monstres appartenant à l'utilisateur
 * 3. Retourne un tableau vide en cas d'erreur (résilience)
 *
 * Responsabilité unique : récupérer la liste complète des monstres
 * de l'utilisateur depuis la base de données.
 *
 * @async
 * @returns {Promise<DBMonster[]>} Liste des monstres ou tableau vide en cas d'erreur
 *
 * @example
 * const monsters = await getMonsters()
 * // [{ _id: "...", name: "Pikachu", ... }, ...]
 */
export async function getMonsters (): Promise<DBMonster[]> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Récupération des monstres de l'utilisateur
    const monsters = await Monster.find({ ownerId: user.id }).exec()

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(monsters))
  } catch (error) {
    console.error('Error fetching monsters:', error)
    return []
  }
}

/**
 * Récupère un monstre spécifique par son identifiant
 *
 * Cette server action :
 * 1. Vérifie l'authentification de l'utilisateur
 * 2. Valide le format de l'identifiant MongoDB
 * 3. Récupère le monstre s'il appartient à l'utilisateur
 * 4. Retourne null si le monstre n'existe pas ou n'appartient pas à l'utilisateur
 *
 * Responsabilité unique : récupérer un monstre spécifique
 * en garantissant la propriété et l'existence.
 *
 * @async
 * @param {string} id - Identifiant du monstre (premier élément du tableau de route dynamique)
 * @returns {Promise<DBMonster | null>} Le monstre trouvé ou null
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 *
 * @example
 * const monster = await getMonsterById("507f1f77bcf86cd799439011")
 * // { _id: "507f1f77bcf86cd799439011", name: "Pikachu", ... }
 *
 * const notFound = await getMonsterById("invalid-id")
 * // null
 */
export async function getMonsterById (id: string): Promise<DBMonster | null> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Extraction de l'ID depuis le tableau de route dynamique
    const _id = id

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(_id)) {
      console.error('Invalid monster ID format')
      return null
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: user.id, _id }).exec()

    // Sérialisation JSON pour éviter les problèmes de typage Next.js
    return JSON.parse(JSON.stringify(monster))
  } catch (error) {
    console.error('Error fetching monster by ID:', error)
    return null
  }
}

const actionsStatesMap: Record<Exclude<MonsterAction, null>, string> = {
  feed: 'hungry',
  comfort: 'angry',
  hug: 'sad',
  wake: 'sleepy'
}

/**
 * Calcule le niveau correct en fonction de l'XP actuel
 * Niveau 1 : 0-99 XP
 * Niveau 2 : 100-199 XP
 * Niveau 3 : 200-299 XP
 * etc.
 *
 * @param {number} xp - XP actuel
 * @returns {{ level: number, xpToNextLevel: number }} Niveau et XP requis pour le prochain niveau
 */
function calculateLevelFromXp (xp: number): { level: number, xpToNextLevel: number } {
  // Niveau 1 commence à 0 XP, niveau 2 à 100 XP, etc.
  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpToNextLevel = level * XP_PER_LEVEL

  return { level, xpToNextLevel }
}

/**
 * Applique une action sur un monstre et gère l'XP/leveling
 *
 * Cette server action :
 * 1. Vérifie l'authentification
 * 2. Vérifie si l'action correspond à l'état du monstre
 * 3. Si oui : change l'état à 'happy' et ajoute de l'XP
 * 4. Gère le leveling automatique si l'XP dépasse le seuil
 *
 * Système de leveling :
 * - Niveau 1 : 100 XP requis
 * - Niveau 2 : 200 XP requis
 * - Niveau N : N * 100 XP requis
 * - Chaque action correcte donne 10 XP
 *
 * @async
 * @param {string} id - ID du monstre
 * @param {MonsterAction} action - Action à appliquer (feed, comfort, hug, wake)
 * @returns {Promise<void>}
 *
 * @example
 * await doActionOnMonster("507f1f77bcf86cd799439011", "feed")
 * // Si le monstre était "hungry", il devient "happy" et gagne 10 XP
 */
export async function doActionOnMonster (id: string, action: MonsterAction): Promise<void> {
  try {
    // Connexion à la base de données
    await connectMongooseToDatabase()

    // Vérification de l'authentification
    const session = await auth.api.getSession({
      headers: await headers()
    })
    if (session === null || session === undefined) {
      throw new Error('User not authenticated')
    }

    const { user } = session

    // Validation du format ObjectId MongoDB
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid monster ID format')
    }

    // Récupération du monstre avec vérification de propriété
    const monster = await Monster.findOne({ ownerId: user.id, _id: id }).exec()

    if (monster === null || monster === undefined) {
      throw new Error('Monster not found')
    }

    // Mise à jour de l'état du monstre en fonction de l'action
    if (action !== null && action !== undefined && action in actionsStatesMap) {
      // Récupération des valeurs actuelles
      const currentXp = Number(monster.xp ?? 0)

      // Vérifier si l'action correspond à l'état actuel du monstre
      if (monster.state === actionsStatesMap[action]) {
        // ✅ ACTION CORRECTE : Changer l'état à 'happy' et gagner de l'XP + pièces
        monster.state = 'happy'

        const newXp = currentXp + XP_GAIN_PER_ACTION
        const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

        monster.xp = newXp
        monster.level = newLevel
        monster.xpToNextLevel = newXpToNextLevel

        monster.markModified('state')
        monster.markModified('xp')
        monster.markModified('level')
        monster.markModified('xpToNextLevel')
        await monster.save()

        // 🪙 Récompense en pièces pour l'action correcte
        const coinsReward = calculateCoinsReward(newLevel)
        await addCoins(coinsReward)
      } else {
        // ❌ ACTION INCORRECTE : Perdre de l'XP (sans changer l'état)
        const newXp = Math.max(0, currentXp - XP_LOSS_PER_WRONG_ACTION)
        const { level: newLevel, xpToNextLevel: newXpToNextLevel } = calculateLevelFromXp(newXp)

        monster.xp = newXp
        monster.level = newLevel
        monster.xpToNextLevel = newXpToNextLevel

        monster.markModified('xp')
        monster.markModified('level')
        monster.markModified('xpToNextLevel')
        await monster.save()
      }
    }
  } catch (error) {
    console.error('Error updating monster state:', error)
  }
}
