import { GameDefinition } from '../types/curriculum.js';

export const OFFICIAL_SCIENTIFIC_GAMES: GameDefinition[] = [
  {
    id: 'game.orbitas',
    title: 'Órbita: Rescate Galileo',
    domains: ['fisica', 'matematicas', 'ingenieria'],
    status: 'planned_not_implemented',
    description: 'Mecánica orbital newtoniana y relativista, maniobras de Hohmann y transferencias bi-elípticas.',
    physicsModel: 'Gravitación universal de N-cuerpos con integrador Runge-Kutta 4 (RK4)'
  },
  {
    id: 'game.balistica',
    title: 'Estadio Balístico',
    domains: ['fisica', 'deporte'],
    status: 'planned_not_implemented',
    description: 'Tiro parabólico con arrastre aerodinámico cuadrático y efecto Magnus tridimensional.',
    physicsModel: 'Ecuaciones diferenciales de resistencia de fluidos con coeficiente de sustentación'
  },
  {
    id: 'game.fourier',
    title: 'Sintetizador de Fourier',
    domains: ['matematicas', 'musica', 'electronica'],
    status: 'planned_not_implemented',
    description: 'Descomposición espectral de armónicos sonoros, series trigonométricas y transformada rápida FFT.',
    physicsModel: 'Series de Fourier en tiempo continuo y discreto con modulación de fase'
  },
  {
    id: 'game.cocina',
    title: 'Cocina de Calor',
    domains: ['fisica', 'quimica', 'cocina'],
    status: 'planned_not_implemented',
    description: 'Transferencia térmica por conducción (Ley de Fourier), convección y radiación de cuerpo negro.',
    physicsModel: 'Ecuación diferencial parcial de difusión térmica en mallas discretizadas'
  },
  {
    id: 'game.circuitos',
    title: 'Circuit Quest',
    domains: ['fisica', 'ingenieria'],
    status: 'planned_not_implemented',
    description: 'Leyes de Kirchhoff, análisis nodal/mallas, régimen transitorio RLC y respuesta en frecuencia.',
    physicsModel: 'Sistemas de ecuaciones diferenciales ordinarias lineales acopladas'
  },
  {
    id: 'game.puente',
    title: 'Puente Estructural',
    domains: ['fisica', 'ingenieria'],
    status: 'planned_not_implemented',
    description: 'Estática de estructuras reticulares, método de nodos/secciones, tensión, compresión y pandeo.',
    physicsModel: 'Equilibrio de fuerzas estáticas y cálculo de esfuerzos axiales según módulo de Young'
  },
  {
    id: 'game.gauss',
    title: 'Laboratorio Gauss',
    domains: ['fisica', 'matematicas'],
    status: 'planned_not_implemented',
    description: 'Campos electrostáticos, superficies gaussianas cerradas, cálculo de flujo y Ley de Gauss.',
    physicsModel: 'Integrales de superficie para campos vectoriales conservativos con simetrías'
  },
  {
    id: 'game.reactor',
    title: 'Reactor Matemático',
    domains: ['quimica', 'ingenieria'],
    status: 'planned_not_implemented',
    description: 'Cinética química de reacciones de orden 0, 1 y 2, equilibrio químico y ecuación de Arrhenius.',
    physicsModel: 'Sistemas de ecuaciones diferenciales no lineales con balance de materia y energía'
  },
  {
    id: 'game.tunel',
    title: 'Túnel Cuántico',
    domains: ['fisica', 'matematicas'],
    status: 'planned_not_implemented',
    description: 'Mecánica cuántica unidimensional, barreras de potencial finito y efecto túnel de partículas.',
    physicsModel: 'Ecuación de Schrödinger independiente del tiempo con coeficientes de transmisión T'
  },
  {
    id: 'game.interferencias',
    title: 'Óptica Interferencial',
    domains: ['fisica', 'arte'],
    status: 'planned_not_implemented',
    description: 'Experimento de Young de doble rendija, redes de difracción, coherencia y patrones de iridiscencia.',
    physicsModel: 'Superposición de ondas electromagnéticas con desfase geométrico delta = k*d*sin(theta)'
  },
  {
    id: 'game.clima',
    title: 'Clima de Energía',
    domains: ['fisica', 'quimica'],
    status: 'planned_not_implemented',
    description: 'Balance radiativo planetario, efecto invernadero, albedo y termodinámica atmosférica.',
    physicsModel: 'Modelo de capas de absorción de radiación infrarroja con retroalimentación'
  },
  {
    id: 'game.unidades',
    title: 'Inspector de Unidades',
    domains: ['todas'],
    status: 'planned_not_implemented',
    description: 'Análisis dimensional riguroso, teorema Pi de Buckingham y detección de errores algebraicos.',
    physicsModel: 'Álgebra de dimensiones en base SI (M, L, T, I, Theta, N, J) con verificación de homogeneidad'
  },
  {
    id: 'game.caos',
    title: 'Caos y Péndulos',
    domains: ['fisica', 'matematicas'],
    status: 'planned_not_implemented',
    description: 'Péndulo doble, atractores extraños, sensibilidad a condiciones iniciales y exponentes de Lyapunov.',
    physicsModel: 'Mecánica lagrangiana con ecuaciones de Euler-Lagrange para péndulo doble acoplado'
  },
  {
    id: 'game.mercado',
    title: 'Mercado de Energía',
    domains: ['ingenieria', 'matematicas', 'finanzas'],
    status: 'planned_not_implemented',
    description: 'Despacho económico de generación eléctrica, curvas de costo marginal y restricciones de transmisión.',
    physicsModel: 'Optimización lineal cuadrática con flujos de potencia DC y balance de red'
  },
  {
    id: 'game.cristales',
    title: 'Morfología de Cristales',
    domains: ['quimica', 'fisica'],
    status: 'planned_not_implemented',
    description: 'Redes de Bravais, índices de Miller, simetrías puntuales y difracción de rayos X (Ley de Bragg).',
    physicsModel: 'Geometría del espacio recíproco y condición de interferencia constructiva 2d*sin(theta) = n*lambda'
  },
  {
    id: 'game.exoplanetas',
    title: 'Observatorio de Exoplanetas',
    domains: ['fisica', 'estadistica'],
    status: 'planned_not_implemented',
    description: 'Método de tránsitos fotométricos, curvas de luz estelar, velocidad radial y zona de habitabilidad.',
    physicsModel: 'Modelado geométrico del oscurecimiento hacia el limbo y ajuste de parámetros orbitales'
  },
  {
    id: 'game.robot',
    title: 'Robot de Control',
    domains: ['ingenieria', 'robotica'],
    status: 'planned_not_implemented',
    description: 'Cinemática directa e inversa, matrices de Denavit-Hartenberg y control PID en bucle cerrado.',
    physicsModel: 'Transformaciones homogéneas 4x4 y dinámica de Newton-Euler con servomotores'
  },
  {
    id: 'game.feynman',
    title: 'Feynman Escape Room',
    domains: ['todas'],
    status: 'planned_not_implemented',
    description: 'Desafíos donde la única forma de escapar es explicar un principio sin jerga, identificar la falla de una analogía o deducir la ley fundamental.',
    physicsModel: 'Motor de validación semántica estructurada contra rúbricas de rigor conceptual'
  }
];
