'use client'

import { useEffect } from 'react'

export function useAutoRefresh (intervalMs: number = 30000): void {
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Trigger the tick endpoint to apply health decay
        const response = await fetch('/api/tamagotchis/tick', {
          method: 'POST'
        })

        if (response.ok) {
          // Optionally refresh the page or emit an event
          // to notify components to refresh their data
          window.dispatchEvent(new Event('tamagotchi-updated'))
        }
      } catch (error) {
        console.error('Error triggering tamagotchi tick:', error)
      }
    }, intervalMs)

    return () => clearInterval(interval)
  }, [intervalMs])
}
