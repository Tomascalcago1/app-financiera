/**
 * Simulation Engine for Buy vs Rent
 * Calculates the net worth progression over a given timeframe.
 */

export const simulateBuyVsRent = (params) => {
  const {
    propertyPrice,
    monthlyRent,
    initialCapital,
    years,
    inflationRate = 0.03,
    investmentReturn = 0.08,
    propertyAppreciation = 0.04,
    maintenanceRate = 0.01,
    mortgageRate = 0.05,
    mortgageYears = 20,
  } = params;

  const results = [];
  
  let currentPropertyPrice = propertyPrice;
  let currentRent = monthlyRent;
  
  const downPayment = Math.min(initialCapital, propertyPrice);
  const loanAmount = propertyPrice - downPayment;
  
  const monthlyRate = mortgageRate / 12;
  const numPayments = mortgageYears * 12;
  
  // Calculate fixed monthly mortgage. If loanAmount is 0, mortgage is 0.
  const monthlyMortgage = loanAmount > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : (loanAmount > 0 && monthlyRate === 0 ? loanAmount / numPayments : 0);

  let remainingDebt = loanAmount;
  let buyInvestedCash = Math.max(0, initialCapital - downPayment);
  let rentNetWorth = initialCapital;
  
  // Track isolated baseline investments (no monthly additions) to show the breakdown
  let buyBaselineInvestment = buyInvestedCash;
  let rentBaselineInvestment = initialCapital;
  
  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      results.push({
        year,
        buyNetWorth: currentPropertyPrice - remainingDebt + buyInvestedCash,
        rentNetWorth: rentNetWorth,
        propertyValue: currentPropertyPrice,
        remainingDebt: remainingDebt,
        rentBaseline: rentBaselineInvestment,
        rentSavings: 0,
        buyBaseline: buyBaselineInvestment,
        buySavings: 0
      });
      continue;
    }

    // End of year calculations

    // 1. Property appreciates
    currentPropertyPrice = currentPropertyPrice * (1 + propertyAppreciation);
    
    // 2. Buy costs
    const annualMaintenance = currentPropertyPrice * maintenanceRate;
    let annualMortgagePaid = 0;
    
    for (let m = 0; m < 12; m++) {
      if (remainingDebt > 0) {
        const interest = remainingDebt * monthlyRate;
        const principal = monthlyMortgage - interest;
        remainingDebt -= principal;
        if (remainingDebt < 0) remainingDebt = 0;
        annualMortgagePaid += monthlyMortgage;
      }
    }

    // 3. Compare monthly costs and invest the difference
    const monthlyMaintenance = annualMaintenance / 12;
    let buyMonthlyCost = monthlyMaintenance + (annualMortgagePaid / 12);
    let rentMonthlyCost = currentRent;

    let buyAnnualSavings = 0;
    let rentAnnualSavings = 0;

    for(let m = 0; m < 12; m++) {
       if (buyMonthlyCost < rentMonthlyCost) {
           buyAnnualSavings += (rentMonthlyCost - buyMonthlyCost);
       } else {
           rentAnnualSavings += (buyMonthlyCost - rentMonthlyCost);
       }
    }
    
    // 4. Investments grow
    buyInvestedCash = buyInvestedCash * (1 + investmentReturn);
    rentNetWorth = rentNetWorth * (1 + investmentReturn);
    
    // Grow baseline separately
    buyBaselineInvestment = buyBaselineInvestment * (1 + investmentReturn);
    rentBaselineInvestment = rentBaselineInvestment * (1 + investmentReturn);

    // 5. Add savings to investments at the end of the year
    buyInvestedCash += buyAnnualSavings;
    rentNetWorth += rentAnnualSavings;

    // 6. Rent increases next year
    currentRent = currentRent * (1 + inflationRate);

    results.push({
      year,
      buyNetWorth: Math.round(currentPropertyPrice - remainingDebt + buyInvestedCash),
      rentNetWorth: Math.round(rentNetWorth),
      propertyValue: Math.round(currentPropertyPrice),
      remainingDebt: Math.round(remainingDebt),
      rentBaseline: Math.round(rentBaselineInvestment),
      rentSavings: Math.round(rentNetWorth - rentBaselineInvestment),
      buyBaseline: Math.round(buyBaselineInvestment),
      buySavings: Math.round(buyInvestedCash - buyBaselineInvestment)
    });
  }

  return results;
};
