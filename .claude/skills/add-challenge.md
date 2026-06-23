---
name: add-challenge
description: Crea un nuevo reto/escenario de simulación en Ctrllab con rúbrica automática. Uso: /add-challenge <módulo> <nivel-dificultad>
---

## Instrucciones para agregar un reto

### 1. Leer el archivo de retos del módulo

Leer `src/features/challenges/challenges.js` para entender el formato actual.

### 2. Definir el reto

```js
{
  id: 'challenge-kebab-id',
  moduleId: '<module-id>',
  title: 'Título descriptivo del reto',
  description: 'Contexto narrativo del problema (ej: "Un horno industrial necesita...")',
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  timeLimit: 300,         // segundos (null = sin límite)
  maxAttempts: 3,         // null = ilimitados
  xpReward: 200,
  badgeUnlock: null,      // ID del badge que desbloquea, o null

  plant: {
    num: [1],             // numerador G(s)
    den: [1, 2, 1],       // denominador G(s): s^2 + 2s + 1
    delay: 0,             // tiempo muerto en segundos
  },

  initialConditions: { kp: 1, ki: 0, kd: 0 },

  specs: {
    settlingTime: { max: 2.0, unit: 's' },         // tiempo de establecimiento
    overshoot: { max: 10, unit: '%' },              // sobreimpulso máximo
    steadyStateError: { max: 5, unit: '%' },        // error en estado estacionario
    riseTime: { max: null, unit: 's' },             // null = no evaluado
  },

  hints: [
    'Pista 1 (se muestra tras el 1er intento fallido)',
    'Pista 2 (se muestra tras el 2do intento fallido)',
  ],

  explanation: 'Explicación de la solución óptima para mostrar al terminar',
}
```

### 3. Rubrica automática

La rúbrica se evalúa en `src/features/gamification/logic/rubric.js`. Verificar que las specs del reto usen criterios ya soportados. Si no, agregar el criterio al evaluador.

### 4. Agregar al módulo

Importar y agregar el reto en el array de retos del módulo correspondiente.

### 5. Confirmar

Reportar: ID, especificaciones de aceptación, planta G(s) configurada, XP.
