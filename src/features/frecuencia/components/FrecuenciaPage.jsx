import { ModulePage } from '@/components/shared/ModulePage.jsx'
import { moduleContent } from '../content.js'
import { FrecuenciaTeoria } from './FrecuenciaTeoria.jsx'
import { FrecuenciaSimulator } from './FrecuenciaSimulator.jsx'
import { FrecuenciaQuiz } from './FrecuenciaQuiz.jsx'

export function FrecuenciaPage() {
  return (
    <ModulePage
      moduleNumber={4}
      content={moduleContent}
      TheoriaComponent={FrecuenciaTeoria}
      SimulatorComponent={FrecuenciaSimulator}
      QuizComponent={FrecuenciaQuiz}
      simulatorHint="Explora el Bode: cambia la ganancia K y observa cómo se desplazan los márgenes. Prueba el sistema de 3 polos clásico y sube K hasta que el margen de fase sea negativo. Luego abre el Nyquist y observa cuándo la curva encierra el punto (−1, 0)."
    />
  )
}
