/**
 * Composant de notification d'achat - Style pixel art gaming
 *
 * Responsabilités (SRP):
 * - Afficher les notifications de succès/erreur lors des achats
 * - Animation d'entrée/sortie fluide
 * - Auto-dismiss après délai
 *
 * Principe OCP:
 * - Extensible via les types de notification
 *
 * Optimisation (Performance):
 * - Mémoïsé avec React.memo pour éviter les re-renders inutiles
 * - Ne re-render que si type, title, message ou isVisible changent
 */

'use client'

import { useEffect, memo } from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface PurchaseNotificationProps {
  type: NotificationType
  title: string
  message: string
  isVisible: boolean
  onClose: () => void
  autoDismiss?: boolean
  dismissDelay?: number
}

/**
 * Composant de notification pour les achats
 *
 * @param {PurchaseNotificationProps} props - Props du composant
 * @returns {React.ReactNode} Notification stylisée
 */
export const PurchaseNotification = memo(function PurchaseNotification ({
  type,
  title,
  message,
  isVisible,
  onClose,
  autoDismiss = true,
  dismissDelay = 5000
}: PurchaseNotificationProps): React.ReactNode {
  // Auto-dismiss
  useEffect(() => {
    if (isVisible && autoDismiss) {
      const timer = setTimeout(() => {
        onClose()
      }, dismissDelay)

      return () => { clearTimeout(timer) }
    }
  }, [isVisible, autoDismiss, dismissDelay, onClose])

  if (!isVisible) return null

  // Configuration visuelle selon le type
  const config = {
    success: {
      icon: '✅',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-400',
      shadowColor: 'shadow-[0_0_30px_rgba(34,197,94,0.5)]'
    },
    error: {
      icon: '❌',
      bgColor: 'bg-red-500',
      borderColor: 'border-red-400',
      shadowColor: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]'
    },
    warning: {
      icon: '⚠️',
      bgColor: 'bg-yellow-500',
      borderColor: 'border-yellow-400',
      shadowColor: 'shadow-[0_0_30px_rgba(234,179,8,0.5)]'
    },
    info: {
      icon: 'ℹ️',
      bgColor: 'bg-blue-500',
      borderColor: 'border-blue-400',
      shadowColor: 'shadow-[0_0_30px_rgba(59,130,246,0.5)]'
    }
  }

  const { icon, bgColor, borderColor, shadowColor } = config[type]

  return (
    <div className='fixed top-4 right-4 z-[9999] animate-slide-in-right'>
      <div
        className={`
          relative
          bg-slate-900/95 backdrop-blur-sm
          rounded-2xl
          p-4 md:p-6
          border-4 ${borderColor}
          ${shadowColor}
          max-w-md
          min-w-[300px]
        `}
        style={{ imageRendering: 'pixelated' }}
      >
        {/* Coins pixel */}
        <div className={`absolute top-0 left-0 w-4 h-4 ${bgColor}`} style={{ imageRendering: 'pixelated' }} />
        <div className={`absolute top-0 right-0 w-4 h-4 ${bgColor}`} style={{ imageRendering: 'pixelated' }} />
        <div className={`absolute bottom-0 left-0 w-4 h-4 ${bgColor}`} style={{ imageRendering: 'pixelated' }} />
        <div className={`absolute bottom-0 right-0 w-4 h-4 ${bgColor}`} style={{ imageRendering: 'pixelated' }} />

        {/* Contenu */}
        <div className='flex items-start gap-4'>
          <div className='text-4xl flex-shrink-0'>
            {icon}
          </div>

          <div className='flex-1 space-y-2'>
            <h3 className='text-lg font-bold text-white font-mono tracking-wider'>
              {title}
            </h3>
            <p className='text-sm text-slate-300 font-mono leading-relaxed'>
              {message}
            </p>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className='
              flex-shrink-0
              w-8 h-8
              flex items-center justify-center
              text-white hover:text-slate-300
              transition-colors duration-200
              font-mono font-bold text-xl
            '
            aria-label='Fermer'
          >
            ×
          </button>
        </div>

        {/* Barre de progression (auto-dismiss) */}
        {autoDismiss && (
          <div className='absolute bottom-0 left-0 right-0 h-1 bg-slate-700/50 rounded-b-xl overflow-hidden'>
            <div
              className={`h-full ${bgColor} animate-progress-bar`}
              style={{
                animationDuration: `${dismissDelay}ms`,
                animationTimingFunction: 'linear'
              }}
            />
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) =>
  prevProps.type === nextProps.type &&
  prevProps.title === nextProps.title &&
  prevProps.message === nextProps.message &&
  prevProps.isVisible === nextProps.isVisible
)

/**
 * Styles CSS pour les animations (à ajouter dans globals.css si nécessaire)
 *
 * @keyframes slide-in-right {
 *   from {
 *     transform: translateX(100%);
 *     opacity: 0;
 *   }
 *   to {
 *     transform: translateX(0);
 *     opacity: 1;
 *   }
 * }
 *
 * @keyframes progress-bar {
 *   from { width: 100%; }
 *   to { width: 0%; }
 * }
 *
 * .animate-slide-in-right {
 *   animation: slide-in-right 0.3s ease-out;
 * }
 *
 * .animate-progress-bar {
 *   animation: progress-bar linear;
 * }
 */
