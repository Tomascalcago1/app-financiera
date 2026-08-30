import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Flame, 
  DollarSign, 
  Shield, 
  ArrowRight, 
  Lock, 
  Database,
  EyeOff,
  Home,
  Percent,
  Scale,
  ChevronDown,
  HelpCircle,
  Landmark,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AdvisorCTA from '../components/AdvisorCTA';
import FinancialTest from '../components/FinancialTest';
import { useLanguage } from '../utils/LanguageContext';
import { translations } from './Inicio.translations';
import { tools as configTools } from '../utils/toolsConfig';

const Inicio = ({ onSelectTool, preloadTool }) => {
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const { language } = useLanguage();

  const [savings, setSavings] = useState(200);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const calcResults = () => {
    const pmt = Number(savings) || 0;
    const r = (Number(rate) || 0) / 100;
    const y = Number(years) || 10;
    
    const rMonthly = r / 12;
    const n = y * 12;
    
    const fv = rMonthly > 0
      ? pmt * ((Math.pow(1 + rMonthly, n) - 1) / rMonthly)
      : pmt * n;
    
    const totalContributed = pmt * n;
    const totalInterest = Math.max(0, fv - totalContributed);
    
    return {
      total: Math.round(fv),
      contributed: Math.round(totalContributed),
      interest: Math.round(totalInterest)
    };
  };

  const { total, contributed, interest } = calcResults();
  
  const contributedPct = total > 0 ? (contributed / total) * 100 : 100;
  const interestPct = total > 0 ? (interest / total) * 100 : 0;

  const formatValue = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCtaClick = () => {
    // Clean up url parameters that might interfere with compound-interest
    const url = new URL(window.location.href);
    url.searchParams.delete('init');
    url.searchParams.delete('contrib');
    url.searchParams.delete('yrs');
    url.searchParams.delete('rate');
    url.searchParams.delete('var');
    url.searchParams.delete('varRange');
    url.searchParams.delete('freq');
    url.searchParams.delete('showAdv');

    // Set new url parameters so they are immediately loaded by the component
    url.searchParams.set('init', '0');
    url.searchParams.set('contrib', String(savings));
    url.searchParams.set('yrs', String(years));
    url.searchParams.set('rate', String(rate));
    url.searchParams.set('var', 'false');
    url.searchParams.set('varRange', '0');
    url.searchParams.set('freq', '12'); // 12 for monthly compounding
    url.searchParams.set('showAdv', 'false');

    window.history.replaceState({}, '', url.toString());

    // Precargar en localStorage as fallback
    localStorage.setItem('valia_compound_initialInvestment', '0');
    localStorage.setItem('valia_compound_monthlyContribution', String(savings));
    localStorage.setItem('valia_compound_years', String(years));
    localStorage.setItem('valia_compound_interestRate', String(rate));
    localStorage.setItem('valia_compound_varianceRange', '0');
    localStorage.setItem('valia_compound_compoundFrequency', '12');
    localStorage.setItem('valia_compound_enableVariance', 'false');

    // Cambiar de pestaña y herramienta
    onSelectTool('compound-interest');
  };

  const t = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  const tools = [
    {
      id: 'sueldo-neto',
      name: t('tool.sueldo-neto.name'),
      icon: <Percent size={22} className="text-accent-primary" />,
      desc: t('tool.sueldo-neto.desc'),
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'ganancias',
      name: t('tool.ganancias.name'),
      icon: <Percent size={22} className="text-accent-primary" />,
      desc: t('tool.ganancias.desc'),
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'installments-vs-cash',
      name: t('tool.installments-vs-cash.name'),
      icon: <Scale size={22} className="text-accent-primary" />,
      desc: t('tool.installments-vs-cash.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'compound-interest',
      name: t('tool.compound-interest.name'),
      icon: <TrendingUp size={22} className="text-accent-primary" />,
      desc: t('tool.compound-interest.desc'),
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'savings-comparison',
      name: t('tool.savings-comparison.name'),
      icon: <Landmark size={22} className="text-accent-primary" />,
      desc: t('tool.savings-comparison.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'hipotecario-uva',
      name: t('tool.hipotecario-uva.name'),
      icon: <Home size={22} className="text-accent-primary" />,
      desc: t('tool.hipotecario-uva.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'tna-to-tea',
      name: t('tool.tna-to-tea.name'),
      icon: <Percent size={22} className="text-accent-primary" />,
      desc: t('tool.tna-to-tea.desc'),
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'ipc-actualizer',
      name: t('tool.ipc-actualizer.name'),
      icon: <Calculator size={22} className="text-accent-primary" />,
      desc: t('tool.ipc-actualizer.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'buy-vs-rent',
      name: t('tool.buy-vs-rent.name'),
      icon: <Calculator size={22} className="text-accent-primary" />,
      desc: t('tool.buy-vs-rent.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'comparador-historico',
      name: t('tool.comparador-historico.name'),
      icon: <TrendingUp size={22} style={{ color: 'var(--accent-success)' }} />,
      desc: t('tool.comparador-historico.desc'),
      color: 'var(--accent-success)',
      category: 'inversiones'
    },
    {
      id: 'savings-goal',
      name: t('tool.savings-goal.name'),
      icon: <Target size={22} className="text-accent-primary" />,
      desc: t('tool.savings-goal.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'inflation',
      name: t('tool.inflation.name'),
      icon: <DollarSign size={22} style={{ color: 'var(--accent-success)' }} />,
      desc: t('tool.inflation.desc'),
      color: 'var(--accent-success)',
      category: 'ahorro-credito'
    },
    {
      id: 'fire',
      name: t('tool.fire.name'),
      icon: <Flame size={22} style={{ color: 'var(--accent-warning)' }} />,
      desc: t('tool.fire.desc'),
      color: 'var(--accent-warning)',
      category: 'inversiones'
    },
    {
      id: 'broker-comparator',
      name: t('tool.broker-comparator.name'),
      icon: <TrendingUp size={22} className="text-accent-primary" />,
      desc: t('tool.broker-comparator.desc'),
      color: 'var(--accent-primary)',
      category: 'inversiones'
    }
  ];

  const filteredTools = (selectedCategory === 'todas' 
    ? tools 
    : tools.filter(t => t.category === selectedCategory)
  ).filter(tool => language === 'es' || configTools.find(ct => ct.id === tool.id)?.isGlobal);

  const trustSources = [
    { name: t('trust.yale.name'), sub: t('trust.yale.sub') },
    { name: t('trust.bcra.name'), sub: t('trust.bcra.sub') },
    { name: t('trust.afip.name'), sub: t('trust.afip.sub') },
    { name: t('trust.indec.name'), sub: t('trust.indec.sub') },
    { name: t('trust.bls.name'), sub: t('trust.bls.sub') }
  ];

  const categoryOptions = [
    { id: 'todas', label: t('cat.todas') },
    { id: 'inversiones', label: t('cat.inversiones') },
    { id: 'ahorro-credito', label: t('cat.ahorro-credito') },
    { id: 'impuestos', label: t('cat.impuestos') }
  ].filter(cat => language === 'es' || cat.id !== 'impuestos');

  const faqs = [
    { q: t('faq.1.q'), a: t('faq.1.a') },
    { q: t('faq.2.q'), a: t('faq.2.a') },
    { q: t('faq.3.q'), a: t('faq.3.a') }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4.5rem' }}>
      
      {/* 1. Hero Section Grid */}
      <section style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: '3.5rem',
        alignItems: 'center',
        padding: '3.5rem 1.5rem 1rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Columna Izquierda: Mensaje y Badges de Confianza */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'left', alignItems: 'flex-start' }}>
          
          {/* Live Indicator Pill Badge */}
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '999px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 500,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 2px 8px rgba(6, 182, 212, 0.08)'
          }}>
            <span className="live-indicator-dot" />
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{t('hero.badge')}</span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.1rem, 5vw, 3rem)', 
            lineHeight: '1.12', 
            fontWeight: '800',
            background: 'linear-gradient(135deg, var(--text-gradient-start) 0%, var(--text-gradient-end) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.035em',
            margin: 0
          }}>
            {t('hero.title')}
          </h1>

          <p style={{ 
            fontSize: '1.08rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.65',
            margin: 0,
            maxWidth: '520px'
          }}>
            {t('hero.desc')}
          </p>

          {/* Badges de Confianza Optimizados */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.85rem', 
            marginTop: '0.25rem', 
            width: '100%',
            padding: '0.75rem 0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(6, 182, 212, 0.08)', 
                border: '1px solid rgba(6, 182, 212, 0.2)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0 
              }}>
                <EyeOff size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge1.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge1.desc')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(16, 185, 129, 0.08)', 
                border: '1px solid rgba(16, 185, 129, 0.2)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0 
              }}>
                <Lock size={16} style={{ color: 'var(--accent-success)' }} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge2.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge2.desc')}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                backgroundColor: 'rgba(6, 182, 212, 0.08)', 
                border: '1px solid rgba(6, 182, 212, 0.2)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexShrink: 0 
              }}>
                <Database size={16} style={{ color: 'var(--accent-primary)' }} />
              </div>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge3.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge3.desc')}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <button 
              className="btn btn-primary transition-spring"
              onClick={() => onSelectTool('buy-vs-rent')}
              style={{ padding: '0.8rem 1.75rem', fontSize: '0.925rem', letterSpacing: '-0.01em' }}
              onMouseEnter={() => preloadTool && preloadTool('buy-vs-rent')}
              onFocus={() => preloadTool && preloadTool('buy-vs-rent')}
            >
              {t('hero.cta')}
              <ArrowRight size={18} />
            </button>
            <a 
              href="#porque-valia"
              className="btn btn-outline transition-spring"
              style={{ padding: '0.8rem 1.75rem', textDecoration: 'none', fontSize: '0.925rem' }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('porque-valia')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.secondary')}
            </a>
          </div>
        </div>

        {/* Columna Derecha: Mini-Simulador Táctil */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="card animate-fade-in" style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            backdropFilter: 'blur(16px)',
            padding: '1.75rem',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.5), var(--shadow-glow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.35rem',
            width: '100%',
            maxWidth: '450px'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  {t('mini.title')}
                </h3>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                {t('mini.desc')}
              </p>
            </div>

            {/* Ahorro Mensual Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.savings')}</span>
                <strong className="tabular-nums" style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                  {formatValue(savings)}
                </strong>
              </div>
              <input 
                type="range"
                className="valia-slider"
                min={10}
                max={1000}
                step={10}
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
              />
            </div>

            {/* Tasa Anual Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.rate')}</span>
                <strong className="tabular-nums" style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                  {rate}%
                </strong>
              </div>
              <input 
                type="range"
                className="valia-slider"
                min={2}
                max={15}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
              />
            </div>

            {/* Plazo en Años Slider */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 500 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.years')}</span>
                <strong className="tabular-nums" style={{ color: 'var(--accent-primary)', fontSize: '0.95rem' }}>
                  {years} {language === 'en' ? 'Years' : 'años'}
                </strong>
              </div>
              <input 
                type="range"
                className="valia-slider"
                min={5}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>

            {/* Resultados del Mini-Simulador */}
            <div style={{ 
              backgroundColor: 'rgba(9, 13, 22, 0.45)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--border-radius-md)',
              padding: '1.1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              textAlign: 'center',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                {t('mini.result.title')}
              </span>
              <strong className="tabular-nums" style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent-success)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {formatValue(total)}
              </strong>
            </div>

            {/* Barra de Progreso Bi-color con micro-labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              <div style={{ 
                height: '10px', 
                borderRadius: '999px', 
                overflow: 'hidden', 
                display: 'flex', 
                backgroundColor: 'var(--bg-tertiary)',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)' 
              }}>
                <div style={{ 
                  width: `${contributedPct}%`, 
                  backgroundColor: '#10B981', 
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} />
                <div style={{ 
                  width: `${interestPct}%`, 
                  backgroundColor: '#06B6D4', 
                  transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)' 
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  {t('mini.capital.label')}: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{Math.round(contributedPct)}%</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }} />
                  {t('mini.interest.label')}: <strong className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{Math.round(interestPct)}%</strong>
                </span>
              </div>
            </div>

            <button 
              onClick={handleCtaClick}
              className="btn btn-primary transition-spring"
              style={{ 
                marginTop: '0.35rem', 
                justifyContent: 'center', 
                fontWeight: 600, 
                fontSize: '0.925rem',
                padding: '0.85rem 1rem',
                boxShadow: '0 4px 14px rgba(6, 182, 212, 0.25)' 
              }}
            >
              {t('mini.cta')}
            </button>
          </div>
        </div>
      </section>

      {/* Brand Trust Bar / Data Sources */}
      <section style={{ 
        textAlign: 'center', 
        padding: '0 1.5rem',
        marginTop: '-1.5rem',
        marginBottom: '0.5rem'
      }}>
        <p style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.12em', 
          color: 'var(--text-tertiary)', 
          fontWeight: 600,
          marginBottom: '1.25rem'
        }}>
          {t('trust.label')}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1rem', 
          flexWrap: 'wrap'
        }}>
          {trustSources.map((source, i) => (
            <div key={i} className="taste-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '0.5rem 1rem',
              border: '1px solid rgba(51, 65, 85, 0.4)',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(30, 41, 59, 0.3)',
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{source.name}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{source.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Comparison Section (Anti-Slop SaaS Matrix) */}
      <section className="container" style={{ maxWidth: '880px', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>{t('trust.comp.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '620px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {t('trust.comp.subtitle')}
          </p>
        </div>

        <div className="taste-card" style={{ padding: 0, overflowX: 'auto', border: '1px solid rgba(6, 182, 212, 0.25)', boxShadow: '0 8px 30px rgba(0,0,0,0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.1rem 1.25rem', width: '28%', color: 'var(--text-secondary)', fontWeight: 600 }}></th>
                <th style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)', fontWeight: 600, width: '36%' }}>
                  {t('trust.comp.header.app')}
                </th>
                <th style={{ 
                  padding: '1.1rem 1.25rem', 
                  color: 'var(--accent-primary)', 
                  fontWeight: 700, 
                  width: '36%', 
                  background: 'rgba(6, 182, 212, 0.08)',
                  borderLeft: '1px solid rgba(6, 182, 212, 0.2)',
                  borderRight: '1px solid rgba(6, 182, 212, 0.2)'
                }}>
                  {t('trust.comp.header.valia')}
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((num) => (
                <tr key={num} style={{ borderBottom: num < 4 ? '1px solid var(--border-color)' : 'none' }}>
                  <td style={{ padding: '1.1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t(`trust.comp.row${num}.label`)}
                  </td>
                  <td style={{ padding: '1.1rem 1.25rem', color: 'var(--text-secondary)' }}>
                    {t(`trust.comp.row${num}.app`)}
                  </td>
                  <td style={{ 
                    padding: '1.1rem 1.25rem', 
                    color: 'var(--text-primary)', 
                    fontWeight: 500, 
                    background: 'rgba(6, 182, 212, 0.03)',
                    borderLeft: '1px solid rgba(6, 182, 212, 0.15)',
                    borderRight: '1px solid rgba(6, 182, 212, 0.15)'
                  }}>
                    {t(`trust.comp.row${num}.valia`)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Financial Health Test Widget (Only shown in Spanish) */}
      {language === 'es' && (
        <section className="container" style={{ maxWidth: '880px' }}>
          <FinancialTest onSelectTool={onSelectTool} preloadTool={preloadTool} />
        </section>
      )}

      {/* 3. Grid of Tools with Category Filter */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>{t('section.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
            {t('section.desc')}
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.6rem', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem auto'
        }}>
          {categoryOptions.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`btn transition-spring ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '0.45rem 1.35rem', 
                fontSize: '0.85rem', 
                borderRadius: '999px',
                fontWeight: selectedCategory === cat.id ? '600' : '400'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tool Cards Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          minHeight: filteredTools.length > 0 ? 'auto' : '200px'
        }}>
          {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              className="taste-card" 
              style={{ 
                padding: '1.5rem',
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1.25rem',
                justifyContent: 'space-between',
                cursor: 'pointer'
              }}
              onClick={() => onSelectTool(tool.id)}
              onMouseEnter={() => {
                if (preloadTool) preloadTool(tool.id);
              }}
              onFocus={() => {
                if (preloadTool) preloadTool(tool.id);
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '46px', 
                  height: '46px', 
                  borderRadius: '12px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                }}>
                  {tool.icon}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.015em', margin: 0 }}>
                  {tool.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.55', margin: 0 }}>
                  {tool.desc}
                </p>
              </div>

              <div 
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: 'var(--accent-primary)',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  marginTop: '0.25rem'
                }}
              >
                <span>{t('section.action')}</span>
                <ArrowRight size={15} />
              </div>
            </div>
          ))}
        </div>

        {/* Lead Gen Advisor CTA banner */}
        <div style={{ marginTop: '3.5rem' }}>
          <AdvisorCTA 
            title={t('advisor.title')}
            description={t('advisor.desc')}
          />
        </div>
      </section>

      {/* 3.5 Integrity Stats & Local Processing Banner */}
      <section className="container" style={{ 
        paddingTop: '3.5rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.75rem'
      }}>
        {/* Valia en Números Stats */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>{t('stats.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('stats.desc')}</p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          {[
            { val: t('stats.simulators.val'), label: t('stats.simulators.label'), desc: t('stats.simulators.desc') },
            { val: t('stats.custody.val'), label: t('stats.custody.label'), desc: t('stats.custody.desc') },
            { val: t('stats.local.val'), label: t('stats.local.label'), desc: t('stats.local.desc') },
            { val: t('stats.fiscal.val'), label: t('stats.fiscal.label'), desc: t('stats.fiscal.desc') }
          ].map((stat, i) => (
            <div key={i} className="taste-card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.4rem',
              padding: '1.75rem 1.25rem',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-gradient-bottom) 100%)'
            }}>
              <span className="tabular-nums" style={{ 
                fontSize: '2.5rem', 
                fontWeight: '800', 
                color: 'var(--accent-primary)',
                background: 'linear-gradient(135deg, var(--accent-primary), #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1,
                letterSpacing: '-0.03em'
              }}>{stat.val}</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.35rem' }}>{stat.label}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Local Processing Banner */}
        <div className="taste-card" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, var(--bg-tertiary) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--border-radius-lg)',
          padding: '2rem 2.5rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: 700,
            fontSize: '1.15rem'
          }}>
            <Shield size={24} />
            {t('privacy.title')}
          </div>
          <p 
            style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '720px', margin: 0, lineHeight: 1.65 }}
            dangerouslySetInnerHTML={{ __html: t('privacy.desc') }}
          />
        </div>
      </section>

      {/* 4. Why Valia (Pilares) */}
      <section id="porque-valia" className="container" style={{ 
        paddingTop: '3.5rem', 
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>{t('why.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('why.subtitle')}</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="taste-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: 'var(--accent-success)',
              marginBottom: '0.25rem',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Lock size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.015em', margin: 0 }}>{t('why.p1.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('why.p1.desc')}
            </p>
          </div>

          <div className="taste-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(6, 182, 212, 0.1)',
              color: 'var(--accent-primary)',
              marginBottom: '0.25rem',
              border: '1px solid rgba(6, 182, 212, 0.2)'
            }}>
              <Database size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.015em', margin: 0 }}>{t('why.p2.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('why.p2.desc')}
            </p>
          </div>

          <div className="taste-card" style={{ textAlign: 'center', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '52px', 
              height: '52px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              color: 'var(--accent-warning)',
              marginBottom: '0.25rem',
              border: '1px solid rgba(245, 158, 11, 0.2)'
            }}>
              <EyeOff size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, letterSpacing: '-0.015em', margin: 0 }}>{t('why.p3.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
              {t('why.p3.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section (Accordion with smooth rotation) */}
      <section className="container" style={{ 
        marginTop: '1.5rem', 
        paddingTop: '3.5rem', 
        borderTop: '1px solid var(--border-color)',
        maxWidth: '850px',
        margin: '0 auto 2rem auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', letterSpacing: '-0.025em' }}>
            <HelpCircle size={26} className="text-accent-primary" />
            {t('faq.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{t('faq.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="taste-card"
                style={{ 
                  padding: '1.25rem 1.6rem',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'var(--accent-primary)' : 'var(--border-color)',
                  background: isOpen 
                    ? 'linear-gradient(to bottom, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' 
                    : 'var(--bg-secondary)',
                  boxShadow: isOpen ? '0 8px 24px -6px rgba(0,0,0,0.3), var(--shadow-glow)' : 'var(--shadow-sm)'
                }}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1.05rem', 
                    margin: 0, 
                    fontWeight: 600,
                    color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                    transition: 'color var(--transition-fast)'
                  }}>
                    {faq.q}
                  </h3>
                  <div style={{ 
                    color: 'var(--text-secondary)', 
                    flexShrink: 0,
                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}>
                    <ChevronDown size={20} />
                  </div>
                </div>
                {isOpen && (
                  <p className="animate-fade-in" style={{ 
                    marginTop: '1rem', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.65',
                    fontSize: '0.925rem',
                    marginBottom: 0
                  }}>
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default Inicio;
