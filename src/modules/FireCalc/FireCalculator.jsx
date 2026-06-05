import React, { useState, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import FireResultsDashboard from './FireResultsDashboard';
import { runFireSimulation } from './FireSimulationEngine';
import { Flame, Settings2 } from 'lucide-react';

const FireCalculator = () => {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [retirementLength, setRetirementLength] = useState('');
  const [withdrawalStrategy, setWithdrawalStrategy] = useState('constant-dollar');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalPercent, setWithdrawalPercent] = useState('');
  const [stockAlloc, setStockAlloc] = useState(80);
  const [bondAlloc, setBondAlloc] = useState(20);
  const [cashAlloc, setCashAlloc] = useState(0);

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
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={32} style={{ color: '#F59E0B' }} />
          Simulador FIRE
        </h1>
        <p>Backtesting de retiro con datos históricos del mercado desde 1926.</p>
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
    </div>
  );
};

export default FireCalculator;
