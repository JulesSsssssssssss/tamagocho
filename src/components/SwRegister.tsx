'use client'

import { useEffect } from 'react'

export default function SwRegister (): null {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator)) return

    let mounted = true

    navigator.serviceWorker.register('/sw.js')
      .then(reg => {
        console.log('[client] Service worker registered', reg)

        const startLog = (): void => {
          if (navigator.serviceWorker.controller != null) {
            navigator.serviceWorker.controller.postMessage({ type: 'START_LOG' })
          }
        }

        if (reg.active != null) {
          startLog()
        } else {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (!mounted) return
            if (navigator.serviceWorker.controller != null) startLog()
          })
        }
      })
      .catch(err => {
        console.error('[client] SW registration failed', err)
      })

    const stopLog = (): void => {
      try {
        if (navigator.serviceWorker.controller != null) {
          navigator.serviceWorker.controller.postMessage({ type: 'STOP_LOG' })
        }
      } catch (err) {
        // ignore
      }
    }

    const onBeforeUnload = (): void => {
      stopLog()
    }

    const onPageHide = (): void => {
      stopLog()
    }

    const onVisibilityChange = (): void => {
      if (document.visibilityState === 'hidden') stopLog()
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    window.addEventListener('pagehide', onPageHide)
    document.addEventListener('visibilitychange', onVisibilityChange)

    return () => {
      mounted = false
      window.removeEventListener('beforeunload', onBeforeUnload)
      window.removeEventListener('pagehide', onPageHide)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      // ensure we ask SW to stop when component unmounts
      stopLog()
    }
  }, [])

  return null
}
