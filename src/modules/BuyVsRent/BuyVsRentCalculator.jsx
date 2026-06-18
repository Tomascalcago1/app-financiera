import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import ResultsDashboard from './ResultsDashboard';
import HelpModal from '../../components/HelpModal';
import { simulateBuyVsRent } from './SimulationEngine';
import { Calculator, Settings2, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const BuyVsRentCalculator = () => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

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
    if (saved !== null) return saved === '' ? '' : Number(saved);
    // Dynamic default: 2% in EN, 3% in ES
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const savedLang = localStorage.getItem('valia-lang');
    const isEn = urlLang === 'en' || savedLang === 'en' || (!urlLang && !savedLang && navigator.language?.startsWith('en'));
    return isEn ? 2 : 3;
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
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
            {tLocal('card.title')}
          </h2>
          
          <FinancialInput 
            label={tLocal('input.price')} 
            value={propertyPrice} 
            onChange={setPropertyPrice}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label={tLocal('input.initial')} 
            value={initialCapital} 
            onChange={setInitialCapital}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label={tLocal('input.rent')} 
            value={monthlyRent} 
            onChange={setMonthlyRent}
            prefix="$"
            step={100}
          />
          
          <FinancialInput 
            label={tLocal('input.years')} 
            value={years} 
            onChange={setYears}
            suffix={tLocal('input.years.suffix')}
            min={1}
            max={50}
          />

          <button 
            className="btn btn-outline" 
            style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings2 size={18} />
            {showAdvanced ? tLocal('btn.advanced.hide') : tLocal('btn.advanced.show')}
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
                label={tLocal('input.inflation')} 
                value={inflationRate} 
                onChange={setInflationRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label={tLocal('input.return')} 
                value={investmentReturn} 
                onChange={setInvestmentReturn}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label={tLocal('input.appreciation')} 
                value={propertyAppreciation} 
                onChange={setPropertyAppreciation}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label={tLocal('input.maintenance')} 
                value={maintenanceRate} 
                onChange={setMaintenanceRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label={tLocal('input.mortgage')} 
                value={mortgageRate} 
                onChange={setMortgageRate}
                suffix="%"
                step={0.1}
              />
              <FinancialInput 
                label={tLocal('input.mortgage_years')} 
                value={mortgageYears} 
                onChange={setMortgageYears}
                suffix={tLocal('input.years.suffix')}
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

      {/* Guía SEO y Contexto Financiero */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          {tLocal('guide.title')}
        </h2>
        <p 
          style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}
          dangerouslySetInnerHTML={{ __html: tLocal('guide.desc') }}
        />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.capital.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.capital.desc')}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.hidden.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.hidden.desc')}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.appreciation.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.appreciation.desc')}
            </p>
          </div>
        </div>
      </section>
      
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title={tLocal('help.title')}
      >
        <p dangerouslySetInnerHTML={{ __html: tLocal('help.intro') }} />

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.step1.title')}</h3>
        <p dangerouslySetInnerHTML={{ __html: tLocal('help.step1.desc') }} />

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.step2.title')}</h3>
        <p dangerouslySetInnerHTML={{ __html: tLocal('help.step2.desc') }} />
        <p dangerouslySetInnerHTML={{ __html: tLocal('help.step2.math') }} />

        <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginTop: '0.5rem' }}>
          <p 
            style={{ margin: 0, fontSize: '0.85rem' }}
            dangerouslySetInnerHTML={{ __html: tLocal('help.conclusion') }}
          />
        </div>
      </HelpModal>
    </div>
  );
};

export default BuyVsRentCalculator;
