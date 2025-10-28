import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { Tamagotchi, type ITamagotchiRepository } from '@/domain'
import { DEFAULT_MONSTER_TRAITS, type MonsterTraits } from '@/shared/types/monster'

export class TamagotchiRepository implements ITamagotchiRepository {
  async findById (id: string): Promise<Tamagotchi | null> {
    await connectMongooseToDatabase()

    const monsterDoc = await Monster.findById(id).exec()
    if (monsterDoc === null) return null

    return this.mapToEntity(monsterDoc)
  }

  async findByOwnerId (ownerId: string): Promise<Tamagotchi[]> {
    await connectMongooseToDatabase()

    const monsterDocs = await Monster.find({ ownerId }).exec()
    return monsterDocs.map(doc => this.mapToEntity(doc))
  }

  async save (tamagotchi: Tamagotchi): Promise<Tamagotchi> {
    await connectMongooseToDatabase()

    const monsterData = tamagotchi.toJSON()

    const monsterDoc = new Monster({
      _id: monsterData.id,
      ownerId: monsterData.ownerId,
      name: monsterData.name,
      traits: JSON.stringify(monsterData.traits),
      state: monsterData.state,
      stats: monsterData.stats,
      level: monsterData.level,
      experience: monsterData.experience,
      lastActionAt: monsterData.lastActionAt,
      createdAt: monsterData.createdAt,
      isDead: monsterData.isDead
    })

    const savedDoc = await monsterDoc.save()
    return this.mapToEntity(savedDoc)
  }

  async saveWithOwner (tamagotchi: Tamagotchi, ownerId: string): Promise<Tamagotchi> {
    await connectMongooseToDatabase()

    const monsterData = tamagotchi.toJSON()

    const monsterDoc = new Monster({
      _id: monsterData.id,
      ownerId,
      name: monsterData.name,
      traits: JSON.stringify(monsterData.traits),
      state: monsterData.state,
      stats: monsterData.stats,
      level: monsterData.level,
      experience: monsterData.experience,
      lastActionAt: monsterData.lastActionAt,
      createdAt: monsterData.createdAt,
      isDead: monsterData.isDead
    })

    const savedDoc = await monsterDoc.save()
    return this.mapToEntity(savedDoc)
  }

  async update (tamagotchi: Tamagotchi): Promise<Tamagotchi> {
    await connectMongooseToDatabase()

    const monsterData = tamagotchi.toJSON()

    const updatedDoc = await Monster.findByIdAndUpdate(
      monsterData.id,
      {
        name: monsterData.name,
        traits: JSON.stringify(monsterData.traits),
        state: monsterData.state,
        stats: monsterData.stats,
        level: monsterData.level,
        experience: monsterData.experience,
        lastActionAt: monsterData.lastActionAt,
        isDead: monsterData.isDead
      },
      { new: true }
    ).exec()

    if (updatedDoc === null) throw new Error('Failed to update tamagotchi')

    return this.mapToEntity(updatedDoc)
  }

  async delete (id: string): Promise<boolean> {
    await connectMongooseToDatabase()

    const result = await Monster.findByIdAndDelete(id).exec()
    return result !== null
  }

  async findAll (): Promise<Tamagotchi[]> {
    await connectMongooseToDatabase()

    const monsterDocs = await Monster.find().exec()
    return monsterDocs.map(doc => this.mapToEntity(doc))
  }

  private mapToEntity (doc: any): Tamagotchi {
    const traits = parseTraits(doc.traits)

    return new Tamagotchi(
      doc._id.toString(),
      doc.name,
      traits,
      doc.state,
      doc.stats,
      doc.level,
      doc.experience,
      doc.lastActionAt,
      doc.createdAt,
      doc.ownerId.toString()
    )
  }
}

function parseTraits (rawTraits: unknown): MonsterTraits {
  if (typeof rawTraits === 'string') {
    try {
      const parsed = JSON.parse(rawTraits) as MonsterTraits
      if (parsed !== null && typeof parsed === 'object') {
        return {
          ...DEFAULT_MONSTER_TRAITS,
          ...parsed
        }
      }
    } catch (error) {
      console.warn('Unable to parse monster traits, using defaults.', error)
    }
  }

  if (rawTraits !== null && typeof rawTraits === 'object') {
    return {
      ...DEFAULT_MONSTER_TRAITS,
      ...(rawTraits as MonsterTraits)
    }
  }

  return { ...DEFAULT_MONSTER_TRAITS }
}
