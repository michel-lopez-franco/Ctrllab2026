import { ModulePage } from '@/components/shared/ModulePage.jsx'
import { moduleContent } from '../content.js'
import { TemporalTeoria } from './TemporalTeoria.jsx'
import { TemporalSimulator } from './TemporalSimulator.jsx'
import { TemporalQuiz } from './TemporalQuiz.jsx'

export function TemporalPage() {
  return (
    <ModulePage
      moduleNumber={2}
      content={moduleContent}
      TheoriaComponent={TemporalTeoria}
      SimulatorComponent={TemporalSimulator}
      QuizComponent={TemporalQuiz}
      simulatorHint="Experimenta con sistemas de 1er y 2do orden. Observa las líneas de anotación en la gráfica: tᵣ (subida), tₛ (establecimiento) y el pico de sobreimpulso. Intenta lograr Mp < 10% con tₛ < 5s."
    />
  )
}
