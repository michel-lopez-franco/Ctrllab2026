const VARIANTS = {
  primary: 'bg-primary-600 hover:bg-primary-500 text-white',
  secondary: 'bg-surface-elevated hover:bg-slate-700 text-slate-200 border border-surface-border',
  ghost: 'hover:bg-slate-800 text-slate-300',
  danger: 'bg-red-600 hover:bg-red-500 text-white',
  accent: 'bg-secondary-600 hover:bg-secondary-500 text-white',
}

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center gap-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
