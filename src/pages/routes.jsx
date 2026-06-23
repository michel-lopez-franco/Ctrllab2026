import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/pages/AppLayout.jsx'
import { DashboardPage } from '@/pages/DashboardPage.jsx'

// Lazy load heavy components
const SimulatorPage = lazy(() => import('@/pages/SimulatorPage.jsx').then(m => ({ default: m.SimulatorPage })))
const ModulesPage = lazy(() => import('@/pages/ModulesPage.jsx').then(m => ({ default: m.ModulesPage })))
const DinamicaPage = lazy(() => import('@/features/dinamica/index.js').then(m => ({ default: m.DinamicaPage })))
const TemporalPage = lazy(() => import('@/features/temporal/index.js').then(m => ({ default: m.TemporalPage })))
const EstabilidadPage = lazy(() => import('@/features/estabilidad/index.js').then(m => ({ default: m.EstabilidadPage })))
const FrecuenciaPage = lazy(() => import('@/features/frecuencia/index.js').then(m => ({ default: m.FrecuenciaPage })))
const PIDPage = lazy(() => import('@/features/pid/index.js').then(m => ({ default: m.PIDPage })))
const RetosPage = lazy(() => import('@/features/retos/index.js').then(m => ({ default: m.RetosPage })))

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-400 text-sm">Cargando módulo...</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route 
          path="simulator" 
          element={
            <Suspense fallback={<PageLoader />}>
              <SimulatorPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules" 
          element={
            <Suspense fallback={<PageLoader />}>
              <ModulesPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/dinamica" 
          element={
            <Suspense fallback={<PageLoader />}>
              <DinamicaPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/temporal" 
          element={
            <Suspense fallback={<PageLoader />}>
              <TemporalPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/estabilidad" 
          element={
            <Suspense fallback={<PageLoader />}>
              <EstabilidadPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/frecuencia" 
          element={
            <Suspense fallback={<PageLoader />}>
              <FrecuenciaPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/pid" 
          element={
            <Suspense fallback={<PageLoader />}>
              <PIDPage />
            </Suspense>
          } 
        />
        <Route 
          path="modules/retos" 
          element={
            <Suspense fallback={<PageLoader />}>
              <RetosPage />
            </Suspense>
          } 
        />
        <Route 
          path="challenges" 
          element={
            <Suspense fallback={<PageLoader />}>
              <RetosPage />
            </Suspense>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
