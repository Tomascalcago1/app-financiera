/**
 * Simulation Engine for Compound Interest
 * Calculates the growth of an investment over time with monthly contributions.
 * Generates three scenarios: Expected, Optimistic (+ variance), and Pessimistic (- variance).
 */

export const simulateCompoundInterest = (params) => {
  const {
    initialInvestment,
    monthlyContribution,
    years,
    interestRate, // e.g. 0.08 for 8%
    varianceRange, // e.g. 0.02 for 2%
    compoundFrequency = 12 // 1 = annually, 12 = monthly, 365 = daily
  } = params;

  const results = [];

  // Calculate the three rates
  const expectedRate = interestRate;
  const optimisticRate = interestRate + varianceRange;
  const pessimisticRate = Math.max(0, interestRate - varianceRange); // don't go below 0 usually, but could be negative. Let's allow negative if needed, but floor at -100%. Actually let's just let it be negative.

  // Helper to calculate compound interest for a specific month
  // We will generate data points year by year for the graph.
  const calculateYearEndValue = (principal, monthlyAddition, rate, freq, totalYears) => {
    // If rate is 0, it's just principal + additions
    if (rate === 0) {
      return principal + (monthlyAddition * 12 * totalYears);
    }
    
    // Formula: A = P(1 + r/n)^(nt) + PMT * [ (1 + r/n)^(nt) - 1 ] / (r/n)
    // Note: PMT frequency and Compound frequency should ideally match.
    // If compound is Annually (freq=1) but contributions are Monthly, the math gets complicated.
    // To be precise and support any combination, we can just simulate it month by month.
    
    let currentBalance = principal;
    const months = totalYears * 12;
    const effectiveMonthlyRate = Math.pow(1 + rate / freq, freq / 12) - 1;
    
    for (let m = 1; m <= months; m++) {
      currentBalance = currentBalance * (1 + effectiveMonthlyRate) + monthlyAddition;
    }
    return currentBalance;
  };

  // Build the array year by year
  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      results.push({
        year,
        expected: initialInvestment,
        optimistic: initialInvestment,
        pessimistic: initialInvestment,
        totalContributions: initialInvestment
      });
      continue;
    }

    results.push({
      year,
      expected: Math.round(calculateYearEndValue(initialInvestment, monthlyContribution, expectedRate, compoundFrequency, year)),
      optimistic: Math.round(calculateYearEndValue(initialInvestment, monthlyContribution, optimisticRate, compoundFrequency, year)),
      pessimistic: Math.round(calculateYearEndValue(initialInvestment, monthlyContribution, pessimisticRate, compoundFrequency, year)),
      totalContributions: initialInvestment + (monthlyContribution * 12 * year)
    });
  }

  return results;
};
