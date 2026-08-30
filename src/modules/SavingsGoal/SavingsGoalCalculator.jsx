import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import SavingsGoalDashboard from './SavingsGoalDashboard';
import { simulateSavingsGoal } from './SavingsGoalEngine';
import HelpModal from '../../components/HelpModal';
import { Target, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const SavingsGoalCalculator = () => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

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
          {tLocal('header.title')}
        </h1>
        <p>{tLocal('header.subtitle')}</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          {tLocal('header.how_works')}
        </button>
      </header>
 
      <div className="grid" style={{ 
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', 
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Input Panel */}
        <div className="taste-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {tLocal('card.title')}
          </h2>

          {/* Quick Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {language === 'en' ? 'Quick Goals:' : 'Metas Típicas:'}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setGoalAmount('10000');
                  setInitialInvestment('1000');
                  setYears('3');
                  setInterestRate('7');
                }}
              >
                🛡️ $10k (3a)
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setGoalAmount('25000');
                  setInitialInvestment('3000');
                  setYears('5');
                  setInterestRate('8');
                }}
              >
                🚗 $25k (5a)
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setGoalAmount('60000');
                  setInitialInvestment('5000');
                  setYears('10');
                  setInterestRate('9');
                }}
              >
                🏠 $60k (10a)
              </button>
            </div>
          </div>
          
          <FinancialInput 
            label={tLocal('input.goal')} 
            value={goalAmount} 
            onChange={setGoalAmount}
            prefix="$"
            step={10000}
          />
          
          <FinancialInput 
            label={tLocal('input.initial')} 
            value={initialInvestment} 
            onChange={setInitialInvestment}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label={tLocal('input.years')} 
            value={years} 
            onChange={setYears}
            suffix={tLocal('input.years.suffix')}
            min={1}
            max={50}
          />

          <FinancialInput 
            label={tLocal('input.rate')} 
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
          {tLocal('guide.title')}
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          {tLocal('guide.desc')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.rule.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.rule.desc')}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.compound.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.compound.desc')}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.smart.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.smart.desc')}
            </p>
          </div>
        </div>
      </section>

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title={tLocal('help.title')}
      >
        <p>
          {tLocal('help.intro')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.step1.title')}</h3>
        <p>
          {tLocal('help.step1.desc')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.step2.title')}</h3>
        <p>
          {tLocal('help.step2.desc')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.step3.title')}</h3>
        <p>
          {tLocal('help.step3.desc')}
        </p>
      </HelpModal>
    </div>
  );
};

export default SavingsGoalCalculator;
