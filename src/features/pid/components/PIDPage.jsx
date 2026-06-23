import { ModulePage } from '@/components/shared/ModulePage.jsx'
import { moduleContent } from '../content.js'
import { PIDTeoria } from './PIDTeoria.jsx'
import { PIDTunerSimulator } from './PIDTunerSimulator.jsx'
import { PIDQuiz } from './PIDQuiz.jsx'

export function PIDPage() {
  return (
    <ModulePage
      moduleNumber={5}
      content={moduleContent}
      TheoriaComponent={PIDTeoria}
      SimulatorComponent={PIDTunerSimulator}
      QuizComponent={PIDQuiz}
      simulatorHint="Usa el Explorador para descubrir cómo cada ganancia afecta la respuesta. Luego ingresa los parámetros Ku y Tu en Ziegler-Nichols y compara tipos P, PI y PID. En el Comparador avanzado guarda varias configuraciones y observa cuál minimiza el ITAE."
    />
  )
}
