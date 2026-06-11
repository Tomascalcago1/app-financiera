/**
 * Savings Comparison Engine for Argentina
 * Compares: Plazo Fijo UVA vs. Plazo Fijo Tradicional vs. Cauciones Financieras
 */
export const runSavingsComparison = (params) => {
  const {
    initialCapital,      // e.g. 1000000 ARS
    termDays,            // e.g. 180 days (minimum 180 for UVA)
    tnaTraditional,      // TNA Traditional Fixed Term (e.g. 0.35 for 35%)
    tnaCauciones,        // TNA Cauciones 7d (e.g. 0.30 for 30%)
    tnaUva,              // TNA Spread UVA (e.g. 0.01 for 1%)
    inflationRates,      // Array of monthly rates, e.g. [0.032, 0.03, 0.028, ...]
    customInflationMode, // boolean
    averageInflation,    // e.g. 0.025 (2.5% monthly)
  } = params;

  const capital = Number(initialCapital) || 0;
  const days = Number(termDays) || 180;
  const rateTrad = Number(tnaTraditional) || 0;
  const rateCauc = Number(tnaCauciones) || 0;
  const rateUva = Number(tnaUva) || 0;
  const avgInf = Number(averageInflation) || 0;

  const numMonths = Math.ceil(days / 30);
  
  let traditionalBalance = capital;
  let caucionesBalance = capital;
  let uvaBalance = capital;
  let cumulativeInflation = 1.0;

  const chartData = [
    {
      monthIndex: 0,
      traditional: Math.round(traditionalBalance),
      cauciones: Math.round(caucionesBalance),
      uva: Math.round(uvaBalance),
      inflationAcumulada: 0,
    }
  ];

  const monthlyBreakdown = [];

  for (let m = 1; m <= numMonths; m++) {
    // Determine the days in this month step
    let daysInStep = 30;
    if (m === numMonths) {
      daysInStep = days - 30 * (numMonths - 1);
    }
    if (daysInStep <= 0) break;

    const fractionOf30Days = daysInStep / 30;

    // Get inflation for this month step
    let currentMonthInflation = avgInf;
    if (customInflationMode && Array.isArray(inflationRates)) {
      // Use custom inflation rate if available, fallback to average
      const rateIndex = m - 1;
      if (rateIndex < inflationRates.length && inflationRates[rateIndex] !== undefined) {
        currentMonthInflation = Number(inflationRates[rateIndex]) || 0;
      }
    }

    // Adjust inflation for the step duration (pro-rata if last step is fractional)
    const stepInflation = currentMonthInflation * fractionOf30Days;
    cumulativeInflation *= (1 + stepInflation);

    // 1. Plazo Fijo Tradicional (compounds every step, i.e., rollover)
    traditionalBalance = traditionalBalance * (1 + rateTrad * daysInStep / 365);

    // 2. Cauciones (compounds every 7 days)
    const caucionPeriods = daysInStep / 7;
    caucionesBalance = caucionesBalance * Math.pow(1 + rateCauc * 7 / 365, caucionPeriods);

    // 3. Plazo Fijo UVA (adjusts by inflation, plus spreads accrued linearly)
    uvaBalance = uvaBalance * (1 + stepInflation) * (1 + rateUva * daysInStep / 365);

    chartData.push({
      monthIndex: m,
      traditional: Math.round(traditionalBalance),
      cauciones: Math.round(caucionesBalance),
      uva: Math.round(uvaBalance),
      inflationAcumulada: Math.round((cumulativeInflation - 1) * 100 * 10) / 10,
    });

    monthlyBreakdown.push({
      monthIndex: m,
      monthName: `Mes ${m}${m === numMonths && daysInStep !== 30 ? ` (${daysInStep} días)` : ''}`,
      inflationValue: Math.round(currentMonthInflation * 100 * 10) / 10,
      traditionalBalance: Math.round(traditionalBalance),
      caucionesBalance: Math.round(caucionesBalance),
      uvaBalance: Math.round(uvaBalance),
    });
  }

  // Calculate gains
  const traditionalGain = traditionalBalance - capital;
  const caucionesGain = caucionesBalance - capital;
  const uvaGain = uvaBalance - capital;

  // Calculate real return (adjusted for final cumulative inflation)
  const traditionalRealValue = traditionalBalance / cumulativeInflation;
  const caucionesRealValue = caucionesBalance / cumulativeInflation;
  const uvaRealValue = uvaBalance / cumulativeInflation;

  const traditionalRealReturn = ((traditionalRealValue - capital) / capital) * 100;
  const caucionesRealReturn = ((caucionesRealValue - capital) / capital) * 100;
  const uvaRealReturn = ((uvaRealValue - capital) / capital) * 100;

  // Find winner
  let winner = 'uva';
  let winnerLabel = 'Plazo Fijo UVA';
  let winnerValue = uvaBalance;
  
  if (traditionalBalance > uvaBalance && traditionalBalance > caucionesBalance) {
    winner = 'traditional';
    winnerLabel = 'Plazo Fijo Tradicional';
    winnerValue = traditionalBalance;
  } else if (caucionesBalance > uvaBalance && caucionesBalance > traditionalBalance) {
    winner = 'cauciones';
    winnerLabel = 'Cauciones Financieras';
    winnerValue = caucionesBalance;
  }

  return {
    traditionalFinal: Math.round(traditionalBalance),
    caucionesFinal: Math.round(caucionesBalance),
    uvaFinal: Math.round(uvaBalance),
    traditionalGain: Math.round(traditionalGain),
    caucionesGain: Math.round(caucionesGain),
    uvaGain: Math.round(uvaGain),
    traditionalRealReturn: Math.round(traditionalRealReturn * 10) / 10,
    caucionesRealReturn: Math.round(caucionesRealReturn * 10) / 10,
    uvaRealReturn: Math.round(uvaRealReturn * 10) / 10,
    inflationAcumulada: Math.round((cumulativeInflation - 1) * 100 * 10) / 10,
    winner,
    winnerLabel,
    winnerValue: Math.round(winnerValue),
    chartData,
    monthlyBreakdown,
  };
};
