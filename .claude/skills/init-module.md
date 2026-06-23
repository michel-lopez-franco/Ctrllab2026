---
name: init-module
description: Crea el scaffold completo de un nuevo módulo educativo en Ctrllab (teoría + simulador + quiz + reto). Uso: /init-module <nombre-modulo>
---

Crea el scaffold completo para un nuevo módulo educativo en `src/features/` con la siguiente estructura:

## Instrucciones

Dado el nombre del módulo como argumento (ej: `pid-control`), crear:

```
src/features/<module-name>/
  index.js                          # Re-exports públicos del módulo
  content.js                        # Contenido teórico (texto, objetivos, quiz)
  components/
    <ModuleName>Page.jsx            # Página principal con Tabs
    <ModuleName>Simulator.jsx       # Simulador específico del módulo
    <ModuleName>Quiz.jsx            # Componente de quiz
    <ModuleName>Challenge.jsx       # Reto del módulo
  hooks/
    use<ModuleName>Simulation.js    # Hook de simulación del módulo
```

### Plantilla de `content.js`

```js
export const moduleContent = {
  id: '<module-id>',
  title: '<Título del Módulo>',
  description: '<Descripción breve>',
  estimatedTime: 45, // minutos
  xpReward: 150,
  objectives: [
    'Describir ...',
    'Identificar ...',
    'Aplicar ...',
  ],
  sections: [],
  quiz: [],
}
```

### Plantilla de página principal

```jsx
import { useState } from 'react'
import { Tabs } from '@/components/ui/Tabs'

const TABS = ['Teoría', 'Simulador', 'Quiz', 'Reto']

export function <ModuleName>Page() {
  const [activeTab, setActiveTab] = useState('Teoría')
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {/* contenido por tab */}
    </div>
  )
}
```

### Después de crear los archivos

1. Agregar la ruta en `src/pages/routes.jsx`
2. Agregar la entrada al array `MODULES` en `src/features/dashboard/modules.js`
3. Confirmar al usuario los archivos creados y la ruta de navegación
