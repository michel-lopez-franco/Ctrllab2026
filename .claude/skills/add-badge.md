---
name: add-badge
description: Agrega un nuevo badge/insignia al sistema de gamificación de Ctrllab. Uso: /add-badge "<nombre>" "<descripción>" <condición-en-código>
---

## Instrucciones para agregar un badge

### 1. Leer el archivo actual de badges
Lee `src/features/gamification/logic/badges.js` para ver el formato existente.

### 2. Definir el badge

Agregar al array `BADGES` en `src/features/gamification/logic/badges.js`:

```js
{
  id: 'kebab-case-id',
  name: 'Nombre del Badge',
  description: 'Descripción de cómo se obtiene (para el usuario)',
  icon: 'LucideIconName',        // Nombre del ícono de Lucide
  color: 'text-yellow-400',      // Clase Tailwind para el color del ícono
  rarity: 'common' | 'rare' | 'epic' | 'legendary',
  xpBonus: 50,                   // XP extra al obtenerlo
  condition: (stats) => boolean, // Función pura que evalúa si se cumple
}
```

### 3. Registrar el evento que dispara la evaluación

En `src/features/gamification/hooks/useGamificationEvents.js`, verificar que el evento relevante ya llama a `checkBadges(stats)`. Si no existe, agregar el evento.

### 4. Crear el ícono SVG/visual si es personalizado

Si el badge usa un ícono de Lucide disponible: no se necesita nada extra.
Si requiere un ícono custom: crear en `src/assets/badges/<badge-id>.svg`.

### 5. Confirmar

Reportar al usuario:
- ID del badge creado
- Condición exacta
- Evento que lo dispara
- XP bonus
