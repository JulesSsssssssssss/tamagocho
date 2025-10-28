import { memo } from 'react'
import type { MonsterTraits } from '@/shared/types/monster'

/**
 * Labels traduits pour chaque style de corps
 */
const BODY_STYLE_LABELS: Record<MonsterTraits['bodyStyle'], string> = {
  round: 'Corps arrondi',
  square: 'Corps carré',
  tall: 'Corps élancé',
  wide: 'Corps large'
}

/**
 * Labels traduits pour chaque style d'yeux
 */
const EYE_STYLE_LABELS: Record<MonsterTraits['eyeStyle'], string> = {
  big: 'Grands yeux',
  small: 'Petits yeux',
  star: 'Yeux étoilés',
  sleepy: 'Yeux endormis'
}

/**
 * Labels traduits pour chaque style d'antenne
 */
const ANTENNA_STYLE_LABELS: Record<MonsterTraits['antennaStyle'], string> = {
  single: 'Antenne unique',
  double: 'Deux antennes',
  curly: 'Antennes bouclées',
  none: 'Sans antennes'
}

/**
 * Labels traduits pour chaque accessoire
 */
const ACCESSORY_LABELS: Record<MonsterTraits['accessory'], string> = {
  horns: 'Cornes',
  ears: 'Oreilles',
  tail: 'Queue',
  none: 'Sans accessoire'
}

/**
 * Configuration des traits à afficher
 */
const FEATURE_LABELS: Array<{
  key: keyof MonsterTraits
  label: string
  icon: string
}> = [
  { key: 'bodyStyle', label: 'Morphologie', icon: '🧬' },
  { key: 'eyeStyle', label: 'Regard', icon: '👀' },
  { key: 'antennaStyle', label: 'Antennes', icon: '📡' },
  { key: 'accessory', label: 'Accessoire', icon: '🎀' }
]

/**
 * Props du composant MonsterTraitsDisplay
 */
interface MonsterTraitsDisplayProps {
  /** Traits du monstre à afficher */
  traits: MonsterTraits
}

/**
 * Formate la valeur d'un trait pour l'affichage
 * 
 * @param {keyof MonsterTraits} key - Clé du trait
 * @param {MonsterTraits} traits - Tous les traits du monstre
 * @returns {string} Valeur formatée en français
 */
function formatTraitValue (key: keyof MonsterTraits, traits: MonsterTraits): string {
  switch (key) {
    case 'bodyStyle':
      return BODY_STYLE_LABELS[traits.bodyStyle]
    case 'eyeStyle':
      return EYE_STYLE_LABELS[traits.eyeStyle]
    case 'antennaStyle':
      return ANTENNA_STYLE_LABELS[traits.antennaStyle]
    case 'accessory':
      return ACCESSORY_LABELS[traits.accessory]
    default:
      return String(traits[key])
  }
}

/**
 * Composant d'affichage des traits caractéristiques d'un monstre
 * 
 * Responsabilités (SRP) :
 * - Affichage formaté des traits (morphologie, yeux, antennes, accessoire)
 * - Traduction des valeurs techniques en labels utilisateur
 * 
 * Optimisation (OCP) :
 * - Composant pur mémoïsé
 * - Ne re-render que si les traits changent
 * 
 * @param {MonsterTraitsDisplayProps} props - Props du composant
 * @returns {React.ReactNode} Liste des traits formatée
 * 
 * @example
 * ```tsx
 * <MonsterTraitsDisplay traits={monster.traits} />
 * ```
 */
const MonsterTraitsDisplay = memo(function MonsterTraitsDisplay ({
  traits
}: MonsterTraitsDisplayProps): React.ReactNode {
  return (
    <div className='rounded-2xl bg-white/80 p-3 text-sm text-slate-600 shadow-inner ring-1 ring-slate-100'>
      <p className='mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500'>
        Traits caractéristiques
      </p>
      <ul className='space-y-1'>
        {FEATURE_LABELS.map(({ key, label, icon }) => (
          <li key={key} className='flex items-center gap-2'>
            <span aria-hidden='true' className='text-base'>
              {icon}
            </span>
            <span className='font-medium text-slate-700'>
              {label}
            </span>
            <span className='text-slate-500'>
              :
              <span className='ml-1'>
                {formatTraitValue(key, traits)}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
})

export default MonsterTraitsDisplay
