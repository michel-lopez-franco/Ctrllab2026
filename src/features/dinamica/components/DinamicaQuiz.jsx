import { ModuleQuiz } from '@/components/shared/ModuleQuiz.jsx'
import { moduleContent } from '../content.js'

export function DinamicaQuiz({ onComplete }) {
  return (
    <ModuleQuiz
      questions={moduleContent.quiz}
      xpReward={moduleContent.xpReward}
      nextModuleTitle="Respuesta Temporal"
      onComplete={onComplete}
    />
  )
}
