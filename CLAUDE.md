# Ctrllab 2026 — Plataforma Gamificada de Control Automático

## Propósito del proyecto

Herramienta educativa gamificada para aprender conceptos de control automático (sistemas dinámicos, PID, estabilidad, función de transferencia) mediante simulaciones interactivas, retos progresivos y mecánicas de gamificación. Dirigida a estudiantes universitarios de ingeniería.

## Stack tecnológico

- **Framework**: React 18 + Vite
- **Estilos**: Tailwind CSS v3
- **Simulación**: math.js, numeric.js (para ODEs y álgebra lineal)
- **Gráficas**: Recharts (respuesta temporal), react-plotly.js (diagramas Bode/Nyquist)
- **Estado global**: Zustand
- **Routing**: React Router v6
- **Animaciones**: Framer Motion
- **Íconos**: Lucide React
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier

## Estructura del proyecto

```
src/
  components/        # Componentes reutilizables (UI primitivos)
  features/          # Módulos por dominio
    auth/            # Autenticación y perfil de usuario
    dashboard/       # Panel principal y progreso
    simulator/       # Simulador PID/sistemas dinámicos
    challenges/      # Retos y misiones
    gamification/    # Puntos, badges, niveles, leaderboard
    theory/          # Contenido teórico interactivo
  hooks/             # Custom hooks
  store/             # Zustand stores
  utils/             # Utilidades (solvers ODE, transfer functions)
  assets/            # Imágenes, sonidos
  pages/             # Páginas/rutas principales
```

## Convenciones de código

- Componentes en PascalCase, archivos `.jsx`
- Hooks en camelCase con prefijo `use`, archivos `.js`
- Stores en camelCase con sufijo `Store`, archivos `.js`
- CSS solo via clases Tailwind; sin CSS modules ni styled-components
- No crear comentarios obvios; solo comentar WHY de lógica matemática no trivial
- No agregar `console.log` en producción
- Formularios sin librerías externas pesadas (usar controlled components)

## Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run preview      # Previsualizar build
npm run test         # Tests con Vitest
npm run lint         # ESLint
npm run format       # Prettier
```

## Contexto académico

- Universidad: CUCEI, Universidad de Guadalajara
- Año: 2026A
- Objetivo de investigación: evaluar impacto de gamificación vs. metodología tradicional en control automático
- Instrumentos: pretest, postest, encuestas de percepción, análisis de interacción

## Módulos de contenido (Control Automático)

1. **Sistemas dinámicos** — modelado, ecuaciones diferenciales
2. **Respuesta temporal** — transitoria y estado estacionario
3. **Estabilidad** — criterio de Routh-Hurwitz, lugar de raíces
4. **Función de transferencia** — polos, ceros, diagramas Bode/Nyquist
5. **Control PID** — sintonización, efectos de Kp, Ki, Kd
6. **Retos integrados** — escenarios reales (temperatura, velocidad, nivel)

## Mecánicas de gamificación

- XP y niveles (Aprendiz → Ingeniero → Experto → Maestro)
- Badges por logros (primer PID estable, sin sobreimpulso, etc.)
- Misiones diarias y semanales
- Leaderboard por grupo/clase
- Retroalimentación inmediata con explicación del error
- Modo desafío cronometrado

## Notas importantes

- El simulador numérico usa Runge-Kutta 4 para resolver ODEs
- Los sistemas se definen por función de transferencia G(s) o espacio de estados
- Preferir cálculo simbólico simple sobre librerías pesadas (e.g., no usar nerdamer)
- La plataforma debe funcionar offline después del primer cargado (PWA)
- Accesibilidad: etiquetas ARIA en simuladores, contraste WCAG AA
