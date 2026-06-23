import { ModuleQuiz } from '@/components/shared/ModuleQuiz.jsx'
import { moduleContent } from '../content.js'

export function FrecuenciaQuiz({ onComplete }) {
  return (
    <ModuleQuiz
      questions={moduleContent.quiz}
      xpReward={moduleContent.xpReward}
      nextModuleTitle="Control PID"
      onComplete={onComplete}
    />
  )
}
