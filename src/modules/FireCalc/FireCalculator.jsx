import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import FireResultsDashboard from './FireResultsDashboard';
import { runFireSimulation } from './FireSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { Flame, Settings2, HelpCircle, Share2 } from 'lucide-react';

const FireCalculator = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getStringParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null ? val : fallback;
  };

  const [portfolioValue, setPortfolioValue] = useState(() => {
    const q = queryParams.get('port');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_portfolioValue');
    return saved !== null && saved !== 'undefined' ? saved : '';
  });
  const [retirementLength, setRetirementLength] = useState(() => {
    const q = queryParams.get('len');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_retirementLength');
    return saved !== null && saved !== 'undefined' ? saved : '';
  });
  const [withdrawalStrategy, setWithdrawalStrategy] = useState(() => {
    const q = queryParams.get('strat');
    if (q !== null) return q;
    const saved = localStorage.getItem('valia_fire_withdrawalStrategy');
    return saved !== null && saved !== 'undefined' ? saved : 'constant-dollar';
  });
  const [withdrawalAmount, setWithdrawalAmount] = useState(() => {
    const q = queryParams.get('amt');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_withdrawalAmount');
    return saved !== null && saved !== 'undefined' ? saved : '';
  });
  const [withdrawalPercent, setWithdrawalPercent] = useState(() => {
    const q = queryParams.get('pct');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_withdrawalPercent');
    return saved !== null && saved !== 'undefined' ? saved : '';
  });
  const [stockAlloc, setStockAlloc] = useState(() => {
    const q = queryParams.get('stock');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_fire_stockAlloc');
    return saved !== null && saved !== 'undefined' && saved !== '' ? Number(saved) : 80;
  });
  const [bondAlloc, setBondAlloc] = useState(() => {
    const q = queryParams.get('bond');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_fire_bondAlloc');
    return saved !== null && saved !== 'undefined' && saved !== '' ? Number(saved) : 20;
  });
  const [cashAlloc, setCashAlloc] = useState(() => {
    const q = queryParams.get('cash');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_fire_cashAlloc');
    return saved !== null && saved !== 'undefined' && saved !== '' ? Number(saved) : 0;
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('herramienta', 'simulador-de-retiro');
    if (portfolioValue) params.set('port', portfolioValue);
    if (retirementLength) params.set('len', retirementLength);
    if (withdrawalStrategy) params.set('strat', withdrawalStrategy);
    if (withdrawalAmount) params.set('amt', withdrawalAmount);
    if (withdrawalPercent) params.set('pct', withdrawalPercent);
    params.set('stock', stockAlloc);
    params.set('bond', bondAlloc);
    params.set('cash', cashAlloc);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

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
    if (portfolioValue === '' || retirementLength === '') return null;
    if (withdrawalStrategy === 'constant-dollar' && withdrawalAmount === '') return null;
    if (withdrawalStrategy === 'percent-of-portfolio' && withdrawalPercent === '') return null;
    if (allocSum !== 100) return null;

    return runFireSimulation({
      portfolioValue: Number(portfolioValue) || 0,
      retirementLength: Number(retirementLength) || 0,
      withdrawalStrategy,
      withdrawalAmount: Number(withdrawalAmount) || 0,
      withdrawalPercent: (Number(withdrawalPercent) || 0) / 100,
      stockAllocation: (Number(stockAlloc) || 0) / 100,
      bondAllocation: (Number(bondAlloc) || 0) / 100,
      cashAllocation: (Number(cashAlloc) || 0) / 100,
    });
  }, [portfolioValue, retirementLength, withdrawalStrategy, withdrawalAmount, withdrawalPercent, stockAlloc, bondAlloc, cashAlloc, allocSum]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={32} style={{ color: '#F59E0B' }} />
          Simulador de Retiro
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

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
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
          <FireResultsDashboard 
            results={results} 
            onShare={handleShare}
            inputs={{
              portfolioValue,
              retirementLength,
              withdrawalStrategy,
              withdrawalAmount,
              withdrawalPercent,
              stockAlloc,
              bondAlloc,
              cashAlloc
            }}
          />
        </div>
      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Retiro Temprano y la Regla del 4%
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          El concepto de Retiro Temprano (Independencia Financiera) promueve el ahorro planificado y la inversión inteligente para lograr la libertad de dejar el trabajo tradicional mucho antes de la edad de jubilación obligatoria. Para determinar la viabilidad de un plan de retiro temprano, este simulador somete tu estrategia a más de 90 años de historia financiera real.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>El Estudio Trinity y la Regla del 4%</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              La regla del 4% establece que un jubilado puede retirar el 4% de su portafolio inicial de inversiones durante el primer año y luego ajustar dicho monto por inflación anualmente, con una probabilidad de éxito superior al 95% de no agotar su capital en un período de 30 años, basándose en la rentabilidad histórica de una cartera mixta de acciones y bonos.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Riesgo de Secuencia de Retornos</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El mayor peligro al que se enfrenta un jubilado temprano es el orden de los rendimientos del mercado en los primeros años de su retiro. Si el mercado sufre una fuerte caída justo al jubilarse, el efecto conjunto del retiro de capital y la desvalorización de activos puede vaciar la cartera prematuramente. Un porcentaje mayor en bonos o efectivo ayuda a mitigar este riesgo.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Estrategias de Retiro Dinámicas</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              A diferencia del dólar constante ajustado por inflación, retirar un porcentaje variable de tu cartera cada año te permite recortar gastos en épocas de crisis de mercado y gastar más cuando el portafolio crece. Esto reduce a la larga la probabilidad de agotar el capital, aunque requiere flexibilidad y adaptación en tu nivel de consumo.
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona la simulación de retiro?"
      >
        <p>
          La planificación del **Retiro Temprano** (Independencia Financiera) consiste en vivir de tus inversiones sin tener la necesidad de trabajar de forma tradicional.
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
