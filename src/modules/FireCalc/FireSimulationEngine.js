import { historicalMarketData } from './historicalData.js';

/**
 * FIRE Backtesting Simulation Engine
 * Runs historical simulations across all possible starting years.
 */
export const runFireSimulation = (params) => {
  const {
    portfolioValue,
    retirementLength,
    withdrawalStrategy, // 'constant-dollar' | 'percent-of-portfolio'
    withdrawalAmount,    // Used for constant-dollar (annual $)
    withdrawalPercent,   // Used for percent-of-portfolio (e.g. 0.04 = 4%)
    minWithdrawal,       // Optional floor for percent-of-portfolio (annual $)
    maxWithdrawal,       // Optional ceiling for percent-of-portfolio (annual $)
    stockAllocation,     // e.g. 0.80
    bondAllocation,      // e.g. 0.20
    cashAllocation,      // e.g. 0.00
    extraFlows = [],     // Optional extraordinary cash flows
  } = params;

  const data = historicalMarketData;
  const maxStartYear = data[data.length - 1].year - retirementLength;
  const possibleStarts = data.filter(d => d.year <= maxStartYear);

  if (possibleStarts.length === 0) {
    return {
      successRate: 0,
      totalSimulations: 0,
      survivedCount: 0,
      statistics: { median: 0, best: 0, worst: 0 },
      simulations: [],
      chartData: [],
    };
  }

  const simulations = [];

  for (const startEntry of possibleStarts) {
    const startIdx = data.indexOf(startEntry);
    let portfolio = portfolioValue;
    let currentWithdrawal = withdrawalAmount || 0;
    let cumulativeInflation = 1.0;
    let survived = true;
    const yearlyData = [];

    for (let i = 0; i < retirementLength; i++) {
      const yearData = data[startIdx + i];
      if (!yearData) break;

      // Update cumulative inflation starting from year 1
      if (i > 0) {
        const prevYearData = data[startIdx + i - 1];
        cumulativeInflation *= (1 + prevYearData.inflation);
      }

      // Calculate base withdrawal first
      let baseWithdrawal = 0;
      if (withdrawalStrategy === 'constant-dollar') {
        // Adjust for inflation using previous year's inflation
        if (i === 0) {
          baseWithdrawal = withdrawalAmount;
        } else {
          currentWithdrawal = withdrawalAmount * cumulativeInflation;
          baseWithdrawal = currentWithdrawal;
        }
      } else {
        // Percent of portfolio based on current balance
        baseWithdrawal = portfolio * withdrawalPercent;

        if (minWithdrawal > 0) {
          const adjustedFloor = minWithdrawal * cumulativeInflation;
          if (baseWithdrawal < adjustedFloor) {
            baseWithdrawal = adjustedFloor;
          }
        }

        if (maxWithdrawal > 0) {
          const adjustedCeiling = maxWithdrawal * cumulativeInflation;
          if (baseWithdrawal > adjustedCeiling) {
            baseWithdrawal = adjustedCeiling;
          }
        }
      }

      // Process extra cash flows for year of retirement i + 1
      let netExtraInflow = 0;
      let netExtraOutflow = 0;
      for (const flow of extraFlows) {
        const start = Number(flow.startYear) || 1;
        const end = flow.recurring ? (Number(flow.endYear) || retirementLength) : start;
        const currentYear = i + 1;
        if (currentYear >= start && currentYear <= end) {
          const rawAmt = Number(flow.amount) || 0;
          const adjustedAmt = flow.adjustForInflation ? rawAmt * cumulativeInflation : rawAmt;
          if (flow.type === 'income') {
            netExtraInflow += adjustedAmt;
          } else {
            netExtraOutflow += adjustedAmt;
          }
        }
      }

      const withdrawal = baseWithdrawal + netExtraOutflow - netExtraInflow;

      portfolio -= withdrawal;

      if (portfolio <= 0) {
        portfolio = 0;
        survived = false;
        yearlyData.push({
          year: yearData.year,
          yearIndex: i + 1,
          portfolio: 0,
          withdrawal: Math.round(withdrawal),
        });
        // Fill remaining years with 0
        for (let j = i + 1; j < retirementLength; j++) {
          const yd = data[startIdx + j];
          if (yd) {
            yearlyData.push({ year: yd.year, yearIndex: j + 1, portfolio: 0, withdrawal: 0 });
          }
        }
        break;
      }

      // Calculate portfolio return based on allocation on the remaining balance
      const portfolioReturn =
        (stockAllocation * yearData.stockReturn) +
        (bondAllocation * yearData.bondReturn) +
        (cashAllocation * yearData.cashReturn);

      // Apply return
      portfolio = portfolio * (1 + portfolioReturn);

      yearlyData.push({
        year: yearData.year,
        yearIndex: i + 1,
        portfolio: Math.round(portfolio),
        withdrawal: Math.round(withdrawal),
      });
    }

    simulations.push({
      startYear: startEntry.year,
      endYear: startEntry.year + retirementLength - 1,
      survived,
      endingValue: Math.round(portfolio),
      yearlyData,
    });
  }

  // Calculate statistics
  const survivedCount = simulations.filter(s => s.survived).length;
  const successRate = simulations.length > 0 ? (survivedCount / simulations.length) * 100 : 0;

  const endingValues = simulations.map(s => s.endingValue).sort((a, b) => a - b);
  const median = endingValues[Math.floor(endingValues.length / 2)] || 0;
  const best = endingValues[endingValues.length - 1] || 0;
  const worst = endingValues[0] || 0;

  // Build chart data: for each yearIndex (1..retirementLength), collect all portfolio values
  const chartData = [];
  for (let i = 0; i < retirementLength; i++) {
    const values = simulations.map(s => s.yearlyData[i]?.portfolio || 0);
    const sorted = [...values].sort((a, b) => a - b);
    chartData.push({
      yearIndex: i + 1,
      median: sorted[Math.floor(sorted.length / 2)] || 0,
      p10: sorted[Math.floor(sorted.length * 0.1)] || 0,
      p90: sorted[Math.floor(sorted.length * 0.9)] || 0,
      min: sorted[0] || 0,
      max: sorted[sorted.length - 1] || 0,
    });
  }

  return {
    successRate: Math.round(successRate * 10) / 10,
    totalSimulations: simulations.length,
    survivedCount,
    statistics: { median, best, worst },
    simulations,
    chartData,
  };
};
