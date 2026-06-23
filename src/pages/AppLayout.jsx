import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Cpu, BookOpen, Trophy, Settings, Bell, Star } from 'lucide-react'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { getLevelInfo } from '@/features/gamification/logic/levels.js'
import { ProgressBar, Badge } from '@/components/ui/index.js'
import { NotificationContainer } from '@/features/gamification/components/NotificationToast.jsx'
import { LevelUpModal } from '@/features/gamification/components/LevelUpModal.jsx'
import { useEffect } from 'react'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/simulator', icon: Cpu, label: 'Simulador' },
  { to: '/modules', icon: BookOpen, label: 'Módulos' },
  { to: '/challenges', icon: Trophy, label: 'Retos' },
]

export function AppLayout() {
  const { 
    xp, 
    level, 
    notifications, 
    clearNotification, 
    pendingLevelUp, 
    clearLevelUp,
    updateDailyStreak,
    stats,
  } = useGamificationStore()
  
  const levelInfo = getLevelInfo(level)
  const nextLevelInfo = getLevelInfo(level + 1)
  const progressToNextLevel = nextLevelInfo 
    ? ((xp - levelInfo.minXP) / (nextLevelInfo.minXP - levelInfo.minXP)) * 100 
    : 100

  useEffect(() => {
    // Update daily streak on mount
    updateDailyStreak()
  }, [])

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-surface via-surface-elevated to-surface">
      {/* Sidebar */}
      <aside className="w-72 border-r border-surface-border flex flex-col glass-strong">
        {/* Logo */}
        <div className="p-6 border-b border-surface-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-gradient">Ctrllab</span>
              </h1>
              <p className="text-xs text-slate-500">Control Automático</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/10 text-primary-300 border border-primary-400/40 shadow-lg shadow-primary-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-surface-elevated border border-transparent hover:border-surface-border'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    className={`transition-all duration-200 ${isActive ? 'scale-110 text-primary-400 filter drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]' : 'group-hover:scale-110 text-slate-400 group-hover:text-slate-200'}`}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
 
        {/* Stats Quick View */}
        <div className="p-4 border-t border-surface-border space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Estadísticas</span>
            <Badge variant="primary" size="sm" className="border-primary-500/30 text-primary-300">{stats.streakDays}d racha</Badge>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-elevated rounded-lg p-2 border border-surface-border">
              <p className="text-xs text-slate-500">Retos</p>
              <p className="text-lg font-bold text-white font-mono">{stats.challengesCompleted}</p>
            </div>
            <div className="bg-surface-elevated rounded-lg p-2 border border-surface-border">
              <p className="text-xs text-slate-500">Módulos</p>
              <p className="text-lg font-bold text-white font-mono">{stats.modulesCompleted}/6</p>
            </div>
          </div>
        </div>
 
        {/* XP Panel */}
        <div className="p-4 border-t border-surface-border bg-gradient-to-br from-primary-500/5 to-secondary-500/5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-lg shadow-accent-500/30 border-2 border-accent-400/40 shrink-0">
              <Star className="w-6 h-6 text-slate-950 fill-slate-950" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">Nivel {level}</span>
                <Badge variant="accent" size="sm" className="font-bold border-accent-500/30 text-accent-300 bg-accent-500/10 shadow-[0_0_10px_rgba(245,158,11,0.15)]">{levelInfo.name}</Badge>
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5 xp-badge-prize">{xp.toLocaleString()} XP</div>
            </div>
          </div>
          
          <ProgressBar 
            value={xp - levelInfo.minXP} 
            max={nextLevelInfo ? nextLevelInfo.minXP - levelInfo.minXP : 1000}
            variant="primary"
            size="md"
            animated
          />
          
          {nextLevelInfo && (
            <p className="text-xs text-slate-500 mt-2 text-center">
              {(nextLevelInfo.minXP - xp).toLocaleString()} XP para nivel {level + 1}
            </p>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative">
        <Outlet />
      </main>

      {/* Notifications */}
      <NotificationContainer 
        notifications={notifications} 
        onClearNotification={clearNotification}
      />

      {/* Level Up Modal */}
      {pendingLevelUp && (
        <LevelUpModal 
          level={pendingLevelUp} 
          onClose={clearLevelUp}
        />
      )}
    </div>
  )
}