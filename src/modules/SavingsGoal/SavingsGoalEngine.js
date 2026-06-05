/**
 * Simulation Engine for Savings Goal
 * Calculates the required monthly contribution to reach a specific financial goal.
 */

export const simulateSavingsGoal = (params) => {
  const {
    goalAmount,
    initialInvestment,
    years,
    interestRate // e.g. 0.08 for 8%
  } = params;

  // Calculate required monthly contribution
  const months = years * 12;
  const monthlyRate = interestRate / 12;

  let requiredMonthlyContribution = 0;

  if (interestRate === 0) {
    requiredMonthlyContribution = (goalAmount - initialInvestment) / months;
  } else {
    // FV = P*(1+r)^n + PMT*[((1+r)^n - 1) / r]
    // PMT = [FV - P*(1+r)^n] * r / [(1+r)^n - 1]
    const compoundFactor = Math.pow(1 + monthlyRate, months);
    requiredMonthlyContribution = (goalAmount - (initialInvestment * compoundFactor)) * monthlyRate / (compoundFactor - 1);
  }

  // If the initial investment alone surpasses the goal, contribution is 0 or negative. 
  // We cap it at 0 to say "you don't need to contribute".
  if (requiredMonthlyContribution < 0) {
    requiredMonthlyContribution = 0;
  }

  // Generate year-by-year progression data for the chart
  const results = [];
  let currentBalance = initialInvestment;
  let totalContributions = initialInvestment;

  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      results.push({
        year,
        expected: initialInvestment,
        totalContributions: initialInvestment,
        goal: goalAmount
      });
      continue;
    }

    // Compound for 12 months
    for (let m = 0; m < 12; m++) {
      if (interestRate > 0) {
        currentBalance = currentBalance * (1 + monthlyRate) + requiredMonthlyContribution;
      } else {
        currentBalance += requiredMonthlyContribution;
      }
    }
    
    totalContributions += (requiredMonthlyContribution * 12);

    results.push({
      year,
      expected: Math.round(currentBalance),
      totalContributions: Math.round(totalContributions),
      goal: goalAmount
    });
  }

  return {
    requiredMonthlyContribution: requiredMonthlyContribution > 0 ? requiredMonthlyContribution : 0,
    progressionData: results
  };
};
