import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import FireResultsDashboard from './FireResultsDashboard';
import { runFireSimulation } from './FireSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { Flame, Settings2, HelpCircle } from 'lucide-react';

const FireCalculator = () => {
  const [portfolioValue, setPortfolioValue] = useState(() => {
    const saved = localStorage.getItem('valia_fire_portfolioValue');
    return saved !== null ? saved : '';
  });
  const [retirementLength, setRetirementLength] = useState(() => {
    const saved = localStorage.getItem('valia_fire_retirementLength');
    return saved !== null ? saved : '';
  });
  const [withdrawalStrategy, setWithdrawalStrategy] = useState(() => {
    const saved = localStorage.getItem('valia_fire_withdrawalStrategy');
    return saved !== null ? saved : 'constant-dollar';
  });
  const [withdrawalAmount, setWithdrawalAmount] = useState(() => {
    const saved = localStorage.getItem('valia_fire_withdrawalAmount');
    return saved !== null ? saved : '';
  });
  const [withdrawalPercent, setWithdrawalPercent] = useState(() => {
    const saved = localStorage.getItem('valia_fire_withdrawalPercent');
    return saved !== null ? saved : '';
  });
  const [stockAlloc, setStockAlloc] = useState(() => {
    const saved = localStorage.getItem('valia_fire_stockAlloc');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 80;
  });
  const [bondAlloc, setBondAlloc] = useState(() => {
    const saved = localStorage.getItem('valia_fire_bondAlloc');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 20;
  });
  const [cashAlloc, setCashAlloc] = useState(() => {
    const saved = localStorage.getItem('valia_fire_cashAlloc');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 0;
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_fire_portfolioValue', portfolioValue);
    localStorage.setItem('valia_fire_retirementLength', retirementLength);
    localStorage.setItem('valia_fire_withdrawalStrategy', withdrawalStrategy);
    localStorage.setItem('valia_fire_withdrawalAmount', withdrawalAmount);
    localStorage.setItem('valia_fire_withdrawalPercent', withdrawalPercent);
    localStorage.setItem('valia_fire_stockAlloc', stockAlloc);
    localStorage.setItem('valia_fire_bondAlloc', bondAlloc);
    localStorage.setItem('valia_fire_cashAlloc', cashAlloc);
  }, [
    portfolioValue,
    retirementLength,
    withdrawalStrategy,
    withdrawalAmount,
    withdrawalPercent,
    stockAlloc,
    bondAlloc,
    cashAlloc
  ]);

  const allocSum = Number(stockAlloc || 0) + Number(bondAlloc || 0) + Number(cashAlloc || 0);

  const results = useMemo(() => {
    if (!portfolioValue || !retirementLength) return null;
    if (withdrawalStrategy === 'constant-dollar' && !withdrawalAmount) return null;
    if (withdrawalStrategy === 'percent-of-portfolio' && !withdrawalPercent) return null;
    if (allocSum !== 100) return null;

    return runFireSimulation({
      portfolioValue: Number(portfolioValue),
      retirementLength: Number(retirementLength),
      withdrawalStrategy,
      withdrawalAmount: Number(withdrawalAmount) || 0,
      withdrawalPercent: (Number(withdrawalPercent) || 0) / 100,
      stockAllocation: Number(stockAlloc) / 100,
      bondAllocation: Number(bondAlloc) / 100,
      cashAllocation: Number(cashAlloc) / 100,
    });
  }, [portfolioValue, retirementLength, withdrawalStrategy, withdrawalAmount, withdrawalPercent, stockAlloc, bondAlloc, cashAlloc, allocSum]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={32} style={{ color: '#F59E0B' }} />
          Simulador FIRE
        </h1>
        <p>Backtesting de retiro con datos históricos del mercado desde 1926.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funciona?
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            Tu Plan de Retiro
          </h2>

          <FinancialInput label="Valor del Portafolio" value={portfolioValue} onChange={setPortfolioValue} prefix="$" step={10000} />
          <FinancialInput label="Duración del Retiro" value={retirementLength} onChange={setRetirementLength} suffix="años" min={1} max={60} />

          <div className="input-group">
            <label className="input-label">Estrategia de Retiro</label>
            <select className="input-field" value={withdrawalStrategy} onChange={e => setWithdrawalStrategy(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="constant-dollar">Dólar Constante (Ajustado por Inflación)</option>
              <option value="percent-of-portfolio">Porcentaje del Portafolio</option>
            </select>
          </div>

          {withdrawalStrategy === 'constant-dollar' ? (
            <FinancialInput label="Retiro Anual Inicial" value={withdrawalAmount} onChange={setWithdrawalAmount} prefix="$" step={1000} />
          ) : (
            <FinancialInput label="Porcentaje de Retiro Anual" value={withdrawalPercent} onChange={setWithdrawalPercent} suffix="%" step={0.1} />
          )}

          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>Distribución del Portafolio</h3>
            <FinancialInput label="Acciones (Stocks)" value={stockAlloc} onChange={setStockAlloc} suffix="%" min={0} max={100} />
            <FinancialInput label="Bonos (Bonds)" value={bondAlloc} onChange={setBondAlloc} suffix="%" min={0} max={100} />
            <FinancialInput label="Efectivo (Cash)" value={cashAlloc} onChange={setCashAlloc} suffix="%" min={0} max={100} />
            {allocSum !== 100 && (
              <p style={{ color: 'var(--accent-warning)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                ⚠ La suma de la distribución debe ser 100% (actualmente {allocSum}%)
              </p>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <FireResultsDashboard results={results} />
        </div>
      </div>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona la simulación FIRE?"
      >
        <p>
          **FIRE** son las siglas de *Financial Independence, Retire Early* (Independencia Financiera, Retiro Temprano). 
          Consiste en vivir de tus inversiones sin tener la necesidad de trabajar.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. Backtesting Histórico (El Viaje en el Tiempo)</h3>
        <p>
          Este simulador no predice el futuro ni usa proyecciones fijas. En su lugar, somete tu plan a un **viaje en el tiempo** 
          y calcula cómo te habría ido en cada año de la historia real desde 1926 (ej: si te hubieras jubilado justo antes de la 
          Gran Depresión de 1929 o en el boom de los 90).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Estrategia de Dólar Constante vs Porcentaje</h3>
        <p>
          - **Dólar Constante:** Retirás un monto fijo el primer año (ej: $40,000) y en los años siguientes ajustás esa suma 
          según la inflación para mantener tu poder de compra.
          - **Porcentaje de Cartera:** Retirás un porcentaje fijo (ej: 4%) del valor que tenga tu cartera al inicio de cada año, 
          lo que significa que retirarás más cuando al mercado le vaya bien y menos cuando esté en caída.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Probabilidad de Éxito</h3>
        <p>
          Al final de la simulación, obtendrás un porcentaje de éxito. Si de 100 períodos simulados tu dinero sobrevivió 
          en 95 sin llegar a cero, tu probabilidad de éxito es del 95%. La histórica **regla del 4%** se basa en este cálculo.
        </p>
      </HelpModal>
    </div>
  );
};

export default FireCalculator;
