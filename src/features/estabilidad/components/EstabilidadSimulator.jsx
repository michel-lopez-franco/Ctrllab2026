import { useState } from 'react'
import { RouthCalculator } from './RouthCalculator.jsx'
import { PoleZeroPlot } from './PoleZeroPlot.jsx'

const VIEWS = ['Criterio de Routh-Hurwitz', 'Plano de polos']

export function EstabilidadSimulator({ onSimulate }) {
  const [view, setView] = useState(VIEWS[0])

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {VIEWS.map((v) => (
          <button key={v} onClick={() => { setView(v); onSimulate?.() }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              view === v ? 'bg-primary-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}>
            {v}
          </button>
        ))}
      </div>

      {view === VIEWS[0]
        ? <RouthCalculator onAnalyzed={onSimulate} />
        : <PoleZeroPlot />
      }
    </div>
  )
}
