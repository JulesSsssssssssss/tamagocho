'use server'

import { connectMongooseToDatabase } from '@/db'
import Player from '@/db/models/player.model'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { INITIAL_COINS } from '@/shared/types/coins'

/**
 * Interface des données du joueur
 */
export interface PlayerData {
  userId: string
  coins: number
  totalMonstersCreated: number
}

/**
 * Récupère ou crée les données du joueur
 *
 * @async
 * @returns {Promise<PlayerData>} Données du joueur
 * @throws {Error} Si l'utilisateur n'est pas authentifié
 */
export async function getPlayerData (): Promise<PlayerData> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const { user } = session

  // Chercher ou créer les données du joueur
  let player = await Player.findOne({ userId: user.id }).exec()

  if (player === null || player === undefined) {
    // Créer un nouveau joueur avec les pièces de départ
    player = new Player({
      userId: user.id,
      coins: INITIAL_COINS,
      totalMonstersCreated: 0
    })
    await player.save()
  }

  return JSON.parse(JSON.stringify(player))
}

/**
 * Ajoute des pièces au joueur
 *
 * @async
 * @param {number} amount - Nombre de pièces à ajouter
 * @returns {Promise<number>} Nouveau solde de pièces
 */
export async function addCoins (amount: number): Promise<number> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const { user } = session

  const player = await Player.findOne({ userId: user.id }).exec()

  if (player === null || player === undefined) {
    throw new Error('Player not found')
  }

  const currentCoins = Number(player.coins ?? 0)
  player.coins = currentCoins + amount
  await player.save()

  return player.coins
}

/**
 * Déduit des pièces du joueur
 *
 * @async
 * @param {number} amount - Nombre de pièces à déduire
 * @returns {Promise<number>} Nouveau solde de pièces
 * @throws {Error} Si le joueur n'a pas assez de pièces
 */
export async function deductCoins (amount: number): Promise<number> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const { user } = session

  const player = await Player.findOne({ userId: user.id }).exec()

  if (player === null || player === undefined) {
    throw new Error('Player not found')
  }

  const currentCoins = Number(player.coins ?? 0)

  if (currentCoins < amount) {
    throw new Error(`Insufficient coins. You have ${String(currentCoins)}, need ${String(amount)}`)
  }

  player.coins = currentCoins - amount
  await player.save()

  return player.coins
}

/**
 * Incrémente le compteur de monstres créés
 *
 * @async
 * @returns {Promise<number>} Nouveau total de monstres créés
 */
export async function incrementMonstersCreated (): Promise<number> {
  await connectMongooseToDatabase()

  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (session === null || session === undefined) {
    throw new Error('User not authenticated')
  }

  const { user } = session

  const player = await Player.findOne({ userId: user.id }).exec()

  if (player === null || player === undefined) {
    throw new Error('Player not found')
  }

  const currentTotal = Number(player.totalMonstersCreated ?? 0)
  player.totalMonstersCreated = currentTotal + 1
  await player.save()

  return player.totalMonstersCreated
}
