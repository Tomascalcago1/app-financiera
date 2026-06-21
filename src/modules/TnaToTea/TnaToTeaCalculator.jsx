import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Legend 
} from 'recharts';
import { 
  Percent, HelpCircle, Download, Printer, Share2, 
  TrendingUp, TableProperties, Coins, Scale, BookOpen
} from 'lucide-react';
import FinancialInput from '../../components/FinancialInput';
import HelpModal from '../../components/HelpModal';
import AdvisorCTA from '../../components/AdvisorCTA';
import PrintReportHeader from '../../components/PrintReportHeader';
import PrintAdvisorCTA from '../../components/PrintAdvisorCTA';
import { compoundingMap, runTnaToTeaCalculations } from './TnaToTeaEngine';
import { useLanguage } from '../../utils/LanguageContext';
import { translations } from './translations';

const formatCurrency = (value) => {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}k`;
  return `$${value}`;
};

const formatPercent = (val) => `${val.toFixed(2)}%`;

const CustomTooltip = ({ active, payload, label, language }) => {
  if (active && payload && payload.length) {
    return (
      <div className="card" style={{ padding: '1rem', border: '1px solid var(--border-color)', minWidth: '180px' }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {language === 'en' ? `Month ${label}` : `Mes ${label}`}
        </p>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.15rem' }}>
            <span style={{ color: entry.color, fontSize: '0.85rem' }}>{entry.name}:</span>
            <strong style={{ fontSize: '0.85rem' }}>
              {new Intl.NumberFormat(language === 'en' ? 'en-US' : 'es-AR', { 
                style: 'currency', 
                currency: language === 'en' ? 'USD' : 'ARS', 
                maximumFractionDigits: 0 
              }).format(entry.value)}
            </strong>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TnaToTeaCalculator = () => {
  const { language } = useLanguage();
  const tLocal = (key) => {
    return translations[language]?.[key] || translations['es'][key] || key;
  };

  const navigateToArticle = (articleId) => {
    const url = new URL(window.location.href);
    url.searchParams.set('seccion', 'educacion');
    url.searchParams.set('articulo', articleId);
    window.history.pushState({}, '', url.toString());
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'educacion' }));
  };

  const queryParams = new URLSearchParams(window.location.search);

  // States
  const [tna, setTna] = useState(() => {
    const q = queryParams.get('tna');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_tt_tna');
    return saved !== null && saved !== 'undefined' ? saved : '40';
  });

  const [frequency, setFrequency] = useState(() => {
    const q = queryParams.get('freq');
    const validFreqs = ['daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'semiannually', 'annually'];
    if (q !== null && validFreqs.includes(q)) return q;
    const saved = localStorage.getItem('valia_tt_frequency');
    return saved !== null && saved !== 'undefined' && validFreqs.includes(saved) ? saved : 'monthly';
  });

  const [inflation, setInflation] = useState(() => {
    const q = queryParams.get('inf');
    if (q !== null && !isNaN(q)) return q;
    const saved = localStorage.getItem('valia_tt_inflation');
    return saved !== null && saved !== 'undefined' ? saved : '30';
  });

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('valia_tt_tna', tna);
    localStorage.setItem('valia_tt_frequency', frequency);
    localStorage.setItem('valia_tt_inflation', inflation);
  }, [tna, frequency, inflation]);

  // Calculations
  const results = useMemo(() => {
    return runTnaToTeaCalculations(tna, frequency, inflation);
  }, [tna, frequency, inflation]);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'herramientas');
    params.set('herramienta', 'conversor-tasa');
    if (tna) params.set('tna', tna);
    if (frequency) params.set('freq', frequency);
    if (inflation) params.set('inf', inflation);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  const exportToCSV = () => {
    if (!results) return;
    const headers = [
      language === 'en' ? 'Period' : 'Mes', 
      language === 'en' ? 'Simple Interest (Principal + Linear Rate)' : 'Interes Simple (Capital + Tasa Lineal)', 
      language === 'en' ? 'Compound Interest (Principal + Compounded Rate)' : 'Interes Compuesto (Capital + Tasa Capitalizada)'
    ];
    const rows = results.chartData.map(row => [
      row.monthIndex,
      row.simple,
      row.compound
    ]);
    
    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `valia_rate_converter_${tna}_apr.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: tLocal('faq.q1'),
      a: tLocal('faq.a1')
    },
    {
      q: tLocal('faq.q2'),
      a: tLocal('faq.a2')
    },
    {
      q: tLocal('faq.q3'),
      a: tLocal('faq.a3')
    },
    {
      q: tLocal('faq.q4'),
      a: tLocal('faq.a4')
    }
  ];

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <header className="calculator-header">
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Percent size={32} style={{ color: '#06B6D4' }} />
          {tLocal('header.title')}
        </h1>
        <p>{tLocal('header.subtitle')}</p>
        
        <button 
          onClick={() => setIsHelpOpen(true)}
          className="help-btn"
        >
          <HelpCircle size={18} className="text-accent-primary" />
          {tLocal('header.understand_rates')}
        </button>
      </header>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '2rem', alignItems: 'start' }}>
        {/* Inputs Panel */}
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.25rem' }}>
            {tLocal('card.params')}
          </h2>

          <FinancialInput label={tLocal('input.tna')} value={tna} onChange={setTna} suffix="%" step={0.5} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              {tLocal('input.freq')}
            </label>
            <select 
              value={frequency} 
              onChange={e => setFrequency(e.target.value)}
              className="input-field"
              style={{ width: '100%', background: 'var(--bg-secondary)', color: 'var(--text-primary)', border: 'none' }}
            >
              {Object.entries(compoundingMap).map(([key]) => (
                <option key={key} value={key}>{tLocal(`freq.${key}`)}</option>
              ))}
            </select>
          </div>

          <FinancialInput label={tLocal('input.inflation')} value={inflation} onChange={setInflation} suffix="%" step={1} />

          <div 
            onClick={() => navigateToArticle('tna-vs-tea-capitalizacion')}
            className="card no-print"
            style={{ 
              marginTop: '1.5rem', 
              cursor: 'pointer',
              background: 'var(--bg-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem',
              borderRadius: 'var(--border-radius-md)',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            <BookOpen size={18} className="text-accent-primary" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.85rem', textAlign: 'left' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'block', marginBottom: '0.15rem', fontSize: '0.725rem', fontWeight: 600, textTransform: 'uppercase' }}>
                {tLocal('guide.tag')}
              </span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                {tLocal('guide.title')}
              </span>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {results && (
            <>
              {/* Print-only Header */}
              <PrintReportHeader 
                title={tLocal('report.title')}
                subtitle={tLocal('report.subtitle')}
                params={[
                  { label: tLocal('report.param.tna'), value: `${tna}%` },
                  { label: tLocal('report.param.freq'), value: tLocal(`freq.${frequency}`) },
                  { label: tLocal('report.param.inflation'), value: `${inflation}%` }
                ]}
              />

              {/* TEA Highlight Card */}
              <div className="card" style={{
                textAlign: 'center',
                borderTop: '4px solid var(--accent-primary)',
                background: 'linear-gradient(180deg, rgba(6, 182, 212, 0.08), transparent)'
              }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  {tLocal('dash.tea_title')}
                </p>
                <h3 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--accent-primary)', lineHeight: 1, margin: '0.25rem 0' }}>
                  {formatPercent(results.tea)}
                </h3>
                <p 
                  style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}
                  dangerouslySetInnerHTML={{ 
                    __html: tLocal('dash.tea_desc').replace('{diff}', formatPercent(results.tea - Number(tna))) 
                  }}
                />
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderTop: '2px solid #06B6D4' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {tLocal('dash.tem_title')}
                  </span>
                  <strong style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{formatPercent(results.tem)}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                    {tLocal('dash.tem_desc')}
                  </span>
                </div>

                <div className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '0.25rem', 
                  borderTop: results.realReturn >= 0 ? '2px solid #10B981' : '2px solid #EF4444' 
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    {tLocal('dash.real_return_title')}
                  </span>
                  <strong style={{ fontSize: '1.25rem', color: results.realReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.realReturn >= 0 ? '+' : ''}{formatPercent(results.realReturn)}
                  </strong>
                  <span style={{ fontSize: '0.7rem', color: results.realReturn >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                    {results.realReturn >= 0 ? tLocal('dash.real_return_success') : tLocal('dash.real_return_loss')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap', marginTop: '-0.5rem' }}>
                <button 
                  onClick={() => {
                    handleShare()
                      .then(() => {
                        setShareCopied(true);
                        setTimeout(() => setShareCopied(false), 2000);
                      })
                      .catch(err => console.error(err));
                  }}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Share2 size={16} />
                  {shareCopied ? tLocal('btn.copied') : tLocal('btn.share')}
                </button>
                
                <button 
                  onClick={exportToCSV}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Download size={16} />
                  {tLocal('btn.csv')}
                </button>

                <button 
                  onClick={() => window.print()}
                  className="btn btn-outline" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  <Printer size={16} />
                  {tLocal('btn.pdf')}
                </button>
              </div>

              {/* Chart */}
              <div className="card chart-container" id="tna-tea-chart" style={{ height: '360px' }}>
                <h3 style={{ marginBottom: '0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                  {tLocal('chart.title')}
                </h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  {tLocal('chart.subtitle')}
                </p>
                <ResponsiveContainer width="100%" height="75%">
                  <LineChart data={results.chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="monthIndex" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={formatCurrency} />
                    <Tooltip content={<CustomTooltip language={language} />} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '15px', fontSize: 12 }} />
                    
                    <Line type="monotone" dataKey="compound" name={tLocal('chart.legend.compound')} stroke="#06B6D4" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="simple" name={tLocal('chart.legend.simple')} stroke="#EF4444" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Table Toggle */}
              <button className="btn btn-outline" onClick={() => setShowTable(!showTable)} style={{ alignSelf: 'flex-start' }}>
                <TableProperties size={18} />
                {showTable ? tLocal('btn.table.hide') : tLocal('btn.table.show')}
              </button>

              {showTable && (
                <div className="card animate-fade-in" style={{ overflowX: 'auto', padding: 0 }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '0.875rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '1rem', textAlign: 'center' }}>{tLocal('table.period')}</th>
                        <th style={{ padding: '1rem' }}>{tLocal('table.simple_balance')}</th>
                        <th style={{ padding: '1rem' }}>{tLocal('table.simple_interest')}</th>
                        <th style={{ padding: '1rem' }}>{tLocal('table.compound_balance')}</th>
                        <th style={{ padding: '1rem' }}>{tLocal('table.compound_interest')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.monthlyBreakdown.map((row) => (
                        <tr key={row.monthIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            {language === 'en' ? `Month ${row.monthIndex}` : `Mes ${row.monthIndex}`}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#EF4444' }}>${row.simpleBalance.toLocaleString(language === 'en' ? 'en-US' : 'es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--text-secondary)' }}>${row.simpleInterestAcc.toLocaleString(language === 'en' ? 'en-US' : 'es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#06B6D4', fontWeight: 600 }}>${row.compoundBalance.toLocaleString(language === 'en' ? 'en-US' : 'es-AR')}</td>
                          <td style={{ padding: '0.75rem 1rem', color: '#06B6D4' }}>${row.compoundInterestAcc.toLocaleString(language === 'en' ? 'en-US' : 'es-AR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <AdvisorCTA goalContext="tasas" />
              <PrintAdvisorCTA />
            </>
          )}
        </div>
      </div>

      {/* FAQs Section */}
      <section className="card animate-fade-in" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          {tLocal('faqs.title')}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              style={{ 
                borderBottom: '1px solid var(--border-color)', 
                paddingBottom: '0.75rem' 
              }}
            >
              <button
                onClick={() => toggleFaq(index)}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '0.5rem 0',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem'
                }}
              >
                <span>{faq.q}</span>
                <span style={{ color: 'var(--accent-primary)', fontSize: '1.1rem' }}>
                  {activeFaq === index ? '−' : '+'}
                </span>
              </button>
              {activeFaq === index && (
                <p 
                  className="animate-fade-in"
                  style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.6', 
                    color: 'var(--text-secondary)',
                    margin: '0.5rem 0 0 0',
                    paddingLeft: '0.25rem'
                  }}
                >
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Help Modal */}
      <HelpModal 
        isOpen={isHelpOpen} 
        onClose={() => setIsHelpOpen(false)}
        title={tLocal('help.title')}
      >
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h1')}</h3>
        <p>{tLocal('help.p1')}</p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h2')}</h3>
        <p>{tLocal('help.p2')}</p>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1rem', marginTop: '0.5rem' }}>{tLocal('help.h3')}</h3>
        <p>{tLocal('help.p3')}</p>
      </HelpModal>
    </div>
  );
};

export default TnaToTeaCalculator;
