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

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6'>
        <div className='max-w-7xl mx-auto space-y-4'>

          {/* 🎮 BOUTON RETOUR + HEADER CRT STYLE */}
          <div className='flex items-center gap-4 mb-2'>
            <button
              onClick={() => { router.push('/dashboard') }}
              className='group relative bg-slate-900 hover:bg-slate-800 border-4 border-yellow-500 rounded-xl px-4 py-2 font-black text-yellow-400 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-yellow-500/50'
            >
              <span className='flex items-center gap-2'>
                <span className='text-xl group-hover:-translate-x-1 transition-transform'>←</span>
                <span className='font-mono tracking-wider'>RETOUR</span>
              </span>
            </button>
          </div>

          {/* 🎮 HEADER CRT STYLE */}
          <div className='relative'>
            {/* Glow externe */}
            <div className='absolute -inset-1 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 rounded-3xl blur-md opacity-75 animate-pulse' />
            
            <div className='relative bg-slate-900 rounded-3xl border-4 border-yellow-500 overflow-hidden shadow-2xl'>
              {/* Scanlines effet CRT */}
              <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none' />
              
              <div className='relative p-5 space-y-4'>
                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
                  <div className='flex items-center gap-4'>
                    {/* Badge Level Pixel Art */}
                    <div className='w-16 h-16 bg-yellow-500 flex items-center justify-center text-slate-900 font-black text-2xl border-4 border-yellow-600 shadow-lg relative overflow-hidden'>
                      <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_52%)] bg-[size:8px_8px]' />
                      <span className='relative z-10'>{currentMonster.level}</span>
                    </div>
                    
                    {/* Nom + Status */}
                    <div>
                      <h1 className='text-3xl sm:text-4xl font-black text-yellow-400 tracking-tight font-mono [text-shadow:2px_2px_0px_rgba(0,0,0,0.8)]'>
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

                  {/* Bouton Public/Privé Pixel Art */}
                  <button
                    onClick={handleTogglePublicStatus}
                    className={`
                      relative px-6 py-3 font-black text-sm font-mono tracking-wider
                      border-4 transition-all duration-300 active:scale-95 shadow-lg
                      [text-shadow:1px_1px_0px_rgba(0,0,0,0.5)]
                      ${currentMonster.isPublic
                        ? 'bg-slate-700 hover:bg-slate-600 text-white border-slate-600 shadow-slate-600/50'
                        : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 border-yellow-600 shadow-yellow-600/50'
                      }
                    `}
                  >
                    <div className='absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.1)_49%,rgba(255,255,255,0.1)_51%,transparent_52%)] bg-[size:6px_6px]' />
                    <span className='relative z-10'>
                      {currentMonster.isPublic ? '🔒 PRIVÉ' : '🌍 PUBLIC'}
                    </span>
                  </button>
                </div>

                {/* XP Bar avec style pixel */}
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

          {/* 🎯 LAYOUT PRINCIPAL - Grid style arcade */}
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-4'>

            {/* 🎨 ZONE AVATAR - Style CRT */}
            <div className='lg:col-span-2'>
              <div className='sticky top-6'>
                <div className='relative'>
                  {/* Glow arcade */}
                  <div className='absolute -inset-1 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-2xl blur opacity-60 animate-pulse' />
                  
                  <div className='relative bg-slate-900 rounded-2xl border-4 border-yellow-500 overflow-hidden shadow-2xl'>
                    {/* Scanlines */}
                    <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] pointer-events-none z-20' />
                    
                    {/* Avatar */}
                    <div className='aspect-square p-6 relative bg-gradient-to-b from-slate-800 to-slate-900'>
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

                    {/* Stats avec bordure pixel */}
                    <div className='p-4 border-t-4 border-yellow-600 bg-slate-900/90'>
                      <CreatureStats
                        hunger={currentMonster.hunger}
                        energy={currentMonster.energy}
                        happiness={currentMonster.happiness}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 📊 ZONE INFOS & ACTIONS (3 cols) */}
            <div className='lg:col-span-3 space-y-4'>

              {/* 🎮 Actions - Style arcade */}
              <div className='relative'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 rounded-xl blur opacity-50' />
                <div className='relative bg-slate-900 rounded-xl border-4 border-green-500 p-5 shadow-2xl overflow-hidden'>
                  {/* Scanlines */}
                  <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
                  
                  <div className='relative z-10'>
                    <div className='flex items-center gap-3 mb-4'>
                      <div className='w-3 h-3 bg-green-500 animate-pulse border-2 border-green-400 shadow-lg shadow-green-500/50' />
                      <h3 className='text-sm font-black text-green-400 tracking-widest font-mono [text-shadow:1px_1px_0px_rgba(0,0,0,0.8)]'>
                        ACTIONS
                      </h3>
                    </div>
                    <CreatureActions creatureId={currentMonster._id} />
                  </div>
                </div>
              </div>

              {/* 📋 Grid d'infos - Style rétro */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>

                {/* Traits */}
                <div className='bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-purple-500/30 transition-all duration-300'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl'>✨</span>
                    <h3 className='text-xs font-bold text-gray-300 tracking-wide uppercase'>Caractéristiques</h3>
                  </div>
                  <MonsterTraitsDisplay traits={traits} />
                </div>

                {/* Infos */}
                <div className='bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-blue-500/30 transition-all duration-300'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl'>📅</span>
                    <h3 className='text-xs font-bold text-gray-300 tracking-wide uppercase'>Informations</h3>
                  </div>
                  <CreatureInfo
                    createdAt={currentMonster.createdAt}
                    updatedAt={currentMonster.updatedAt}
                  />
                </div>

                {/* Accessoires */}
                <div className='bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-pink-500/30 transition-all duration-300'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl'>👕</span>
                    <h3 className='text-xs font-bold text-gray-300 tracking-wide uppercase'>Accessoires</h3>
                  </div>
                  <CreatureEquippedItemsList
                    equippedItems={currentMonster.equippedItems}
                    creatureId={currentMonster._id}
                    onItemChange={() => { void refreshMonster() }}
                  />
                </div>

                {/* Fond d'écran */}
                <div className='bg-slate-900/40 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-orange-500/30 transition-all duration-300'>
                  <div className='flex items-center gap-2 mb-3'>
                    <span className='text-xl'>🖼️</span>
                    <h3 className='text-xs font-bold text-gray-300 tracking-wide uppercase'>Fond d'écran</h3>
                  </div>
                  <CreatureBackgroundManager
                    creatureId={currentMonster._id}
                    onBackgroundChange={() => { void refreshMonsterAndBackground() }}
                  />
                </div>
              </div>

              {/* � Astuce */}
              <div className='relative'>
                <div className='absolute -inset-0.5 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 rounded-xl blur' />
                <div className='relative bg-slate-900/40 backdrop-blur-sm rounded-xl border border-yellow-500/20 p-3'>
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl animate-pulse'>💡</span>
                    <p className='text-sm text-gray-300'>
                      <span className='font-bold text-yellow-400'>Astuce :</span> Interagis régulièrement pour maximiser le bonheur de ton monstre !
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
