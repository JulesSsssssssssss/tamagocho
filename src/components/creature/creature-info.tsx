import { memo } from 'react'

/**
 * Formate une date en français
 * @param {Date} date - Date à formater
 * @param {string} format - Format ('long', 'short', 'time')
 * @returns {string} Date formatée
 */
function formatDate (date: Date, formatType: 'long' | 'short' | 'time'): string {
  const options: Intl.DateTimeFormatOptions = formatType === 'long'
    ? { day: '2-digit', month: 'long', year: 'numeric' }
    : formatType === 'time'
      ? { hour: '2-digit', minute: '2-digit', second: '2-digit' }
      : { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }

  return new Intl.DateTimeFormat('fr-FR', options).format(date)
}

/**
 * Props du composant CreatureInfo
 */
interface CreatureInfoProps {
  /** Date de création de la créature */
  createdAt: Date
  /** Date de dernière mise à jour */
  updatedAt: Date
}

/**
 * Informations additionnelles sur la créature
 *
 * Responsabilités (SRP) :
 * - Affichage des dates de création et mise à jour
 * - Formatage des dates en français
 *
 * Optimisation (OCP) :
 * - Composant mémoïsé
 * - Ne re-render que si les dates changent
 *
 * @param {CreatureInfoProps} props - Props du composant
 * @returns {React.ReactNode} Informations de la créature
 *
 * @example
 * ```tsx
 * <CreatureInfo createdAt={creature.createdAt} updatedAt={creature.updatedAt} />
 * ```
 */
const CreatureInfo = memo(function CreatureInfo ({
  createdAt,
  updatedAt
}: CreatureInfoProps): React.ReactNode {
  // Conversion en objets Date si nécessaire
  const creationDate = createdAt instanceof Date ? createdAt : new Date(createdAt)
  const updateDate = updatedAt instanceof Date ? updatedAt : new Date(updatedAt)

  return (
    <div className='bg-slate-800/60 rounded-3xl p-6 shadow-lg ring-1 ring-yellow-500/20'>
      <h3 className='text-lg font-semibold text-white mb-4 font-mono tracking-wider'>
        📋 INFORMATIONS
      </h3>

      <div className='space-y-3'>
        {/* Date de naissance */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl' aria-hidden='true'>🎂</span>
            <span className='text-sm font-medium text-white font-mono'>
              Né le
            </span>
          </div>
          <span className='text-sm text-yellow-400 font-mono'>
            {formatDate(creationDate, 'long')}
          </span>
        </div>

        {/* Heure de naissance */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl' aria-hidden='true'>⏰</span>
            <span className='text-sm font-medium text-white font-mono'>
              Heure
            </span>
          </div>
          <span className='text-sm text-yellow-400 font-mono'>
            {formatDate(creationDate, 'time')}
          </span>
        </div>

        {/* Dernière interaction */}
        <div className='flex items-start justify-between gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-2xl' aria-hidden='true'>🔄</span>
            <span className='text-sm font-medium text-white font-mono'>
              Dernière activité
            </span>
          </div>
          <span className='text-sm text-yellow-400 font-mono'>
            {formatDate(updateDate, 'short')}
          </span>
        </div>

        {/* Âge approximatif */}
        <div className='mt-4 pt-4 border-t border-slate-200'>
          <div className='flex items-center justify-center gap-2 text-sm text-slate-600'>
            <span aria-hidden='true'>⌛</span>
            <span>
              Créé il y a {Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24))} jour(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  )
})

export default CreatureInfo
