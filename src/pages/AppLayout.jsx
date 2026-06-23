import { Outlet, NavLink } from 'react-router-dom'
import { LayoutDashboard, Cpu, BookOpen, Trophy, Settings } from 'lucide-react'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { getLevelInfo, getXPForNextLevel } from '@/features/gamification/logic/levels.js'
import { ProgressBar } from '@/components/ui/index.js'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/simulator', icon: Cpu, label: 'Simulador' },
  { to: '/modules', icon: BookOpen, label: 'Módulos' },
]

export function AppLayout() {
  const { xp, level } = useGamificationStore()
  const levelInfo = getLevelInfo(level)
  const nextXP = getXPForNextLevel(level)
  const prevXP = getLevelInfo(level).xpRequired

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#334155] flex flex-col">
        <div className="p-6 border-b border-[#334155]">
          <h1 className="text-xl font-bold font-mono text-white tracking-tight">
            <span className="text-primary-400">Ctrl</span>lab
          </h1>
          <p className="text-xs text-slate-500 mt-1">Control Automático</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* XP panel */}
        <div className="p-4 border-t border-[#334155]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-primary-600/30 flex items-center justify-center text-primary-400 font-bold text-sm">
              {level}
            </div>
            <div>
              <div className={`text-sm font-semibold ${levelInfo.color}`}>{levelInfo.name}</div>
              <div className="text-xs text-slate-500">{xp} XP</div>
            </div>
          </div>
          {nextXP && (
            <ProgressBar value={xp - prevXP} max={nextXP - prevXP} color="bg-primary-500" />
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
