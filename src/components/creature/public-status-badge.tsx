/**
 * Composant PublicStatusBadge
 *
 * Responsabilités (SRP):
 * - Afficher le statut public/privé d'un monstre
 * - Indicateur visuel avec icône et couleur
 * - Style pixel-art cohérent avec le design
 *
 * Principe OCP:
 * - Extensible via props (size, variant)
 *
 * Optimisation:
 * - Mémoïsé avec React.memo pour éviter re-renders inutiles
 */

import { memo } from 'react'

interface PublicStatusBadgeProps {
  isPublic: boolean
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

/**
 * Badge affichant le statut public/privé d'un monstre
 *
 * @param isPublic - true si le monstre est public, false si privé
 * @param size - Taille du badge (défaut: 'md')
 * @param showLabel - Afficher le label textuel (défaut: true)
 */
export const PublicStatusBadge = memo(function PublicStatusBadge ({
  isPublic,
  size = 'md',
  showLabel = true
}: PublicStatusBadgeProps): React.ReactNode {
  // Configuration visuelle selon le statut
  const config = isPublic
    ? {
        icon: '🌍',
        label: 'Public',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500',
        textColor: 'text-green-400',
        glowColor: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]'
      }
    : {
        icon: '🔒',
        label: 'Privé',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500',
        textColor: 'text-gray-400',
        glowColor: 'shadow-[0_0_10px_rgba(107,114,128,0.3)]'
      }

  // Classes de taille
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  }

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div
      className={`
        inline-flex items-center gap-2
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.borderColor}
        ${config.textColor}
        border-2 rounded-lg
        ${config.glowColor}
        font-mono font-bold
        transition-all duration-300
      `}
      style={{ imageRendering: 'pixelated' }}
    >
      <span className={iconSizes[size]}>{config.icon}</span>
      {showLabel && <span>{config.label}</span>}
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.isPublic === nextProps.isPublic &&
  prevProps.size === nextProps.size &&
  prevProps.showLabel === nextProps.showLabel
)

export default PublicStatusBadge
