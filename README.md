# Ctrllab  — Plataforma Gamificada de Control Automático

Herramienta educativa para el aprendizaje de conceptos fundamentales de control automático, mediante simulaciones interactivas, retos progresivos y mecánicas de gamificación.

**Desarrollado en CUCEI, Universidad de Guadalajara — 2026A**

---

## Objetivo

Diseñar, implementar y evaluar una plataforma que mejore la comprensión, motivación y participación de estudiantes universitarios de ingeniería en el aprendizaje de control automático, en comparación con metodologías tradicionales.

## Características

- **Simulador PID interactivo** — ajusta Kp, Ki, Kd y observa la respuesta en tiempo real
- **6 módulos de contenido** — desde sistemas dinámicos hasta retos integrados
- **Sistema de gamificación** — XP, niveles, insignias, misiones diarias
- **Retroalimentación inmediata** — rúbricas automáticas con explicaciones pedagógicas
- **Funciona offline** — PWA con service worker

## Stack

- React 18 + Vite + Tailwind CSS v4
- Zustand (estado), React Router v6 (navegación)
- Recharts + Plotly.js (visualizaciones)
- Simulación numérica propia (Runge-Kutta 4)
- Vitest + Testing Library (tests)

## Inicio rápido

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run test` | Correr tests |
| `npm run lint` | Linter |
| `npm run format` | Formatear código |

## Estructura del proyecto

```
src/
  components/ui/        # Botones, Cards, Sliders, etc.
  features/
    simulator/          # Simulador PID
    gamification/       # XP, badges, misiones, rúbricas
    dashboard/          # Panel del estudiante
  pages/                # Páginas con React Router
  utils/                # Motor numérico (RK4, funciones de transferencia)
  store/                # Zustand stores
```

## Módulos de contenido

1. Sistemas Dinámicos
2. Respuesta Temporal
3. Estabilidad (Routh-Hurwitz, Lugar de raíces)
4. Análisis en Frecuencia (Bode, Nyquist)
5. Control PID
6. Retos Integrados

## Contribuir

Este proyecto es open-source bajo licencia MIT. Las contribuciones son bienvenidas.

## Licencia

MIT © 2026 CUCEI, Universidad de Guadalajara
