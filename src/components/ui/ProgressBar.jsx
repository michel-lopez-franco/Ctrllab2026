export function ProgressBar({ 
  value = 0, 
  max = 100, 
  className = '', 
  showLabel = false,
  variant = 'primary',
  size = 'md',
  animated = true,
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const VARIANTS = {
    primary: 'from-primary-400 to-secondary-400',
    secondary: 'from-secondary-500 to-secondary-400',
    accent: 'from-accent-500 to-accent-400',
    success: 'from-success-600 to-success-400',
    warning: 'from-warning-600 to-warning-400',
    danger: 'from-danger-600 to-danger-400',
  }

  const SIZES = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
    xl: 'h-6',
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-300">Progreso</span>
          <span className="text-sm font-mono font-semibold text-primary-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-elevated rounded-full overflow-hidden border border-surface-border ${SIZES[size]}`}>
        <div
          className={`
            ${SIZES[size]} 
            bg-gradient-to-r ${VARIANTS[variant]}
            rounded-full 
            transition-all duration-500 ease-out
            relative overflow-hidden
            ${animated ? 'animate-shimmer' : ''}
          `}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          )}
        </div>
      </div>
    </div>
  )
}

export function CircularProgress({ 
  value = 0, 
  max = 100, 
  size = 120,
  strokeWidth = 8,
  className = '',
  showLabel = true,
  variant = 'primary',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const COLORS = {
    primary: '#00f0ff',
    secondary: '#39ff14',
    accent: '#ffb300',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface-border"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={COLORS[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${COLORS[variant]}40)`,
          }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-white font-mono">{Math.round(percentage)}%</span>
          <span className="text-xs text-slate-400 mt-1">completado</span>
        </div>
      )}
    </div>
  )
}