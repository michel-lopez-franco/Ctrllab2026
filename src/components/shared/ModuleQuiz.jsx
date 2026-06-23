import { useState } from 'react'
import { CheckCircle, XCircle, ChevronRight, Award } from 'lucide-react'
import { Button, Card } from '@/components/ui/index.js'

// Generic quiz component. Receives a `questions` array and fires onComplete.
// Each question: { id, question, options: string[], correctIndex, explanation }

export function ModuleQuiz({ questions, xpReward, nextModuleTitle, onComplete }) {
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  const q = questions[current]
  const correctNow = selected === q?.correctIndex

  const confirm = () => {
    if (selected === null) return
    setAnswered(true)
    setAnswers((a) => [...a, { correct: selected === q.correctIndex }])
  }

  const next = () => {
    if (current + 1 >= questions.length) {
      setFinished(true)
      const score = [...answers, { correct: correctNow }].filter((a) => a.correct).length
      onComplete?.({ score, total: questions.length, passed: score / questions.length >= 0.7 })
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  const restart = () => {
    setCurrent(0); setSelected(null); setAnswered(false)
    setAnswers([]); setFinished(false)
  }

  if (finished) {
    const finalScore = answers.filter((a) => a.correct).length
    const pct = Math.round((finalScore / questions.length) * 100)
    const passed = pct >= 70
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${passed ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
          <Award size={40} className={passed ? 'text-green-400' : 'text-amber-400'} />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{pct}%</h3>
          <p className="text-slate-400 mt-1">{finalScore} de {questions.length} correctas</p>
        </div>

        {passed ? (
          <Card className="p-4 border-green-500/30 bg-green-900/10 text-left space-y-1">
            <p className="text-green-400 font-semibold text-sm">¡Módulo superado!</p>
            <p className="text-slate-400 text-sm">
              Ganaste <span className="text-primary-400">+{xpReward} XP</span>.
              {nextModuleTitle && <> El siguiente módulo — <span className="text-white">{nextModuleTitle}</span> — está desbloqueado.</>}
            </p>
          </Card>
        ) : (
          <Card className="p-4 border-amber-500/30 bg-amber-900/10 text-left space-y-1">
            <p className="text-amber-400 font-semibold text-sm">Necesitas 70% para pasar</p>
            <p className="text-slate-400 text-sm">Repasa la teoría y vuelve a intentarlo. Sin penalización por reintentar.</p>
          </Card>
        )}

        <div className="flex gap-2 justify-center flex-wrap">
          {answers.map((a, i) => (
            <div key={i} className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${a.correct ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {i + 1}
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="secondary" onClick={restart}>Reintentar</Button>
          {passed && <Button onClick={() => onComplete?.({ score: finalScore, total: questions.length, passed: true })}>Continuar →</Button>}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Pregunta {current + 1} de {questions.length}</span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${
              i < current ? answers[i]?.correct ? 'bg-green-500' : 'bg-red-500'
              : i === current ? 'bg-primary-500' : 'bg-slate-700'
            }`} />
          ))}
        </div>
      </div>

      <Card className="p-6">
        <p className="text-white font-medium leading-relaxed">{q.question}</p>
      </Card>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          let style = 'border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-300 cursor-pointer'
          if (answered) {
            if (i === q.correctIndex) style = 'border-green-500/60 bg-green-900/20 text-green-300'
            else if (i === selected) style = 'border-red-500/60 bg-red-900/20 text-red-300'
            else style = 'border-slate-700 bg-slate-800/30 text-slate-500'
          } else if (i === selected) {
            style = 'border-primary-500/60 bg-primary-900/20 text-primary-300 cursor-pointer'
          }
          return (
            <button key={i} disabled={answered} onClick={() => !answered && setSelected(i)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${style}`}>
              <div className="flex items-start gap-3">
                <span className="font-mono text-xs mt-0.5 shrink-0 text-slate-500">{String.fromCharCode(65 + i)}.</span>
                <span className="text-sm leading-relaxed">{opt}</span>
                {answered && i === q.correctIndex && <CheckCircle size={16} className="text-green-400 ml-auto shrink-0 mt-0.5" />}
                {answered && i === selected && i !== q.correctIndex && <XCircle size={16} className="text-red-400 ml-auto shrink-0 mt-0.5" />}
              </div>
            </button>
          )
        })}
      </div>

      {answered && (
        <Card className={`p-4 border ${correctNow ? 'border-green-500/30 bg-green-900/10' : 'border-amber-500/30 bg-amber-900/10'}`}>
          <div className="flex items-start gap-2">
            {correctNow ? <CheckCircle size={16} className="text-green-400 shrink-0 mt-0.5" /> : <XCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />}
            <p className="text-sm text-slate-300 leading-relaxed">{q.explanation}</p>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-slate-500">{answers.filter((a) => a.correct).length} correctas hasta ahora</span>
        {!answered
          ? <Button onClick={confirm} disabled={selected === null}>Confirmar respuesta</Button>
          : <Button onClick={next}>
              {current + 1 < questions.length ? <>Siguiente <ChevronRight size={16} /></> : 'Ver resultados'}
            </Button>
        }
      </div>
    </div>
  )
}
