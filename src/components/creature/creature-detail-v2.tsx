'use client'

import { memo, useEffect, useState, useCallback } from 'react'
import type { DBMonster } from '@/shared/types/monster'
import CreatureHeader from './creature-header'
import CreatureAvatar from './creature-avatar'
import CreatureInfo from './creature-info'
import CreatureStats from './creature-stats'
import CreatureXpBar from './creature-xp-bar'
import CreatureActions from './creature-actions'
import CreatureEquippedItemsList from './creature-equipped-items-list'
import CreatureBackgroundManager from './creature-background-manager'
import MonsterTraitsDisplay from '../monsters/monster-traits-display'
import PublicStatusBadge from './public-status-badge'
import { useQuestProgress } from '@/hooks/use-quest-progress'

interface CreatureDetailProps {
  creature: DBMonster
}

/**
 * NOUVELLE VERSION - Layout Gaming inspiré des consoles rétro
 *
 * Structure :
 * - Header CRT style avec effet scanline
 * - Grid 3 colonnes : Avatar + Stats (1/3) | Infos (2/3)
 * - Cards 2x2 pour les sections secondaires
 * - Design épuré, moins de bordures jaunes
 */
const CreatureDetail = memo(function CreatureDetail ({
  creature
}: CreatureDetailProps): React.ReactNode {
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(creature)
  const [backgroundRefreshKey, setBackgroundRefreshKey] = useState<number>(0)
  const { trackMakePublic } = useQuestProgress()
  const traits = JSON.parse(currentMonster.traits)

  const refreshMonster = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${currentMonster._id}`)
      if (response.ok) {
        const updatedMonster: DBMonster = await response.json()
        if (updatedMonster !== null && updatedMonster !== undefined) {
          setCurrentMonster(updatedMonster)
        }
      } else if (response.status !== 401) {
        console.error('Erreur lors de la récupération du monstre :', response.status)
      }
    } catch (error) {
      // Erreur silencieuse
    }
  }, [currentMonster._id])

  const refreshMonsterAndBackground = useCallback(async (): Promise<void> => {
    await refreshMonster()
    setBackgroundRefreshKey(prev => prev + 1)
  }, [refreshMonster])

  const handleTogglePublicStatus = useCallback((): void => {
    void (async () => {
      try {
        const newPublicStatus = !(currentMonster.isPublic ?? false)
        const response = await fetch(
          `/api/monsters/${currentMonster._id}/public`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isPublic: newPublicStatus })
          }
        )

        if (response.ok) {
          await refreshMonster()
          if (newPublicStatus) {
            trackMakePublic()
          }
        } else {
          console.error('Erreur lors du changement de visibilité')
        }
      } catch (error) {
        console.error('Erreur:', error)
      }
    })()
  }, [currentMonster._id, currentMonster.isPublic, refreshMonster, trackMakePublic])

  useEffect(() => {
    const interval = setInterval(() => {
      void refreshMonster()
    }, 1000)
    return () => { clearInterval(interval) }
  }, [refreshMonster])

  return (
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'>
      {/* Grille pixel art subtile */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none' />

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6'>
        <div className='max-w-6xl mx-auto space-y-4'>

          {/* 🎮 HEADER - Style écran CRT rétro */}
          <div className='relative'>
            {/* Glow externe */}
            <div className='absolute -inset-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl blur-sm opacity-75' />

            <div className='relative bg-slate-900 rounded-3xl border-4 border-yellow-500 overflow-hidden'>
              {/* Scanlines effet CRT */}
              <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />

              <div className='relative p-6 space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <CreatureHeader
                      name={currentMonster.name}
                      level={currentMonster.level}
                    />
                  </div>

                  <div className='bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-black text-sm border-2 border-yellow-600 shadow-lg font-mono'>
                    LVL {currentMonster.level}
                  </div>
                </div>

                <div className='bg-slate-800/80 rounded-xl overflow-hidden border-2 border-slate-700'>
                  <CreatureXpBar
                    level={currentMonster.level}
                    xp={currentMonster.xp}
                    xpToNextLevel={currentMonster.xpToNextLevel}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 LAYOUT - Grid 3 colonnes */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>

            {/* COLONNE 1 - Avatar + Stats (1/3) */}
            <div className='space-y-4'>
              <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 overflow-hidden shadow-2xl'>
                <div className='aspect-square relative'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none' />
                  <div className='absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent' />

                  <div className='relative z-10 w-full h-full p-6 flex items-center justify-center'>
                    <CreatureAvatar
                      traitsJson={currentMonster.traits}
                      state={currentMonster.state}
                      equippedItems={currentMonster.equippedItems}
                      creatureId={currentMonster._id}
                      refreshKey={backgroundRefreshKey}
                    />
                  </div>
                </div>

                {/* Stats collées sous l'avatar */}
                <div className='p-4 bg-slate-900/50 border-t-2 border-slate-700'>
                  <CreatureStats
                    hunger={currentMonster.hunger}
                    energy={currentMonster.energy}
                    happiness={currentMonster.happiness}
                  />
                </div>
              </div>
            </div>

            {/* COLONNES 2+3 - Infos (2/3) */}
            <div className='lg:col-span-2 space-y-4'>

              {/* Actions - Mise en avant */}
              <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 p-5 shadow-xl'>
                <div className='flex items-center gap-2 mb-4'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse' />
                  <h3 className='text-sm font-black text-yellow-400 font-mono tracking-widest'>
                    ACTIONS
                  </h3>
                </div>
                <CreatureActions creatureId={currentMonster._id} />
              </div>

              {/* Grid 2x2 infos secondaires */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                {/* Traits */}
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 p-5 shadow-xl'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-lg'>✨</span>
                    <h3 className='text-xs font-black text-gray-300 font-mono tracking-widest'>
                      CARACTÉRISTIQUES
                    </h3>
                  </div>
                  <MonsterTraitsDisplay traits={traits} />
                </div>

                {/* Infos */}
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 p-5 shadow-xl'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-lg'>📅</span>
                    <h3 className='text-xs font-black text-gray-300 font-mono tracking-widest'>
                      INFORMATIONS
                    </h3>
                  </div>
                  <CreatureInfo
                    createdAt={currentMonster.createdAt}
                    updatedAt={currentMonster.updatedAt}
                  />
                </div>

                {/* Accessoires */}
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 p-5 shadow-xl'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-lg'>👕</span>
                    <h3 className='text-xs font-black text-gray-300 font-mono tracking-widest'>
                      ACCESSOIRES
                    </h3>
                  </div>
                  <CreatureEquippedItemsList
                    equippedItems={currentMonster.equippedItems}
                    creatureId={currentMonster._id}
                    onItemChange={() => { void refreshMonster() }}
                  />
                </div>

                {/* Fond d'écran */}
                <div className='bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border-2 border-slate-700 p-5 shadow-xl'>
                  <div className='flex items-center gap-2 mb-4'>
                    <span className='text-lg'>🖼️</span>
                    <h3 className='text-xs font-black text-gray-300 font-mono tracking-widest'>
                      FOND D'ÉCRAN
                    </h3>
                  </div>
                  <CreatureBackgroundManager
                    creatureId={currentMonster._id}
                    onBackgroundChange={() => { void refreshMonsterAndBackground() }}
                  />
                </div>
              </div>

              {/* Visibilité - Bandeau */}
              <div className='bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl border-2 border-slate-700 p-4 shadow-xl'>
                <div className='flex items-center justify-between gap-4'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl border-2 ${
                        currentMonster.isPublic
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-slate-700/20 border-slate-600/50'
                      }`}
                    >
                      {currentMonster.isPublic ? '🌍' : '🔒'}
                    </div>
                    <div>
                      <h4 className='text-xs font-black text-gray-400 font-mono tracking-widest'>VISIBILITÉ</h4>
                      <PublicStatusBadge
                        isPublic={currentMonster.isPublic ?? false}
                        size='sm'
                        showLabel
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePublicStatus}
                    className={`
                      px-5 py-2.5 rounded-xl font-black text-xs font-mono tracking-wider
                      border-2 transition-all duration-300 active:scale-95
                      ${currentMonster.isPublic
                        ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 border-yellow-600 shadow-[0_0_20px_rgba(234,179,8,0.5)]'
                      }
                    `}
                  >
                    {currentMonster.isPublic ? '🔒 PRIVÉ' : '🌍 PUBLIC'}
                  </button>
                </div>
                <p className='text-xs text-gray-500 mt-3 text-center'>
                  {currentMonster.isPublic
                    ? 'Ton monstre apparaît dans la galerie communautaire'
                    : 'Ton monstre est privé, visible uniquement par toi'}
                </p>
              </div>
            </div>
          </div>

          {/* Footer - Tip */}
          <div className='relative'>
            <div className='absolute -inset-0.5 bg-gradient-to-r from-yellow-500/20 via-yellow-400/20 to-yellow-500/20 rounded-xl blur' />
            <div className='relative bg-slate-900/80 backdrop-blur-sm rounded-xl border border-yellow-500/30 p-3'>
              <div className='flex items-center justify-center gap-3'>
                <span className='text-xl animate-pulse'>💡</span>
                <p className='text-xs text-gray-300 font-medium'>
                  <strong className='text-yellow-400'>Astuce :</strong> Interagis régulièrement avec ton monstre pour maximiser son bonheur et gagner de l'XP !
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
