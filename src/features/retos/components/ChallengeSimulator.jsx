import { useState, useMemo, useRef, useEffect } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer,
} from 'recharts'
import { Card, Slider, Button } from '@/components/ui/index.js'
import { simulatePID, computeMetrics } from '@/utils/transferFunction.js'
import { evaluateChallenge } from '@/features/gamification/logic/rubric.js'
import { CheckCircle, XCircle, Clock, Play } from 'lucide-react'

function MetricRow({ criterion, achieved, target, unit, pass, score, weight, feedback }) {
  return (
    <div className={`rounded-lg border p-3 ${pass ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          {pass
            ? <CheckCircle size={14} className="text-green-400 shrink-0" />
            : <XCircle size={14} className="text-red-400 shrink-0" />
          }
          <span className="text-sm font-medium text-slate-200">{criterion}</span>
        </div>
        <span className={`text-xs font-mono font-semibold ${pass ? 'text-green-400' : 'text-red-400'}`}>
          {achieved.toFixed(2)}{unit} / ≤{target}{unit}
        </span>
      </div>
      <p className="text-xs text-slate-400 ml-6">{feedback}</p>
    </div>
  )
}

export function ChallengeSimulator({ challenge, onComplete }) {
  const { plant, specs, tEnd, dt, reference } = challenge

  const [kp, setKp] = useState(challenge.suggestedStart.kp)
  const [ki, setKi] = useState(challenge.suggestedStart.ki)
  const [kd, setKd] = useState(challenge.suggestedStart.kd)
  const [result, setResult] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const startRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    startRef.current = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    if (result?.evaluation?.passed) clearInterval(timerRef.current)
  }, [result])

  const sim = useMemo(() => {
    try {
      const { time, output } = simulatePID(plant.num, plant.den, { kp, ki, kd }, tEnd, dt)
      return { time, output, error: null }
    } catch (e) {
      return { time: [], output: [], error: e.message }
    }
  }, [plant, kp, ki, kd, tEnd, dt])

  const chartData = useMemo(() => {
    if (!sim.time.length) return []
    return sim.time.map((t, i) => ({
      t: +t.toFixed(2),
      y: +sim.output[i].toFixed(4),
      r: reference,
    }))
  }, [sim, reference])

  function handleSimulate() {
    if (!sim.time.length) return
    setRunning(true)
    const metrics = computeMetrics(sim.time, sim.output)
    const evaluation = evaluateChallenge(metrics, specs)
    setResult({ metrics, evaluation, time: elapsed })
    setRunning(false)
    if (evaluation.passed) {
      onComplete({ evaluation, elapsed, kp, ki, kd })
    }
  }

  const passed = result?.evaluation?.passed

  return (
    <div className="space-y-5">
      {/* Context card */}
      <Card className="p-4 border-slate-700">
        <div className="flex items-start gap-3">
          <span className="text-3xl shrink-0">{challenge.icon}</span>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{challenge.title}</h3>
              <span className={`text-xs px-2 py-0.5 rounded border font-medium ${challenge.difficultyColor}`}>
                {challenge.difficulty}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{challenge.context}</p>
            <p className="text-xs text-slate-500 mt-2 font-mono">{challenge.plant.label}</p>
          </div>
        </div>
      </Card>

      {/* Specs */}
      <div className="grid grid-cols-3 gap-3">
        {specs.settlingTime && (
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Tiempo establecimiento</p>
            <p className="text-lg font-bold text-white">≤{specs.settlingTime.max}s</p>
          </div>
        )}
        {specs.overshoot && (
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Sobreimpulso máx.</p>
            <p className="text-lg font-bold text-white">≤{specs.overshoot.max}%</p>
          </div>
        )}
        {specs.steadyStateError && (
          <div className="bg-slate-800 rounded-lg p-3 text-center border border-slate-700">
            <p className="text-xs text-slate-500 mb-1">Error estacionario máx.</p>
            <p className="text-lg font-bold text-white">≤{specs.steadyStateError.max}%</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="space-y-4">
          <div className="space-y-3">
            <Slider label="Kp (Proporcional)" value={kp} onChange={setKp} min={0} max={20} step={0.1} unit="" />
            <Slider label="Ki (Integral)"      value={ki} onChange={setKi} min={0} max={10} step={0.1} unit="" />
            <Slider label="Kd (Derivativo)"    value={kd} onChange={setKd} min={0} max={10} step={0.1} unit="" />
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Clock size={14} />
            <span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}</span>
          </div>

          <Button onClick={handleSimulate} disabled={running || !!passed} className="w-full">
            <Play size={14} />
            {passed ? 'Superado ✓' : 'Evaluar respuesta'}
          </Button>

          {/* Hints */}
          <div className="space-y-1.5">
            {challenge.hints.map((h, i) => (
              <div key={i} className="text-xs text-slate-500 flex gap-2">
                <span className="text-primary-500 shrink-0">•</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-2 space-y-3">
          {sim.error ? (
            <div className="h-52 flex items-center justify-center bg-slate-800 rounded-lg border border-red-500/30">
              <p className="text-red-400 text-sm">Sistema inestable con esta configuración — ajusta las ganancias</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="t" tick={{ fill: '#94a3b8', fontSize: 11 }}
                  label={{ value: 'Tiempo (s)', position: 'insideBottomRight', offset: -4, fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6 }}
                  labelStyle={{ color: '#94a3b8' }}
                  formatter={(v) => v.toFixed(4)}
                />
                <ReferenceLine y={reference} stroke="#64748b" strokeDasharray="4 4" />
                {specs.settlingTime && result && (
                  <ReferenceLine x={result.metrics.settlingTime} stroke="#22c55e" strokeDasharray="3 3"
                    label={{ value: 'ts', position: 'top', fill: '#22c55e', fontSize: 10 }} />
                )}
                <Line dataKey="r" name="Referencia" stroke="#475569" strokeDasharray="5 5" dot={false} strokeWidth={1} />
                <Line dataKey="y" name="Salida controlada" stroke="#6366f1" dot={false} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}

          {/* Evaluation results */}
          {result && (
            <div className="space-y-2">
              <div className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
                passed
                  ? 'border-green-500/40 bg-green-500/10'
                  : 'border-slate-700 bg-slate-800/50'
              }`}>
                <div className="flex items-center gap-2">
                  {passed
                    ? <CheckCircle size={18} className="text-green-400" />
                    : <XCircle size={18} className="text-red-400" />
                  }
                  <span className={`font-semibold ${passed ? 'text-green-400' : 'text-slate-200'}`}>
                    {passed ? '¡Reto superado!' : 'Ajusta y vuelve a intentar'}
                  </span>
                </div>
                <span className="text-2xl font-bold text-white font-mono">{result.evaluation.score}%</span>
              </div>
              {result.evaluation.criteria.map((c) => (
                <MetricRow key={c.criterion} {...c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
