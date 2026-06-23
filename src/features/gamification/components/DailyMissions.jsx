import { CheckCircle, Circle, Clock, Star, Zap } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, ProgressBar, Badge } from '@/components/ui/index.js'
import { useGamificationStore } from '../store/gamificationStore.js'
import { useEffect } from 'react'

export function DailyMissions() {
  const { missions, generateDailyMissions } = useGamificationStore()

  useEffect(() => {
    // Generate missions if empty
    if (missions.daily.length === 0) {
      generateDailyMissions()
    }
  }, [])

  const completedCount = missions.daily.filter(m => m.completed).length
  const totalMissions = missions.daily.length

  return (
    <Card variant="glass" hover="lift">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center shadow-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Misiones Diarias</CardTitle>
              <CardDescription>Se reinician cada 24 horas</CardDescription>
            </div>
          </div>
          <Badge variant="accent" size="lg">
            {completedCount}/{totalMissions}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {missions.daily.map((mission) => (
          <MissionItem key={mission.id} mission={mission} />
        ))}

        {missions.daily.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay misiones disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function MissionItem({ mission }) {
  const progress = (mission.progress / mission.target) * 100
  const isCompleted = mission.completed || mission.progress >= mission.target

  return (
    <div className={`
      p-4 rounded-xl border transition-all duration-200
      ${isCompleted 
        ? 'bg-success-600/10 border-success-500/40' 
        : 'bg-surface-elevated border-surface-border hover:border-surface-border-light'
      }
    `}>
      <div className="flex items-start gap-3">
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center
          ${isCompleted 
            ? 'bg-success-600 text-white' 
            : 'bg-surface border border-surface-border text-slate-400'
          }
        `}>
          {isCompleted ? (
            <CheckCircle size={20} />
          ) : (
            <Circle size={20} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h4 className={`font-semibold text-sm ${isCompleted ? 'text-success-300' : 'text-white'}`}>
                {mission.title}
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                {mission.description}
              </p>
            </div>
            <Badge 
              variant={isCompleted ? 'success' : 'primary'} 
              size="sm"
              icon={<Star size={12} />}
            >
              +{mission.xpReward} XP
            </Badge>
          </div>

          <div className="space-y-2">
            <ProgressBar 
              value={mission.progress} 
              max={mission.target}
              variant={isCompleted ? 'success' : 'primary'}
              size="sm"
            />
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Progreso: {mission.progress}/{mission.target}
              </span>
              {isCompleted && (
                <span className="text-success-400 font-semibold flex items-center gap-1">
                  <CheckCircle size={14} />
                  Completada
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function MissionsSummary() {
  const { missions } = useGamificationStore()
  const completedCount = missions.daily.filter(m => m.completed).length
  const totalXP = missions.daily.reduce((sum, m) => sum + (m.completed ? m.xpReward : 0), 0)

  return (
    <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-xl border border-surface-border">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-600 to-accent-400 flex items-center justify-center">
        <Zap className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-slate-400">Misiones completadas hoy</p>
        <p className="text-xl font-bold text-white font-mono">
          {completedCount}/{missions.daily.length}
        </p>
      </div>
      {totalXP > 0 && (
        <Badge variant="success" size="lg">
          +{totalXP} XP
        </Badge>
      )}
    </div>
  )
}
