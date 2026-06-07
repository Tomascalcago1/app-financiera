import React, { useState, useEffect, useMemo } from 'react';
import InflationDashboard from './InflationDashboard';
import { calculateInflation, generateHistoricalChartData } from './InflationEngine';
import HelpModal from '../../components/HelpModal';
import { DollarSign, RotateCcw, HelpCircle } from 'lucide-react';

const InflationCalculator = () => {
  const [amount, setAmount] = useState(() => {
    const saved = localStorage.getItem('valia_inflation_amount');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 100;
  });
  const [fromYear, setFromYear] = useState(() => {
    const saved = localStorage.getItem('valia_inflation_fromYear');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 1913;
  });
  const [toYear, setToYear] = useState(() => {
    const saved = localStorage.getItem('valia_inflation_toYear');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 2025;
  });
  const [customRate, setCustomRate] = useState(() => {
    const saved = localStorage.getItem('valia_inflation_customRate');
    return saved !== null ? (saved === 'null' ? null : Number(saved)) : null;
  }); // null = use CPI
  const [rateInput, setRateInput] = useState(() => {
    const saved = localStorage.getItem('valia_inflation_rateInput');
    return saved !== null ? saved : '';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const blockInvalidChar = (e) => {
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_inflation_amount', amount);
    localStorage.setItem('valia_inflation_fromYear', fromYear);
    localStorage.setItem('valia_inflation_toYear', toYear);
    localStorage.setItem('valia_inflation_customRate', customRate === null ? 'null' : customRate);
    localStorage.setItem('valia_inflation_rateInput', rateInput);
  }, [
    amount,
    fromYear,
    toYear,
    customRate,
    rateInput
  ]);

  // Calculate using CPI to get the "natural" rate
  const cpiResult = useMemo(() => {
    const fYr = Number(fromYear);
    const tYr = Number(toYear);
    if (!fYr || !tYr || fYr === tYr) return null;
    return calculateInflation({ 
      amount: Number(amount) || 0, 
      fromYear: fYr, 
      toYear: tYr, 
      customRate: null 
    });
  }, [amount, fromYear, toYear]);

  // Calculate using custom rate if set
  const displayResult = useMemo(() => {
    const fYr = Number(fromYear);
    const tYr = Number(toYear);
    if (customRate !== null) {
      return calculateInflation({ 
        amount: Number(amount) || 0, 
        fromYear: fYr, 
        toYear: tYr, 
        customRate: customRate / 100 
      });
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
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <DollarSign size={32} style={{ color: 'var(--accent-success)' }} />
          Calculadora de Inflación Histórica
        </h1>
        <p>Comprende cómo cambia el poder adquisitivo de tu dinero a lo largo del tiempo.</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          ¿Cómo funciona?
        </button>
      </header>

      {/* Inputs - Horizontal Layout */}
      <div className="card animate-fade-in no-print" style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Tus Parámetros</h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Moneda: USD (Dólares)</span>
        </div>
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
                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                onKeyDown={blockInvalidChar}
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
              onChange={e => setFromYear(e.target.value === '' ? '' : Number(e.target.value))}
              onKeyDown={blockInvalidChar}
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
              onChange={e => setToYear(e.target.value === '' ? '' : Number(e.target.value))}
              onKeyDown={blockInvalidChar}
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
                onKeyDown={blockInvalidChar}
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
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona la Inflación Histórica?"
      >
        <p>
          La **inflación** es el aumento sostenido y generalizado de los precios. Cuando hay inflación, el dinero pierde 
          su valor porque con la misma cantidad de billetes podés comprar menos cosas (pérdida de poder adquisitivo).
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. ¿Qué es el CPI (Índice de Precios)?</h3>
        <p>
          Para medir la inflación real de forma objetiva, los gobiernos registran el costo de una "canasta básica" de bienes 
          y servicios (alimentos, vivienda, transporte). Este simulador utiliza el **Índice de Precios al Consumidor (CPI)** 
          oficial de EE.UU. desde 1913, complementado con datos históricos desde 1635.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Poder Adquisitivo Equivalente</h3>
        <p>
          Si un producto costaba $10 en 1950, la calculadora te dice exactamente cuántos dólares necesitás hoy para 
          comprar ese mismo producto, reflejando el impacto de la inflación acumulada a lo largo de las décadas.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. Tasa de Inflación Personalizada</h3>
        <p>
          Además de consultar los datos históricos reales, podés ingresar una tasa de inflación anual personalizada (por ejemplo, 3% o 5%) 
          para proyectar cómo se deteriorará el valor de tus ahorros a futuro si se mantuviera ese ritmo de aumento de precios.
        </p>
      </HelpModal>
    </div>
  );
};

export default InflationCalculator;
