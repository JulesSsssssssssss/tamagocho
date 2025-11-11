'use client'

import { Input } from '@/components/ui/input'

interface InputFieldProps extends React.ComponentProps<'input'> {
  label?: string
  error?: string
  onChangeText?: (value: string) => void
}

export default function InputField ({
  label,
  error,
  onChange,
  onChangeText,
  ...props
}: InputFieldProps): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e)
    onChangeText?.(e.target.value)
  }

  return (
    <div className='space-y-2'>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
        </label>
      )}
      <Input
        {...props}
        onChange={handleChange}
        className={error ? 'border-red-500' : ''}
      />
      {error && (
        <p className='text-sm text-red-500'>{error}</p>
      )}
    </div>
  )
}
