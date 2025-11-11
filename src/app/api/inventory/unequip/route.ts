/**
 * API Route: POST /api/inventory/unequip
 *
 * Déséquiper un item d'une créature
 *
 * Body:
 * {
 *   monsterId: string
 *   category: string  // 'hat' | 'glasses' | 'shoes'
 * }
 */

import { NextResponse } from 'next/server'
import { connectMongooseToDatabase } from '@/db'
import MonsterModel from '@/db/models/monster.model'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    // Parser le body
    const body = await request.json()
    const { monsterId, category } = body

    if (typeof monsterId !== 'string' || monsterId === '') {
      return NextResponse.json(
        { success: false, error: 'Monster ID is required' },
        { status: 400 }
      )
    }

    if (typeof category !== 'string' || !['hat', 'glasses', 'shoes'].includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Valid category is required (hat, glasses, shoes)' },
        { status: 400 }
      )
    }

    // Connexion à MongoDB
    await connectMongooseToDatabase()

    // Mettre à jour le champ equippedItems du monstre
    const updateField = `equippedItems.${category}`
    const monster = await MonsterModel.findByIdAndUpdate(
      monsterId,
      { $set: { [updateField]: null } },
      { new: true }
    )

    if (!monster) {
      return NextResponse.json(
        { success: false, error: 'Monster not found' },
        { status: 404 }
      )
    }

    console.log(`✅ Item déséquipé: ${category} sur monster ${monsterId}`)

    return NextResponse.json({
      success: true,
      message: `${category} unequipped successfully`,
      monster: {
        id: monster._id,
        equippedItems: monster.equippedItems
      }
    })
  } catch (error) {
    console.error('Error unequipping item:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unequip item'
      },
      { status: 500 }
    )
  }
}
