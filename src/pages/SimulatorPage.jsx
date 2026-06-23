import { useCallback } from 'react'
import { PIDSimulator } from '@/features/simulator/PIDSimulator.jsx'
import { useGamificationStore } from '@/features/gamification/store/gamificationStore.js'

export function SimulatorPage() {
  const { updateStats, checkBadges, addXP } = useGamificationStore()

  const handleResult = useCallback((metrics) => {
    updateStats({
      simulationsRun: 1,
      bestOvershoot: metrics.overshoot,
      bestSettlingTime: metrics.settlingTime,
      bestSteadyStateError: metrics.steadyStateError,
    })
    addXP(5)
    checkBadges()
  }, [updateStats, checkBadges, addXP])

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Simulador PID</h2>
        <p className="text-slate-400 mt-1">
          Ajusta las ganancias Kp, Ki y Kd y observa cómo cambia la respuesta del sistema en tiempo real.
        </p>
      </div>
      <PIDSimulator onResult={handleResult} />
    </div>
  )
}
