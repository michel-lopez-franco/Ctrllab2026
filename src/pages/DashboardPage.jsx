import { BookOpen, Cpu, Trophy, Flame } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, Button, ProgressBar } from '@/components/ui/index.js'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { BADGES } from '@/features/gamification/logic/badges.js'
import { getLevelInfo } from '@/features/gamification/logic/levels.js'

const MODULES_OVERVIEW = [
  { id: 'dinamica', title: 'Sistemas Dinámicos', description: 'EDOs, variables de estado, linealización', xp: 100, locked: false },
  { id: 'temporal', title: 'Respuesta Temporal', description: 'Transitoria, estado estacionario, métricas', xp: 120, locked: false },
  { id: 'estabilidad', title: 'Estabilidad', description: 'Routh-Hurwitz, lugar de raíces', xp: 150, locked: true },
  { id: 'frecuencia', title: 'Análisis en Frecuencia', description: 'Bode, Nyquist, márgenes', xp: 150, locked: true },
  { id: 'pid', title: 'Control PID', description: 'Sintonización, efectos de parámetros', xp: 200, locked: true },
  { id: 'retos', title: 'Retos Integrados', description: 'Escenarios reales de ingeniería', xp: 300, locked: true },
]

export function DashboardPage() {
  const { xp, level, stats, badges } = useGamificationStore()
  const levelInfo = getLevelInfo(level)
  const earnedBadges = BADGES.filter((b) => badges.includes(b.id))

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Bienvenido a Ctrllab</h2>
        <p className="text-slate-400 mt-1">Aprende control automático mediante simulación y retos interactivos.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Trophy size={20} className="text-amber-400" />} label="Nivel" value={`${levelInfo.name}`} sub={`${xp} XP`} />
        <StatCard icon={<BookOpen size={20} className="text-blue-400" />} label="Módulos" value={`${stats.modulesCompleted}/6`} sub="completados" />
        <StatCard icon={<Cpu size={20} className="text-cyan-400" />} label="Simulaciones" value={stats.simulationsRun} sub="ejecutadas" />
        <StatCard icon={<Flame size={20} className="text-orange-400" />} label="Racha" value={`${stats.streakDays}d`} sub="días seguidos" />
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6 flex flex-col gap-4" accent>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-600/30 flex items-center justify-center">
              <Cpu size={22} className="text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Simulador PID</h3>
              <p className="text-sm text-slate-400">Experimenta con ganancias y observa la respuesta en tiempo real</p>
            </div>
          </div>
          <NavLink to="/simulator">
            <Button className="w-full">Abrir simulador</Button>
          </NavLink>
        </Card>

        <Card className="p-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-secondary-600/30 flex items-center justify-center">
              <BookOpen size={22} className="text-secondary-400" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Módulos teóricos</h3>
              <p className="text-sm text-slate-400">Aprende los conceptos con teoría interactiva y quizzes</p>
            </div>
          </div>
          <NavLink to="/modules">
            <Button variant="secondary" className="w-full">Ver módulos</Button>
          </NavLink>
        </Card>
      </div>

      {/* Módulos grid */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Ruta de aprendizaje</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES_OVERVIEW.map((mod, i) => (
            <Card key={mod.id} className={`p-4 ${mod.locked ? 'opacity-50' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-mono text-slate-500">Módulo {i + 1}</span>
                <span className="text-xs text-primary-400 font-semibold">+{mod.xp} XP</span>
              </div>
              <h4 className="font-semibold text-white text-sm">{mod.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{mod.description}</p>
              {mod.locked && <p className="text-xs text-slate-600 mt-2">🔒 Completa el anterior para desbloquear</p>}
            </Card>
          ))}
        </div>
      </div>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Insignias obtenidas</h3>
          <div className="flex flex-wrap gap-3">
            {earnedBadges.map((b) => (
              <div key={b.id} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700">
                <span className={`text-lg ${b.color}`}>{b.icon}</span>
                <span className="text-sm text-slate-300">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-slate-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-2xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub}</div>
    </Card>
  )
}
