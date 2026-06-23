import { useState } from 'react'
import { BookOpen, Cpu, HelpCircle, Star, Clock, CheckCircle } from 'lucide-react'
import { Tabs, Card } from '@/components/ui/index.js'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'

// Generic module shell shared by every content module.
// Props:
//   moduleNumber  – integer shown in breadcrumb
//   content       – moduleContent object (id, title, estimatedTime, xpReward, objectives, sections)
//   TheoriaComponent  – JSX component; receives onSectionRead(n)
//   SimulatorComponent – JSX component; receives onSimulate()
//   QuizComponent      – JSX component; receives onComplete({ score, total, passed })
//   simulatorHint  – string shown above the simulator tab

export function ModulePage({
  moduleNumber,
  content,
  TheoriaComponent,
  SimulatorComponent,
  QuizComponent,
  simulatorHint,
}) {
  const [activeTab, setActiveTab] = useState('Teoría')
  const [sectionsRead, setSectionsRead] = useState(0)
  const [simUsed, setSimUsed] = useState(false)
  const [quizResult, setQuizResult] = useState(null)

  const { addXP, updateStats, checkBadges } = useGamificationStore()

  const handleQuizComplete = ({ score, total, passed }) => {
    if (!quizResult && passed) {
      addXP(content.xpReward)
      updateStats({ modulesCompleted: 1 })
      checkBadges()
    }
    setQuizResult({ score, total, passed })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span>Módulo {moduleNumber}</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Clock size={12} /> {content.estimatedTime} min</span>
            <span>·</span>
            <span className="flex items-center gap-1 text-primary-400"><Star size={12} /> +{content.xpReward} XP</span>
          </div>
          <h2 className="text-2xl font-bold text-white">{content.title}</h2>
        </div>
        {quizResult?.passed && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg shrink-0">
            <CheckCircle size={16} className="text-green-400" />
            <span className="text-green-400 text-sm font-medium">Completado</span>
          </div>
        )}
      </div>

      {/* Objetivos */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Objetivos de aprendizaje</h3>
        <ul className="space-y-2">
          {content.objectives.map((obj, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
              <span className="text-primary-400 font-mono text-xs mt-1 shrink-0">{i + 1}.</span>
              {obj}
            </li>
          ))}
        </ul>
      </Card>

      {/* Chips de progreso */}
      <div className="grid grid-cols-3 gap-3">
        <ProgressChip icon={<BookOpen size={14} />} label="Teoría"
          done={sectionsRead} total={content.sections.length}
          active={activeTab === 'Teoría'} onClick={() => setActiveTab('Teoría')} />
        <ProgressChip icon={<Cpu size={14} />} label="Simulador"
          done={simUsed ? 1 : 0} total={1}
          active={activeTab === 'Simulador'} onClick={() => setActiveTab('Simulador')} />
        <ProgressChip icon={<HelpCircle size={14} />} label="Quiz"
          done={quizResult ? 1 : 0} total={1}
          active={activeTab === 'Quiz'} onClick={() => setActiveTab('Quiz')} />
      </div>

      <Tabs tabs={['Teoría', 'Simulador', 'Quiz']} active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Teoría' && (
        <TheoriaComponent onSectionRead={setSectionsRead} />
      )}

      {activeTab === 'Simulador' && (
        <div className="space-y-4">
          {simulatorHint && (
            <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-slate-400">
              <strong className="text-white">Objetivo:</strong> {simulatorHint}
            </div>
          )}
          <SimulatorComponent onSimulate={() => setSimUsed(true)} />
        </div>
      )}

      {activeTab === 'Quiz' && (
        <div className="space-y-4">
          {!simUsed && (
            <div className="p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg text-sm text-amber-300">
              Recomendamos usar el simulador antes del quiz para afianzar los conceptos.
            </div>
          )}
          <QuizComponent onComplete={handleQuizComplete} />
        </div>
      )}
    </div>
  )
}

function ProgressChip({ icon, label, done, total, active, onClick }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  const complete = done >= total
  return (
    <button onClick={onClick}
      className={`p-3 rounded-lg border text-left transition-colors ${
        active ? 'border-primary-500/50 bg-primary-600/10'
        : complete ? 'border-green-500/30 bg-green-900/10'
        : 'border-slate-700 bg-slate-800/50 hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={complete ? 'text-green-400' : active ? 'text-primary-400' : 'text-slate-400'}>
          {complete ? <CheckCircle size={14} /> : icon}
        </span>
        <span className={`text-xs font-medium ${complete ? 'text-green-400' : 'text-slate-300'}`}>{label}</span>
      </div>
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${complete ? 'bg-green-500' : 'bg-primary-500'}`}
          style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-slate-500 mt-1">{done}/{total}</p>
    </button>
  )
}
