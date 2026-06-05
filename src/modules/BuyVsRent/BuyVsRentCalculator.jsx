import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import ResultsDashboard from './ResultsDashboard';
import HelpModal from '../../components/HelpModal';
import { simulateBuyVsRent } from './SimulationEngine';
import { Calculator, Settings2, HelpCircle } from 'lucide-react';

const BuyVsRentCalculator = () => {
  // State for mandatory variables
  const [propertyPrice, setPropertyPrice] = useState(100000);
  const [monthlyRent, setMonthlyRent] = useState(500);
  const [initialCapital, setInitialCapital] = useState(20000);
  const [years, setYears] = useState(20);

  // State for advanced variables (hidden by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inflationRate, setInflationRate] = useState(3);
  const [investmentReturn, setInvestmentReturn] = useState(8);
  const [propertyAppreciation, setPropertyAppreciation] = useState(4);
  const [maintenanceRate, setMaintenanceRate] = useState(1);
  const [mortgageRate, setMortgageRate] = useState(5);
  const [mortgageYears, setMortgageYears] = useState(20);

  // Modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Generate simulation data when inputs change
  const simulationData = useMemo(() => {
    return simulateBuyVsRent({
      propertyPrice,
      monthlyRent,
      initialCapital,
      years,
      inflationRate: inflationRate / 100,
      investmentReturn: investmentReturn / 100,
      propertyAppreciation: propertyAppreciation / 100,
      maintenanceRate: maintenanceRate / 100,
      mortgageRate: mortgageRate / 100,
      mortgageYears: mortgageYears
    });
  }, [
    propertyPrice,
    monthlyRent,
    initialCapital,
    years,
    inflationRate,
    investmentReturn,
    propertyAppreciation,
    maintenanceRate,
    mortgageRate,
    mortgageYears
  ]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Calculator className="text-accent-primary" size={32} />
          ¿Comprar o Alquilar?
        </h1>
        <p>Descubre qué opción es mejor para tu patrimonio a largo plazo.</p>
        
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
            Tus Datos
          </h2>
          
          <FinancialInput 
            label="Precio de la Propiedad" 
            value={propertyPrice} 
            onChange={setPropertyPrice}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Capital Inicial (Ahorros)" 
            value={initialCapital} 
            onChange={setInitialCapital}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label="Alquiler Mensual" 
            value={monthlyRent} 
            onChange={setMonthlyRent}
            prefix="$"
            step={100}
          />
          
          <FinancialInput 
            label="Horizonte Temporal (Años)" 
            value={years} 
            onChange={setYears}
            suffix="años"
            min={1}
            max={50}
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
              <FinancialInput 
                label="Inflación Estimada (Anual)" 
                value={inflationRate} 
                onChange={setInflationRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label="Rendimiento de Inversiones (TNA)" 
                value={investmentReturn} 
                onChange={setInvestmentReturn}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label="Apreciación del Inmueble (Anual)" 
                value={propertyAppreciation} 
                onChange={setPropertyAppreciation}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label="Gastos de Mantenimiento (Anual)" 
                value={maintenanceRate} 
                onChange={setMaintenanceRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label="Tasa de Hipoteca (Anual)" 
                value={mortgageRate} 
                onChange={setMortgageRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label="Plazo de Hipoteca (Años)" 
                value={mortgageYears} 
                onChange={setMortgageYears}
                suffix="años"
                min={1}
                max={50}
              />
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <ResultsDashboard data={simulationData} />
        </div>

      </div>
      
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default BuyVsRentCalculator;
