'use client'

interface ErrorMessageProps {
  message: string | null
  type?: 'error' | 'success'
}

export default function ErrorMessage ({ message, type = 'error' }: ErrorMessageProps): React.ReactNode {
  if (message === null || message === '') return null

  const bgColor = type === 'error' ? 'bg-red-50' : 'bg-green-50'
  const textColor = type === 'error' ? 'text-red-500' : 'text-green-500'
  const borderColor = type === 'error' ? 'border-red-200' : 'border-green-200'
  const icon = type === 'error' ? '😅' : '🎉'

  return (
    <div className={`${bgColor} ${textColor} border ${borderColor} rounded-lg p-4 mb-6 flex items-center gap-3 text-sm animate-fade-in`}>
      <span className='text-lg'>{icon}</span>
      <p>{message}</p>
    </div>
  )
}
