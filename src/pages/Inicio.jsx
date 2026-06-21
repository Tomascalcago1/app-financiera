import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Target, 
  Flame, 
  DollarSign, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  Database,
  EyeOff,
  Home,
  Percent,
  Scale,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Landmark
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

  const [savings, setSavings] = useState(() => language === 'en' ? 200 : 100000);
  const [rate, setRate] = useState(() => language === 'en' ? 8 : 40);
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
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-AR', {
      style: 'currency',
      currency: language === 'en' ? 'USD' : 'ARS',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleCtaClick = () => {
    // Precargar en localStorage
    localStorage.setItem('valia_ci_init', '0');
    localStorage.setItem('valia_ci_contrib', String(savings));
    localStorage.setItem('valia_ci_yrs', String(years));
    localStorage.setItem('valia_ci_rate', String(rate));
    localStorage.setItem('valia_ci_var', '0');
    localStorage.setItem('valia_ci_freq', 'monthly');
    localStorage.setItem('valia_ci_showAdv', 'false');

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
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: t('tool.sueldo-neto.desc'),
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'ganancias',
      name: t('tool.ganancias.name'),
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: t('tool.ganancias.desc'),
      color: 'var(--accent-primary)',
      category: 'impuestos'
    },
    {
      id: 'installments-vs-cash',
      name: t('tool.installments-vs-cash.name'),
      icon: <Scale size={24} className="text-accent-primary" />,
      desc: t('tool.installments-vs-cash.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'compound-interest',
      name: t('tool.compound-interest.name'),
      icon: <TrendingUp size={24} className="text-accent-primary" />,
      desc: t('tool.compound-interest.desc'),
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'savings-comparison',
      name: t('tool.savings-comparison.name'),
      icon: <Landmark size={24} className="text-accent-primary" />,
      desc: t('tool.savings-comparison.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'hipotecario-uva',
      name: t('tool.hipotecario-uva.name'),
      icon: <Home size={24} className="text-accent-primary" />,
      desc: t('tool.hipotecario-uva.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'tna-to-tea',
      name: t('tool.tna-to-tea.name'),
      icon: <Percent size={24} className="text-accent-primary" />,
      desc: t('tool.tna-to-tea.desc'),
      color: 'var(--accent-primary)',
      category: 'inversiones'
    },
    {
      id: 'ipc-actualizer',
      name: t('tool.ipc-actualizer.name'),
      icon: <Calculator size={24} className="text-accent-primary" />,
      desc: t('tool.ipc-actualizer.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'buy-vs-rent',
      name: t('tool.buy-vs-rent.name'),
      icon: <Calculator size={24} className="text-accent-primary" />,
      desc: t('tool.buy-vs-rent.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'comparador-historico',
      name: t('tool.comparador-historico.name'),
      icon: <TrendingUp size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: t('tool.comparador-historico.desc'),
      color: 'var(--accent-success)',
      category: 'inversiones'
    },
    {
      id: 'savings-goal',
      name: t('tool.savings-goal.name'),
      icon: <Target size={24} className="text-accent-primary" />,
      desc: t('tool.savings-goal.desc'),
      color: 'var(--accent-primary)',
      category: 'ahorro-credito'
    },
    {
      id: 'inflation',
      name: t('tool.inflation.name'),
      icon: <DollarSign size={24} style={{ color: 'var(--accent-success)' }} />,
      desc: t('tool.inflation.desc'),
      color: 'var(--accent-success)',
      category: 'ahorro-credito'
    },
    {
      id: 'fire',
      name: t('tool.fire.name'),
      icon: <Flame size={24} style={{ color: 'var(--accent-warning)' }} />,
      desc: t('tool.fire.desc'),
      color: 'var(--accent-warning)',
      category: 'inversiones'
    },
    {
      id: 'broker-comparator',
      name: t('tool.broker-comparator.name'),
      icon: <TrendingUp size={24} className="text-accent-primary" />,
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
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
      
      {/* 1. Hero Section Grid */}
      <section style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: '3rem',
        alignItems: 'center',
        padding: '3rem 1.5rem 1rem 1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        {/* Columna Izquierda: Mensaje y Badges de Confianza */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', alignItems: 'flex-start' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            padding: '0.35rem 1rem',
            borderRadius: '50px',
            backgroundColor: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            color: 'var(--accent-primary)',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <Sparkles size={14} />
            {t('hero.badge')}
          </div>
          <h1 style={{ 
            fontSize: '2.75rem', 
            lineHeight: '1.15', 
            fontWeight: '700',
            background: 'linear-gradient(to right, var(--text-gradient-start), var(--text-gradient-end))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            margin: 0
          }}>
            {t('hero.title')}
          </h1>
          <p style={{ 
            fontSize: '1.1rem', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.6',
            margin: 0
          }}>
            {t('hero.desc')}
          </p>

          {/* Badges de Confianza */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <EyeOff size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge1.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge1.desc')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Lock size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge2.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge2.desc')}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Database size={16} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', display: 'block' }}>{t('hero.trust.badge3.title')}</strong>
                <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{t('hero.trust.badge3.desc')}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <button 
              className="btn btn-primary"
              onClick={() => onSelectTool('buy-vs-rent')}
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
              onMouseEnter={() => preloadTool && preloadTool('buy-vs-rent')}
              onFocus={() => preloadTool && preloadTool('buy-vs-rent')}
            >
              {t('hero.cta')}
              <ArrowRight size={18} />
            </button>
            <a 
              href="#porque-valia"
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.5rem', textDecoration: 'none', fontSize: '0.9rem' }}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('porque-valia')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {t('hero.secondary')}
            </a>
          </div>
        </div>

        {/* Columna Derecha: Mini-Simulador */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <div className="card animate-fade-in" style={{
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.45) 0%, rgba(9, 13, 22, 0.6) 100%)',
            border: '1px solid var(--border-color)',
            backdropFilter: 'blur(12px)',
            padding: '1.5rem',
            borderRadius: 'var(--border-radius-lg)',
            boxShadow: 'var(--shadow-glow), var(--shadow-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            width: '100%',
            maxWidth: '440px'
          }}>
            <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 0.25rem 0' }}>
                {t('mini.title')}
              </h3>
              <p style={{ fontSize: '0.775rem', color: 'var(--text-secondary)', margin: 0 }}>
                {t('mini.desc')}
              </p>
            </div>

            {/* Ahorro Mensual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.savings')}</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{formatValue(savings)}</strong>
              </div>
              <input 
                type="range"
                min={language === 'en' ? 10 : 10000}
                max={language === 'en' ? 1000 : 500000}
                step={language === 'en' ? 10 : 5000}
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Tasa Anual */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.rate')}</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{rate}%</strong>
              </div>
              <input 
                type="range"
                min={language === 'en' ? 2 : 10}
                max={language === 'en' ? 15 : 70}
                step={language === 'en' ? 0.5 : 1}
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Plazo en Años */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{t('mini.years')}</span>
                <strong style={{ color: 'var(--accent-primary)' }}>{years} {language === 'en' ? 'Years' : 'años'}</strong>
              </div>
              <input 
                type="range"
                min={5}
                max={40}
                step={1}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                style={{ 
                  width: '100%', 
                  accentColor: 'var(--accent-primary)',
                  cursor: 'pointer'
                }}
              />
            </div>

            {/* Resultados del Mini-Simulador */}
            <div style={{ 
              backgroundColor: 'rgba(9, 13, 22, 0.4)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--border-radius-sm)',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('mini.result.title')}
              </span>
              <strong style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-success)' }}>
                {formatValue(total)}
              </strong>
            </div>

            {/* Barra de Progreso Bi-color */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ 
                height: '8px', 
                borderRadius: '4px', 
                overflow: 'hidden', 
                display: 'flex', 
                backgroundColor: 'var(--bg-tertiary)' 
              }}>
                <div style={{ 
                  width: `${contributedPct}%`, 
                  backgroundColor: '#10B981', 
                  transition: 'width 0.3s ease-out' 
                }} />
                <div style={{ 
                  width: `${interestPct}%`, 
                  backgroundColor: '#06B6D4', 
                  transition: 'width 0.3s ease-out' 
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981' }} />
                  {t('mini.capital.label')}: {Math.round(contributedPct)}%
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#06B6D4' }} />
                  {t('mini.interest.label')}: {Math.round(interestPct)}%
                </span>
              </div>
            </div>

            <button 
              onClick={handleCtaClick}
              className="btn btn-primary"
              style={{ 
                marginTop: '0.25rem', 
                justifyContent: 'center', 
                fontWeight: 600, 
                fontSize: '0.9rem',
                padding: '0.75rem 1rem' 
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
        marginTop: '-1rem',
        marginBottom: '1rem'
      }}>
        <p style={{ 
          fontSize: '0.75rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.1em', 
          color: 'var(--text-tertiary)', 
          fontWeight: 600,
          marginBottom: '1rem'
        }}>
          {t('trust.label')}
        </p>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '1.25rem', 
          flexWrap: 'wrap',
          opacity: 0.85
        }}>
          {trustSources.map((source, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              padding: '0.4rem 0.8rem',
              border: '1px solid rgba(51, 65, 85, 0.3)',
              borderRadius: 'var(--border-radius-sm)',
              background: 'rgba(30, 41, 59, 0.4)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-primary)' }}>{source.name}</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>{source.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Comparison Section */}
      <section className="container" style={{ maxWidth: '850px', marginTop: '1rem', marginBottom: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('trust.comp.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '0.95rem' }}>
            {t('trust.comp.subtitle')}
          </p>
        </div>

        <div className="card" style={{ padding: 0, overflowX: 'auto', border: '1px solid rgba(6, 182, 212, 0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', width: '30%' }}></th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: '600', width: '35%' }}>
                  {t('trust.comp.header.app')}
                </th>
                <th style={{ padding: '1rem', color: 'var(--accent-primary)', fontWeight: '700', width: '35%', background: 'rgba(6, 182, 212, 0.04)' }}>
                  {t('trust.comp.header.valia')}
                </th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map((num) => (
                <tr key={num} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {t(`trust.comp.row${num}.label`)}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                    {t(`trust.comp.row${num}.app`)}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-primary)', fontWeight: 500, background: 'rgba(6, 182, 212, 0.02)' }}>
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
        <section className="container" style={{ maxWidth: '850px' }}>
          <FinancialTest onSelectTool={onSelectTool} preloadTool={preloadTool} />
        </section>
      )}

      {/* 3. Grid of Tools */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('section.title')}</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            {t('section.desc')}
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
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
              className={`btn ${selectedCategory === cat.id ? 'btn-primary' : 'btn-outline'}`}
              style={{ 
                padding: '0.4rem 1.25rem', 
                fontSize: '0.85rem', 
                borderRadius: '50px',
                fontWeight: selectedCategory === cat.id ? '600' : '400',
                transition: 'all var(--transition-fast)'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1.5rem',
          minHeight: filteredTools.length > 0 ? 'auto' : '200px'
        }}>
          {filteredTools.map((tool) => (
            <div 
              key={tool.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                justifyContent: 'space-between',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'pointer'
              }}
              onClick={() => onSelectTool(tool.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                if (preloadTool) preloadTool(tool.id);
              }}
              onFocus={() => {
                if (preloadTool) preloadTool(tool.id);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '10px', 
                  backgroundColor: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-color)'
                }}>
                  {tool.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem' }}>{tool.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  {tool.desc}
                </p>
              </div>
              <button 
                className="btn btn-outline" 
                style={{ 
                  padding: '0.5rem 1rem', 
                  fontSize: '0.875rem', 
                  marginTop: '0.5rem',
                  width: '100%',
                  justifyContent: 'center',
                  pointerEvents: 'none', // prevent button click from duplicating card click
                  borderColor: 'rgba(6, 182, 212, 0.1)',
                  color: 'var(--accent-primary)',
                  fontWeight: 500
                }}
              >
                {t('section.action')}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Lead Gen Advisor CTA banner */}
        <div style={{ marginTop: '3rem' }}>
          <AdvisorCTA 
            title={t('advisor.title')}
            description={t('advisor.desc')}
          />
        </div>
      </section>

      {/* 3.5 Integrity Stats & Local Processing Banner */}
      <section className="container" style={{ 
        paddingTop: '3rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '2.5rem'
      }}>
        {/* Valia en Números Stats */}
        <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('stats.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('stats.desc')}</p>
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
            <div key={i} className="card" style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '0.35rem',
              padding: '1.5rem 1rem',
              background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-gradient-bottom) 100%)',
              transition: 'none'
            }}>
              <span style={{ 
                fontSize: '2.25rem', 
                fontWeight: '800', 
                color: 'var(--accent-primary)',
                background: 'linear-gradient(to right, var(--accent-primary), #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1
              }}>{stat.val}</span>
              <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{stat.label}</strong>
              <span style={{ fontSize: '0.775rem', color: 'var(--text-secondary)' }}>{stat.desc}</span>
            </div>
          ))}
        </div>

        {/* Local Processing Banner */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: 'var(--border-radius-md)',
          padding: '1.5rem 2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--accent-primary)',
            fontWeight: '600',
            fontSize: '1.1rem'
          }}>
            <Shield size={22} />
            {t('privacy.title')}
          </div>
          <p 
            style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: 0, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: t('privacy.desc') }}
          />
        </div>
      </section>

      {/* 4. Why Valia (Pilares) */}
      <section id="porque-valia" className="container" style={{ 
        paddingTop: '3rem', 
        borderTop: '1px solid var(--border-color)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('why.title')}</h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('why.subtitle')}</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '2rem' 
        }}>
          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.08)',
              color: 'var(--accent-success)',
              marginBottom: '0.5rem'
            }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>{t('why.p1.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {t('why.p1.desc')}
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              color: 'var(--accent-primary)',
              marginBottom: '0.5rem'
            }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>{t('why.p2.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {t('why.p2.desc')}
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(245, 158, 11, 0.08)',
              color: 'var(--accent-warning)',
              marginBottom: '0.5rem'
            }}>
              <EyeOff size={22} />
            </div>
            <h3 style={{ fontSize: '1.125rem' }}>{t('why.p3.title')}</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
              {t('why.p3.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 5. FAQs Section */}
      <section className="container" style={{ 
        marginTop: '2rem', 
        paddingTop: '3rem', 
        borderTop: '1px solid var(--border-color)',
        maxWidth: '800px',
        margin: '0 auto 2rem auto'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <HelpCircle size={24} className="text-accent-primary" />
            {t('faq.title')}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{t('faq.subtitle')}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div 
                key={index} 
                className="card"
                style={{ 
                  padding: '1.25rem 1.5rem',
                  cursor: 'pointer',
                  borderColor: isOpen ? 'rgba(6, 182, 212, 0.4)' : 'var(--border-color)',
                  background: isOpen 
                    ? 'linear-gradient(to bottom, var(--bg-secondary) 0%, rgba(15, 23, 42, 0.3) 100%)' 
                    : 'var(--bg-secondary)',
                  transition: 'all var(--transition-fast)'
                }}
                onClick={() => setOpenFaq(isOpen ? null : index)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <h3 style={{ 
                    fontSize: '1rem', 
                    margin: 0, 
                    fontWeight: 600,
                    color: isOpen ? 'var(--accent-primary)' : 'var(--text-primary)'
                  }}>
                    {faq.q}
                  </h3>
                  <div style={{ color: 'var(--text-secondary)', flexShrink: 0 }}>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                {isOpen && (
                  <p className="animate-fade-in" style={{ 
                    marginTop: '1rem', 
                    borderTop: '1px solid var(--border-color)', 
                    paddingTop: '1rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    fontSize: '0.9rem',
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
