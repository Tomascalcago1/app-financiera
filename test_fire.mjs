// Test script for FIRE Simulation Engine
import { historicalMarketData } from './src/modules/FireCalc/historicalData.js';

function runTest(params) {
  const { portfolioValue, retirementLength, withdrawalStrategy, withdrawalAmount, withdrawalPercent, stockAllocation, bondAllocation, cashAllocation } = params;
  const data = historicalMarketData;
  const maxStartYear = data[data.length - 1].year - retirementLength;
  const possibleStarts = data.filter(d => d.year <= maxStartYear);
  const simulations = [];
  for (const startEntry of possibleStarts) {
    const startIdx = data.indexOf(startEntry);
    let portfolio = portfolioValue;
    let currentWithdrawal = withdrawalAmount || 0;
    let survived = true;
    for (let i = 0; i < retirementLength; i++) {
      const yearData = data[startIdx + i];
      if (!yearData) break;
      
      let withdrawal = 0;
      if (withdrawalStrategy === 'constant-dollar') {
        if (i === 0) { withdrawal = withdrawalAmount; }
        else { 
          const prevYearData = data[startIdx + i - 1];
          currentWithdrawal = currentWithdrawal * (1 + prevYearData.inflation); 
          withdrawal = currentWithdrawal; 
        }
      } else { withdrawal = portfolio * withdrawalPercent; }
      portfolio -= withdrawal;
      if (portfolio <= 0) { portfolio = 0; survived = false; break; }
      
      const portfolioReturn = (stockAllocation * yearData.stockReturn) + (bondAllocation * yearData.bondReturn) + (cashAllocation * yearData.cashReturn);
      portfolio = portfolio * (1 + portfolioReturn);
    }
    simulations.push({ startYear: startEntry.year, survived, endingValue: Math.round(portfolio) });
  }
  const survivedCount = simulations.filter(s => s.survived).length;
  const successRate = (survivedCount / simulations.length) * 100;
  const ends = simulations.map(s => s.endingValue).sort((a,b) => a-b);
  return { successRate: Math.round(successRate*10)/10, total: simulations.length, survived: survivedCount, median: ends[Math.floor(ends.length/2)], best: ends[ends.length-1], worst: ends[0], failed: simulations.filter(s=>!s.survived).map(s=>s.startYear) };
}

console.log("=== Scenario 1: $1M, 30yr, $40k constant, 75/25 ===");
const r1 = runTest({ portfolioValue:1e6, retirementLength:30, withdrawalStrategy:'constant-dollar', withdrawalAmount:40000, withdrawalPercent:0, stockAllocation:0.75, bondAllocation:0.25, cashAllocation:0 });
console.log(JSON.stringify(r1, null, 2));
