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

/**
 * Props du composant CreatureDetail
 */
interface CreatureDetailProps {
  /** Données complètes de la créature */
  creature: DBMonster
}

/**
 * Composant principal d'affichage des détails d'une créature
 *
 * Responsabilités (SRP) :
 * - Composition des sous-composants de la page créature
 * - Organisation de la mise en page
 * - Synchronisation automatique avec le serveur
 *
 * Architecture (OCP) :
 * - Extensible par ajout de nouveaux sous-composants
 * - Chaque section est indépendante
 *
 * Composition :
 * - CreatureHeader : En-tête avec nom/niveau
 * - CreatureAvatar : Avatar animé du monstre
 * - CreatureStats : Barres de progression (hunger, energy, happiness)
 * - CreatureActions : Boutons d'interaction
 * - MonsterTraitsDisplay : Traits caractéristiques
 * - CreatureInfo : Informations temporelles
 *
 * Optimisation :
 * - Composant mémoïsé
 * - Sous-composants mémoïsés individuellement
 * - Polling optimisé (1s) pour mise à jour fluide sans refresh visible
 *
 * @param {CreatureDetailProps} props - Props du composant
 * @returns {React.ReactNode} Page de détails de la créature
 *
 * @example
 * ```tsx
 * const creature = await getMonsterById(id)
 * return <CreatureDetail creature={creature} />
 * ```
 */
const CreatureDetail = memo(function CreatureDetail ({
  creature
}: CreatureDetailProps): React.ReactNode {
  // State local pour les données du monstre (mis à jour par polling)
  const [currentMonster, setCurrentMonster] = useState<DBMonster>(creature)
  // Clé de rafraîchissement pour forcer le rechargement du fond d'écran
  const [backgroundRefreshKey, setBackgroundRefreshKey] = useState<number>(0)

  // Hook de progression des quêtes
  const { trackMakePublic } = useQuestProgress()

  // Parse des traits pour MonsterTraitsDisplay
  const traits = JSON.parse(currentMonster.traits)

  // Fonction pour rafraîchir les données du monstre
  const refreshMonster = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch(`/api/monster?id=${currentMonster._id}`)
      if (response.ok) {
        const updatedMonster: DBMonster = await response.json()
        // Vérifier que le monstre existe avant de mettre à jour
        if (updatedMonster !== null && updatedMonster !== undefined) {
          setCurrentMonster(updatedMonster)
        }
      } else {
        // Ne pas logger les erreurs 401 (non authentifié) pour éviter le spam
        if (response.status !== 401) {
          console.error('Erreur lors de la récupération du monstre :', response.status)
        }
      }
    } catch (error) {
      // Erreur réseau silencieuse (le polling continue)
      // Ne pas logger pour éviter le spam de la console
    }
  }, [currentMonster._id])

  // Fonction pour rafraîchir le monstre ET le fond d'écran
  const refreshMonsterAndBackground = useCallback(async (): Promise<void> => {
    await refreshMonster()
    setBackgroundRefreshKey(prev => prev + 1)
  }, [refreshMonster])

  // Handler pour le toggle du statut public/privé
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
          // Tracker la quête "Rendre monstre public" si passage en public
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

  // Polling pour synchroniser les données avec le serveur
  // Met à jour le state React sans refresh visible de page
  useEffect(() => {
    // Polling toutes les secondes pour mise à jour fluide
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
        {/* Container principal - Style Game Boy */}
        <div className='max-w-6xl mx-auto space-y-4'>
          
          {/* 🎮 HEADER - Style écran de jeu rétro */}
          <div className='relative'>
            {/* Bordure externe jaune épaisse */}
            <div className='absolute -inset-1 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 rounded-3xl blur-sm opacity-75' />
            
            <div className='relative bg-slate-900 rounded-3xl border-4 border-yellow-500 overflow-hidden'>
              {/* Scanlines effet CRT */}
              <div className='absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none' />
              
              <div className='relative p-6 space-y-4'>
                {/* Nom + Niveau */}
                <div className='flex items-center justify-between'>
                  <div>
                    <CreatureHeader
                      name={currentMonster.name}
                      level={currentMonster.level}
                    />
                  </div>
                  
                  {/* Badge niveau style rétro */}
                  <div className='bg-yellow-500 text-slate-900 px-4 py-2 rounded-lg font-black text-sm border-2 border-yellow-600 shadow-lg font-mono'>
                    LVL {currentMonster.level}
                  </div>
                </div>
                
                {/* Barre XP */}
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

          {/* 🎯 ZONE 2: Layout Principal - Grid 2 colonnes */}
          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            
            {/* COLONNE GAUCHE - Avatar avec fond (2/5 de la largeur) */}
            <div className='lg:col-span-2'>
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-slate-700/50 shadow-xl relative overflow-hidden'>
                {/* Grille pixel art subtile */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-30 pointer-events-none' />
                
                {/* Effet de lueur douce */}
                <div className='absolute inset-0 bg-gradient-to-t from-yellow-500/5 via-transparent to-transparent' />
                
                {/* Avatar grande taille */}
                <div className='relative z-10 aspect-square w-full flex items-center justify-center'>
                  <CreatureAvatar
                    traitsJson={currentMonster.traits}
                    state={currentMonster.state}
                    equippedItems={currentMonster.equippedItems}
                    creatureId={currentMonster._id}
                    refreshKey={backgroundRefreshKey}
                  />
                </div>
              </div>
            </div>

            {/* COLONNE DROITE - Infos et Actions (3/5 de la largeur) */}
            <div className='lg:col-span-3 space-y-6'>
              
              {/* Bloc Stats + Actions - MÊME CARTE */}
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 shadow-xl overflow-hidden'>
                <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50'>
                  {/* Stats */}
                  <div className='p-5'>
                    <h3 className='text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2 font-mono tracking-wider'>
                      <span className='text-lg'>�</span>
                      STATISTIQUES
                    </h3>
                    <CreatureStats
                      hunger={currentMonster.hunger}
                      energy={currentMonster.energy}
                      happiness={currentMonster.happiness}
                    />
                  </div>

                  {/* Actions */}
                  <div className='p-5'>
                    <CreatureActions
                      creatureId={currentMonster._id}
                    />
                  </div>
                </div>
              </div>

              {/* Bloc Traits + Infos - MÊME CARTE */}
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 shadow-xl overflow-hidden'>
                <div className='grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-700/50'>
                  {/* Traits */}
                  <div className='p-5'>
                    <h3 className='text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2 font-mono tracking-wider'>
                      <span className='text-lg'>✨</span>
                      CARACTÉRISTIQUES
                    </h3>
                    <MonsterTraitsDisplay traits={traits} />
                  </div>

                  {/* Informations */}
                  <div className='p-5'>
                    <CreatureInfo
                      createdAt={currentMonster.createdAt}
                      updatedAt={currentMonster.updatedAt}
                    />
                  </div>
                </div>
              </div>

              {/* Bloc Customisation - PLEINE LARGEUR */}
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl border-2 border-slate-700/50 shadow-xl p-5'>
                <h3 className='text-sm font-bold text-yellow-400 mb-4 flex items-center gap-2 font-mono tracking-wider'>
                  <span className='text-lg'>🎨</span>
                  PERSONNALISATION
                </h3>
                
                <div className='space-y-4'>
                  {/* Accessoires équipés */}
                  <div>
                    <h4 className='text-xs font-semibold text-gray-400 mb-2 font-mono'>ACCESSOIRES</h4>
                    <CreatureEquippedItemsList
                      equippedItems={currentMonster.equippedItems}
                      creatureId={currentMonster._id}
                      onItemChange={() => { void refreshMonster() }}
                    />
                  </div>

                  {/* Fond d'écran */}
                  <div>
                    <h4 className='text-xs font-semibold text-gray-400 mb-2 font-mono'>FOND D'ÉCRAN</h4>
                    <CreatureBackgroundManager
                      creatureId={currentMonster._id}
                      onBackgroundChange={() => { void refreshMonsterAndBackground() }}
                    />
                  </div>

                  {/* Visibilité */}
                  <div className='pt-4 border-t border-slate-700/50'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-lg'>{currentMonster.isPublic ? '🌍' : '🔒'}</span>
                        <div>
                          <h4 className='text-xs font-semibold text-white font-mono'>VISIBILITÉ</h4>
                          <PublicStatusBadge
                            isPublic={currentMonster.isPublic ?? false}
                            size='sm'
                            showLabel
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={handleTogglePublicStatus}
                        className='
                          px-4 py-2
                          bg-yellow-500 hover:bg-yellow-400
                          text-slate-900 font-bold text-xs
                          rounded-lg border-2 border-yellow-600
                          shadow-[0_0_15px_rgba(234,179,8,0.4)]
                          transition-all duration-300
                          active:scale-95
                          font-mono tracking-wider
                        '
                        style={{ imageRendering: 'pixelated' }}
                      >
                        {currentMonster.isPublic ? 'PRIVÉ' : 'PUBLIC'}
                      </button>
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>
                      {currentMonster.isPublic
                        ? 'Visible dans la galerie communautaire'
                        : 'Visible uniquement par toi'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎯 Message d'aide - Bandeau pleine largeur */}
          <div className='bg-gradient-to-r from-yellow-500/10 via-yellow-400/5 to-yellow-500/10 rounded-xl p-4 border border-yellow-500/20'>
            <div className='flex items-center justify-center gap-3 text-center'>
              <span className='text-2xl'>🎮</span>
              <p className='text-sm text-gray-300 font-medium'>
                <strong className='text-yellow-400'>Astuce :</strong> Prends soin de ton monstre pour gagner de l'XP et monter de niveau !
              </p>
              <span className='text-2xl'>⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
