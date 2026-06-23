import { ModulePage } from '@/components/shared/ModulePage.jsx'
import { moduleContent } from '../content.js'
import { DinamicaTeoria } from './DinamicaTeoria.jsx'
import { DinamicaSimulator } from './DinamicaSimulator.jsx'
import { DinamicaQuiz } from './DinamicaQuiz.jsx'

export function DinamicaPage() {
  return (
    <ModulePage
      moduleNumber={1}
      content={moduleContent}
      TheoriaComponent={DinamicaTeoria}
      SimulatorComponent={DinamicaSimulator}
      QuizComponent={DinamicaQuiz}
      simulatorHint="Experimenta con los tres tipos de sistemas que viste en la teoría. Observa cómo cambia la respuesta al modificar los parámetros del modelo."
    />
  )
}
