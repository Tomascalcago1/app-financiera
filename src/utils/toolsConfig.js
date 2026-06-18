export const tools = [
  // Global Tools
  {
    id: 'compound-interest',
    name: {
      es: 'Interés Compuesto',
      en: 'Compound Interest'
    },
    path: {
      es: 'interes-compuesto',
      en: 'compound-interest'
    },
    isGlobal: true,
    category: 'planning'
  },
  {
    id: 'fire',
    name: {
      es: 'Simulador de Retiro',
      en: 'Retirement Simulator (FIRE)'
    },
    path: {
      es: 'simulador-de-retiro',
      en: 'retirement-simulator'
    },
    isGlobal: true,
    category: 'planning'
  },
  {
    id: 'savings-goal',
    name: {
      es: 'Objetivo de Ahorro',
      en: 'Savings Goal Calculator'
    },
    path: {
      es: 'objetivo-de-ahorro',
      en: 'savings-goal'
    },
    isGlobal: true,
    category: 'planning'
  },
  {
    id: 'buy-vs-rent',
    name: {
      es: '¿Comprar o Alquilar?',
      en: 'Buy vs. Rent'
    },
    path: {
      es: 'comprar-o-alquilar',
      en: 'buy-vs-rent'
    },
    isGlobal: true,
    category: 'planning'
  },
  {
    id: 'tna-to-tea',
    name: {
      es: 'Conversor TNA a TEA',
      en: 'APR to APY Converter'
    },
    path: {
      es: 'conversor-tasa',
      en: 'rate-converter'
    },
    isGlobal: true,
    category: 'tools'
  },
  
  // Argentina Local Tools
  {
    id: 'installments-vs-cash',
    name: {
      es: '¿Cuotas o Efectivo?',
      en: 'Installments vs. Cash'
    },
    path: {
      es: 'cuotas-o-efectivo',
      en: 'installments-vs-cash'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'sueldo-neto',
    name: {
      es: 'Sueldo Neto Freelancer',
      en: 'Net Salary (AR)'
    },
    path: {
      es: 'sueldo-neto',
      en: 'net-salary-ar'
    },
    isGlobal: false,
    category: 'taxes'
  },
  {
    id: 'ganancias',
    name: {
      es: 'Simulador de Ganancias',
      en: 'Income Tax (AR)'
    },
    path: {
      es: 'ganancias',
      en: 'income-tax-ar'
    },
    isGlobal: false,
    category: 'taxes'
  },
  {
    id: 'savings-comparison',
    name: {
      es: '¿UVA, Plazo Fijo o Caución?',
      en: 'Savings Comparison (AR)'
    },
    path: {
      es: 'comparador-de-ahorro',
      en: 'savings-comparison-ar'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'hipotecario-uva',
    name: {
      es: 'Crédito Hipotecario UVA',
      en: 'UVA Mortgage Calculator'
    },
    path: {
      es: 'hipotecario-uva',
      en: 'uva-mortgage'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'ipc-actualizer',
    name: {
      es: 'Actualizador IPC (INDEC)',
      en: 'Inflation Indexer (AR)'
    },
    path: {
      es: 'actualizador-ipc',
      en: 'inflation-indexer-ar'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'comparador-historico',
    name: {
      es: 'Dólar vs PF vs Merval',
      en: 'Historical Performance (AR)'
    },
    path: {
      es: 'comparador-historico',
      en: 'historical-comparison-ar'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'inflation',
    name: {
      es: 'Inflación Histórica',
      en: 'Historical Inflation (AR)'
    },
    path: {
      es: 'inflacion-historica',
      en: 'historical-inflation-ar'
    },
    isGlobal: false,
    category: 'tools'
  },
  {
    id: 'broker-comparator',
    name: {
      es: 'Comparador de Brokers',
      en: 'Broker Comparison (AR)'
    },
    path: {
      es: 'comparador-de-brokers',
      en: 'broker-comparison-ar'
    },
    isGlobal: false,
    category: 'tools'
  }
];

// Helper dictionaries for routing
export const toolMap = {
  'simulador-fire': 'fire'
};
export const toolMapReverse = {};

tools.forEach(t => {
  // Map Spanish paths
  toolMap[t.path.es] = t.id;
  toolMapReverse[t.id] = t.path.es;

  // Map English paths
  toolMap[t.path.en] = t.id;
});

// Getter based on language
export const getToolPath = (toolId, lang) => {
  const tool = tools.find(t => t.id === toolId);
  return tool ? tool.path[lang] : toolId;
};

export const getToolName = (toolId, lang) => {
  const tool = tools.find(t => t.id === toolId);
  return tool ? tool.name[lang] : toolId;
};
