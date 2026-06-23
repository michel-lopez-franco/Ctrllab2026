import { useState } from 'react'
import { Card, Button } from '@/components/ui/index.js'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { CHALLENGES } from '../challenges.js'
import { ChallengeSimulator } from './ChallengeSimulator.jsx'
import { Trophy, Star, Clock, ChevronLeft, CheckCircle, Zap } from 'lucide-react'

function ScoreBar({ score }) {
  const color = score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{score}%</span>
    </div>
  )
}

function LevelUpBanner({ level, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-amber-400/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="text-6xl mb-4">⬆️</div>
        <h2 className="text-2xl font-bold text-amber-400 mb-2">¡Subiste de nivel!</h2>
        <p className="text-slate-400 mb-6">Ahora eres <span className="text-white font-semibold">{level.name}</span></p>
        <Button onClick={onDismiss} className="w-full">Continuar</Button>
      </div>
    </div>
  )
}

function BadgeBanner({ badges, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-violet-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="text-5xl mb-4">🏅</div>
        <h2 className="text-2xl font-bold text-violet-400 mb-2">¡Insignia obtenida!</h2>
        <div className="space-y-2 mb-6">
          {badges.map((b) => (
            <div key={b.id} className="bg-slate-800 rounded-lg px-4 py-2">
              <p className="font-semibold text-white">{b.name}</p>
              <p className="text-xs text-slate-400">{b.description}</p>
              <p className="text-xs text-amber-400 mt-1">+{b.xpBonus} XP</p>
            </div>
          ))}
        </div>
        <Button onClick={onDismiss} className="w-full">¡Genial!</Button>
      </div>
    </div>
  )
}

export function RetosPage() {
  const { addXP, updateStats, checkBadges, pendingLevelUp, clearLevelUp } = useGamificationStore()
  const [completedMap, setCompletedMap] = useState({})   // { id: { score, time } }
  const [activeId, setActiveId] = useState(null)
  const [newBadges, setNewBadges] = useState([])

  const completedCount = Object.keys(completedMap).length
  const totalXP = Object.values(completedMap).reduce((s, c) => s + (c.xp ?? 0), 0)

  function handleComplete(challengeId, xpReward, { evaluation, elapsed }) {
    if (completedMap[challengeId]) return // already done

    const score = evaluation.score
    setCompletedMap((prev) => ({ ...prev, [challengeId]: { score, time: elapsed, xp: xpReward } }))

    addXP(xpReward)
    updateStats({
      challengesCompleted: 1,
      pidChallengesCompleted: 1,
      simulationsRun: 1,
      $min_fastestChallenge: elapsed,
    })

    const earned = checkBadges()
    if (earned.length) setNewBadges(earned)
  }

  const activeChallenge = CHALLENGES.find((c) => c.id === activeId)

  return (
    <>
      {pendingLevelUp && (
        <LevelUpBanner
          level={{ name: `Nivel ${pendingLevelUp}` }}
          onDismiss={clearLevelUp}
        />
      )}
      {newBadges.length > 0 && (
        <BadgeBanner badges={newBadges} onDismiss={() => setNewBadges([])} />
      )}

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        {activeId ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveId(null)}
              className="flex items-center gap-1 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={16} /> Volver a retos
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{activeChallenge?.title}</span>
          </div>
        ) : (
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Retos Integrados</h2>
              <p className="text-slate-400 mt-1">Aplica control PID a escenarios industriales reales. Completa todos para desbloquear la insignia Maestro PID.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400">{completedCount}/{CHALLENGES.length}</p>
                <p className="text-xs text-slate-500">Completados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">+{totalXP}</p>
                <p className="text-xs text-slate-500">XP ganado</p>
              </div>
            </div>
          </div>
        )}

        {/* Active challenge */}
        {activeChallenge ? (
          <ChallengeSimulator
            key={activeChallenge.id}
            challenge={activeChallenge}
            onComplete={(result) => handleComplete(activeChallenge.id, activeChallenge.xpReward, result)}
          />
        ) : (
          <>
            {/* Progress bar */}
            {completedCount > 0 && (
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-300 font-medium">Progreso general</span>
                  <span className="text-sm text-primary-400 font-mono">{completedCount}/{CHALLENGES.length}</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full transition-all"
                    style={{ width: `${(completedCount / CHALLENGES.length) * 100}%` }}
                  />
                </div>
              </Card>
            )}

            {/* Challenge grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CHALLENGES.map((ch, i) => {
                const done = !!completedMap[ch.id]
                const locked = false
                const result = completedMap[ch.id]

                return (
                  <Card
                    key={ch.id}
                    className={`p-5 transition-all ${locked ? 'opacity-50' : 'hover:border-primary-500/40 cursor-pointer'} ${done ? 'border-green-500/30' : ''}`}
                    onClick={() => !locked && setActiveId(ch.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-white">{ch.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${ch.difficultyColor}`}>
                            {ch.difficulty}
                          </span>
                          {done && <CheckCircle size={14} className="text-green-400" />}
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{ch.subtitle}</p>

                        {result ? (
                          <ScoreBar score={result.score} />
                        ) : (
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Star size={11} /> +{ch.xpReward} XP</span>
                            <span className="flex items-center gap-1"><Zap size={11} />
                              ts ≤{ch.specs.settlingTime?.max}s, Mp ≤{ch.specs.overshoot?.max}%
                            </span>
                          </div>
                        )}

                        {result && (
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                            <span className="flex items-center gap-1 text-amber-400"><Star size={11} /> +{ch.xpReward} XP</span>
                            <span className="flex items-center gap-1"><Clock size={11} /> {Math.floor(result.time/60)}:{String(result.time%60).padStart(2,'0')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>

            {/* Trophy — all done */}
            {completedCount === CHALLENGES.length && (
              <Card className="p-6 border-amber-400/40 bg-amber-500/5 text-center">
                <Trophy size={40} className="text-amber-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">¡Maestro del Control PID!</h3>
                <p className="text-slate-400 text-sm">Has completado todos los retos integrados. Tu dominio del control automático es excelente.</p>
                <p className="text-amber-400 font-semibold mt-3">+{totalXP} XP total ganado</p>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}
