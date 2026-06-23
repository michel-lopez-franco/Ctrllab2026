import { useState, useMemo } from 'react'
import { Plus, Minus, RefreshCw } from 'lucide-react'
import { Button, Card } from '@/components/ui/index.js'
import { routhTable, polyRoots, classifyStability } from '@/utils/stability.js'

const PRESETS = [
  { label: 'Estable (3er orden)', coeffs: [1, 6, 11, 6] },
  { label: 'Inestable (3er orden)', coeffs: [1, 1, -2, 8] },
  { label: 'Marginal (K = 12)', coeffs: [1, 4, 3, 12] },
  { label: 'Estable (4to orden)', coeffs: [1, 2, 3, 2, 1] },
  { label: 'Inestable (4to orden)', coeffs: [1, 2, 3, 4, 5] },
]

const STATUS_STYLE = {
  stable: { bg: 'bg-green-900/20 border-green-500/40', text: 'text-green-400', label: 'Sistema ESTABLE' },
  'marginally-stable': { bg: 'bg-amber-900/20 border-amber-500/40', text: 'text-amber-400', label: 'Marginalmente estable' },
  unstable: { bg: 'bg-red-900/20 border-red-500/40', text: 'text-red-400', label: 'Sistema INESTABLE' },
}

function fmt(v) {
  if (v === null || v === undefined) return '—'
  const n = parseFloat(v.toFixed(4))
  return Math.abs(n) < 1e-8 ? '0' : String(n)
}

export function RouthCalculator({ onAnalyzed }) {
  const [coeffs, setCoeffs] = useState([1, 6, 11, 6])
  const [degree, setDegree] = useState(3)

  const setCoeff = (i, val) => {
    const next = [...coeffs]
    next[i] = val
    setCoeffs(next)
  }

  const addDegree = () => {
    setDegree((d) => d + 1)
    setCoeffs((c) => [1, ...c])
  }

  const removeDegree = () => {
    if (degree < 2) return
    setDegree((d) => d - 1)
    setCoeffs((c) => c.slice(1))
  }

  const loadPreset = (preset) => {
    setDegree(preset.coeffs.length - 1)
    setCoeffs([...preset.coeffs])
  }

  const { table, stable, signChanges, firstCol } = useMemo(() => routhTable(coeffs), [coeffs])
  const roots = useMemo(() => polyRoots(coeffs), [coeffs])
  const stability = useMemo(() => classifyStability(roots), [roots])
  const status = STATUS_STYLE[stability]

  const handleAnalyzed = () => onAnalyzed?.()

  return (
    <div className="space-y-5">
      {/* Presets */}
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Ejemplos predefinidos</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => loadPreset(p)}
              className="px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        {/* Entrada del polinomio */}
        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Polinomio característico
            </h4>
            <div className="flex gap-1">
              <button onClick={removeDegree} disabled={degree < 2}
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                aria-label="Reducir grado">
                <Minus size={12} />
              </button>
              <button onClick={addDegree} disabled={degree >= 6}
                className="p-1.5 rounded bg-slate-700 hover:bg-slate-600 disabled:opacity-30 transition-colors"
                aria-label="Aumentar grado">
                <Plus size={12} />
              </button>
            </div>
          </div>

          {/* Representación visual del polinomio */}
          <div className="p-3 bg-slate-900 rounded-lg font-mono text-sm text-cyan-300 leading-relaxed overflow-x-auto">
            {coeffs.map((c, i) => {
              const power = degree - i
              const term = power === 0 ? '' : power === 1 ? 's' : `s${power > 1 ? '⁰¹²³⁴⁵⁶'[power] : ''}`
              return (
                <span key={i}>
                  {i > 0 && <span className="text-slate-500"> + </span>}
                  <span className={c < 0 ? 'text-red-400' : 'text-cyan-300'}>{c}</span>
                  {term && <span className="text-slate-300">{term}</span>}
                </span>
              )
            })} = 0
          </div>

          {/* Inputs de coeficientes */}
          <div className="space-y-2">
            {coeffs.map((c, i) => {
              const power = degree - i
              return (
                <div key={i} className="flex items-center gap-3">
                  <label className="text-xs font-mono text-slate-400 w-16 shrink-0">
                    a{power > 1 ? `_${power}` : power === 1 ? '_1' : '_0'}
                    <span className="text-slate-600"> (s{power > 0 ? power : '⁰'})</span>
                  </label>
                  <input
                    type="number"
                    value={c}
                    step="1"
                    onChange={(e) => { setCoeff(i, parseFloat(e.target.value) || 0); handleAnalyzed() }}
                    className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                    aria-label={`Coeficiente de s elevado a ${power}`}
                  />
                </div>
              )
            })}
          </div>
        </Card>

        {/* Tabla de Routh */}
        <Card className="p-4 space-y-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Tabla de Routh</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-1.5 pr-3 text-slate-500 font-normal">Fila</th>
                  {table[0]?.map((_, j) => (
                    <th key={j} className="text-right px-3 py-1.5 text-slate-500 font-normal">Col {j + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.map((row, i) => {
                  const power = degree - i
                  const fv = firstCol[i]
                  const prevFv = firstCol[i - 1]
                  const signChange = i > 0 && fv * prevFv < 0
                  return (
                    <tr key={i} className={`border-b border-slate-800 ${signChange ? 'bg-red-900/10' : ''}`}>
                      <td className="py-1.5 pr-3 text-slate-500">
                        s{power > 0 ? power : '⁰'}
                      </td>
                      {row.map((val, j) => (
                        <td key={j} className={`text-right px-3 py-1.5 ${
                          j === 0
                            ? signChange ? 'text-red-400 font-bold' : fv > 0 ? 'text-green-400' : 'text-red-400'
                            : 'text-slate-300'
                        }`}>
                          {fmt(val)}
                        </td>
                      ))}
                      {signChange && (
                        <td className="pl-2 text-red-400 text-xs">← cambio de signo</td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Resultado */}
          <div className={`p-3 rounded-lg border ${status.bg}`}>
            <p className={`font-bold text-sm ${status.text}`}>{status.label}</p>
            <p className="text-xs text-slate-400 mt-1">
              {signChanges} cambio{signChanges !== 1 ? 's' : ''} de signo en la 1ª columna
              {signChanges > 0 && ` → ${signChanges} raíce${signChanges !== 1 ? 's' : ''} en el semiplano derecho`}
            </p>
          </div>
        </Card>
      </div>

      {/* Raíces calculadas */}
      {roots.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Verificación — raíces del polinomio
          </h4>
          <div className="flex flex-wrap gap-2">
            {roots.map((r, i) => {
              const inRHP = r.re > 1e-6
              const onAxis = Math.abs(r.re) <= 1e-6
              return (
                <div key={i} className={`px-3 py-1.5 rounded-lg border text-xs font-mono ${
                  inRHP ? 'border-red-500/40 bg-red-900/10 text-red-300'
                  : onAxis ? 'border-amber-500/40 bg-amber-900/10 text-amber-300'
                  : 'border-green-500/30 bg-green-900/10 text-green-300'
                }`}>
                  s = {r.re >= 0 ? '' : ''}{r.re.toFixed(3)}
                  {Math.abs(r.im) > 1e-6 ? ` ${r.im >= 0 ? '+' : '−'} ${Math.abs(r.im).toFixed(3)}j` : ''}
                </div>
              )
            })}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Verde = semiplano izquierdo (estable) · Rojo = semiplano derecho (inestable) · Amarillo = eje imaginario
          </p>
        </Card>
      )}
    </div>
  )
}
