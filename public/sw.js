/* global self */
// Simple service worker that logs a message every 10 seconds
// Note: Browsers may suspend service workers when idle, so logs may stop when the SW is not active.

self.addEventListener('install', (event) => {
  console.log('[SW] install')
  // activate worker immediately
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('[SW] activate')
  // take control of uncontrolled clients right away
  event.waitUntil(self.clients.claim())
})

// Helper to start a recurring log
function startRecurringLog () {
  try {
    // Save interval id to global scope so it can be cleared if needed
    if (typeof self._tamagotchoInterval === 'number') return

    self._tamagotchoInterval = setInterval(() => {
      console.log('[SW] tick', new Date().toISOString())
    }, 1_000)
  } catch (err) {
    console.error('[SW] failed to start interval', err)
  }
}

// Start logging when the SW is evaluated. This will run while the worker is alive.
startRecurringLog()

// Also listen for messages so a client can explicitly start the logging again if needed
self.addEventListener('message', (event) => {
  const data = event && event.data
  if (data && data.type === 'START_LOG') {
    startRecurringLog()
    event.source?.postMessage?.({ type: 'LOG_STARTED' })
  } else if (data && data.type === 'STOP_LOG') {
    try {
      if (typeof self._tamagotchoInterval === 'number') {
        clearInterval(self._tamagotchoInterval)
        // unset the interval id
        // eslint-disable-next-line no-undefined
        self._tamagotchoInterval = undefined
      }
      event.source?.postMessage?.({ type: 'LOG_STOPPED' })
    } catch (err) {
      console.error('[SW] failed to stop interval', err)
    }
  }
})
