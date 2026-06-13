/**
 * Rate Conversion and Simulation Engine
 * Handles TNA to TEA/TEM conversions and inflation-adjusted real returns.
 */

export const compoundingMap = {
  daily: { label: 'Diaria (365 días)', periods: 365, labelEs: 'Diaria' },
  weekly: { label: 'Semanal (52 semanas)', periods: 52, labelEs: 'Semanal' },
  biweekly: { label: 'Quincenal (24 quincenas)', periods: 24, labelEs: 'Quincenal' },
  monthly: { label: 'Mensual (12 meses)', periods: 12, labelEs: 'Mensual' },
  bimonthly: { label: 'Bimestral (6 bimestres)', periods: 6, labelEs: 'Bimestral' },
  quarterly: { label: 'Trimestral (4 trimestres)', periods: 4, labelEs: 'Trimestral' },
  semiannually: { label: 'Semestral (2 semestres)', periods: 2, labelEs: 'Semestral' },
  annually: { label: 'Anual (1 vez al año)', periods: 1, labelEs: 'Anual' }
};

export const runTnaToTeaCalculations = (tna, frequency, inflation) => {
  const rTna = (Number(tna) || 0) / 100;
  const rInf = (Number(inflation) || 0) / 100;
  const n = compoundingMap[frequency]?.periods || 12;

  // TEA = (1 + TNA/n)^n - 1
  const tea = Math.pow(1 + rTna / n, n) - 1;

  // TEM = (1 + TEA)^(1/12) - 1
  const tem = Math.pow(1 + tea, 1 / 12) - 1;

  // Real Return = (TEA - Inflation) / (1 + Inflation)
  const realReturn = (tea - rInf) / (1 + rInf);

  // Simulate growth of $100.000 to illustrate difference
  const principal = 100000;
  const chartData = [];
  const monthlyBreakdown = [];

  // Monthly rates for simulation
  const monthlyRateSimple = rTna / 12;
  const monthlyRateCompound = tem;

  let balanceSimple = principal;
  let balanceCompound = principal;

  chartData.push({
    monthIndex: 0,
    simple: Math.round(balanceSimple),
    compound: Math.round(balanceCompound)
  });

  for (let m = 1; m <= 12; m++) {
    // Simple Interest (TNA basis - no reinvestment)
    balanceSimple = principal * (1 + monthlyRateSimple * m);
    
    // Compound Interest (TEA basis - reinvesting)
    balanceCompound = balanceCompound * (1 + monthlyRateCompound);

    chartData.push({
      monthIndex: m,
      simple: Math.round(balanceSimple),
      compound: Math.round(balanceCompound)
    });

    monthlyBreakdown.push({
      monthIndex: m,
      monthName: `Mes ${m}`,
      simpleBalance: Math.round(balanceSimple),
      simpleInterestAcc: Math.round(balanceSimple - principal),
      compoundBalance: Math.round(balanceCompound),
      compoundInterestAcc: Math.round(balanceCompound - principal)
    });
  }

  return {
    tea: tea * 100,
    tem: tem * 100,
    realReturn: realReturn * 100,
    chartData,
    monthlyBreakdown,
    gainDiff: Math.round(balanceCompound - balanceSimple)
  };
};
