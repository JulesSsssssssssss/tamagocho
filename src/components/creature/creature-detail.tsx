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
    <div className='min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      {/* Effet de grille rétro en arrière-plan */}
      <div className='fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none' />

      {/* Particules pixel-art - jaunes comme le wallet */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-10 left-10 w-3 h-3 bg-yellow-400/30 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated' }} />
        <div className='absolute top-20 right-20 w-4 h-4 bg-yellow-400/20 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '0.5s' }} />
        <div className='absolute bottom-16 left-1/4 w-2 h-2 bg-yellow-400/25 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1s' }} />
        <div className='absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400/15 rounded-sm animate-pulse' style={{ imageRendering: 'pixelated', animationDelay: '1.5s' }} />
      </div>

      <div className='relative z-10 w-full min-h-screen p-4 md:p-6 lg:p-8'>
        {/* Container principal avec max-width */}
        <div className='max-w-7xl mx-auto space-y-4 md:space-y-6'>
          {/* En-tête avec nom et niveau */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
            {/* Pixels dans les coins */}
            <div className='absolute top-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 left-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-2 right-2 w-4 h-4 bg-yellow-400 rounded-sm' style={{ imageRendering: 'pixelated' }} />
            <CreatureHeader
              name={currentMonster.name}
              level={currentMonster.level}
            />
          </div>

          {/* Barre XP - Même largeur que l'en-tête */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl border-4 border-slate-700/50 shadow-xl overflow-hidden'>
            <CreatureXpBar
              level={currentMonster.level}
              xp={currentMonster.xp}
              xpToNextLevel={currentMonster.xpToNextLevel}
            />
          </div>

          {/* Grid principal - 2 colonnes sur grand écran */}
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6'>
            {/* Colonne gauche - Avatar */}
            <div className='lg:col-span-1 space-y-4 md:space-y-6'>
              {/* Avatar animé */}
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-6 md:p-8 border-4 border-slate-700/50 shadow-xl relative overflow-hidden aspect-square'>
                {/* Grille pixel art en arrière-plan */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />
                {/* Effet de lueur derrière l'avatar */}
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

              {/* Liste des accessoires équipés */}
              <CreatureEquippedItemsList
                equippedItems={currentMonster.equippedItems}
                creatureId={currentMonster._id}
                onItemChange={() => { void refreshMonster() }}
              />

              {/* Gestionnaire de fonds d'écran */}
              <CreatureBackgroundManager
                creatureId={currentMonster._id}
                onBackgroundChange={() => { void refreshMonsterAndBackground() }}
              />

              {/* Statut Public/Privé */}
              <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 border-4 border-slate-700/50 shadow-xl relative'>
                {/* Grille pixel art */}
                <div className='absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:1rem_1rem] opacity-40 pointer-events-none' />

                <div className='relative z-10 space-y-3'>
                  <h3 className='text-sm font-bold text-white flex items-center gap-2 font-mono tracking-wider'>
                    <span className='text-base'>{currentMonster.isPublic ? '🌍' : '🔒'}</span>
                    VISIBILITÉ
                  </h3>

                  {/* Badge statut actuel */}
                  <div className='flex items-center justify-between'>
                    <PublicStatusBadge
                      isPublic={currentMonster.isPublic ?? false}
                      size='md'
                      showLabel
                    />

                    {/* Bouton toggle */}
                    <button
                      onClick={handleTogglePublicStatus}
                      className='
                        px-3 py-2
                        bg-yellow-500 hover:bg-yellow-400
                        text-slate-900 font-bold text-xs
                        rounded-lg border-2 border-yellow-600
                        shadow-[0_0_15px_rgba(234,179,8,0.5)]
                        transition-all duration-300
                        active:scale-95
                        font-mono tracking-wider
                      '
                      style={{ imageRendering: 'pixelated' }}
                    >
                      {currentMonster.isPublic ? 'RENDRE PRIVÉ' : 'RENDRE PUBLIC'}
                    </button>
                  </div>

                  {/* Description */}
                  <p className='text-xs text-gray-400'>
                    {currentMonster.isPublic
                      ? '🌐 Ton monstre est visible par tous dans la galerie communautaire'
                      : '🔐 Ton monstre est visible uniquement par toi'}
                  </p>
                </div>
              </div>
            </div>

            {/* Colonne droite - Stats, Actions, Infos */}
            <div className='lg:col-span-2 space-y-4 md:space-y-6'>
              {/* Stats et Actions */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
                {/* Statistiques */}
                <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
                  {/* Coins pixel jaunes */}
                  <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

                  <h3 className='text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono tracking-wider'>
                    <span className='text-xl md:text-2xl'>📊</span>
                    STATISTIQUES
                  </h3>
                  <CreatureStats
                    hunger={currentMonster.hunger}
                    energy={currentMonster.energy}
                    happiness={currentMonster.happiness}
                  />
                </div>

                {/* Actions */}
                <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
                  {/* Coins pixel jaunes */}
                  <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

                  <CreatureActions
                    creatureId={currentMonster._id}
                  />
                </div>
              </div>

              {/* Traits et Informations */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6'>
                {/* Traits caractéristiques */}
                <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
                  {/* Coins pixel jaunes */}
                  <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

                  <h3 className='text-base md:text-lg font-bold text-white mb-4 flex items-center gap-2 font-mono tracking-wider'>
                    <span className='text-xl md:text-2xl'>✨</span>
                    CARACTÉRISTIQUES
                  </h3>
                  <MonsterTraitsDisplay traits={traits} />
                </div>

                {/* Informations temporelles */}
                <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
                  {/* Coins pixel jaunes */}
                  <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
                  <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

                  <CreatureInfo
                    createdAt={currentMonster.createdAt}
                    updatedAt={currentMonster.updatedAt}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Message gaming - PLEINE LARGEUR */}
          <div className='bg-slate-900/90 backdrop-blur-sm rounded-2xl p-4 md:p-6 border-4 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)] relative'>
            {/* Coins pixel jaunes */}
            <div className='absolute top-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute top-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-0 left-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />
            <div className='absolute bottom-0 right-0 w-4 h-4 bg-yellow-400' style={{ imageRendering: 'pixelated' }} />

            <div className='flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center'>
              <span className='text-2xl md:text-3xl'>🎮</span>
              <p className='text-xs md:text-sm text-white font-medium font-mono'>
                <strong className='text-yellow-400'>PRENDS SOIN DE TON MONSTRE !</strong> Utilise les bonnes actions pour gagner de l'XP et monter de niveau.
              </p>
              <span className='text-2xl md:text-3xl'>⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureDetail
