import { useState, useCallback } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts'
import { Play, RotateCcw, Info } from 'lucide-react'
import { Slider, Button, Card } from '@/components/ui/index.js'
import { simulateStepResponse, computeMetrics } from '@/utils/transferFunction.js'

const MODES = ['1er orden', '2do orden']

const DAMPING_LABEL = (z) =>
  z < 1 ? `Subamortiguado — oscila y decae` :
  z === 1 ? `Críticamente amortiguado` :
  `Sobreamortiguado — sin oscilación`

const DAMPING_COLOR = (z) => z < 1 ? 'text-amber-300 bg-amber-900/20' : 'text-green-300 bg-green-900/20'

function MetricBadge({ label, value, unit = '', good }) {
  return (
    <div className={`rounded-lg p-3 border text-center ${good ? 'border-green-500/30 bg-green-900/10' : 'border-slate-700 bg-slate-800'}`}>
      <div className={`text-base font-mono font-bold ${good ? 'text-green-400' : 'text-cyan-400'}`}>
        {value !== null ? `${value}${unit}` : '—'}
      </div>
      <div className="text-xs text-slate-500 mt-0.5">{label}</div>
    </div>
  )
}

export function TemporalSimulator({ onSimulate }) {
  const [mode, setMode] = useState('1er orden')
  const [p1, setP1] = useState({ tau: 1, K: 1 })
  const [p2, setP2] = useState({ zeta: 0.7, wn: 3 })
  const [result, setResult] = useState(null)
  const [metrics, setMetrics] = useState(null)
  const [running, setRunning] = useState(false)

  const buildTF = useCallback(() => {
    if (mode === '1er orden') {
      return { num: [p1.K], den: [p1.tau, 1], tEnd: Math.max(15, p1.tau * 6) }
    }
    const { zeta: z, wn: w } = p2
    return { num: [w * w], den: [1, 2 * z * w, w * w], tEnd: Math.max(15, 20 / w) }
  }, [mode, p1, p2])

  const run = useCallback(() => {
    setRunning(true)
    setTimeout(() => {
      const { num, den, tEnd } = buildTF()
      try {
        const { time, output } = simulateStepResponse(num, den, tEnd, 0.02)
        const m = computeMetrics(time, output)
        setResult(time.map((t, i) => ({ t: parseFloat(t.toFixed(2)), y: parseFloat(output[i].toFixed(4)) })))
        setMetrics(m)
        onSimulate?.()
      } catch {
        setResult([])
        setMetrics(null)
      } finally {
        setRunning(false)
      }
    }, 10)
  }, [buildTF, onSimulate])

  const reset = () => { setResult(null); setMetrics(null) }

  const is2nd = mode === '2do orden'
  const z = p2.zeta

  // Anotaciones en la gráfica basadas en métricas
  const refLines = []
  if (metrics) {
    if (metrics.settlingTime) {
      refLines.push(<ReferenceLine key="ts" x={parseFloat(metrics.settlingTime.toFixed(2))} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'tₛ', fill: '#10b981', fontSize: 10 }} />)
    }
    if (metrics.riseTime && result?.length) {
      const tRise = parseFloat((result[0].t + metrics.riseTime).toFixed(2))
      refLines.push(<ReferenceLine key="tr" x={tRise} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'tᵣ', fill: '#f59e0b', fontSize: 10 }} />)
    }
    if (metrics.peakValue && metrics.peakValue > metrics.finalValue * 1.01) {
      refLines.push(<ReferenceLine key="mp" y={parseFloat(metrics.peakValue.toFixed(4))} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'pico', fill: '#ef4444', fontSize: 10 }} />)
    }
    refLines.push(<ReferenceLine key="yf" y={parseFloat(metrics.finalValue.toFixed(4))} stroke="#64748b" strokeDasharray="2 2" />)
  }

  return (
    <div className="space-y-5">
      {/* Selector de modo */}
      <div className="flex gap-2">
        {MODES.map((m) => (
          <button key={m} onClick={() => { setMode(m); reset() }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}>
            Sistema de {m}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-5">
        {/* Panel de parámetros */}
        <Card className="p-4 space-y-5">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Parámetros</h4>

          {!is2nd ? (
            <>
              <div className="p-3 bg-slate-900 rounded-lg">
                <code className="text-xs font-mono text-cyan-300">G(s) = {p1.K.toFixed(1)} / ({p1.tau.toFixed(1)}s + 1)</code>
              </div>
              <Slider label="τ (constante de tiempo)" value={p1.tau} min={0.1} max={8} step={0.1} unit=" s"
                onChange={(v) => setP1((p) => ({ ...p, tau: v }))} />
              <Slider label="K (ganancia estática)" value={p1.K} min={0.1} max={3} step={0.1}
                onChange={(v) => setP1((p) => ({ ...p, K: v }))} />
              <div className="text-xs text-slate-500 space-y-1 p-3 bg-slate-900 rounded-lg">
                <p>tₛ ≈ <span className="text-white font-mono">{(4 * p1.tau).toFixed(1)}s</span></p>
                <p>tᵣ ≈ <span className="text-white font-mono">{(2.2 * p1.tau).toFixed(1)}s</span></p>
                <p>y(τ) = <span className="text-white font-mono">{(0.632 * p1.K).toFixed(3)}</span></p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 bg-slate-900 rounded-lg">
                <code className="text-xs font-mono text-cyan-300">
                  G(s) = {(p2.wn * p2.wn).toFixed(1)} / (s² + {(2 * p2.zeta * p2.wn).toFixed(2)}s + {(p2.wn * p2.wn).toFixed(1)})
                </code>
              </div>
              <Slider label="ζ (amortiguamiento)" value={p2.zeta} min={0.05} max={2} step={0.05}
                onChange={(v) => setP2((p) => ({ ...p, zeta: v }))} />
              <Slider label="ωₙ (frec. natural)" value={p2.wn} min={0.5} max={8} step={0.1} unit=" rad/s"
                onChange={(v) => setP2((p) => ({ ...p, wn: v }))} />
              <div className={`text-xs px-3 py-2 rounded-lg font-medium ${DAMPING_COLOR(z)}`}>
                {DAMPING_LABEL(z)}
              </div>
              {z < 1 && (
                <div className="text-xs text-slate-500 space-y-1 p-3 bg-slate-900 rounded-lg">
                  <p>Mp ≈ <span className="text-white font-mono">{(Math.exp(-Math.PI * z / Math.sqrt(1 - z * z)) * 100).toFixed(1)}%</span></p>
                  <p>tₛ ≈ <span className="text-white font-mono">{(4 / (z * p2.wn)).toFixed(2)}s</span></p>
                  <p>ωd = <span className="text-white font-mono">{(p2.wn * Math.sqrt(1 - z * z)).toFixed(2)} rad/s</span></p>
                </div>
              )}
            </>
          )}

          <div className="flex gap-2">
            <Button onClick={run} disabled={running} className="flex-1">
              <Play size={14} /> {running ? 'Calculando…' : 'Simular'}
            </Button>
            <Button variant="secondary" onClick={reset} aria-label="Reiniciar"><RotateCcw size={14} /></Button>
          </div>
        </Card>

        {/* Gráfica + métricas */}
        <div className="space-y-4">
          <Card className="p-4">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Respuesta al escalón unitario
            </h4>
            <div className="h-60" role="img" aria-label={`Respuesta temporal sistema de ${mode}`}>
              {result ? (
                result.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-red-400 text-sm">
                    Sistema inestable — intenta reducir las ganancias.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="t" stroke="#64748b" tick={{ fontSize: 10 }}
                        label={{ value: 'Tiempo (s)', position: 'insideBottom', offset: -2, fill: '#64748b', fontSize: 10 }} />
                      <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
                      <Tooltip
                        contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 6, fontSize: 11 }}
                        formatter={(v) => [v.toFixed(4), 'y(t)']}
                        labelFormatter={(l) => `t = ${l}s`}
                      />
                      {refLines}
                      <Line type="monotone" dataKey="y" stroke="#3b82f6" dot={false} strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                )
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-2 text-slate-600">
                  <Play size={28} className="text-slate-700" />
                  <span className="text-sm">Ajusta los parámetros y presiona Simular</span>
                </div>
              )}
            </div>
          </Card>

          {metrics && (
            <div className="grid grid-cols-4 gap-3">
              <MetricBadge label="Sobreimpulso" value={metrics.overshoot.toFixed(1)} unit="%" good={metrics.overshoot < 15} />
              <MetricBadge label="T. establecimiento" value={metrics.settlingTime?.toFixed(2) ?? null} unit="s" good={metrics.settlingTime < 10} />
              <MetricBadge label="T. subida" value={metrics.riseTime?.toFixed(2) ?? null} unit="s" good />
              <MetricBadge label="Error SS" value={metrics.steadyStateError.toFixed(2)} unit="%" good={metrics.steadyStateError < 2} />
            </div>
          )}

          {/* Hint pedagógico contextual */}
          {result && metrics && (
            <div className="p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-400 space-y-1">
              {is2nd && z < 1 && metrics.overshoot > 20 && (
                <p><span className="text-amber-300">Sobreimpulso alto:</span> Aumenta ζ para reducir oscilaciones (o usa un controlador con acción derivativa).</p>
              )}
              {is2nd && z >= 1 && (
                <p><span className="text-green-300">Sin oscilación:</span> ζ ≥ 1 garantiza respuesta monotónica. El costo es un tiempo de subida mayor.</p>
              )}
              {!is2nd && (
                <p><span className="text-cyan-300">1er orden:</span> Nota que en t = {p1.tau.toFixed(1)}s la salida vale exactamente el 63.2% de {p1.K.toFixed(1)}.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
