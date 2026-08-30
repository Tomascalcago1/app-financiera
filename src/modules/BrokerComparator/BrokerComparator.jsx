import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  ExternalLink, 
  Shield, 
  Award, 
  CheckCircle, 
  MessageSquare, 
  HelpCircle, 
  Sparkles, 
  DollarSign, 
  Percent, 
  ChevronRight,
  Info,
  Download,
  Printer,
  Share2,
  Image,
  TableProperties
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import FinancialInput from '../../components/FinancialInput';
import { exportChartToPNG } from '../../utils/chartExporter';

const BrokerComparator = ({ onNavigateToAsesores }) => {
  // Simulator states
  const [tradeAmount, setTradeAmount] = useState('500000'); // Monto a operar
  const [cashBalance, setCashBalance] = useState('200000'); // Dinero en cuenta sin invertir
  const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'table'
  const [shareCopied, setShareCopied] = useState(false);

  const handleShare = () => {
    const params = new URLSearchParams();
    params.set('seccion', 'brokers');
    params.set('trade', tradeAmount);
    params.set('cash', cashBalance);

    const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    return navigator.clipboard.writeText(shareUrl);
  };

  // Navigation via window event or prop
  const handleContactAdvisor = () => {
    if (onNavigateToAsesores) {
      onNavigateToAsesores();
    } else {
      window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
    }
  };

  // Dataset of Argentine brokers
  const brokersData = useMemo(() => [
    {
      id: 'balanz_valia',
      name: 'Balanz (Exclusivo Valia)',
      recommended: true,
      commissionAcciones: '0.40%',
      commissionAccionesRaw: 0.004,
      commissionONs: '0.40%',
      commissionONsRaw: 0.004,
      commissionLetras: '0.40%',
      commissionLetrasRaw: 0.004,
      tnaRemunerada: '38.0%',
      tnaRemuneradaRaw: 0.38,
      benefit: 'Asesor matriculado CNV asignado sin cargo + Apertura bonificada de por vida + Tasa de comisiones preferencial al 0.40%.',
      ctaText: 'Obtener Beneficio Valia',
      ctaType: 'internal',
      link: null
    },
    {
      id: 'balanz',
      name: 'Balanz (Estándar)',
      recommended: false,
      commissionAcciones: '0.60%',
      commissionAccionesRaw: 0.006,
      commissionONs: '0.60%',
      commissionONsRaw: 0.006,
      commissionLetras: '0.60%',
      commissionLetrasRaw: 0.006,
      tnaRemunerada: '38.0%',
      tnaRemuneradaRaw: 0.38,
      benefit: 'Soporte general automatizado por canales de atención comunes. Sin asesor personal idóneo asignado.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.balanz.com/'
    },
    {
      id: 'ppi',
      name: 'PPI (Portfolio Personal)',
      recommended: false,
      commissionAcciones: '0.60% + Der.',
      commissionAccionesRaw: 0.006,
      commissionONs: '0.60%',
      commissionONsRaw: 0.006,
      commissionLetras: '0.60%',
      commissionLetrasRaw: 0.006,
      tnaRemunerada: '37.2%',
      tnaRemuneradaRaw: 0.372,
      benefit: 'Soporte general automatizado. Sin bonificaciones exclusivas.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.portfoliopersonal.com/'
    },
    {
      id: 'iol',
      name: 'IOL (InvertirOnline)',
      recommended: false,
      commissionAcciones: '0.50% + IVA + Der.',
      commissionAccionesRaw: 0.0065, // aproximado neto
      commissionONs: '0.50% + IVA',
      commissionONsRaw: 0.0060,
      commissionLetras: '0.50% + IVA',
      commissionLetrasRaw: 0.0060,
      tnaRemunerada: '36.5%',
      tnaRemuneradaRaw: 0.365,
      benefit: 'Soporte general. Sin asesoramiento personalizado bonificado.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.invertironline.com/'
    },
    {
      id: 'cocos',
      name: 'Cocos Capital',
      recommended: false,
      commissionAcciones: '0.00% / 0.50%',
      commissionAccionesRaw: 0.002, // promedio ponderado / demoras
      commissionONs: '0.50%',
      commissionONsRaw: 0.005,
      commissionLetras: '0.50%',
      commissionLetrasRaw: 0.005,
      tnaRemunerada: '35.0%',
      tnaRemuneradaRaw: 0.35,
      benefit: 'Soporte general por chatbot. Sin asesor idóneo asignado.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://cocos.capital/'
    },
    {
      id: 'bullmarket',
      name: 'Bull Market Brokers',
      recommended: false,
      commissionAcciones: '0.50% + IVA + Der.',
      commissionAccionesRaw: 0.0065,
      commissionONs: '0.50% + IVA',
      commissionONsRaw: 0.0060,
      commissionLetras: '0.50% + IVA',
      commissionLetrasRaw: 0.0060,
      tnaRemunerada: '35.5%',
      tnaRemuneradaRaw: 0.355,
      benefit: 'Soporte por ticket y chat general. Costos de retiro aplicables en ciertas operaciones.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://bullmarketbrokers.com/'
    },
    {
      id: 'banza',
      name: 'Banza',
      recommended: false,
      commissionAcciones: '0.50% + IVA',
      commissionAccionesRaw: 0.0060,
      commissionONs: '0.50%',
      commissionONsRaw: 0.0050,
      commissionLetras: '0.50%',
      commissionLetrasRaw: 0.0050,
      tnaRemunerada: '36.0%',
      tnaRemuneradaRaw: 0.36,
      benefit: 'Operación simplificada desde app móvil. Sin asesoramiento personalizado bonificado.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.banza.com.ar/'
    },
    {
      id: 'inviu',
      name: 'Inviu',
      recommended: false,
      commissionAcciones: '0.70% + IVA',
      commissionAccionesRaw: 0.0085,
      commissionONs: '0.70%',
      commissionONsRaw: 0.0070,
      commissionLetras: '0.70%',
      commissionLetrasRaw: 0.0070,
      tnaRemunerada: '34.0%',
      tnaRemuneradaRaw: 0.34,
      benefit: 'Soporte a través de red de asesores independientes. Mínimos de operación según asesor.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://inviu.com.ar/'
    },
    {
      id: 'mercadopago',
      name: 'Mercado Pago',
      recommended: false,
      commissionAcciones: '1.0% a 2.0% (implícita)',
      commissionAccionesRaw: 0.015,
      commissionONs: 'No disponible',
      commissionONsRaw: null,
      commissionLetras: 'No disponible',
      commissionLetrasRaw: null,
      tnaRemunerada: '36.8%',
      tnaRemuneradaRaw: 0.368,
      benefit: 'FCI automático de bajo rendimiento. Sin asesor ni acceso a bonos/ONs directas.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.mercadopago.com.ar/'
    },
    {
      id: 'personalpay',
      name: 'Personal Pay',
      recommended: false,
      commissionAcciones: 'No disponible',
      commissionAccionesRaw: null,
      commissionONs: 'No disponible',
      commissionONsRaw: null,
      commissionLetras: 'No disponible',
      commissionLetrasRaw: null,
      tnaRemunerada: '37.5%',
      tnaRemuneradaRaw: 0.375,
      benefit: 'Billetera virtual con remuneración diaria. Sin acceso a bolsa ni asesores.',
      ctaText: 'Ver Web Oficial',
      ctaType: 'external',
      link: 'https://www.personalpay.com.ar/'
    }
  ], []);

  // Simulator calculations
  const simulatorResults = useMemo(() => {
    const trade = Number(tradeAmount) || 0;
    const balance = Number(cashBalance) || 0;

    return brokersData.map(b => {
      // Commision calculation
      let tradeCostText = 'N/A';
      let tradeCostRaw = 0;
      if (b.commissionAccionesRaw !== null) {
        tradeCostRaw = trade * b.commissionAccionesRaw;
        tradeCostText = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(tradeCostRaw);
      }

      // Remunerated yield calculation (annualized)
      const annualYieldRaw = balance * b.tnaRemuneradaRaw;
      const monthlyYieldRaw = annualYieldRaw / 12;
      const monthlyYieldText = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(monthlyYieldRaw);

      // Estimated advisory cost (Balanz Exclusivo is 0, others typically charge or you don't get it)
      // Industry standard personal advisor is at least 1.0% of portfolio annually or $50k fixed minimum
      const advisoryCostText = b.id === 'balanz_valia' ? 'Bonificado ($0)' : 'Sin Asesor / Soporte general';
      const savings = b.id === 'balanz_valia' ? 'Destacado' : '';

      return {
        ...b,
        tradeCostRaw,
        tradeCostText,
        monthlyYieldRaw,
        monthlyYieldText,
        advisoryCostText
      };
    });
  }, [brokersData, tradeAmount, cashBalance]);

  // Find Balanz for comparison callouts
  const balanzResults = simulatorResults.find(r => r.id === 'balanz_valia');

  const faqs = [
    {
      q: '¿Por qué las comisiones de Balanz a través de Valia son preferenciales?',
      a: 'Al registrarte a través de nuestro canal de recomendación directa de Valia, accedés a la estructura de comisiones preferenciales y la bonificación absoluta en la asignación de un asesor idóneo matriculado en CNV, sin costo fijo ni comisiones adicionales.'
    },
    {
      q: '¿Qué es la cuenta remunerada o FCI Money Market?',
      a: 'Es la tasa anual (TNA) que rinde el saldo líquido que tenés en cuenta sin invertir. En las billeteras virtuales ocurre de forma automática, mientras que en brokers tradicionales como Balanz, PPI o IOL se realiza suscribiendo al Fondo Común de Inversión (FCI) de liquidez inmediata (Money Market) con rescate en el acto de 9:00 a 16:00 hs.'
    },
    {
      q: '¿Qué son los derechos de mercado y el IVA?',
      a: 'Algunos brokers anuncian comisiones nominales bajas pero no incluyen los derechos cobrados por Bolsas y Mercados Argentinos (BYMA) ni el 21% de IVA sobre la comisión. En Balanz, la tasa del 0.5% ya es preferencial e incluye la gestión personalizada de tu cartera de inversiones.'
    },
    {
      q: '¿Es seguro operar mis ahorros en un broker en lugar de un banco?',
      a: 'Sí. Todos los brokers (ALyCs) incluidos en esta tabla están regulados y supervisados por la Comisión Nacional de Valores (CNV). Los fondos y títulos (Acciones, CEDEARs, Bonos) están registrados a tu nombre en Caja de Valores, por lo que el patrimonio está resguardado independientemente del broker.'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0' }}>
      
      {/* Header */}
      <header className="calculator-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <TrendingUp className="text-accent-primary" size={32} />
          Comparador de Tasas y Brokers
        </h1>
        <p>Analizá comisiones, rendimientos y accedé a los beneficios preferenciales de Valia para potenciar tus ahorros.</p>
      </header>

      {/* Intro Perks Card */}
      <div className="taste-card" style={{ 
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, var(--bg-secondary) 100%)',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        boxShadow: '0 8px 24px rgba(6, 182, 212, 0.1)',
        padding: '2rem',
        marginBottom: '3rem',
        borderRadius: 'var(--border-radius-md)'
      }}>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ 
            backgroundColor: 'rgba(6, 182, 212, 0.15)', 
            color: 'var(--accent-primary)', 
            padding: '1rem', 
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={28} />
          </div>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              Beneficios Exclusivos con Balanz
              <span className="badge" style={{ backgroundColor: 'var(--accent-primary)', color: '#FFFFFF', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 'bold' }}>VALIA PREFERENCIAL</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', lineHeight: '1.6', marginBottom: '1rem' }}>
              Operando a través de Valia accedés a un canal exclusivo de asesoramiento financiero directo. Un profesional matriculado de Balanz te ayudará a diseñar carteras de inversión a medida sin pagar costos extras ni comisiones infladas.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} className="text-accent-primary" />
                Apertura y Mantenimiento $0
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} className="text-accent-primary" />
                Asesor Personal Bonificado
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                <CheckCircle size={16} className="text-accent-primary" />
                Comisiones Reducidas al 0.4%
              </div>
            </div>
          </div>
          <button 
            onClick={handleContactAdvisor}
            className="btn btn-primary"
            style={{ alignSelf: 'center', padding: '0.75rem 1.5rem', fontWeight: 600 }}
          >
            Obtener Beneficio Valia
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Interactive Table Section */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.35rem', marginBottom: '1.5rem' }}>Tabla Comparativa de Brokers (Argentina 2026)</h2>
        
        {/* Mobile Swipe Hint */}
        <div style={{ 
          display: 'none', 
          textAlign: 'center', 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)', 
          marginBottom: '0.75rem',
          padding: '0.5rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '6px'
        }} className="mobile-swipe-hint">
          ← Deslizá horizontalmente para ver la tabla completa →
        </div>

        <style>{`
          @media (max-width: 800px) {
            .mobile-swipe-hint {
              display: block !important;
            }
          }
        `}</style>

        <div style={{ 
          overflowX: 'auto', 
          width: '100%', 
          borderRadius: 'var(--border-radius-md)', 
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-md)',
          backgroundColor: 'var(--bg-secondary)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '950px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Broker / Plataforma</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Comisión Acciones / CEDEARs</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Comisión ONs (Bonos Corp)</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>Comisión Letras y Bonos</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'right' }}>Remunerada (TNA)</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', width: '25%' }}>Beneficio Exclusivo Valia</th>
                <th style={{ padding: '1rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {brokersData.map((broker) => {
                const isRecommended = broker.recommended;
                return (
                  <tr 
                    key={broker.id} 
                    style={{ 
                      borderBottom: '1px solid var(--border-color)',
                      backgroundColor: isRecommended ? 'rgba(6, 182, 212, 0.04)' : 'transparent',
                      boxShadow: isRecommended ? 'inset 2px 0 0 var(--accent-primary)' : 'none',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isRecommended) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.01)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isRecommended) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    {/* Name */}
                    <td style={{ padding: '1.25rem 1rem', fontWeight: isRecommended ? 600 : 500 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span style={{ color: isRecommended ? 'var(--accent-primary)' : 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          {broker.name}
                          {isRecommended && (
                            <span style={{ 
                              fontSize: '0.65rem', 
                              backgroundColor: 'rgba(6, 182, 212, 0.15)', 
                              color: 'var(--accent-primary)', 
                              padding: '0.15rem 0.4rem', 
                              borderRadius: '4px',
                              fontWeight: 'bold',
                              border: '1px solid rgba(6, 182, 212, 0.3)'
                            }}>
                              ★ Recomendado
                            </span>
                          )}
                        </span>
                      </div>
                    </td>

                    {/* Commission Acciones */}
                    <td style={{ padding: '1.25rem 1rem', color: isRecommended ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {broker.commissionAcciones}
                    </td>

                    {/* Commission ONs */}
                    <td style={{ padding: '1.25rem 1rem', color: isRecommended ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {broker.commissionONs}
                    </td>

                    {/* Commission Letras y Bonos */}
                    <td style={{ padding: '1.25rem 1rem', color: isRecommended ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {broker.commissionLetras || 'No disponible'}
                    </td>

                    {/* TNA Remunerada */}
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'right', fontWeight: 600, color: 'var(--accent-success)' }}>
                      {broker.tnaRemunerada}
                    </td>

                    {/* Valia Exclusive Benefit */}
                    <td style={{ padding: '1.25rem 1rem', fontSize: '0.85rem', color: isRecommended ? 'var(--text-primary)' : 'var(--text-tertiary)', lineHeight: '1.4' }}>
                      {isRecommended ? (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.3rem' }}>
                          <Sparkles size={14} className="text-accent-primary" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                          <span>{broker.benefit}</span>
                        </div>
                      ) : (
                        <span>{broker.benefit}</span>
                      )}
                    </td>

                    {/* CTA Button */}
                    <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                      {isRecommended ? (
                        <button 
                          onClick={handleContactAdvisor}
                          className="btn btn-primary"
                          style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}
                        >
                          {broker.ctaText}
                        </button>
                      ) : (
                        <a 
                          href={broker.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-outline"
                          style={{ 
                            padding: '0.4rem 0.85rem', 
                            fontSize: '0.8rem', 
                            whiteSpace: 'nowrap',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            borderColor: 'var(--border-color)'
                          }}
                        >
                          {broker.ctaText}
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Simulator / Savings Calculator Card */}
      <section style={{ marginBottom: '4rem' }}>
        <div className="taste-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                <Percent size={20} className="text-accent-primary" />
                Simulador de Ahorro y Comisiones en Tiempo Real
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
                Ingresá los montos que estimás operar y mantener en tu cuenta para ver el impacto financiero directo en comisiones y rendimientos mensuales.
              </p>
            </div>

            {/* Toolbar: Switch and Export Actions */}
            <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Tab Switcher */}
              <div style={{ display: 'inline-flex', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '999px', border: '1px solid var(--border-color)', marginRight: '0.5rem' }}>
                <button
                  type="button"
                  className={`btn transition-spring ${activeTab === 'chart' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
                  onClick={() => setActiveTab('chart')}
                >
                  <TrendingUp size={14} />
                  Gráfico
                </button>
                <button
                  type="button"
                  className={`btn transition-spring ${activeTab === 'table' ? 'btn-primary' : 'btn-outline'}`}
                  style={{ padding: '0.35rem 1rem', fontSize: '0.8rem', borderRadius: '999px', border: 'none' }}
                  onClick={() => setActiveTab('table')}
                >
                  <TableProperties size={14} />
                  Tarjetas Detalladas
                </button>
              </div>

              <button 
                onClick={() => {
                  handleShare();
                  setShareCopied(true);
                  setTimeout(() => setShareCopied(false), 2000);
                }}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', borderColor: shareCopied ? 'var(--accent-success)' : 'var(--border-color)' }}
              >
                <Share2 size={14} className={shareCopied ? "text-accent-success" : ""} />
                {shareCopied ? '¡Copiado!' : 'Compartir'}
              </button>
              
              <button 
                onClick={() => {
                  const headers = ['Broker', 'Comisión Acciones', 'Comisión ONs', 'Comisión Letras', 'TNA Remunerada', 'Costo Operación (ARS)', 'Interés Mensual Estimado (ARS)', 'Asesoría'];
                  const rows = simulatorResults.map(b => [
                    b.name,
                    b.commissionAcciones,
                    b.commissionONs,
                    b.commissionLetras,
                    b.tnaRemunerada,
                    b.tradeCostRaw,
                    b.monthlyYieldRaw,
                    b.advisoryCostText
                  ]);
                  const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => typeof val === 'number' ? val.toFixed(2) : `"${val}"`).join(','))].join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.setAttribute("href", url);
                  link.setAttribute("download", `valia_comparador_brokers.csv`);
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Download size={14} />
                CSV
              </button>

              <button 
                onClick={() => window.print()}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Printer size={14} />
                PDF
              </button>

              <button 
                onClick={() => exportChartToPNG('broker-chart-container', 'valia_comparador_brokers.png')}
                className="btn btn-outline transition-spring" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
              >
                <Image size={14} />
                PNG
              </button>
            </div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            <FinancialInput 
              label="Operación Estimada (Compra/Venta Acciones o Cedears)"
              value={tradeAmount}
              onChange={setTradeAmount}
              prefix="$"
              step={50000}
            />
            <FinancialInput 
              label="Capital Líquido Promedio (Cuenta Remunerada / FCI)"
              value={cashBalance}
              onChange={setCashBalance}
              prefix="$"
              step={50000}
            />
          </div>

          {activeTab === 'chart' ? (
            <div className="taste-card chart-container animate-fade-in" id="broker-chart-container" style={{ height: '360px', padding: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.05rem', fontWeight: 700 }}>Comparación de Costos y Rendimientos por Broker</h3>
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={simulatorResults.map(b => ({
                    name: b.id === 'balanz_valia' ? 'Balanz (Valia)' : b.name.split(' ')[0],
                    'Costo Comisión': b.tradeCostRaw,
                    'Interés Mensual': Math.round(b.monthlyYieldRaw)
                  }))}
                  margin={{ top: 15, right: 20, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} />
                  <YAxis stroke="var(--text-secondary)" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={value => [new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)]} />
                  <Legend verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px', fontSize: 12 }} />
                  <Bar name="Costo Comisión ($)" dataKey="Costo Comisión" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  <Bar name="Interés Mensual Líquido ($)" dataKey="Interés Mensual" fill="var(--accent-success)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }} className="animate-fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {simulatorResults.map((broker) => {
                  const isRecommended = broker.recommended;
                  return (
                    <div 
                      key={broker.id}
                      className="taste-card"
                      style={{
                        background: isRecommended ? 'linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, var(--bg-tertiary) 100%)' : 'var(--bg-tertiary)',
                        border: isRecommended ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid var(--border-color)',
                        boxShadow: isRecommended ? 'var(--shadow-glow)' : 'none',
                        padding: '1.25rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                        position: 'relative'
                      }}
                    >
                      {isRecommended && (
                        <span style={{ 
                          position: 'absolute', 
                          top: '0.75rem', 
                          right: '0.75rem', 
                          fontSize: '0.65rem', 
                          backgroundColor: 'var(--accent-primary)', 
                          color: '#090D16', 
                          padding: '0.15rem 0.35rem', 
                          borderRadius: '4px',
                          fontWeight: 'bold'
                        }}>
                          RECOMENDADO
                        </span>
                      )}

                      <span style={{ fontWeight: 'bold', fontSize: '1rem', color: isRecommended ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {broker.name}
                      </span>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Costo Comisión:</span>
                          <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{broker.tradeCostText}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Interés Mensual:</span>
                          <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--accent-success)' }}>+{broker.monthlyYieldText} / mes</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '0.4rem', marginTop: '0.1rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Asesoría idónea:</span>
                          <span style={{ fontWeight: 500, color: isRecommended ? 'var(--accent-primary)' : 'var(--text-tertiary)' }}>
                            {broker.advisoryCostText}
                          </span>
                        </div>
                      </div>

                      {isRecommended && (
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: 'rgba(6, 182, 212, 0.9)', 
                          backgroundColor: 'rgba(6, 182, 212, 0.05)', 
                          padding: '0.5rem', 
                          borderRadius: '4px', 
                          marginTop: '0.25rem',
                          lineHeight: '1.3'
                        }}>
                          Ahorrás en comisiones, optimizás tus saldos líquidos y contás con asesoría bonificada de por vida.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Guía SEO y Contexto Financiero */}
      <section className="taste-card faq-section no-print animate-fade-in" style={{ marginTop: '3rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', animationDelay: '200ms' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Guía Comparativa: ¿Cómo elegir el mejor Broker de Bolsa (ALyC) en Argentina?
        </h2>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          Para operar en el mercado de capitales argentino (comprar acciones, CEDEARs, bonos soberanos u Obligaciones Negociables), es obligatorio abrir una cuenta de custodia en un Agente de Liquidación y Compensación (ALyC), comúnmente llamado broker. A continuación, analizamos los tres pilares esenciales para elegir la plataforma adecuada para tu perfil.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Comisiones Ocultas y Derechos de Mercado</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Al analizar comisiones, debés distinguir entre la tasa neta del broker, los derechos de mercado cobrados por BYMA (típicamente 0.08%) y el IVA sobre la comisión. Algunas plataformas promocionan comisiones bajas pero aplican mínimos por operación o aranceles fijos de mantenimiento de cuenta que licúan los portafolios pequeños.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>La Importancia de un Asesor Idóneo Matriculado</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              Invertir sin asesoramiento expone al inversor a errores de diversificación o descalce de plazos. Un asesor financiero matriculado ante la CNV te ayuda a armar carteras acordes a tu perfil de riesgo. Operar con un canal que bonifique el costo de este asesor asignado (como el beneficio de Valia con Balanz) representa una enorme ventaja económica y de seguridad.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>Rendimiento de los Saldos Líquidos</h3>
            <p style={{ fontSize: '0.85rem', lineHeight: '1.5', margin: 0, color: 'var(--text-secondary)' }}>
              El capital que permanece inactivo entre operaciones sufre de devaluación en economías inflacionarias. Elegir un broker que integre herramientas de cuenta remunerada ágiles o colocaciones automáticas en Fondos Comunes de Inversión (Money Market) con rescate inmediato te permite generar rendimientos diarios sobre tu liquidez operativa.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="taste-card faq-section no-print animate-fade-in" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Preguntas Frecuentes sobre Brokers y Comisiones</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="taste-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BrokerComparator;
