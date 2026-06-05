import React, { useState, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import CompoundResultsDashboard from './CompoundResultsDashboard';
import { simulateCompoundInterest } from './CompoundSimulationEngine';
import { TrendingUp, Settings2 } from 'lucide-react';

const CompoundInterestCalculator = () => {
  // Main Variables
  const [initialInvestment, setInitialInvestment] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [years, setYears] = useState('');
  const [interestRate, setInterestRate] = useState('');
  
  // Advanced Variables
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [varianceRange, setVarianceRange] = useState(2);
  const [compoundFrequency, setCompoundFrequency] = useState(1); // 1 = Annually, 12 = Monthly
  const [enableVariance, setEnableVariance] = useState(false);

  // Generate simulation data when inputs change
  const simulationData = useMemo(() => {
    // Solo simulamos si los datos obligatorios no están vacíos
    if (initialInvestment === '' || years === '' || interestRate === '') return [];

    return simulateCompoundInterest({
      initialInvestment: Number(initialInvestment) || 0,
      monthlyContribution: Number(monthlyContribution) || 0,
      years: Number(years) || 0,
      interestRate: (Number(interestRate) || 0) / 100,
      varianceRange: enableVariance ? (Number(varianceRange) || 0) / 100 : 0,
      compoundFrequency: compoundFrequency
    });
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <TrendingUp className="text-accent-primary" size={32} />
          Calculadora de Interés Compuesto
        </h1>
        <p>Descubre cuánto puede crecer tu dinero a lo largo del tiempo.</p>
      </header>

      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Input Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Tu Inversión
          </h2>
          
          <FinancialInput 
            label="Capital Inicial" 
            value={initialInvestment} 
            onChange={setInitialInvestment}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Aporte Mensual" 
            value={monthlyContribution} 
            onChange={setMonthlyContribution}
            prefix="$"
            step={100}
          />
          
          <FinancialInput 
            label="Plazo de Inversión (Años)" 
            value={years} 
            onChange={setYears}
            suffix="años"
            min={1}
            max={50}
          />

          <FinancialInput 
            label="Tasa de Interés Estimada" 
            value={interestRate} 
            onChange={setInterestRate}
            suffix="%"
            step={0.1}
          />

          <button 
            className="btn btn-outline" 
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings2 size={18} />
            {showAdvanced ? 'Ocultar Opciones Avanzadas' : 'Mostrar Opciones Avanzadas'}
          </button>

          {showAdvanced && (
            <div className="animate-fade-in" style={{ 
              marginTop: '1rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  Calcular Escenarios de Varianza
                </label>
                <input 
                  type="checkbox" 
                  checked={enableVariance}
                  onChange={(e) => setEnableVariance(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </div>

              {enableVariance && (
                <FinancialInput 
                  label="Rango de Varianza de la Tasa (+/-)" 
                  value={varianceRange} 
                  onChange={setVarianceRange}
                  suffix="%"
                  step={0.1}
                />
              )}

              <div className="input-group">
                <label className="input-label">Frecuencia de Capitalización</label>
                <select 
                  className="input-field" 
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  style={{ appearance: 'auto' }}
                >
                  <option value={1}>Anualmente</option>
                  <option value={2}>Semestralmente</option>
                  <option value={12}>Mensualmente</option>
                  <option value={365}>Diariamente</option>
                </select>
              </div>

            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CompoundResultsDashboard data={simulationData} varianceEnabled={enableVariance} />
        </div>

      </div>
    </div>
  );
};

export default CompoundInterestCalculator;
