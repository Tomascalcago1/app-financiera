import React, { useState, useMemo } from 'react';
import InflationDashboard from './InflationDashboard';
import { calculateInflation, generateHistoricalChartData } from './InflationEngine';
import { DollarSign, RotateCcw } from 'lucide-react';

const InflationCalculator = () => {
  const [amount, setAmount] = useState(100);
  const [fromYear, setFromYear] = useState(1913);
  const [toYear, setToYear] = useState(2025);
  const [customRate, setCustomRate] = useState(null); // null = use CPI
  const [rateInput, setRateInput] = useState('');

  // Calculate using CPI to get the "natural" rate
  const cpiResult = useMemo(() => {
    if (!fromYear || !toYear || fromYear === toYear) return null;
    return calculateInflation({ amount, fromYear, toYear, customRate: null });
  }, [amount, fromYear, toYear]);

  // Calculate using custom rate if set
  const displayResult = useMemo(() => {
    if (customRate !== null) {
      return calculateInflation({ amount, fromYear, toYear, customRate: customRate / 100 });
    }
    return cpiResult;
  }, [amount, fromYear, toYear, customRate, cpiResult]);

  // Sync rate input with CPI rate when not in custom mode
  const displayedRate = customRate !== null ? customRate : (cpiResult?.averageAnnualRate || 0);

  // Historical chart data ($100 from 1635)
  const historicalChart = useMemo(() => generateHistoricalChartData(1635, 100), []);

  const handleRateChange = (val) => {
    const num = parseFloat(val);
    setRateInput(val);
    if (!isNaN(num)) {
      setCustomRate(num);
    }
  };

  const resetRate = () => {
    setCustomRate(null);
    setRateInput('');
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <DollarSign size={32} style={{ color: 'var(--accent-success)' }} />
          Calculadora de Inflación Histórica
        </h1>
        <p>Comprende cómo cambia el poder adquisitivo de tu dinero a lo largo del tiempo.</p>
      </header>

      {/* Inputs - Horizontal Layout */}
      <div className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Monto</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ position: 'absolute', left: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }}>$</span>
              <input
                type="number"
                className="input-field"
                style={{ paddingLeft: '2rem' }}
                value={amount}
                onChange={e => setAmount(Number(e.target.value) || 0)}
                step={100}
              />
            </div>
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Desde el Año</label>
            <input
              type="number"
              className="input-field"
              value={fromYear}
              onChange={e => setFromYear(Number(e.target.value))}
              min={1635}
              max={2025}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label">Hasta el Año</label>
            <input
              type="number"
              className="input-field"
              value={toYear}
              onChange={e => setToYear(Number(e.target.value))}
              min={1635}
              max={2025}
            />
          </div>

          <div className="input-group" style={{ marginBottom: 0 }}>
            <label className="input-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Tasa de Inflación Anual</span>
              {customRate !== null && (
                <button
                  onClick={resetRate}
                  style={{
                    background: 'none', border: 'none', color: 'var(--accent-primary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem'
                  }}
                >
                  <RotateCcw size={12} /> Reset
                </button>
              )}
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type="number"
                className="input-field"
                style={{
                  paddingRight: '2rem',
                  borderColor: customRate !== null ? 'var(--accent-warning)' : undefined
                }}
                value={customRate !== null ? rateInput : displayedRate.toFixed(2)}
                onChange={e => handleRateChange(e.target.value)}
                step={0.1}
              />
              <span style={{ position: 'absolute', right: '1rem', color: 'var(--text-secondary)', pointerEvents: 'none' }}>%</span>
            </div>
            {customRate !== null && (
              <p style={{ fontSize: '0.7rem', color: 'var(--accent-warning)', marginTop: '0.25rem' }}>
                Usando tasa personalizada
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <InflationDashboard
        result={displayResult}
        chartData={historicalChart}
        amount={amount}
        fromYear={fromYear}
        toYear={toYear}
        annualRate={displayedRate}
      />
    </div>
  );
};

export default InflationCalculator;
