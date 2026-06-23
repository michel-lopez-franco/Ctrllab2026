const VARIANTS = {
  default: 'bg-surface-elevated text-slate-300 border-surface-border',
  primary: 'bg-primary-600/20 text-primary-300 border-primary-500/30',
  secondary: 'bg-secondary-600/20 text-secondary-300 border-secondary-500/30',
  accent: 'bg-accent-600/20 text-accent-300 border-accent-500/30',
  success: 'bg-success-600/20 text-success-300 border-success-500/30',
  warning: 'bg-warning-600/20 text-warning-300 border-warning-500/30',
  danger: 'bg-danger-600/20 text-danger-300 border-danger-500/30',
  gradient: 'bg-gradient-to-r from-primary-600/20 to-secondary-600/20 text-white border-primary-500/30',
}

const SIZES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
}

const RARITIES = {
  common: 'border-slate-500/50 bg-slate-600/10',
  rare: 'border-blue-500/50 bg-blue-600/10 shadow-sm shadow-blue-500/20',
  epic: 'border-violet-500/50 bg-violet-600/10 shadow-md shadow-violet-500/30',
  legendary: 'border-amber-400/50 bg-amber-600/10 shadow-lg shadow-amber-400/40 animate-pulse-glow',
}

export function Badge({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  icon,
  dot = false,
  rarity,
  ...props 
}) {
  const variantClass = rarity ? RARITIES[rarity] : VARIANTS[variant]
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 
        font-semibold rounded-lg border
        transition-all duration-200
        ${variantClass}
        ${SIZES[size]}
        ${className}
      `}
      {...props}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

export function BadgeGroup({ children, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {children}
    </div>
  )
}
