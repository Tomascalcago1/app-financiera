import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import ResultsDashboard from './ResultsDashboard';
import HelpModal from '../../components/HelpModal';
import { simulateBuyVsRent } from './SimulationEngine';
import { Calculator, Settings2, HelpCircle } from 'lucide-react';

const BuyVsRentCalculator = () => {
  // State for mandatory variables
  const [propertyPrice, setPropertyPrice] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_propertyPrice');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 100000;
  });
  const [monthlyRent, setMonthlyRent] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_monthlyRent');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 500;
  });
  const [initialCapital, setInitialCapital] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_initialCapital');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 20000;
  });
  const [years, setYears] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_years');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 20;
  });

  // State for advanced variables (hidden by default)
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inflationRate, setInflationRate] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_inflationRate');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 3;
  });
  const [investmentReturn, setInvestmentReturn] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_investmentReturn');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 8;
  });
  const [propertyAppreciation, setPropertyAppreciation] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_propertyAppreciation');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 4;
  });
  const [maintenanceRate, setMaintenanceRate] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_maintenanceRate');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 1;
  });
  const [mortgageRate, setMortgageRate] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_mortgageRate');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 5;
  });
  const [mortgageYears, setMortgageYears] = useState(() => {
    const saved = localStorage.getItem('valia_buyvsrent_mortgageYears');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 20;
  });

  // Modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_buyvsrent_propertyPrice', propertyPrice);
    localStorage.setItem('valia_buyvsrent_monthlyRent', monthlyRent);
    localStorage.setItem('valia_buyvsrent_initialCapital', initialCapital);
    localStorage.setItem('valia_buyvsrent_years', years);
    localStorage.setItem('valia_buyvsrent_inflationRate', inflationRate);
    localStorage.setItem('valia_buyvsrent_investmentReturn', investmentReturn);
    localStorage.setItem('valia_buyvsrent_propertyAppreciation', propertyAppreciation);
    localStorage.setItem('valia_buyvsrent_maintenanceRate', maintenanceRate);
    localStorage.setItem('valia_buyvsrent_mortgageRate', mortgageRate);
    localStorage.setItem('valia_buyvsrent_mortgageYears', mortgageYears);
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

  // Generate simulation data when inputs change
  const simulationData = useMemo(() => {
    return simulateBuyVsRent({
      propertyPrice: propertyPrice === '' ? 0 : Number(propertyPrice),
      monthlyRent: monthlyRent === '' ? 0 : Number(monthlyRent),
      initialCapital: initialCapital === '' ? 0 : Number(initialCapital),
      years: years === '' ? 0 : Number(years),
      inflationRate: (inflationRate === '' ? 0 : Number(inflationRate)) / 100,
      investmentReturn: (investmentReturn === '' ? 0 : Number(investmentReturn)) / 100,
      propertyAppreciation: (propertyAppreciation === '' ? 0 : Number(propertyAppreciation)) / 100,
      maintenanceRate: (maintenanceRate === '' ? 0 : Number(maintenanceRate)) / 100,
      mortgageRate: (mortgageRate === '' ? 0 : Number(mortgageRate)) / 100,
      mortgageYears: mortgageYears === '' ? 0 : Number(mortgageYears)
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
          <ResultsDashboard 
            data={simulationData} 
            inputs={{
              propertyPrice,
              initialCapital,
              monthlyRent,
              years,
              inflationRate,
              investmentReturn,
              propertyAppreciation,
              maintenanceRate,
              mortgageRate,
              mortgageYears
            }}
          />
        </div>

      </div>
      
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona la comparación?"
      >
        <p>
          Esta calculadora compara de manera justa los escenarios de comprar y alquilar, asumiendo que en ambos casos 
          <strong> gastas exactamente la misma cantidad de dinero de tu bolsillo cada mes</strong>.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Escenario: Alquilar e Invertir</h3>
        <p>
          Tu <strong>Capital Inicial</strong> se invierte inmediatamente al rendimiento estimado. 
          Además, cada mes la calculadora revisa si pagar tu alquiler te sale más barato que 
          pagar la hipoteca y el mantenimiento de una casa. <strong>Ese ahorro mensual también se invierte mes a mes</strong>.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Escenario: Comprar Inmueble</h3>
        <p>
          Tu Capital Inicial se usa como adelanto de la propiedad. El resto se financia con una hipoteca.
          El inmueble se revaloriza (sube de precio) con los años, pero tienes gastos de hipoteca, mantenimiento e impuestos.
          Si en algún mes pagar esto es más barato que alquilar, la diferencia se ahorra y se invierte.
        </p>
        <p>
          Al final del plazo, tu patrimonio si compraste es igual a: 
          <strong> (Valor de la Propiedad) - (Deuda restante) + (Tus ahorros invertidos)</strong>.
        </p>

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginTop: '0.5rem' }}>
          <p style={{ margin: 0, fontSize: '0.85rem' }}>
            <strong>Conclusión:</strong> El gráfico te muestra qué decisión te deja con más riqueza neta en el bolsillo al final del plazo, considerando el costo del dinero y el crecimiento de las inversiones.
          </p>
        </div>
      </HelpModal>
    </div>
  );
};

export default BuyVsRentCalculator;
