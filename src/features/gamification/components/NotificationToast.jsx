import { X, Trophy, Star, Zap, Award, TrendingUp, CheckCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/index.js'

const NOTIFICATION_ICONS = {
  xp: <Star className="text-primary-400" size={16} />,
  badge: <Award className="text-amber-400" size={16} />,
  level_up: <TrendingUp className="text-success-400" size={16} />,
  mission_complete: <CheckCircle className="text-success-400" size={16} />,
  streak_milestone: <Zap className="text-orange-400" size={16} />,
}

const NOTIFICATION_COLORS = {
  xp: 'from-primary-600/10 to-primary-500/5 border-primary-500/20',
  badge: 'from-amber-600/10 to-amber-500/5 border-amber-500/20',
  level_up: 'from-success-600/10 to-success-500/5 border-success-500/20',
  mission_complete: 'from-success-600/10 to-success-500/5 border-success-500/20',
  streak_milestone: 'from-orange-600/10 to-orange-500/5 border-orange-500/20',
}

export function NotificationToast({ notification, onClose, index }) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    // Slide in animation
    setTimeout(() => setIsVisible(true), 50)

    // Auto dismiss after 4 seconds (más rápido)
    const timer = setTimeout(() => {
      handleClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => {
      onClose()
    }, 300)
  }

  return (
    <div
      className={`
        fixed right-4 z-50 w-80 max-w-[calc(100vw-2rem)]
        transition-all duration-300 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      style={{ top: `${4 + index * 5}rem` }}
    >
      <div className={`
        glass rounded-xl border p-3
        bg-gradient-to-br ${NOTIFICATION_COLORS[notification.type] || 'from-surface-elevated to-surface-elevated border-surface-border'}
        shadow-lg
      `}>
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
            {NOTIFICATION_ICONS[notification.type] || <Trophy className="text-primary-400" size={16} />}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-xs leading-tight">
              {notification.message}
            </p>
            {notification.xpReward && (
              <Badge variant="primary" size="sm" className="mt-1.5">
                +{notification.xpReward} XP
              </Badge>
            )}
          </div>

          <button
            onClick={handleClose}
            className="flex-shrink-0 w-5 h-5 rounded hover:bg-surface-elevated transition-colors flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function NotificationContainer({ notifications, onClearNotification }) {
  // Solo mostrar notificaciones importantes (nivel y badges)
  const importantNotifications = notifications.filter(n => 
    n.type === 'level_up' || n.type === 'badge' || n.type === 'streak_milestone'
  )

  return (
    <div className="fixed top-0 right-0 pointer-events-none z-50">
      <div className="pointer-events-auto">
        {importantNotifications.slice(0, 2).map((notification, index) => (
          <NotificationToast
            key={notification.timestamp}
            notification={notification}
            index={index}
            onClose={() => {
              const originalIndex = notifications.findIndex(n => n.timestamp === notification.timestamp)
              onClearNotification(originalIndex)
            }}
          />
        ))}
      </div>
    </div>
  )
}