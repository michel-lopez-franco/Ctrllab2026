export const moduleContent = {
  id: 'dinamica',
  title: 'Sistemas Dinámicos',
  estimatedTime: 45,
  xpReward: 100,
  objectives: [
    'Identificar un sistema dinámico y sus variables de entrada, salida y estado.',
    'Escribir el modelo matemático de sistemas físicos simples mediante EDOs.',
    'Distinguir sistemas de primer y segundo orden por su ecuación característica.',
    'Aplicar el concepto de linealización alrededor de un punto de operación.',
  ],
  sections: [
    {
      id: 'intro',
      title: '¿Qué es un sistema dinámico?',
      content: `Un **sistema dinámico** es cualquier proceso cuyo comportamiento cambia con el tiempo y puede describirse mediante ecuaciones diferenciales.

En ingeniería de control nos interesan sistemas donde:
- Hay una **entrada** u(t) que podemos manipular (voltaje, fuerza, caudal…)
- Hay una **salida** y(t) que queremos controlar (velocidad, temperatura, posición…)
- El sistema tiene **memoria**: lo que pasa ahora depende del pasado

**Ejemplo cotidiano:** Un calentador de agua. La entrada es la potencia eléctrica; la salida es la temperatura. Si apagamos el calentador, el agua no se enfría instantáneamente — tiene memoria térmica.`,
    },
    {
      id: 'modelo',
      title: 'Modelo matemático: ecuaciones diferenciales',
      content: `La herramienta para describir sistemas dinámicos son las **ecuaciones diferenciales ordinarias (EDOs)**.

**Sistema de primer orden** — un solo elemento de almacenamiento de energía:

> τ · dy/dt + y = K · u(t)

Donde τ es la constante de tiempo y K es la ganancia estática.

**Ejemplo — Tanque de agua:**
La tasa de cambio del nivel h depende del caudal de entrada q_in menos el de salida:

> A · dh/dt = q_in − (1/R) · h

Aquí A es el área del tanque y R la resistencia hidráulica.

**Sistema de segundo orden** — dos elementos de almacenamiento (masa + resorte, inductor + capacitor…):

> m · ÿ + b · ẏ + k · y = F(t)

Esta es la ecuación masa-resorte-amortiguador. En forma estándar:

> ÿ + 2ζωₙẏ + ωₙ²y = ωₙ²u

Donde ζ es el **coeficiente de amortiguamiento** y ωₙ la **frecuencia natural**.`,
    },
    {
      id: 'variables-estado',
      title: 'Variables de estado',
      content: `Las **variables de estado** son el conjunto mínimo de variables que, conocidas en t₀, permiten calcular la respuesta para todo t > t₀.

Para la ecuación masa-resorte-amortiguador definimos:
- x₁ = y (posición)
- x₂ = ẏ (velocidad)

Y reescribimos como sistema de primer orden:

> ẋ₁ = x₂
> ẋ₂ = −(k/m)x₁ − (b/m)x₂ + (1/m)F

En forma matricial **ẋ = Ax + Bu**, **y = Cx**:

\`\`\`
A = [ 0        1   ]    B = [ 0   ]    C = [ 1  0 ]
    [ -k/m   -b/m  ]        [ 1/m ]
\`\`\`

**¿Por qué importa?** Porque el espacio de estados es la base del diseño moderno de controladores y permite representar sistemas de cualquier orden de forma sistemática.`,
    },
    {
      id: 'linealizacion',
      title: 'Linealización',
      content: `La mayoría de los sistemas físicos reales son **no lineales**. Sin embargo, las técnicas de control clásicas trabajan con modelos lineales.

La solución: **linealizar alrededor de un punto de operación** (equilibrio).

Si el sistema es ẋ = f(x, u), y tiene un punto de equilibrio en (x₀, u₀) donde f(x₀, u₀) = 0, entonces para pequeñas perturbaciones δx = x − x₀ y δu = u − u₀:

> δẋ ≈ A · δx + B · δu

Donde A y B son las matrices **jacobianas** evaluadas en el punto de operación:

> A = ∂f/∂x |₍ₓ₀,ᵤ₀₎       B = ∂f/∂u |₍ₓ₀,ᵤ₀₎

**Ejemplo — Péndulo invertido:**
La ecuación no lineal es: θ̈ = (g/L)·sin(θ) − (b/mL²)·θ̇

En torno a θ₀ = 0 (posición vertical): sin(θ) ≈ θ, y se obtiene el modelo lineal:

> θ̈ = (g/L)·θ − (b/mL²)·θ̇

Válido mientras θ sea pequeño (< 15° aproximadamente).`,
    },
    {
      id: 'analogias',
      title: 'Analogías entre dominios físicos',
      content: `Una de las ideas más poderosas en sistemas dinámicos: la misma ecuación describe fenómenos físicos en dominios completamente distintos.

| Mecánico | Eléctrico | Hidráulico | Térmico |
|----------|-----------|------------|---------|
| Masa m | Inductancia L | Inercia fluida | Capacidad térmica |
| Amortiguador b | Resistencia R | Resistencia hidráulica | Resistencia térmica |
| Resorte k | Capacitor 1/C | — | — |
| Fuerza F | Voltaje V | Presión P | Flujo de calor Q |
| Velocidad ẋ | Corriente i | Caudal q | Temperatura T |

**Implicación práctica:** Si sabes analizar un circuito RC, ya sabes analizar un sistema térmico. El controlador que diseñas para uno funciona (con los valores correctos) para el otro.`,
    },
  ],

  quiz: [
    {
      id: 'q1',
      question: '¿Cuál de las siguientes afirmaciones describe mejor a un sistema dinámico?',
      options: [
        'Un sistema cuya salida depende únicamente del valor actual de la entrada, sin memoria del pasado.',
        'Un sistema cuyo comportamiento evoluciona con el tiempo y puede describirse mediante ecuaciones diferenciales.',
        'Un sistema donde la relación entre entrada y salida es siempre lineal.',
        'Un sistema que solo puede tener una variable de entrada y una de salida.',
      ],
      correctIndex: 1,
      explanation:
        'La característica esencial de un sistema dinámico es que su comportamiento depende del tiempo y del historial del sistema (memoria), lo que se captura mediante ecuaciones diferenciales. No necesita ser lineal ni de una sola entrada/salida.',
    },
    {
      id: 'q2',
      question:
        'El modelo de un tanque de nivel es A·dh/dt = qᵢₙ − h/R. ¿Qué representa la constante de tiempo τ = A·R?',
      options: [
        'El tiempo que tarda el tanque en llenarse completamente.',
        'El tiempo en que el nivel alcanza el 63.2% de su valor final ante un escalón de entrada.',
        'La velocidad máxima de vaciado del tanque.',
        'El nivel de equilibrio cuando la entrada es constante.',
      ],
      correctIndex: 1,
      explanation:
        'En cualquier sistema de primer orden, la constante de tiempo τ es el tiempo necesario para que la respuesta alcance el 63.2% de su valor final (1 − e⁻¹ ≈ 0.632). Para el tanque, τ = A·R combina la capacidad de almacenamiento (A) con la resistencia al flujo (R).',
    },
    {
      id: 'q3',
      question:
        'Para el sistema masa-resorte-amortiguador mÿ + bẏ + ky = F, ¿cuáles son las variables de estado más apropiadas?',
      options: [
        'x₁ = F (fuerza) y x₂ = ÿ (aceleración).',
        'x₁ = y (posición) y x₂ = ẏ (velocidad).',
        'x₁ = ẏ (velocidad) y x₂ = ÿ (aceleración).',
        'Solo se necesita x₁ = y porque es un sistema de segundo orden.',
      ],
      correctIndex: 1,
      explanation:
        'Las variables de estado deben capturar la "energía almacenada" del sistema. En el sistema mecánico: la posición x₁ = y almacena energía potencial (resorte) y la velocidad x₂ = ẏ almacena energía cinética (masa). Con estas dos variables en t₀, podemos predecir el comportamiento futuro completamente.',
    },
    {
      id: 'q4',
      question:
        'Un ingeniero linealiza el sistema θ̈ = (g/L)·sin(θ) en torno a θ₀ = 0. El modelo lineal resultante es válido principalmente cuando:',
      options: [
        'El péndulo oscila con ángulos grandes (θ > 90°).',
        'La frecuencia de oscilación es muy baja.',
        'Las perturbaciones son pequeñas respecto al punto de operación (θ ≈ 0).',
        'La longitud del péndulo es mucho mayor que la amplitud de oscilación.',
      ],
      correctIndex: 2,
      explanation:
        'La linealización es una aproximación válida solo cerca del punto de operación. La aproximación sin(θ) ≈ θ introduce un error menor al 1% para θ < 7° y menor al 5% para θ < 17°. Fuera de esa región, el modelo lineal puede predecir comportamientos incorrectos.',
    },
    {
      id: 'q5',
      question:
        'Un circuito RC con R = 1kΩ y C = 1mF tiene la ecuación RC·dVc/dt + Vc = Vs. ¿Cuál es su sistema mecánico equivalente?',
      options: [
        'Un resorte sin amortiguamiento (sistema conservativo).',
        'Un amortiguador viscoso sin resorte ni masa (sistema de primer orden b·ẋ = F).',
        'Un sistema masa-resorte-amortiguador de segundo orden.',
        'Un péndulo simple.',
      ],
      correctIndex: 1,
      explanation:
        'El circuito RC es un sistema de primer orden donde la resistencia R es análoga al amortiguador b y el capacitor C es análogo a la masa m en la ecuación b·ẋ + (1/C)·x ≈ F. Sin embargo, la analogía más directa es con un amortiguador puro: la resistencia disipa energía y el capacitor la almacena, sin elemento restaurador (sin resorte), igual que b·ẋ = F.',
    },
    {
      id: 'q6',
      question:
        'La ecuación en espacio de estados ẋ = Ax + Bu, y = Cx tiene las matrices A = [[-2]], B = [[1]], C = [[3]]. ¿Cuál es la función de transferencia G(s) = Y(s)/U(s)?',
      options: [
        'G(s) = 3/(s + 2)',
        'G(s) = 1/(s + 2)',
        'G(s) = 3/(s − 2)',
        'G(s) = 2/(s + 3)',
      ],
      correctIndex: 0,
      explanation:
        'Para un sistema de espacio de estados, G(s) = C(sI − A)⁻¹B. Con A = [[-2]], B = [[1]], C = [[3]]: (sI − A) = (s + 2), su inversa es 1/(s + 2), y G(s) = 3 · 1/(s + 2) · 1 = 3/(s + 2). La ganancia estática (s = 0) es G(0) = 3/2 = 1.5.',
    },
  ],
}
