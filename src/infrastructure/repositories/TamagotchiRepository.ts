import { connectMongooseToDatabase } from '@/db'
import Monster from '@/db/models/monster.model'
import { Tamagotchi, type ITamagotchiRepository } from '@/domain'
import { DEFAULT_MONSTER_TRAITS, type MonsterTraits } from '@/shared/types/monster'
import type { GalleryFilters, PaginationParams, EnrichedMonster } from '@/shared/types/gallery'

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
      isDead: monsterData.isDead,
      isPublic: tamagotchi.isPublic
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
      isDead: monsterData.isDead,
      isPublic: tamagotchi.isPublic
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
        isDead: monsterData.isDead,
        isPublic: tamagotchi.isPublic
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

  async findPublicMonsters (
    filters: GalleryFilters,
    pagination: PaginationParams
  ): Promise<{ monsters: EnrichedMonster[], total: number }> {
    await connectMongooseToDatabase()

    // Construction de la query MongoDB
    const query: any = { isPublic: true }

    // Filtre par niveau
    if (filters.minLevel !== undefined || filters.maxLevel !== undefined) {
      query.level = {}
      if (filters.minLevel !== undefined) {
        query.level.$gte = filters.minLevel
      }
      if (filters.maxLevel !== undefined) {
        query.level.$lte = filters.maxLevel
      }
    }

    // Filtre par état
    if (filters.state !== undefined) {
      query.state = filters.state
    }

    // Calcul de l'offset pour la pagination
    const skip = (pagination.page - 1) * pagination.limit

    // Détermination du tri
    let sort: any = { createdAt: -1 } // Par défaut: plus récents en premier
    if (filters.sortBy === 'oldest') {
      sort = { createdAt: 1 }
    } else if (filters.sortBy === 'level') {
      sort = { level: -1, createdAt: -1 }
    }

    // Exécution de la requête avec pagination
    const [monsterDocs, total] = await Promise.all([
      Monster.find(query)
        .sort(sort)
        .skip(skip)
        .limit(pagination.limit)
        .exec(),
      Monster.countDocuments(query).exec()
    ])

    return {
      monsters: monsterDocs.map(doc => this.mapToEnrichedMonster(doc)),
      total
    }
  }

  private mapToEnrichedMonster (doc: any): EnrichedMonster {
    return {
      tamagotchi: this.mapToEntity(doc),
      equippedItems: {
        hat: doc.equippedItems?.hat ?? null,
        glasses: doc.equippedItems?.glasses ?? null,
        shoes: doc.equippedItems?.shoes ?? null
      },
      equippedBackground: doc.equippedBackground ?? null
    }
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
      doc.ownerId.toString(),
      doc.isPublic ?? false
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
