'use client'

import { useState } from 'react'

/**
 * Page admin pour gérer la boutique
 */
export default function AdminPage (): React.ReactNode {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [itemCount, setItemCount] = useState<number | null>(null)

  const handleSeedShop = async (): Promise<void> => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/seed-shop', {
        method: 'POST'
      })

      const data = await response.json()

      if (data.success === true) {
        setMessage(`✅ ${data.message}`)
        setItemCount(data.count)
      } else {
        setMessage(`❌ ${data.message ?? data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckStatus = async (): Promise<void> => {
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/admin/seed-shop')
      const data = await response.json()

      setItemCount(data.currentItemCount)
      setMessage(`📊 Status: ${data.status} - ${data.currentItemCount} items in database`)
    } catch (error) {
      setMessage(`❌ Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🔧 Admin Panel</h1>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-4">Shop Management</h2>

          <div className="space-y-4">
            <button
              onClick={handleCheckStatus}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {loading ? 'Loading...' : '📊 Check Shop Status'}
            </button>

            <button
              onClick={handleSeedShop}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-all"
            >
              {loading ? 'Loading...' : '🌱 Seed Shop Items'}
            </button>
          </div>

          {message !== '' && (
            <div className="mt-6 p-4 bg-gray-900 rounded-lg border border-gray-700">
              <p className="text-white whitespace-pre-wrap">{message}</p>
              {itemCount !== null && (
                <p className="text-gray-400 mt-2">Total items: {itemCount}</p>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-900/30 border border-yellow-600 rounded-lg">
            <h3 className="text-yellow-400 font-bold mb-2">⚠️ Instructions</h3>
            <ul className="text-yellow-200 text-sm space-y-1">
              <li>1. Click "Check Shop Status" to see current items</li>
              <li>2. If empty, click "Seed Shop Items" to initialize</li>
              <li>3. This will create 12 items (4 hats, 4 glasses, 4 shoes)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
