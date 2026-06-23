import { useState, memo } from 'react'
import { Card, Button, Badge } from '@/components/ui/index.js'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'
import { CHALLENGES } from '../challenges.js'
import { ChallengeSimulator } from './ChallengeSimulator.jsx'
import { Trophy, Star, Clock, ChevronLeft, CheckCircle, Zap, BookOpen } from 'lucide-react'
import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

const ScoreBar = memo(function ScoreBar({ score }) {
  const color = score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs font-mono text-slate-300 w-8 text-right">{score}%</span>
    </div>
  )
})

const LevelUpBanner = memo(function LevelUpBanner({ level, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-scale-in">
      <div className="glass-strong border border-primary-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center shadow-lg">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient mb-2">¡Subiste de nivel!</h2>
        <p className="text-slate-400 mb-6">Ahora eres <span className="text-white font-semibold">{level.name}</span></p>
        <Button onClick={onDismiss} className="w-full">Continuar</Button>
      </div>
    </div>
  )
})

const BadgeBanner = memo(function BadgeBanner({ badges, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-scale-in">
      <div className="glass-strong border border-secondary-500/50 rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-2xl">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-lg">
          <Star className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient mb-2">¡Insignia obtenida!</h2>
        <div className="space-y-2 mb-6">
          {badges.map((b) => (
            <div key={b.id} className="bg-surface-elevated rounded-lg px-4 py-3 border border-surface-border">
              <p className="font-semibold text-white">{b.name}</p>
              <p className="text-xs text-slate-400 mt-1">{b.description}</p>
              <Badge variant="primary" size="sm" className="mt-2">+{b.xpBonus} XP</Badge>
            </div>
          ))}
        </div>
        <Button onClick={onDismiss} className="w-full">¡Genial!</Button>
      </div>
    </div>
  )
})

const ChallengeTheory = memo(function ChallengeTheory({ challenge }) {
  const renderMathContent = (text) => {
    // Split by $$ for block math
    const parts = text.split(/(\$\$[^$]+\$\$)/g)
    
    return parts.map((part, i) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim()
        return (
          <div key={i} className="my-3 overflow-x-auto">
            <BlockMath math={math} />
          </div>
        )
      } else if (part.includes('$') && !part.includes('$$')) {
        // Inline math with single $
        const inlineParts = part.split(/(\$[^$]+\$)/g)
        return (
          <span key={i}>
            {inlineParts.map((p, j) => {
              if (p.startsWith('$') && p.endsWith('$')) {
                const math = p.slice(1, -1).trim()
                return <InlineMath key={j} math={math} />
              }
              return p
            })}
          </span>
        )
      }
      return part
    })
  }

  return (
    <Card variant="glass" className="mb-6">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary-600/20 flex items-center justify-center border border-primary-500/30">
            <BookOpen className="w-5 h-5 text-primary-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Teoría del Sistema</h3>
        </div>
        
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-slate-400 mb-3">{challenge.description}</p>
            <div className="bg-surface-elevated rounded-lg p-4 border border-surface-border overflow-x-auto">
              <BlockMath math={challenge.equation.replace(/\$\$/g, '').trim()} />
            </div>
          </div>

          {challenge.theory && (
            <div className="bg-surface-elevated rounded-lg p-4 border border-surface-border space-y-3">
              {challenge.theory.split('\n\n').map((paragraph, i) => {
                const trimmed = paragraph.trim()
                
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return (
                    <p key={i} className="text-white font-semibold mt-3 mb-2">
                      {trimmed.replace(/\*\*/g, '')}
                    </p>
                  )
                } else if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
                  const math = trimmed.slice(2, -2).trim()
                  return (
                    <div key={i} className="my-3 overflow-x-auto">
                      <BlockMath math={math} />
                    </div>
                  )
                } else {
                  return (
                    <p key={i} className="text-slate-300 leading-relaxed">
                      {renderMathContent(trimmed)}
                    </p>
                  )
                }
              })}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
})

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

    addXP(xpReward, `challenge:${challengeId}`)
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

      <div className="p-8 max-w-6xl mx-auto space-y-6">
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
              <h2 className="text-3xl font-bold text-white mb-2">Retos Integrados</h2>
              <p className="text-slate-400">Aplica control PID a escenarios industriales reales. Completa todos para desbloquear la insignia <span className="text-amber-400 font-semibold">Maestro PID</span>.</p>
            </div>
            <div className="flex gap-4 shrink-0">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-400 font-mono">{completedCount}/{CHALLENGES.length}</p>
                <p className="text-xs text-slate-500">Completados</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400 font-mono">+{totalXP}</p>
                <p className="text-xs text-slate-500">XP ganado</p>
              </div>
            </div>
          </div>
        )}

        {/* Active challenge */}
        {activeChallenge ? (
          <>
            <ChallengeTheory challenge={activeChallenge} />
            <ChallengeSimulator
              key={activeChallenge.id}
              challenge={activeChallenge}
              onComplete={(result) => handleComplete(activeChallenge.id, activeChallenge.xpReward, result)}
            />
          </>
        ) : (
          <>
            {/* Progress bar */}
            {completedCount > 0 && (
              <Card variant="accent" className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Progreso general</span>
                  <span className="text-sm text-primary-400 font-mono font-bold">{completedCount}/{CHALLENGES.length}</span>
                </div>
                <div className="h-2.5 bg-surface-elevated rounded-full overflow-hidden border border-surface-border">
                  <div
                    className="h-full bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full transition-all duration-500"
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
                    variant={done ? 'success' : 'glass'}
                    hover={locked ? 'none' : 'lift'}
                    className={`p-5 transition-all ${locked ? 'opacity-50' : 'cursor-pointer'}`}
                    onClick={() => !locked && setActiveId(ch.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{ch.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-semibold text-white">{ch.title}</span>
                          <Badge variant="default" size="sm" className={ch.difficultyColor}>
                            {ch.difficulty}
                          </Badge>
                          {done && <CheckCircle size={14} className="text-success-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mb-3">{ch.subtitle}</p>

                        {result ? (
                          <>
                            <ScoreBar score={result.score} />
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                              <span className="flex items-center gap-1 text-amber-400">
                                <Star size={11} /> +{ch.xpReward} XP
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={11} /> {Math.floor(result.time/60)}:{String(result.time%60).padStart(2,'0')}
                              </span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                          <Badge variant="accent" size="sm" icon={<Star size={11} className="fill-accent-400" />} className="font-bold border-accent-500/40 text-accent-300 bg-accent-500/10">
                            +{ch.xpReward} XP
                          </Badge>
                            <span className="flex items-center gap-1">
                              <Zap size={11} />
                              ts ≤{ch.specs.settlingTime?.max}s, Mp ≤{ch.specs.overshoot?.max}%
                            </span>
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
              <Card variant="accent" className="p-8 text-center animate-scale-in">
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center shadow-lg animate-pulse-glow">
                  <Trophy size={40} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gradient mb-2">¡Maestro del Control PID!</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto mb-4">
                  Has completado todos los retos integrados. Tu dominio del control automático es excelente.
                </p>
                <Badge variant="success" size="lg">
                  +{totalXP} XP total ganado
                </Badge>
              </Card>
            )}
          </>
        )}
      </div>
    </>
  )
}
