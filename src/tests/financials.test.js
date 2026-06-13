import { describe, it, expect } from 'vitest';
import { runTnaToTeaCalculations } from '../modules/TnaToTea/TnaToTeaEngine';
import { simulateCompoundInterest } from '../modules/CompoundInterest/CompoundSimulationEngine';
import { runFireSimulation } from '../modules/FireCalc/FireSimulationEngine';
import { runSavingsComparison } from '../modules/SavingsComparison/SavingsComparisonEngine';

describe('Financial Engines Math & Regression Tests', () => {

  describe('TNA to TEA Calculator (runTnaToTeaCalculations)', () => {
    it('should calculate monthly compound rates correctly', () => {
      // 40% TNA, monthly compounding, 30% inflation
      const res = runTnaToTeaCalculations(40, 'monthly', 30);
      
      // TEA = (1 + 0.40 / 12) ^ 12 - 1 = 48.2128%
      expect(res.tea).toBeCloseTo(48.2128, 2);
      
      // TEM = (1 + TEA) ^ (1/12) - 1 = 3.3333%
      expect(res.tem).toBeCloseTo(3.3333, 2);

      // Real Return = (TEA - Inflation) / (1 + Inflation) = (0.482128 - 0.30) / 1.30 = 14.0099%
      expect(res.realReturn).toBeCloseTo(14.0099, 2);

      // Chart data should have 13 elements (month 0 to 12)
      expect(res.chartData.length).toBe(13);
      expect(res.monthlyBreakdown.length).toBe(12);

      // Principal is 100,000
      expect(res.chartData[0].simple).toBe(100000);
      expect(res.chartData[0].compound).toBe(100000);

      // Simple interest month 12: 100000 * (1 + 0.40) = 140000
      expect(res.chartData[12].simple).toBe(140000);

      // Compound interest month 12: 100000 * (1 + TEA) = 148213
      expect(res.chartData[12].compound).toBe(148213);
      expect(res.gainDiff).toBe(8213); // 148213 - 140000
    });

    it('should calculate annual compound rates correctly', () => {
      // 40% TNA, annual compounding, 30% inflation
      const res = runTnaToTeaCalculations(40, 'annually', 30);
      
      // TEA = (1 + 0.40 / 1) ^ 1 - 1 = 40%
      expect(res.tea).toBeCloseTo(40.00, 2);

      // Real Return = (0.40 - 0.30) / 1.30 = 7.6923%
      expect(res.realReturn).toBeCloseTo(7.6923, 2);
    });
  });

  describe('Compound Interest Engine (simulateCompoundInterest)', () => {
    it('should simulate balance growth over years', () => {
      const params = {
        initialInvestment: 100000,
        monthlyContribution: 1000,
        years: 5,
        interestRate: 0.08,
        varianceRange: 0.02,
        compoundFrequency: 12
      };

      const results = simulateCompoundInterest(params);

      // 6 entries (Year 0 to 5)
      expect(results.length).toBe(6);
      
      // Year 0 details
      expect(results[0].year).toBe(0);
      expect(results[0].expected).toBe(100000);
      expect(results[0].totalContributions).toBe(100000);

      // Year 5 contributions should be: 100000 + (1000 * 12 * 5) = 160000
      expect(results[5].year).toBe(5);
      expect(results[5].totalContributions).toBe(160000);

      // Expect optimistic > expected > pessimistic
      expect(results[5].optimistic).toBeGreaterThan(results[5].expected);
      expect(results[5].expected).toBeGreaterThan(results[5].pessimistic);

      // Expected balance verification
      // Monthly rate = (1 + 0.08 / 12) ^ 1 - 1 = 0.0066667
      // 5 years = 60 months. Let's make sure the number is in a reasonable ballpark:
      // (100000 * 1.006667^60) + 1000 * ((1.006667^60 - 1)/0.006667) = ~148984 + ~73476 = ~222460
      expect(results[5].expected).toBeCloseTo(222460, -2); // close within 100 pesos
    });
  });

  describe('FIRE Backtesting Simulation Engine (runFireSimulation)', () => {
    it('should run backtesting successfully and compute statistics', () => {
      const params = {
        portfolioValue: 1000000,
        retirementLength: 30,
        withdrawalStrategy: 'constant-dollar',
        withdrawalAmount: 40000,
        stockAllocation: 0.75,
        bondAllocation: 0.25,
        cashAllocation: 0.00
      };

      const res = runFireSimulation(params);

      expect(res.successRate).toBeGreaterThan(0);
      expect(res.successRate).toBeLessThanOrEqual(100);
      expect(res.totalSimulations).toBeGreaterThan(0);
      expect(res.survivedCount).toBeLessThanOrEqual(res.totalSimulations);

      expect(res.statistics.best).toBeGreaterThan(res.statistics.median);
      expect(res.statistics.median).toBeGreaterThan(res.statistics.worst);

      // Chart data should cover the length of retirement (30 years)
      expect(res.chartData.length).toBe(30);
      expect(res.chartData[0].yearIndex).toBe(1);
      expect(res.chartData[29].yearIndex).toBe(30);
    });

    it('should handle percent-of-portfolio strategy with floors and ceilings', () => {
      const params = {
        portfolioValue: 1000000,
        retirementLength: 30,
        withdrawalStrategy: 'percent-of-portfolio',
        withdrawalPercent: 0.04, // 4%
        minWithdrawal: 30000,    // floor
        maxWithdrawal: 50000,    // ceiling
        stockAllocation: 0.60,
        bondAllocation: 0.40,
        cashAllocation: 0.00
      };

      const res = runFireSimulation(params);
      expect(res.totalSimulations).toBeGreaterThan(0);
      expect(res.successRate).toBeGreaterThan(80); // 4% rule with floor/ceiling is usually high success
    });
  });

  describe('Savings Comparison Engine (runSavingsComparison)', () => {
    it('should calculate and compare different assets for Argentina', () => {
      const params = {
        initialCapital: 1000000,
        termDays: 90,
        tnaTraditional: 0.40, // 40% Traditional
        tnaCauciones: 0.35,   // 35% Cauciones
        tnaUva: 0.01,         // 1% UVA Spread
        inflationRates: [0.03, 0.04, 0.035],
        customInflationMode: true,
        averageInflation: 0.03
      };

      const res = runSavingsComparison(params);

      // Outputs should be numbers
      expect(res.traditionalFinal).toBeGreaterThan(1000000);
      expect(res.caucionesFinal).toBeGreaterThan(1000000);
      expect(res.uvaFinal).toBeGreaterThan(1000000);

      expect(res.traditionalGain).toBe(res.traditionalFinal - 1000000);
      expect(res.caucionesGain).toBe(res.caucionesFinal - 1000000);
      expect(res.uvaGain).toBe(res.uvaFinal - 1000000);

      // Cumulative inflation check
      // (1 + 0.03) * (1 + 0.04) * (1 + 0.035) - 1 = 1.03 * 1.04 * 1.035 - 1 = 1.10869 - 1 = 10.87%
      expect(res.inflationAcumulada).toBeCloseTo(10.9, 1);

      // Number of months: Math.ceil(90/30) = 3
      expect(res.chartData.length).toBe(4); // Month 0 to 3
      expect(res.monthlyBreakdown.length).toBe(3);

      expect(res.winner).toBeTypeOf('string');
      expect(res.winnerLabel).toBeTypeOf('string');
      expect(res.winnerValue).toBeGreaterThan(1000000);
    });
  });

});
