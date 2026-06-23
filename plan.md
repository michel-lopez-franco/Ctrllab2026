# Plan de Implementación — Ctrllab 2026

## Visión general

Plataforma web gamificada para el aprendizaje de control automático. Publicable como herramienta educativa open-source para ingeniería.

---

## Fases de desarrollo

### Fase 0 — Infraestructura (Semana 1)
- [ ] Inicializar proyecto Vite + React + Tailwind
- [ ] Configurar ESLint, Prettier, Vitest
- [ ] Definir paleta de colores y design tokens
- [ ] Configurar React Router con rutas base
- [ ] Configurar Zustand stores iniciales
- [ ] Setup CI básico (GitHub Actions: lint + test)

### Fase 1 — Motor de simulación (Semana 2)
- [ ] Implementar solver Runge-Kutta 4 para ODEs
- [ ] Módulo de función de transferencia (G(s) → coeficientes)
- [ ] Simulador de sistema de 2do orden (ζ, ωn)
- [ ] Simulador PID (Kp, Ki, Kd) con planta configurable
- [ ] Tests unitarios del motor (cobertura >80%)
- [ ] Componente `SimulatorGraph` con Recharts

### Fase 2 — UI base y navegación (Semana 3)
- [ ] Layout principal (sidebar, header, contenido)
- [ ] Dashboard del estudiante (progreso, XP, misiones activas)
- [ ] Página de perfil (avatar, nivel, historial de badges)
- [ ] Sistema de rutas protegidas (auth mock inicial)
- [ ] Componentes UI: Button, Card, Badge, Modal, Tooltip, ProgressBar

### Fase 3 — Módulos de contenido (Semanas 4-5)
- [ ] Módulo 1: Sistemas dinámicos (teoría + ejercicio interactivo)
- [ ] Módulo 2: Respuesta temporal (simulador + quiz)
- [ ] Módulo 3: Estabilidad — Routh-Hurwitz (calculadora interactiva)
- [ ] Módulo 4: Función de transferencia (diagrama Bode con Plotly)
- [ ] Módulo 5: Control PID (sintonizador visual)
- [ ] Módulo 6: Retos integrados (3 escenarios: temperatura, motor DC, nivel de tanque)

### Fase 4 — Sistema de gamificación (Semana 6)
- [ ] Store de gamificación (XP, nivel, badges, misiones)
- [ ] Lógica de otorgamiento de badges (eventos del sistema)
- [ ] Componente `LevelUpModal` con animación
- [ ] Misiones diarias/semanales con progreso visual
- [ ] Leaderboard (mock con datos de clase)
- [ ] Sistema de notificaciones in-app (logros, recordatorios)

### Fase 5 — Retos y evaluación (Semana 7)
- [ ] Motor de retos con rúbrica automática
- [ ] Reto cronometrado (modo desafío)
- [ ] Pretest y postest (formulario integrado)
- [ ] Encuesta de percepción (escala Likert)
- [ ] Dashboard de analítica para instructor
- [ ] Exportar resultados a CSV

### Fase 6 — Pulido y publicación (Semana 8)
- [ ] PWA (service worker, manifest)
- [ ] Accesibilidad WCAG AA (aria-labels, contraste, keyboard nav)
- [ ] Optimización de bundle (code splitting por módulo)
- [ ] README completo para publicación open-source
- [ ] Demo desplegada en GitHub Pages / Vercel
- [ ] Documentación de la API del simulador

---

## Arquitectura de datos

### Usuario (store local + futuro backend)
```js
{
  id, name, email, avatar,
  xp, level, badges[],
  completedModules[], completedChallenges[],
  missionProgress: { daily: [], weekly: [] },
  pretest: { score, date }, postest: { score, date }
}
```

### Simulación
```js
{
  plantType: 'transfer_function' | 'state_space',
  numerator: number[], denominator: number[],
  pid: { kp, ki, kd },
  timeSpan: number, stepSize: number,
  result: { time: number[], output: number[], error: number[] }
}
```

### Reto
```js
{
  id, title, description, difficulty,
  plantParams, targetSpec: { settlingTime, overshoot, steadyStateError },
  maxAttempts, timeLimit,
  rubric: { criteria[], weights[] }
}
```

---

## Decisiones técnicas

| Decisión | Elección | Alternativa descartada | Razón |
|---|---|---|---|
| Simulación numérica | RK4 propio | ode45 de mathjs | Control total, sin overhead |
| Gráficas tiempo | Recharts | Chart.js | Mejor integración React |
| Gráficas frecuencia | Plotly.js | D3.js | Bode/Nyquist out-of-box |
| Estado global | Zustand | Redux | Menos boilerplate para este tamaño |
| Animaciones | Framer Motion | CSS puro | Transiciones de nivel/badge fluidas |
| Build | Vite | CRA | Velocidad, ESM nativo |

---

## Criterios de aceptación para publicación

- [ ] Funciona en Chrome, Firefox y Safari (últimas 2 versiones)
- [ ] Funciona offline después del primer cargado
- [ ] Lighthouse score ≥ 85 en Performance, Accesibilidad, Best Practices
- [ ] Tests pasan en CI
- [ ] Documentación suficiente para que otro desarrollador pueda contribuir
- [ ] Licencia MIT
