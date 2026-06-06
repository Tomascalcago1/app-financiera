import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import CompoundResultsDashboard from './CompoundResultsDashboard';
import { simulateCompoundInterest } from './CompoundSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { TrendingUp, Settings2, HelpCircle } from 'lucide-react';

const CompoundInterestCalculator = () => {
  // Main Variables
  const [initialInvestment, setInitialInvestment] = useState(() => {
    const saved = localStorage.getItem('valia_compound_initialInvestment');
    return saved !== null ? saved : '';
  });
  const [monthlyContribution, setMonthlyContribution] = useState(() => {
    const saved = localStorage.getItem('valia_compound_monthlyContribution');
    return saved !== null ? saved : '';
  });
  const [years, setYears] = useState(() => {
    const saved = localStorage.getItem('valia_compound_years');
    return saved !== null ? saved : '';
  });
  const [interestRate, setInterestRate] = useState(() => {
    const saved = localStorage.getItem('valia_compound_interestRate');
    return saved !== null ? saved : '';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Advanced Variables
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [varianceRange, setVarianceRange] = useState(() => {
    const saved = localStorage.getItem('valia_compound_varianceRange');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 2;
  });
  const [compoundFrequency, setCompoundFrequency] = useState(() => {
    const saved = localStorage.getItem('valia_compound_compoundFrequency');
    return saved !== null ? Number(saved) : 1;
  });
  const [enableVariance, setEnableVariance] = useState(() => {
    const saved = localStorage.getItem('valia_compound_enableVariance');
    return saved !== null ? saved === 'true' : false;
  });

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_compound_initialInvestment', initialInvestment);
    localStorage.setItem('valia_compound_monthlyContribution', monthlyContribution);
    localStorage.setItem('valia_compound_years', years);
    localStorage.setItem('valia_compound_interestRate', interestRate);
    localStorage.setItem('valia_compound_varianceRange', varianceRange);
    localStorage.setItem('valia_compound_compoundFrequency', compoundFrequency);
    localStorage.setItem('valia_compound_enableVariance', enableVariance);
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

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
    <div className="container" style={{ padding: '2rem 0' }}>
      
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <TrendingUp className="text-accent-primary" size={32} />
          Calculadora de Interés Compuesto
        </h1>
        <p>Descubre cuánto puede crecer tu dinero a lo largo del tiempo.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funciona?
        </button>
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

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona el Interés Compuesto?"
      >
        <p>
          El interés compuesto es la fuerza más poderosa de las finanzas personales. A diferencia del interés simple, 
          aquí los intereses que ganás se suman a tu capital y **generan nuevos intereses el mes siguiente**.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. El Efecto Bola de Nieve</h3>
        <p>
          Si invertís $100 y ganás 10% el primer año, al final tenés $110. El segundo año, tu 10% se calcula sobre 
          $110 (no sobre los $100 iniciales), obteniendo $121. Con el tiempo, este crecimiento se acelera de forma exponencial.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Aportes Mensuales</h3>
        <p>
          Al sumar una contribución fija cada mes, no solo crece tu capital principal, sino que cada aporte empieza a generar 
          su propia "bola de nieve" de intereses inmediatamente, multiplicando la velocidad de crecimiento.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Frecuencia de Capitalización</h3>
        <p>
          Es la frecuencia con la que los intereses ganados se suman al capital (ej: mensual o anualmente). Cuanto más 
          frecuente sea (por ejemplo, mensual en vez de anual), más rápido crece tu dinero porque los intereses generan 
          ganancias más seguido.
        </p>
      </HelpModal>
    </div>
  );
};

export default CompoundInterestCalculator;
