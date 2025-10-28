function InputField ({
  type,
  name,
  value,
  label,
  onChange,
  onChangeText
}: {
  type?: string
  name?: string
  value?: string
  label?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onChangeText?: (text: string) => void
}): React.ReactNode {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (onChange !== undefined) onChange(e)
    if (onChangeText !== undefined) onChangeText?.(e.target.value)
  }

  return (
    <div className='w-full mb-4'>
      {label && (
        <label className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          className='w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-bermuda-400 focus:border-transparent transition-all duration-200 placeholder-gray-400'
        />
        {type === 'password' && (
          <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 select-none'>
            🔒
          </span>
        )}
        {type === 'email' && (
          <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 select-none'>
            ✉️
          </span>
        )}
      </div>
    </div>
  )
}

export default InputField
