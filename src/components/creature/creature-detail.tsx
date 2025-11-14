'use client'

import { memo, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
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
 * VERSION PIXEL ART - Design rétro gaming
 *
 * Structure :
 * - Bouton retour dashboard
 * - Header CRT style avec scanlines
 * - Grid 2 colonnes avec bordures épaisses colorées
 * - Effets pixel art et arcade partout
 */
const CreatureDetail = memo(function CreatureDetail ({
  creature
}: CreatureDetailProps): React.ReactNode {
  const router = useRouter()
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
      {/* Grille pixel art */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none' />

      <div className='relative z-10 w-full min-h-screen p-3 sm:p-4 md:p-6'>
        <div className='max-w-7xl mx-auto space-y-3 sm:space-y-4'>

          {/* 🎮 BOUTON RETOUR ARCADE */}
          <button
            onClick={() => { router.push('/dashboard') }}
            className='group relative bg-slate-900 hover:bg-slate-800 border-3 sm:border-4 border-yellow-500 rounded-lg sm:rounded-xl px-3 py-2 sm:px-5 sm:py-3 font-black text-yellow-400 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-yellow-500/50 overflow-hidden w-full sm:w-auto'
          >
            <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[size:6px_6px]' />
            <span className='relative z-10 flex items-center justify-center gap-2 font-mono tracking-wider [text-shadow:2px_2px_0px_rgba(0,0,0,0.8)] text-sm sm:text-base'>
              <span className='text-xl sm:text-2xl group-hover:-translate-x-1 transition-transform'>←</span>
              <span>RETOUR</span>
            </span>
          </button>

          {/* 🎮 HEADER CRT STYLE */}
          <div className='relative'>
            <div className='absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-2xl sm:rounded-3xl blur-md opacity-75 animate-pulse' />

            <div className='relative bg-slate-900 rounded-2xl sm:rounded-3xl border-3 sm:border-4 border-yellow-500 overflow-hidden shadow-2xl'>
              <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none' />

              <div className='relative p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4'>
                <div className='flex flex-col gap-3 sm:gap-4'>
                  <div className='flex items-center gap-2 sm:gap-4'>
                    <div className='w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 flex items-center justify-center text-slate-900 font-black text-2xl sm:text-3xl border-3 sm:border-4 border-yellow-600 shadow-lg relative overflow-hidden flex-shrink-0'>
                      <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_52%)] bg-[size:8px_8px]' />
                      <span className='relative z-10'>{currentMonster.level}</span>
                    </div>

                    <div className='min-w-0 flex-1'>
                      <h1 className='text-2xl sm:text-3xl md:text-4xl font-black text-yellow-400 tracking-tight font-mono [text-shadow:2px_2px_0px_rgba(0,0,0,0.8)] break-words'>
                        {currentMonster.name}
                      </h1>
                      <div className='flex items-center gap-2 mt-1'>
                        <PublicStatusBadge
                          isPublic={currentMonster.isPublic ?? false}
                          size='sm'
                          showLabel
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleTogglePublicStatus}
                    className={`
                      relative px-4 py-2 sm:px-6 sm:py-3 font-black text-xs sm:text-sm font-mono tracking-wider
                      border-3 sm:border-4 transition-all duration-300 active:scale-95 shadow-lg overflow-hidden
                      [text-shadow:1px_1px_0px_rgba(0,0,0,0.5)] w-full sm:w-auto
                      ${currentMonster.isPublic
                        ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-slate-600/50'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 border-yellow-600 shadow-yellow-600/50'
                      }
                    `}
                  >
                    <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.15)_49%,rgba(255,255,255,0.15)_51%,transparent_52%)] bg-[size:6px_6px]' />
                    <span className='relative z-10'>
                      {currentMonster.isPublic ? '🔒 PRIVÉ' : '🌍 PUBLIC'}
                    </span>
                  </button>
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

          {/* 🎯 LAYOUT ARCADE - Grid 2 colonnes */}
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4'>

            {/* 🎨 CARTE AVATAR CRT */}
            <div className='lg:col-span-2'>
              <div className='sticky top-3 sm:top-6 relative'>
                <div className='absolute -inset-1 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl sm:rounded-2xl blur opacity-60 animate-pulse' />

                <div className='relative bg-slate-900 rounded-xl sm:rounded-2xl border-3 sm:border-4 border-yellow-500 overflow-hidden shadow-2xl'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-20' />

                  <div className='aspect-square p-3 sm:p-4 md:p-6 relative bg-gradient-to-b from-slate-800 to-slate-900'>
                    <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]' />
                    <div className='absolute inset-0 bg-gradient-to-t from-yellow-500/10 via-transparent to-transparent' />

                    <div className='relative z-10 w-full h-full flex items-center justify-center'>
                      <CreatureAvatar
                        traitsJson={currentMonster.traits}
                        state={currentMonster.state}
                        equippedItems={currentMonster.equippedItems}
                        creatureId={currentMonster._id}
                        refreshKey={backgroundRefreshKey}
                      />
                    </div>
                  </div>

                  <div className='p-3 sm:p-4 border-t-3 sm:border-t-4 border-yellow-600 bg-slate-900/90'>
                    <CreatureStats
                      hunger={currentMonster.hunger}
                      energy={currentMonster.energy}
                      happiness={currentMonster.happiness}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 📊 ZONE ACTIONS & INFOS */}
            <div className='lg:col-span-3 space-y-3 sm:space-y-4'>

              {/* 🎮 ACTIONS */}
              <div className='relative'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-lg sm:rounded-xl blur opacity-50' />
                <div className='relative bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-green-500 p-3 sm:p-4 md:p-5 shadow-2xl overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />

                  <div className='relative z-10'>
                    <div className='flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4'>
                      <div className='w-2 h-2 sm:w-3 sm:h-3 bg-green-500 animate-pulse border-2 border-green-400 shadow-lg shadow-green-500/50' />
                      <h3 className='text-xs sm:text-sm font-black text-green-400 tracking-widest font-mono [text-shadow:1px_1px_0px_rgba(0,0,0,0.8)]'>
                        ACTIONS
                      </h3>
                    </div>
                    <CreatureActions creatureId={currentMonster._id} />
                  </div>
                </div>
              </div>

              {/* 📋 GRID INFOS PIXEL ART */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>

                {/* Traits */}
                <div className='bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-purple-500 p-3 sm:p-4 shadow-xl hover:shadow-purple-500/50 transition-all duration-300 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  <div className='relative z-10'>
                    <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                      <span className='text-base sm:text-xl'>✨</span>
                      <h3 className='text-xs font-black text-purple-400 tracking-widest font-mono'>TRAITS</h3>
                    </div>
                    <MonsterTraitsDisplay traits={traits} />
                  </div>
                </div>

                {/* Infos */}
                <div className='bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-blue-500 p-3 sm:p-4 shadow-xl hover:shadow-blue-500/50 transition-all duration-300 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  <div className='relative z-10'>
                    <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                      <span className='text-base sm:text-xl'>📅</span>
                      <h3 className='text-xs font-black text-blue-400 tracking-widest font-mono'>INFOS</h3>
                    </div>
                    <CreatureInfo
                      createdAt={currentMonster.createdAt}
                      updatedAt={currentMonster.updatedAt}
                    />
                  </div>
                </div>

                {/* Accessoires */}
                <div className='bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-pink-500 p-3 sm:p-4 shadow-xl hover:shadow-pink-500/50 transition-all duration-300 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  <div className='relative z-10'>
                    <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                      <span className='text-base sm:text-xl'>👕</span>
                      <h3 className='text-xs font-black text-pink-400 tracking-widest font-mono'>ITEMS</h3>
                    </div>
                    <CreatureEquippedItemsList
                      equippedItems={currentMonster.equippedItems}
                      creatureId={currentMonster._id}
                      onItemChange={() => { void refreshMonster() }}
                    />
                  </div>
                </div>

                {/* Fond d'écran */}
                <div className='bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-orange-500 p-3 sm:p-4 shadow-xl hover:shadow-orange-500/50 transition-all duration-300 relative overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  <div className='relative z-10'>
                    <div className='flex items-center gap-2 mb-2 sm:mb-3'>
                      <span className='text-base sm:text-xl'>🖼️</span>
                      <h3 className='text-xs font-black text-orange-400 tracking-widest font-mono'>BACKGROUND</h3>
                    </div>
                    <CreatureBackgroundManager
                      creatureId={currentMonster._id}
                      onBackgroundChange={() => { void refreshMonsterAndBackground() }}
                    />
                  </div>
                </div>
              </div>

              {/* 💡 ASTUCE ARCADE */}
              <div className='relative'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-lg sm:rounded-xl blur opacity-50' />
                <div className='relative bg-slate-900 rounded-lg sm:rounded-xl border-3 sm:border-4 border-yellow-500 p-3 sm:p-4 overflow-hidden'>
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  <div className='relative z-10 flex items-center gap-2 sm:gap-3'>
                    <span className='text-xl sm:text-2xl animate-pulse flex-shrink-0'>💡</span>
                    <p className='text-xs sm:text-sm text-yellow-100 font-mono [text-shadow:1px_1px_0px_rgba(0,0,0,0.8)]'>
                      <span className='font-black text-yellow-400'>TIP:</span> Interagis régulièrement pour maximiser le bonheur !
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
