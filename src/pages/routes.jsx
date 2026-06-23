import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/pages/AppLayout.jsx'
import { DashboardPage } from '@/pages/DashboardPage.jsx'
import { SimulatorPage } from '@/pages/SimulatorPage.jsx'
import { ModulesPage } from '@/pages/ModulesPage.jsx'
import { DinamicaPage } from '@/features/dinamica/index.js'
import { TemporalPage } from '@/features/temporal/index.js'
import { EstabilidadPage } from '@/features/estabilidad/index.js'
import { FrecuenciaPage } from '@/features/frecuencia/index.js'
import { PIDPage } from '@/features/pid/index.js'
import { RetosPage } from '@/features/retos/index.js'

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="simulator" element={<SimulatorPage />} />
        <Route path="modules" element={<ModulesPage />} />
        <Route path="modules/dinamica" element={<DinamicaPage />} />
        <Route path="modules/temporal" element={<TemporalPage />} />
        <Route path="modules/estabilidad" element={<EstabilidadPage />} />
        <Route path="modules/frecuencia" element={<FrecuenciaPage />} />
        <Route path="modules/pid" element={<PIDPage />} />
        <Route path="modules/retos" element={<RetosPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
