import { ModulePage } from '@/components/shared/ModulePage.jsx'
import { moduleContent } from '../content.js'
import { EstabilidadTeoria } from './EstabilidadTeoria.jsx'
import { EstabilidadSimulator } from './EstabilidadSimulator.jsx'
import { EstabilidadQuiz } from './EstabilidadQuiz.jsx'

export function EstabilidadPage() {
  return (
    <ModulePage
      moduleNumber={3}
      content={moduleContent}
      TheoriaComponent={EstabilidadTeoria}
      SimulatorComponent={EstabilidadSimulator}
      QuizComponent={EstabilidadQuiz}
      simulatorHint="Usa la calculadora de Routh-Hurwitz para analizar cualquier polinomio: ingresa los coeficientes, observa la tabla completa y verifica el resultado con las raíces calculadas. Luego explora el plano de polos para ver cómo ζ y ωₙ mueven los polos en tiempo real."
    />
  )
}
