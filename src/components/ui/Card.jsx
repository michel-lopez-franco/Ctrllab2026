const VARIANTS = {
  default: 'bg-surface-elevated border-surface-border',
  glass: 'glass border-surface-border-light',
  accent: 'bg-surface-elevated border-primary-500/30',
  success: 'bg-surface-elevated border-success-500/30',
  elevated: 'bg-surface-elevated border-surface-border shadow-lg shadow-black/10',
}

const HOVER_EFFECTS = {
  none: '',
  lift: 'hover-lift cursor-pointer',
  glow: 'hover:shadow-md hover:shadow-primary-500/10 transition-shadow duration-300',
  scale: 'hover:scale-[1.01] transition-transform duration-200 cursor-pointer',
}

export function Card({ 
  children, 
  className = '', 
  variant = 'default',
  hover = 'none',
  padding = true,
  ...props 
}) {
  return (
    <div
      className={`
        rounded-xl border backdrop-blur-sm
        transition-all duration-200
        ${VARIANTS[variant]}
        ${HOVER_EFFECTS[hover]}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className = '', gradient = false }) {
  return (
    <h3 className={`text-xl font-bold ${gradient ? 'text-gradient' : 'text-white'} ${className}`}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-slate-400 mt-1 ${className}`}>
      {children}
    </p>
  )
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t border-surface-border ${className}`}>
      {children}
    </div>
  )
}
