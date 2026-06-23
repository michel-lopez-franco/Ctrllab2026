import { ModuleQuiz } from '@/components/shared/ModuleQuiz.jsx'
import { moduleContent } from '../content.js'

export function PIDQuiz({ onComplete }) {
  return (
    <ModuleQuiz
      questions={moduleContent.quiz}
      xpReward={moduleContent.xpReward}
      nextModuleTitle="Retos Integrados"
      onComplete={onComplete}
    />
  )
}
