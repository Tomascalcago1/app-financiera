import React, { useState, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import SavingsGoalDashboard from './SavingsGoalDashboard';
import { simulateSavingsGoal } from './SavingsGoalEngine';
import { Target } from 'lucide-react';

const SavingsGoalCalculator = () => {
  // Main Variables (Empty by default like the previous one)
  const [goalAmount, setGoalAmount] = useState('');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [years, setYears] = useState('');
  const [interestRate, setInterestRate] = useState('');
  
  // Generate simulation data when inputs change
  const simulationResult = useMemo(() => {
    // Only simulate if mandatory fields are filled
    if (goalAmount === '' || initialInvestment === '' || years === '' || interestRate === '') return null;

    return simulateSavingsGoal({
      goalAmount: Number(goalAmount) || 0,
      initialInvestment: Number(initialInvestment) || 0,
      years: Number(years) || 0,
      interestRate: (Number(interestRate) || 0) / 100
    });
  }, [
    goalAmount,
    initialInvestment,
    years,
    interestRate
  ]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Target className="text-accent-primary" size={32} />
          Calculadora de Objetivo de Ahorro
        </h1>
        <p>Averigua exactamente cuánto debes aportar cada mes para alcanzar tu meta.</p>
      </header>

      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Input Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Tu Meta
          </h2>
          
          <FinancialInput 
            label="Objetivo de Ahorro" 
            value={goalAmount} 
            onChange={setGoalAmount}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Capital Inicial (Ahorros Actuales)" 
            value={initialInvestment} 
            onChange={setInitialInvestment}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Plazo para la Meta (Años)" 
            value={years} 
            onChange={setYears}
            suffix="años"
            min={1}
            max={50}
          />

          <FinancialInput 
            label="Tasa de Interés Estimada (Anual)" 
            value={interestRate} 
            onChange={setInterestRate}
            suffix="%"
            step={0.1}
          />
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <SavingsGoalDashboard 
            data={simulationResult?.progressionData} 
            requiredContribution={simulationResult?.requiredMonthlyContribution}
            goalAmount={Number(goalAmount) || 0}
          />
        </div>

      </div>
    </div>
  );
};

export default SavingsGoalCalculator;
