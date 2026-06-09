import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import SavingsGoalDashboard from './SavingsGoalDashboard';
import { simulateSavingsGoal } from './SavingsGoalEngine';
import HelpModal from '../../components/HelpModal';
import { Target, HelpCircle } from 'lucide-react';

const SavingsGoalCalculator = () => {
  // Main Variables (Empty by default like the previous one)
  const [goalAmount, setGoalAmount] = useState(() => {
    const saved = localStorage.getItem('valia_savings_goalAmount');
    return saved !== null ? saved : '';
  });
  const [initialInvestment, setInitialInvestment] = useState(() => {
    const saved = localStorage.getItem('valia_savings_initialInvestment');
    return saved !== null ? saved : '';
  });
  const [years, setYears] = useState(() => {
    const saved = localStorage.getItem('valia_savings_years');
    return saved !== null ? saved : '';
  });
  const [interestRate, setInterestRate] = useState(() => {
    const saved = localStorage.getItem('valia_savings_interestRate');
    return saved !== null ? saved : '';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_savings_goalAmount', goalAmount);
    localStorage.setItem('valia_savings_initialInvestment', initialInvestment);
    localStorage.setItem('valia_savings_years', years);
    localStorage.setItem('valia_savings_interestRate', interestRate);
  }, [
    goalAmount,
    initialInvestment,
    years,
    interestRate
  ]);
  
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
    <div className="container" style={{ padding: '2rem 0' }}>
      
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Target className="text-accent-primary" size={32} />
          Calculadora de Objetivo de Ahorro
        </h1>
        <p>Averigua exactamente cuánto debes aportar cada mes para alcanzar tu meta.</p>
        
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
            inputs={{
              goalAmount,
              initialInvestment,
              years,
              interestRate
            }}
          />
        </div>

      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía de Planificación: ¿Cómo calcular y alcanzar tu Objetivo de Ahorro?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Alcanzar una meta financiera (comprar un vehículo, realizar un viaje o acumular un fondo de emergencia) requiere disciplina y una estrategia clara de ahorro e inversión periódica. Esta calculadora determina el esfuerzo mensual exacto que debés hacer de acuerdo a tus metas y la tasa de interés obtenida.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>La Regla de Ahorro Sistemático</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Separar una porción fija de tus ingresos al comienzo del mes (estrategia de "pagarte a vos primero") en lugar de ahorrar lo que sobra al final es el método más efectivo para acumular capital a mediano plazo. Automatizar este ahorro mensual reduce la fricción y asegura la consistencia de tu plan.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>El Apalancamiento del Interés Compuesto</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Al invertir tus aportes mensuales en activos financieros (como fondos comunes, bonos o acciones), tus ahorros generan intereses que a su vez se reinvierten para generar más intereses. En plazos largos, esta acumulación exponencial hace que una gran parte de tu meta se financie con ganancias del mercado y no de tu bolsillo.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Definición de Metas SMART</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Una meta efectiva debe ser específica, medible, alcanzable, relevante y con un límite de tiempo definido (SMART). Estimar un horizonte temporal real (ej. 3 o 5 años) te permite elegir instrumentos de inversión adecuados para ese plazo, minimizando los riesgos de volatilidad del mercado.
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title="¿Cómo funciona el Objetivo de Ahorro?"
      >
        <p>
          Esta calculadora te ayuda a descifrar **cuánto dinero debés separar de tu bolsillo mes a mes** para comprar 
          un auto, irte de viaje o acumular una suma específica en un plazo determinado.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>1. La Meta e Inversión Inicial</h3>
        <p>
          Partís de tu **Objetivo de Ahorro** y le restás tu **Capital Inicial** (lo que ya tenés ahorrado hoy).
          El capital inicial que ya poseés trabaja desde el día uno generando intereses para achicar la brecha.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>2. Intereses a tu Favor</h3>
        <p>
          Gracias al interés compuesto, no necesitás depositar el 100% de la meta de tu propio bolsillo. 
          Una gran parte de la meta se pagará sola a través del rendimiento acumulado de tus ahorros mensuales invertidos.
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>3. El Resultado Mensual</h3>
        <p>
          El sistema utiliza fórmulas financieras estándar para calcular el aporte mensual exacto necesario para que, 
          sumado a tus intereses acumulados y tu capital inicial, alcances tu meta en la fecha exacta.
        </p>
      </HelpModal>
    </div>
  );
};

export default SavingsGoalCalculator;
