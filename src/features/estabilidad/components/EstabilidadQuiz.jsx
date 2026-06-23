import { ModuleQuiz } from '@/components/shared/ModuleQuiz.jsx'
import { moduleContent } from '../content.js'

export function EstabilidadQuiz({ onComplete }) {
  return (
    <ModuleQuiz
      questions={moduleContent.quiz}
      xpReward={moduleContent.xpReward}
      nextModuleTitle="Análisis en Frecuencia"
      onComplete={onComplete}
    />
  )
}
