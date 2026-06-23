import { ModuleQuiz } from '@/components/shared/ModuleQuiz.jsx'
import { moduleContent } from '../content.js'

export function TemporalQuiz({ onComplete }) {
  return (
    <ModuleQuiz
      questions={moduleContent.quiz}
      xpReward={moduleContent.xpReward}
      nextModuleTitle="Estabilidad"
      onComplete={onComplete}
    />
  )
}
