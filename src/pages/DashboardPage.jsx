import { BookOpen, Cpu, Trophy, Flame, Star, Zap, Target, Award, TrendingUp, Clock } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, ProgressBar, CircularProgress, Badge, BadgeGroup } from '@/components/ui/index.js'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { BADGES } from '@/features/gamification/logic/badges.js'
import { getLevelInfo } from '@/features/gamification/logic/levels.js'

const MODULES_OVERVIEW = [
  { id: 'dinamica', title: 'Sistemas Dinámicos', description: 'EDOs, variables de estado, linealización', xp: 100, locked: false, icon: '🔄', color: 'from-blue-600/20 to-cyan-600/10' },
  { id: 'temporal', title: 'Respuesta Temporal', description: 'Transitoria, estado estacionario, métricas', xp: 120, locked: false, icon: '⏱️', color: 'from-purple-600/20 to-pink-600/10' },
  { id: 'estabilidad', title: 'Estabilidad', description: 'Routh-Hurwitz, lugar de raíces', xp: 150, locked: true, icon: '⚖️', color: 'from-green-600/20 to-emerald-600/10' },
  { id: 'frecuencia', title: 'Análisis en Frecuencia', description: 'Bode, Nyquist, márgenes', xp: 150, locked: true, icon: '📊', color: 'from-orange-600/20 to-red-600/10' },
  { id: 'pid', title: 'Control PID', description: 'Sintonización, efectos de parámetros', xp: 200, locked: true, icon: '🎛️', color: 'from-indigo-600/20 to-violet-600/10' },
  { id: 'retos', title: 'Retos Integrados', description: 'Escenarios reales de ingeniería', xp: 300, locked: true, icon: '🏆', color: 'from-amber-600/20 to-yellow-600/10' },
]

export function DashboardPage() {
  const { xp, level, stats, badges } = useGamificationStore()
  const levelInfo = getLevelInfo(level)
  const nextLevelInfo = getLevelInfo(level + 1)
  const earnedBadges = BADGES.filter((b) => badges.includes(b.id))
  const progressToNextLevel = nextLevelInfo ? ((xp - levelInfo.minXP) / (nextLevelInfo.minXP - levelInfo.minXP)) * 100 : 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface via-surface-elevated to-surface">
      <div className="relative p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Header - más sutil */}
        <div className="text-center space-y-3 py-6 animate-slide-up">
          <h1 className="text-4xl font-bold text-white">
            Bienvenido a <span className="text-gradient">Ctrllab</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Aprende control automático mediante simulación interactiva
          </p>
        </div>

        {/* Level Progress Card - más discreto */}
        <Card variant="accent" hover="glow" className="animate-scale-in">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
                  <Star className="w-7 h-7 text-primary-400" />
                </div>
                <div>
                  <CardTitle>Nivel {level} • {levelInfo.name}</CardTitle>
                  <CardDescription>{xp.toLocaleString()} XP total</CardDescription>
                </div>
              </div>
              <CircularProgress 
                value={xp - levelInfo.minXP} 
                max={nextLevelInfo ? nextLevelInfo.minXP - levelInfo.minXP : 1000}
                size={90}
                variant="primary"
              />
            </div>
          </CardHeader>
          <CardContent>
            <ProgressBar 
              value={xp - levelInfo.minXP} 
              max={nextLevelInfo ? nextLevelInfo.minXP - levelInfo.minXP : 1000}
              showLabel
              variant="primary"
              size="md"
              animated
            />
            {nextLevelInfo && (
              <p className="text-sm text-slate-400 mt-2 text-center">
                {(nextLevelInfo.minXP - xp).toLocaleString()} XP para <span className="text-primary-400 font-medium">{nextLevelInfo.name}</span>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Grid - más limpio */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<Trophy className="text-amber-400" />} 
            label="Retos Completados" 
            value={stats.challengesCompleted}
            variant="default"
          />
          <StatCard 
            icon={<BookOpen className="text-blue-400" />} 
            label="Módulos" 
            value={`${stats.modulesCompleted}/6`}
            progress={(stats.modulesCompleted / 6) * 100}
            variant="default"
          />
          <StatCard 
            icon={<Cpu className="text-cyan-400" />} 
            label="Simulaciones" 
            value={stats.simulationsRun}
            subtitle="ejecutadas"
            variant="default"
          />
          <StatCard 
            icon={<Flame className="text-orange-400" />} 
            label="Racha Actual" 
            value={`${stats.streakDays}`}
            subtitle="días seguidos"
            variant="default"
          />
        </div>

        {/* Quick Actions - más profesional */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="glass" hover="lift" className="group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/20 flex items-center justify-center border border-primary-500/30 group-hover:scale-105 transition-transform">
                  <Cpu size={24} className="text-primary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Simulador PID</h3>
                  <p className="text-sm text-slate-400">Experimenta con parámetros y observa la respuesta en tiempo real</p>
                </div>
              </div>
              <NavLink to="/simulator" className="block">
                <Button className="w-full" size="md" icon={<Zap size={16} />}>
                  Abrir Simulador
                </Button>
              </NavLink>
            </CardContent>
          </Card>

          <Card variant="glass" hover="lift" className="group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-secondary-600/20 flex items-center justify-center border border-secondary-500/30 group-hover:scale-105 transition-transform">
                  <BookOpen size={24} className="text-secondary-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">Módulos de Aprendizaje</h3>
                  <p className="text-sm text-slate-400">Teoría interactiva, quizzes y ejercicios prácticos</p>
                </div>
              </div>
              <NavLink to="/modules" className="block">
                <Button variant="secondary" className="w-full" size="md" icon={<Target size={16} />}>
                  Ver Módulos
                </Button>
              </NavLink>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path - más organizado */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Target className="text-primary-400" size={28} />
              Ruta de Aprendizaje
            </h2>
            <Badge variant="primary" size="lg">
              {stats.modulesCompleted}/6 Completados
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODULES_OVERVIEW.map((mod, i) => (
              <Card 
                key={mod.id} 
                variant={mod.locked ? 'default' : 'elevated'}
                hover={mod.locked ? 'none' : 'scale'}
                className={`group relative overflow-hidden ${mod.locked ? 'opacity-60' : ''}`}
              >
                {/* Gradient overlay más sutil */}
                {!mod.locked && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${mod.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                )}
                
                <CardContent className="p-5 relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{mod.icon}</span>
                      <Badge variant="default" size="sm">Módulo {i + 1}</Badge>
                    </div>
                    <Badge variant="primary" size="sm" icon={<Star size={12} />}>
                      +{mod.xp}
                    </Badge>
                  </div>
                  
                  <h4 className="font-bold text-white text-base mb-2">
                    {mod.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-3">{mod.description}</p>
                  
                  {mod.locked ? (
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <span>🔒</span>
                      <span>Completa el módulo anterior</span>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="w-full">
                      Comenzar →
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Achievements Section - más compacto */}
        {earnedBadges.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <Award className="text-amber-400" size={28} />
                Logros Desbloqueados
              </h2>
              <Badge variant="accent" size="lg">
                {earnedBadges.length}/{BADGES.length}
              </Badge>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {earnedBadges.map((badge) => (
                <Card 
                  key={badge.id} 
                  variant="glass" 
                  hover="lift"
                  className="group"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-slate-400 mb-2">{badge.description}</p>
                    <Badge rarity={badge.rarity} size="sm">
                      {badge.rarity}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, subtitle, progress, variant = 'default' }) {
  return (
    <Card 
      variant="glass" 
      hover="lift"
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-surface-border flex items-center justify-center">
            {icon}
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{label}</p>
          <p className="text-2xl font-bold text-white font-mono">{value}</p>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          {progress !== undefined && (
            <ProgressBar value={progress} max={100} size="sm" variant="primary" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
