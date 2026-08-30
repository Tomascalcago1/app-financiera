import React, { useState, useEffect, useMemo } from 'react';
import FinancialInput from '../../components/FinancialInput';
import FireResultsDashboard from './FireResultsDashboard';
import { runFireSimulation } from './FireSimulationEngine';
import HelpModal from '../../components/HelpModal';
import { Flame, Settings2, HelpCircle, Share2, Trash2, Plus, X } from 'lucide-react';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const FireCalculator = () => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

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
    if (q !== null && !isNaN(q)) {
      const num = Number(q);
      return num > 80 ? '80' : num < 1 ? '1' : q;
    }
    const saved = localStorage.getItem('valia_fire_retirementLength');
    if (saved !== null && saved !== 'undefined' && saved !== '') {
      const num = Number(saved);
      if (!isNaN(num)) {
        return num > 80 ? '80' : num < 1 ? '1' : saved;
      }
    }
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
  const [minWithdrawal, setMinWithdrawal] = useState(() => {
    const q = queryParams.get('minAmt');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_minWithdrawal');
    return saved !== null && saved !== 'undefined' ? saved : '';
  });
  const [maxWithdrawal, setMaxWithdrawal] = useState(() => {
    const q = queryParams.get('maxAmt');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_fire_maxWithdrawal');
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

  const [extraFlows, setExtraFlows] = useState(() => {
    const q = queryParams.get('extra');
    if (q) {
      try {
        const parsed = JSON.parse(q);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing extraFlows from query params', e);
      }
    }
    const saved = localStorage.getItem('valia_fire_extraFlows');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Error parsing extraFlows from localStorage', e);
      }
    }
    return [];
  });

  const handleAddExtraFlow = () => {
    const newFlow = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      type: 'income',
      amount: '',
      recurring: false,
      startYear: '1',
      endYear: '10',
      adjustForInflation: true,
    };
    setExtraFlows([...extraFlows, newFlow]);
  };

  const handleRemoveExtraFlow = (id) => {
    setExtraFlows(extraFlows.filter(f => f.id !== id));
  };

  const handleUpdateExtraFlow = (id, field, value) => {
    setExtraFlows(extraFlows.map(f => {
      if (f.id === id) {
        return { ...f, [field]: value };
      }
      return f;
    }));
  };

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('lang', language);
    if (language === 'en') {
      params.set('tool', 'retirement-simulator');
    } else {
      params.set('herramienta', 'simulador-de-retiro');
    }
    if (portfolioValue) params.set('port', portfolioValue);
    if (retirementLength) params.set('len', retirementLength);
    if (withdrawalStrategy) params.set('strat', withdrawalStrategy);
    if (withdrawalAmount) params.set('amt', withdrawalAmount);
    if (withdrawalPercent) params.set('pct', withdrawalPercent);
    if (minWithdrawal) params.set('minAmt', minWithdrawal);
    if (maxWithdrawal) params.set('maxAmt', maxWithdrawal);
    params.set('stock', stockAlloc);
    params.set('bond', bondAlloc);
    params.set('cash', cashAlloc);
    if (extraFlows && extraFlows.length > 0) {
      params.set('extra', JSON.stringify(extraFlows));
    }

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
    localStorage.setItem('valia_fire_minWithdrawal', minWithdrawal);
    localStorage.setItem('valia_fire_maxWithdrawal', maxWithdrawal);
    localStorage.setItem('valia_fire_stockAlloc', stockAlloc);
    localStorage.setItem('valia_fire_bondAlloc', bondAlloc);
    localStorage.setItem('valia_fire_cashAlloc', cashAlloc);
    localStorage.setItem('valia_fire_extraFlows', JSON.stringify(extraFlows));
  }, [
    portfolioValue,
    retirementLength,
    withdrawalStrategy,
    withdrawalAmount,
    withdrawalPercent,
    minWithdrawal,
    maxWithdrawal,
    stockAlloc,
    bondAlloc,
    cashAlloc,
    extraFlows
  ]);

  const allocSum = Number(stockAlloc || 0) + Number(bondAlloc || 0) + Number(cashAlloc || 0);

  const results = useMemo(() => {
    if (portfolioValue === '' || retirementLength === '') return null;
    if (withdrawalStrategy === 'constant-dollar' && withdrawalAmount === '') return null;
    if (withdrawalStrategy === 'percent-of-portfolio' && withdrawalPercent === '') return null;
    if (allocSum !== 100) return null;

    let length = Number(retirementLength) || 0;
    if (length > 80) length = 80;
    if (length < 1) length = 1;

    return runFireSimulation({
      portfolioValue: Number(portfolioValue) || 0,
      retirementLength: length,
      withdrawalStrategy,
      withdrawalAmount: Number(withdrawalAmount) || 0,
      withdrawalPercent: (Number(withdrawalPercent) || 0) / 100,
      minWithdrawal: Number(minWithdrawal) || 0,
      maxWithdrawal: Number(maxWithdrawal) || 0,
      stockAllocation: (Number(stockAlloc) || 0) / 100,
      bondAllocation: (Number(bondAlloc) || 0) / 100,
      cashAllocation: (Number(cashAlloc) || 0) / 100,
      extraFlows,
    });
  }, [portfolioValue, retirementLength, withdrawalStrategy, withdrawalAmount, withdrawalPercent, minWithdrawal, maxWithdrawal, stockAlloc, bondAlloc, cashAlloc, allocSum, extraFlows]);

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={32} style={{ color: '#F59E0B' }} />
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

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="taste-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', padding: '1.75rem' }}>
          <h2 style={{ fontSize: '1.2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            {tLocal('card.title')}
          </h2>

          {/* Quick Presets */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {tLocal('preset.title')}
            </span>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setPortfolioValue('500000');
                  setRetirementLength('30');
                  setWithdrawalStrategy('constant-dollar');
                  setWithdrawalAmount('20000');
                  setStockAlloc(80);
                  setBondAlloc(20);
                  setCashAlloc(0);
                }}
              >
                {tLocal('preset.classic')}
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setPortfolioValue('250000');
                  setRetirementLength('35');
                  setWithdrawalStrategy('constant-dollar');
                  setWithdrawalAmount('10000');
                  setStockAlloc(90);
                  setBondAlloc(10);
                  setCashAlloc(0);
                }}
              >
                {tLocal('preset.lean')}
              </button>
              <button 
                type="button" 
                className="btn btn-outline transition-spring"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: '999px' }}
                onClick={() => {
                  setPortfolioValue('1200000');
                  setRetirementLength('30');
                  setWithdrawalStrategy('constant-dollar');
                  setWithdrawalAmount('42000');
                  setStockAlloc(75);
                  setBondAlloc(25);
                  setCashAlloc(0);
                }}
              >
                {tLocal('preset.fat')}
              </button>
            </div>
          </div>

          <FinancialInput label={tLocal('input.portfolio')} value={portfolioValue} onChange={setPortfolioValue} prefix="$" step={10000} />
          <FinancialInput label={tLocal('input.length')} value={retirementLength} onChange={setRetirementLength} suffix={tLocal('input.length.suffix')} min={1} max={80} />

          <div className="input-group">
            <label className="input-label">{tLocal('input.strategy')}</label>
            <select className="input-field" value={withdrawalStrategy} onChange={e => setWithdrawalStrategy(e.target.value)} style={{ appearance: 'auto' }}>
              <option value="constant-dollar">{tLocal('input.strategy.constant')}</option>
              <option value="percent-of-portfolio">{tLocal('input.strategy.percent')}</option>
            </select>
          </div>

          {withdrawalStrategy === 'constant-dollar' ? (
            <FinancialInput label={tLocal('input.amount')} value={withdrawalAmount} onChange={setWithdrawalAmount} prefix="$" step={1000} />
          ) : (
            <>
              <FinancialInput label={tLocal('input.percent')} value={withdrawalPercent} onChange={setWithdrawalPercent} suffix="%" step={0.1} />
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <FinancialInput label={tLocal('input.min')} value={minWithdrawal} onChange={setMinWithdrawal} prefix="$" step={1000} />
                </div>
                <div style={{ flex: 1 }}>
                  <FinancialInput label={tLocal('input.max')} value={maxWithdrawal} onChange={setMaxWithdrawal} prefix="$" step={1000} />
                </div>
              </div>
            </>
          )}

          {/* Flujos Extraordinarios */}
          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-secondary)' }}>{tLocal('flows.title')}</h3>
              <button
                type="button"
                onClick={handleAddExtraFlow}
                className="btn btn-outline"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
              >
                <Plus size={12} />
                {tLocal('flows.add')}
              </button>
            </div>

            {extraFlows.length === 0 ? (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', margin: '0.5rem 0' }}>
                {tLocal('flows.empty')}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {extraFlows.map((flow) => (
                  <div 
                    key={flow.id} 
                    className="card animate-fade-in" 
                    style={{ 
                      padding: '0.75rem', 
                      background: 'var(--bg-tertiary)', 
                      border: '1px solid var(--border-color)', 
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraFlow(flow.id)}
                      style={{ 
                        position: 'absolute', 
                        top: '0.5rem', 
                        right: '0.5rem', 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-tertiary)', 
                        cursor: 'pointer', 
                        padding: '0.25rem' 
                      }}
                      title={tLocal('flows.delete')}
                    >
                      <X size={14} />
                    </button>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <input
                        type="text"
                        className="input-field"
                        placeholder={tLocal('flows.placeholder.name')}
                        value={flow.name}
                        onChange={e => handleUpdateExtraFlow(flow.id, 'name', e.target.value)}
                        style={{ flex: 2, padding: '0.375rem', fontSize: '0.85rem' }}
                      />
                      <select
                        className="input-field"
                        value={flow.type}
                        onChange={e => handleUpdateExtraFlow(flow.id, 'type', e.target.value)}
                        style={{ flex: 1, padding: '0.375rem', fontSize: '0.85rem', appearance: 'auto' }}
                      >
                        <option value="income">{tLocal('flows.type.income')}</option>
                        <option value="expense">{tLocal('flows.type.expense')}</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ flex: 1, position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: 'var(--text-tertiary)' }}>$</span>
                        <input
                          type="number"
                          className="input-field"
                          placeholder={tLocal('flows.placeholder.amount')}
                          value={flow.amount}
                          onChange={e => handleUpdateExtraFlow(flow.id, 'amount', e.target.value)}
                          style={{ paddingLeft: '1.25rem', paddingRight: '0.25rem', paddingY: '0.375rem', width: '100%', fontSize: '0.85rem' }}
                        />
                      </div>
                      
                      <select
                        className="input-field"
                        value={flow.recurring ? 'recurring' : 'single'}
                        onChange={e => handleUpdateExtraFlow(flow.id, 'recurring', e.target.value === 'recurring')}
                        style={{ flex: 1, padding: '0.375rem', fontSize: '0.85rem', appearance: 'auto' }}
                      >
                        <option value="single">{tLocal('flows.recurrence.single')}</option>
                        <option value="recurring">{tLocal('flows.recurrence.recurring')}</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {!flow.recurring ? (
                          <>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('flows.label.year')}</span>
                            <input
                              type="number"
                              className="input-field"
                              min={1}
                              max={retirementLength || 80}
                              value={flow.startYear}
                              onChange={e => {
                                let val = Number(e.target.value) || '';
                                if (val > 80) val = 80;
                                if (val < 1 && val !== '') val = 1;
                                handleUpdateExtraFlow(flow.id, 'startYear', val.toString());
                              }}
                              style={{ width: '50px', padding: '0.25rem', textAlign: 'center', fontSize: '0.85rem' }}
                            />
                          </>
                        ) : (
                          <>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('flows.label.years')}</span>
                            <input
                              type="number"
                              className="input-field"
                              min={1}
                              max={retirementLength || 80}
                              value={flow.startYear}
                              onChange={e => {
                                let val = Number(e.target.value) || '';
                                if (val > 80) val = 80;
                                if (val < 1 && val !== '') val = 1;
                                handleUpdateExtraFlow(flow.id, 'startYear', val.toString());
                              }}
                              style={{ width: '45px', padding: '0.25rem', textAlign: 'center', fontSize: '0.85rem' }}
                              placeholder="Desde"
                            />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{tLocal('flows.label.to')}</span>
                            <input
                              type="number"
                              className="input-field"
                              min={1}
                              max={retirementLength || 80}
                              value={flow.endYear}
                              onChange={e => {
                                let val = Number(e.target.value) || '';
                                if (val > 80) val = 80;
                                if (val < 1 && val !== '') val = 1;
                                handleUpdateExtraFlow(flow.id, 'endYear', val.toString());
                              }}
                              style={{ width: '45px', padding: '0.25rem', textAlign: 'center', fontSize: '0.85rem' }}
                              placeholder="Hasta"
                            />
                          </>
                        )}
                      </div>
                      
                      <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        <input
                          type="checkbox"
                          checked={flow.adjustForInflation}
                          onChange={e => handleUpdateExtraFlow(flow.id, 'adjustForInflation', e.target.checked)}
                        />
                        {tLocal('flows.label.adjust')}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>{tLocal('allocation.title')}</h3>
            <FinancialInput label={tLocal('allocation.stocks')} value={stockAlloc} onChange={setStockAlloc} suffix="%" min={0} max={100} />
            <FinancialInput label={tLocal('allocation.bonds')} value={bondAlloc} onChange={setBondAlloc} suffix="%" min={0} max={100} />
            <FinancialInput label={tLocal('allocation.cash')} value={cashAlloc} onChange={setCashAlloc} suffix="%" min={0} max={100} />
            {allocSum !== 100 && (
              <p style={{ color: 'var(--accent-warning)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {tLocal('allocation.warning').replace('{sum}', allocSum)}
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
              minWithdrawal,
              maxWithdrawal,
              stockAlloc,
              bondAlloc,
              cashAlloc,
              extraFlows
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
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.sequence.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.sequence.desc')}
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{tLocal('guide.dynamic.title')}</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              {tLocal('guide.dynamic.desc')}
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

export default FireCalculator;
