import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import CompoundResultsDashboard from './CompoundResultsDashboard';
import { simulateCompoundInterest } from './CompoundSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { TrendingUp, Settings2, HelpCircle, BookOpen, Sparkles } from 'lucide-react';
import FAQSection from '../../components/FAQSection';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const CompoundInterestCalculator = () => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  const navigateToArticle = (articleId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('seccion', 'educacion');
    url.searchParams.set('articulo', articleId);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'educacion' }));
  };

  const queryParams = new URLSearchParams(window.location.search);
  const getNumericParam = (key, fallback) => {
    const val = queryParams.get(key);
    return val !== null && !isNaN(val) ? Number(val) : fallback;
  };
  const getBoolParam = (key, fallback) => {
    const val = queryParams.get(key);
    if (val === 'true') return true;
    if (val === 'false') return false;
    return fallback;
  };

  // Main Variables
  const [initialInvestment, setInitialInvestment] = useState(() => {
    const q = queryParams.get('init');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_initialInvestment');
    return saved !== null ? saved : '1000';
  });
  const [monthlyContribution, setMonthlyContribution] = useState(() => {
    const q = queryParams.get('contrib');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_monthlyContribution');
    return saved !== null ? saved : '200';
  });
  const [years, setYears] = useState(() => {
    const q = queryParams.get('yrs');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_years');
    return saved !== null ? saved : '15';
  });
  const [interestRate, setInterestRate] = useState(() => {
    const q = queryParams.get('rate');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_compound_interestRate');
    return saved !== null ? saved : '8';
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  
  // Advanced Variables
  const [showAdvanced, setShowAdvanced] = useState(() => getBoolParam('showAdv', false));
  const [varianceRange, setVarianceRange] = useState(() => {
    const q = queryParams.get('varRange');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_compound_varianceRange');
    return saved !== null ? (saved === '' ? '' : Number(saved)) : 2;
  });
  const [compoundFrequency, setCompoundFrequency] = useState(() => {
    const q = queryParams.get('freq');
    if (q !== null && !isNaN(q)) return Number(q);
    const saved = localStorage.getItem('valia_compound_compoundFrequency');
    return saved !== null ? Number(saved) : 12;
  });
  const [enableVariance, setEnableVariance] = useState(() => {
    const q = queryParams.get('var');
    if (q === 'true') return true;
    if (q === 'false') return false;
    const saved = localStorage.getItem('valia_compound_enableVariance');
    return saved !== null ? saved === 'true' : false;
  });

  const applyPreset = (init, monthly, yrs, rate) => {
    setInitialInvestment(String(init));
    setMonthlyContribution(String(monthly));
    setYears(String(yrs));
    setInterestRate(String(rate));
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('tool', 'compound-interest');
    if (initialInvestment) params.set('init', initialInvestment);
    if (monthlyContribution) params.set('contrib', monthlyContribution);
    if (years) params.set('yrs', years);
    if (interestRate) params.set('rate', interestRate);
    if (enableVariance) {
      params.set('var', 'true');
      params.set('varRange', varianceRange);
    }
    if (compoundFrequency !== 12) params.set('freq', compoundFrequency);
    if (showAdvanced) params.set('showAdv', 'true');

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  // Save states to localStorage
  useEffect(() => {
    localStorage.setItem('valia_compound_initialInvestment', initialInvestment);
    localStorage.setItem('valia_compound_monthlyContribution', monthlyContribution);
    localStorage.setItem('valia_compound_years', years);
    localStorage.setItem('valia_compound_interestRate', interestRate);
    localStorage.setItem('valia_compound_varianceRange', varianceRange);
    localStorage.setItem('valia_compound_compoundFrequency', compoundFrequency);
    localStorage.setItem('valia_compound_enableVariance', enableVariance);
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

  // Generate simulation data when inputs change
  const simulationData = useMemo(() => {
    if (initialInvestment === '' || years === '' || interestRate === '') return [];

    return simulateCompoundInterest({
      initialInvestment: Number(initialInvestment) || 0,
      monthlyContribution: Number(monthlyContribution) || 0,
      years: Number(years) || 0,
      interestRate: (Number(interestRate) || 0) / 100,
      varianceRange: enableVariance ? (Number(varianceRange) || 0) / 100 : 0,
      compoundFrequency: compoundFrequency
    });
  }, [
    initialInvestment,
    monthlyContribution,
    years,
    interestRate,
    varianceRange,
    compoundFrequency,
    enableVariance
  ]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
          <TrendingUp className="text-accent-primary" size={32} />
          {tLocal('header.title')}
        </h1>
        <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1rem', lineHeight: 1.6 }}>{tLocal('header.subtitle')}</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn transition-spring"
          style={{ marginTop: '0.75rem' }}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {tLocal('card.title')}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 600 }}>
              <Sparkles size={14} />
              <span>100% Local</span>
            </div>
          </div>

          {/* Preset Strategy Chips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tLocal('preset.title')}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button"
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => applyPreset(1000, 150, 10, 7)}
              >
                {tLocal('preset.starter')}
              </button>
              <button 
                type="button"
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => applyPreset(5000, 300, 20, 10)}
              >
                {tLocal('preset.etf')}
              </button>
              <button 
                type="button"
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => applyPreset(10000, 750, 25, 8)}
              >
                {tLocal('preset.fire')}
              </button>
              <button 
                type="button"
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => applyPreset(5000, 200, 15, 5)}
              >
                {tLocal('preset.bonds')}
              </button>
            </div>
          </div>
          
          <FinancialInput 
            label={tLocal('input.initial')} 
            value={initialInvestment} 
            onChange={setInitialInvestment}
            prefix="$"
            step={1000}
          />
          
          <FinancialInput 
            label={tLocal('input.monthly')} 
            value={monthlyContribution} 
            onChange={setMonthlyContribution}
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

          <FinancialInput 
            label={tLocal('input.rate')} 
            value={interestRate} 
            onChange={setInterestRate}
            suffix="%"
            step={0.1}
          />

          <button 
            className="btn btn-outline transition-spring" 
            style={{ marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings2 size={18} />
            {showAdvanced ? tLocal('btn.advanced.hide') : tLocal('btn.advanced.show')}
          </button>

          {showAdvanced && (
            <div className="animate-fade-in" style={{ 
              marginTop: '0.5rem', 
              paddingTop: '1rem', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                  {tLocal('advanced.variance.label')}
                </label>
                <input 
                  type="checkbox" 
                  checked={enableVariance}
                  onChange={(e) => setEnableVariance(e.target.checked)}
                  style={{ cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
                />
              </div>

              {enableVariance && (
                <FinancialInput 
                  label={tLocal('advanced.variance.input')} 
                  value={varianceRange} 
                  onChange={setVarianceRange}
                  suffix="%"
                  step={0.1}
                />
              )}

              <div className="input-group">
                <label className="input-label">{tLocal('advanced.freq.label')}</label>
                <select 
                  className="input-field" 
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(Number(e.target.value))}
                  style={{ appearance: 'auto' }}
                >
                  <option value={1}>{tLocal('advanced.freq.annual')}</option>
                  <option value={2}>{tLocal('advanced.freq.semiannual')}</option>
                  <option value={12}>{tLocal('advanced.freq.monthly')}</option>
                  <option value={365}>{tLocal('advanced.freq.daily')}</option>
                </select>
              </div>

            </div>
          )}

          <div 
            onClick={() => navigateToArticle('interes-compuesto-retiro-temprano')}
            className="taste-card no-print transition-spring"
            style={{ 
              marginTop: '1rem', 
              cursor: 'pointer',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--border-radius-md)'
            }}
          >
            <BookOpen size={20} className="text-accent-primary" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.15rem', fontSize: '0.725rem', fontWeight: 600, textTransform: 'uppercase' }}>{tLocal('guide.tag')}</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{tLocal('guide.title')}</span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CompoundResultsDashboard 
            data={simulationData} 
            varianceEnabled={enableVariance} 
            onShare={handleShare}
            inputs={{
              initialInvestment,
              monthlyContribution,
              years,
              interestRate,
              varianceRange: enableVariance ? varianceRange : 0,
              compoundFrequency
            }}
          />
        </div>

      </div>

      {/* Guía SEO y Contexto Financiero */}
      <section className="taste-card animate-fade-in" style={{ marginTop: '3.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '2rem', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {tLocal('seo.title')}
        </h2>
        <p style={{ fontSize: '0.925rem', lineHeight: '1.65', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          {tLocal('seo.desc')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div className="taste-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{tLocal('seo.freq.title')}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.55', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('seo.freq.desc')}
            </p>
          </div>
          <div className="taste-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{tLocal('seo.time.title')}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.55', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('seo.time.desc')}
            </p>
          </div>
          <div className="taste-card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1.05rem', color: 'var(--accent-primary)', marginBottom: '0.5rem', fontWeight: 600 }}>{tLocal('seo.contrib.title')}</h3>
            <p style={{ fontSize: '0.875rem', lineHeight: '1.55', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('seo.contrib.desc')}
            </p>
          </div>
        </div>
      </section>

      <FAQSection 
        faqs={[
          {
            question: tLocal('faq.q1'),
            answer: tLocal('faq.a1')
          },
          {
            question: tLocal('faq.q2'),
            answer: tLocal('faq.a2')
          },
          {
            question: tLocal('faq.q3'),
            answer: tLocal('faq.a3')
          },
          {
            question: tLocal('faq.q4'),
            answer: tLocal('faq.a4')
          }
        ]}
      />

      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title={tLocal('help.title')}
      >
        <p>
          {tLocal('help.p1')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h1')}</h3>
        <p>
          {tLocal('help.p2')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h2')}</h3>
        <p>
          {tLocal('help.p3')}
        </p>

        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h3')}</h3>
        <p>
          {tLocal('help.p4')}
        </p>
      </HelpModal>
    </div>
  );
};

export default CompoundInterestCalculator;
