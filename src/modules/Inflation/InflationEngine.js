import { cpiData } from './cpiData';

/**
 * Inflation Calculation Engine
 */

const getCpi = (year) => {
  const entry = cpiData.find(d => d.year === year);
  return entry ? entry.cpi : null;
};

/**
 * Calculate equivalent value between two years using CPI data or custom rate.
 */
export const calculateInflation = (params) => {
  const { amount, fromYear, toYear, customRate } = params;

  const yearSpan = toYear - fromYear;

  if (customRate !== null && customRate !== undefined) {
    // Custom rate calculation
    const equivalentValue = amount * Math.pow(1 + customRate, yearSpan);
    const totalInflationPercent = ((equivalentValue / amount) - 1) * 100;
    return {
      equivalentValue,
      totalInflationPercent,
      averageAnnualRate: customRate * 100,
      isCustom: true,
    };
  }

  // CPI-based calculation
  const fromCpi = getCpi(fromYear);
  const toCpi = getCpi(toYear);

  if (!fromCpi || !toCpi) {
    return null;
  }

  const equivalentValue = amount * (toCpi / fromCpi);
  const totalInflationPercent = ((toCpi / fromCpi) - 1) * 100;
  const averageAnnualRate = yearSpan !== 0
    ? (Math.pow(toCpi / fromCpi, 1 / Math.abs(yearSpan)) - 1) * 100
    : 0;

  return {
    equivalentValue,
    totalInflationPercent,
    averageAnnualRate,
    isCustom: false,
  };
};

/**
 * Generate full historical chart data: what $100 in startYear is worth in each subsequent year.
 */
export const generateHistoricalChartData = (startYear = 1635, amount = 100) => {
  const startCpi = getCpi(startYear);
  if (!startCpi) return [];

  return cpiData
    .filter(d => d.year >= startYear)
    .map(d => ({
      year: d.year,
      value: Math.round((amount * (d.cpi / startCpi)) * 100) / 100,
    }));
};

/**
 * Generate future projection data given a current amount and annual inflation rate.
 */
export const generateFutureProjection = (currentAmount, annualRate, yearsAhead = 30) => {
  const data = [];
  for (let i = 0; i <= yearsAhead; i++) {
    const futurePrice = currentAmount * Math.pow(1 + annualRate, i);
    const purchasingPower = currentAmount * Math.pow(1 / (1 + annualRate), i);
    data.push({
      year: new Date().getFullYear() + i,
      futurePrice: Math.round(futurePrice * 100) / 100,
      purchasingPower: Math.round(purchasingPower * 100) / 100,
    });
  }
  return data;
};
