const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-500 text-white shadow-md shadow-primary-500/20 hover:shadow-primary-500/30',
  secondary: 'bg-surface-elevated hover:bg-surface-hover text-slate-200 border border-surface-border hover:border-surface-border-light shadow-sm',
  ghost: 'hover:bg-surface-elevated text-slate-300 hover:text-white',
  danger: 'bg-danger-600 hover:bg-danger-500 text-white shadow-md shadow-danger-500/20',
  accent: 'bg-secondary-600 hover:bg-secondary-500 text-white shadow-md shadow-secondary-500/20',
  success: 'bg-success-600 hover:bg-success-500 text-white shadow-md shadow-success-500/20',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
  xl: 'px-9 py-4 text-lg',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
  iconPosition = 'left',
  loading = false,
  ...props
}) {
  const content = (
    <>
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {icon && iconPosition === 'left' && !loading && <span className="flex-shrink-0">{icon}</span>}
      <span className="font-semibold">{children}</span>
      {icon && iconPosition === 'right' && !loading && <span className="flex-shrink-0">{icon}</span>}
    </>
  )

  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg 
        transition-all duration-200 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface 
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        active:scale-[0.98]
        ${VARIANTS[variant]} 
        ${SIZES[size]} 
        ${!disabled && 'hover:transform hover:-translate-y-0.5'}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  )
}
