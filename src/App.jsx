import React, { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { Home, Wrench, Wallet, Info, ChevronLeft, ChevronRight, Users, BookOpen, Book, Code, Sun, Moon } from 'lucide-react';
import HelpModal from './components/HelpModal';
import { trackEvent } from './utils/analytics';
import { calculatorFaqs } from './utils/faqs';

// Dynamic loaders for intent-based preloading
const calculatorLoaders = {
  'buy-vs-rent': () => import('./modules/BuyVsRent/BuyVsRentCalculator'),
  'compound-interest': () => import('./modules/CompoundInterest/CompoundInterestCalculator'),
  'savings-goal': () => import('./modules/SavingsGoal/SavingsGoalCalculator'),
  'fire': () => import('./modules/FireCalc/FireCalculator'),
  'inflation': () => import('./modules/Inflation/InflationCalculator'),
  'hipotecario-uva': () => import('./modules/HipotecarioUva/HipotecarioUvaCalculator'),
  'comparador-historico': () => import('./modules/ComparadorHistorico/ComparadorHistorico'),
  'sueldo-neto': () => import('./modules/SueldoNeto/SueldoNetoCalculator'),
  'broker-comparator': () => import('./modules/BrokerComparator/BrokerComparator'),
  'ganancias': () => import('./modules/Ganancias/GananciasCalculator'),
  'installments-vs-cash': () => import('./modules/InstallmentsVsCash/InstallmentsVsCashCalculator'),
  'savings-comparison': () => import('./modules/SavingsComparison/SavingsComparisonCalculator'),
  'tna-to-tea': () => import('./modules/TnaToTea/TnaToTeaCalculator'),
  'ipc-actualizer': () => import('./modules/IpcActualizer/IpcActualizerCalculator'),
};

const pageLoaders = {
  'acerca': () => import('./pages/AcercaDe'),
  'privacidad': () => import('./pages/Privacidad'),
  'terminos': () => import('./pages/Terminos'),
  'inicio': () => import('./pages/Inicio'),
  'asesores': () => import('./pages/Asesores'),
  'educacion': () => import('./pages/Blog'),
  'glosario': () => import('./pages/Glosario'),
};

// Lazy components instantiated from loaders
const BuyVsRentCalculator = lazy(calculatorLoaders['buy-vs-rent']);
const CompoundInterestCalculator = lazy(calculatorLoaders['compound-interest']);
const SavingsGoalCalculator = lazy(calculatorLoaders['savings-goal']);
const FireCalculator = lazy(calculatorLoaders['fire']);
const InflationCalculator = lazy(calculatorLoaders['inflation']);
const HipotecarioUvaCalculator = lazy(calculatorLoaders['hipotecario-uva']);
const ComparadorHistorico = lazy(calculatorLoaders['comparador-historico']);
const SueldoNetoCalculator = lazy(calculatorLoaders['sueldo-neto']);
const BrokerComparator = lazy(calculatorLoaders['broker-comparator']);
const GananciasCalculator = lazy(calculatorLoaders['ganancias']);
const InstallmentsVsCashCalculator = lazy(calculatorLoaders['installments-vs-cash']);
const SavingsComparisonCalculator = lazy(calculatorLoaders['savings-comparison']);
const TnaToTeaCalculator = lazy(calculatorLoaders['tna-to-tea']);
const IpcActualizerCalculator = lazy(calculatorLoaders['ipc-actualizer']);

const AcercaDe = lazy(pageLoaders['acerca']);
const Privacidad = lazy(pageLoaders['privacidad']);
const Terminos = lazy(pageLoaders['terminos']);
const Inicio = lazy(pageLoaders['inicio']);
const Asesores = lazy(pageLoaders['asesores']);
const Blog = lazy(pageLoaders['educacion']);
const Glosario = lazy(pageLoaders['glosario']);

// Helper functions for dynamic hover preloading
const preloadTool = (toolId) => {
  const loader = calculatorLoaders[toolId];
  if (loader) loader();
};

const preloadPage = (pageId) => {
  const loader = pageLoaders[pageId];
  if (loader) loader();
};

const LoadingState = () => (
  <div className="container" style={{ 
    display: 'flex', 
    flexDirection: 'column',
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh', 
    gap: '1.25rem'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: '3px solid rgba(6, 182, 212, 0.15)',
      borderTopColor: 'var(--accent-primary)',
      animation: 'spin 1s linear infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
    <div style={{ 
      fontSize: '0.9rem', 
      color: 'var(--text-secondary)', 
      fontWeight: 500,
      letterSpacing: '0.05em' 
    }}>
      Cargando simulador...
    </div>
  </div>
);

const toolMap = {
  'comprar-o-alquilar': 'buy-vs-rent',
  'interes-compuesto': 'compound-interest',
  'objetivo-de-ahorro': 'savings-goal',
  'simulador-de-retiro': 'fire',
  'simulador-fire': 'fire',
  'inflacion-historica': 'inflation',
  'hipotecario-uva': 'hipotecario-uva',
  'comparador-historico': 'comparador-historico',
  'sueldo-neto': 'sueldo-neto',
  'ganancias': 'ganancias',
  'comparador-de-brokers': 'broker-comparator',
  'cuotas-o-efectivo': 'installments-vs-cash',
  'comparador-de-ahorro': 'savings-comparison',
  'conversor-tasa': 'tna-to-tea',
  'actualizador-ipc': 'ipc-actualizer'
};

const toolMapReverse = {
  'buy-vs-rent': 'comprar-o-alquilar',
  'compound-interest': 'interes-compuesto',
  'savings-goal': 'objetivo-de-ahorro',
  'fire': 'simulador-de-retiro',
  'inflation': 'inflacion-historica',
  'hipotecario-uva': 'hipotecario-uva',
  'comparador-historico': 'comparador-historico',
  'sueldo-neto': 'sueldo-neto',
  'ganancias': 'ganancias',
  'broker-comparator': 'comparador-de-brokers',
  'installments-vs-cash': 'cuotas-o-efectivo',
  'savings-comparison': 'comparador-de-ahorro',
  'tna-to-tea': 'conversor-tasa',
  'ipc-actualizer': 'actualizador-ipc'
};

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('seccion') || params.get('tab');
    const validTabs = ['inicio', 'herramientas', 'educacion', 'glosario', 'asesores', 'acerca', 'privacidad', 'terminos'];
    if (tab && validTabs.includes(tab)) return tab;
    if (params.get('herramienta') || params.get('tool')) return 'herramientas';
    return 'herramientas';
  });
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const isEmbedded = new URLSearchParams(window.location.search).get('embed') === 'true';

  const [isCopied, setIsCopied] = useState(false);

  const [activeTool, setActiveTool] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    const tool = params.get('herramienta') || params.get('tool');
    const validTools = [
      'buy-vs-rent', 
      'compound-interest', 
      'savings-goal', 
      'fire', 
      'inflation', 
      'hipotecario-uva', 
      'comparador-historico', 
      'sueldo-neto', 
      'ganancias', 
      'broker-comparator',
      'installments-vs-cash',
      'savings-comparison',
      'tna-to-tea',
      'ipc-actualizer'
    ];
    if (tool) {
      if (validTools.includes(tool)) return tool;
      if (toolMap[tool]) return toolMap[tool];
    }
    return 'compound-interest';
  });
  const scrollRef = useRef(null);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('valia-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('valia-theme', theme);
    if (isEmbedded) {
      document.documentElement.setAttribute('data-embed', 'true');
    } else {
      document.documentElement.removeAttribute('data-embed');
    }
  }, [theme, isEmbedded]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      trackEvent('theme_toggled', { theme: next });
      return next;
    });
  };

  // Global Event Listeners for Automatic Tracking (Print, Clipboard, Open Tool, Downloads)
  useEffect(() => {
    // 1. Intercept printing (PDF Export)
    const originalPrint = window.print;
    window.print = () => {
      trackEvent('report_exported', { calculatorId: activeTool, format: 'pdf' });
      originalPrint();
    };

    // 2. Intercept Clipboard Copy (Sharing & Embeds)
    const originalWriteText = navigator.clipboard.writeText;
    navigator.clipboard.writeText = (text) => {
      if (text.includes('seccion=herramientas')) {
        if (text.includes('embed=true')) {
          trackEvent('widget_embedded', { calculatorId: activeTool });
        } else {
          trackEvent('link_shared', { calculatorId: activeTool });
        }
      }
      return originalWriteText(text);
    };

    // 3. Track Calculator opened
    if (activeTab === 'herramientas' && activeTool) {
      trackEvent('calculator_opened', { calculatorId: activeTool });
    }

    // 4. Intercept CSV and PNG programmatic downloads
    const handleGlobalClick = (e) => {
      let target = e.target;
      while (target && target !== document.body) {
        if (target.tagName === 'A') {
          const downloadAttr = target.getAttribute('download');
          if (downloadAttr) {
            if (downloadAttr.endsWith('.csv')) {
              trackEvent('report_exported', { calculatorId: activeTool, format: 'csv' });
            } else if (downloadAttr.endsWith('.png')) {
              trackEvent('report_exported', { calculatorId: activeTool, format: 'png' });
            }
          }
          break;
        }
        target = target.parentNode;
      }
    };
    document.addEventListener('click', handleGlobalClick);

    return () => {
      window.print = originalPrint;
      navigator.clipboard.writeText = originalWriteText;
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [activeTab, activeTool]);

  // 4. Track input calculations (debounced)
  useEffect(() => {
    if (activeTab !== 'herramientas' || !activeTool) return;

    let timeoutId;
    const handleInput = (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('input-field')) {
        const fieldName = e.target.name || e.target.placeholder || 'input';
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          trackEvent('calculator_calculated', { 
            calculatorId: activeTool,
            fieldName: fieldName
          });
        }, 2000); // 2 second debounce to prevent spamming while typing
      }
    };

    document.addEventListener('input', handleInput);
    return () => {
      document.removeEventListener('input', handleInput);
      clearTimeout(timeoutId);
    };
  }, [activeTab, activeTool]);

  // Sincronizar URL con la pestaña y herramienta activa en tiempo real (pushState) en español
  useEffect(() => {
    const url = new URL(window.location.href);
    const currentTab = url.searchParams.get('seccion') || url.searchParams.get('tab');
    const currentTool = url.searchParams.get('herramienta') || url.searchParams.get('tool');

    // uses global toolMapReverse constant

    const targetToolSpanish = toolMapReverse[activeTool] || activeTool;

    // Solo actualizar la historia si hay un cambio real con respecto a la URL actual
    const tabChanged = currentTab !== activeTab;
    const toolChanged = activeTab === 'herramientas' && currentTool !== targetToolSpanish;
    const toolRemoved = activeTab !== 'herramientas' && currentTool !== null;

    if (tabChanged || toolChanged || toolRemoved) {
      // Limpiar parámetros antiguos en inglés
      url.searchParams.delete('tab');
      url.searchParams.delete('tool');

      url.searchParams.set('seccion', activeTab);
      if (activeTab === 'herramientas') {
        url.searchParams.set('herramienta', targetToolSpanish);
      } else {
        url.searchParams.delete('herramienta');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, [activeTab, activeTool]);



  // Escuchar el evento popstate para soportar navegación con botones Atrás/Adelante del navegador en español e inglés
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get('seccion') || params.get('tab');
      const validTabs = ['inicio', 'herramientas', 'educacion', 'glosario', 'asesores', 'acerca', 'privacidad', 'terminos'];
      
      let targetTab = 'herramientas';
      if (tab && validTabs.includes(tab)) {
        targetTab = tab;
      } else if (params.get('herramienta') || params.get('tool')) {
        targetTab = 'herramientas';
      }
      
      setActiveTab(targetTab);

      const tool = params.get('herramienta') || params.get('tool');
      const validTools = [
        'buy-vs-rent', 
        'compound-interest', 
        'savings-goal', 
        'fire', 
        'inflation', 
        'hipotecario-uva', 
        'comparador-historico', 
        'sueldo-neto', 
        'ganancias', 
        'broker-comparator',
        'installments-vs-cash',
        'savings-comparison',
        'tna-to-tea',
        'ipc-actualizer'
      ];
      if (tool) {
        if (validTools.includes(tool)) {
          setActiveTool(tool);
        } else {
          if (toolMap[tool]) {
            setActiveTool(toolMap[tool]);
          } else {
            setActiveTool('compound-interest');
          }
        }
      } else {
        setActiveTool('compound-interest');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);


  // Actualizar metadatos (Título de pestaña y descripción) para SEO dinámico
  useEffect(() => {
    let title = "Valia | Planificación y Simuladores Financieros";
    let desc = "Simuladores financieros gratuitos e independientes para la planificación y simulación de finanzas personales. 100% privados y locales.";

    if (activeTab === 'herramientas') {
      const toolTitles = {
        'buy-vs-rent': "Simulador de Comprar o Alquilar Vivienda | Valia",
        'compound-interest': "Calculadora de Interés Compuesto y Ahorro | Valia",
        'savings-goal': "Calculadora de Objetivo de Ahorro y Metas | Valia",
        'fire': "Simulador de Retiro y Jubilación | Valia",
        'inflation': "Calculadora de Inflación Histórica | Valia",
        'hipotecario-uva': "Simulador de Crédito Hipotecario UVA | Valia",
        'comparador-historico': "Comparador Dólar vs Plazo Fijo vs Merval | Valia",
        'sueldo-neto': "Calculadora de Sueldo Neto Freelancer | Valia",
        'ganancias': "Simulador de Impuesto a las Ganancias | Valia",
        'broker-comparator': "Comparador de Brokers de Inversión | Valia",
        'installments-vs-cash': "Calculadora de Compras en Cuotas vs Efectivo | Valia",
        'savings-comparison': "Comparador de Tasas: Plazo Fijo UVA vs Tradicional vs Cauciones | Valia",
        'tna-to-tea': "Convertidor de Tasas: TNA a TEA y TEM | Valia",
        'ipc-actualizer': "Actualizador de Pesos por IPC INDEC | Valia"
      };

      const toolDescs = {
        'buy-vs-rent': "Compara financieramente si te conviene alquilar una propiedad e invertir la diferencia o comprarla con un crédito hipotecario a largo plazo.",
        'compound-interest': "Proyecta el crecimiento exponencial de tus ahorros e inversiones mensuales aplicando la fórmula de interés compuesto con aportes.",
        'savings-goal': "Calcula exactamente cuánto debés ahorrar e invertir por mes para alcanzar una meta financiera (comprar un auto, viajar, etc.) en un plazo determinado.",
        'fire': "Pon a prueba tu estrategia de retiro haciendo backtesting contra 99 años de datos históricos del S&P 500 y bonos.",
        'inflation': "Visualiza la pérdida de poder adquisitivo del dinero a lo largo del tiempo con registros oficiales e históricos desde 1635.",
        'hipotecario-uva': "Simula créditos hipotecarios UVA vs tasa fija, comparando el sistema Francés y Alemán con la inflación de Argentina.",
        'comparador-historico': "Compara el rendimiento histórico real en pesos de ahorrar en dólares blue, plazo fijo tradicional, plazo fijo UVA y el Merval desde 2015.",
        'sueldo-neto': "Calcula tus ingresos netos en mano estimando la cuota del Monotributo, comisiones de cobro e Ingresos Brutos.",
        'ganancias': "Calcula la retención del Impuesto a las Ganancias sobre tu sueldo (4° categoría) con las deducciones y escalas oficiales.",
        'broker-comparator': "Compara comisiones, cuenta remunerada (TNA) y beneficios exclusivos de Balanz y otras plataformas en tiempo real.",
        'installments-vs-cash': "Simula si te conviene pagar en cuotas fijas o al contado con descuento evaluando inflación e inversiones.",
        'savings-comparison': "Compara el rendimiento y la ganancia real de tus pesos entre Plazo Fijo UVA, Plazo Fijo Tradicional y Cauciones Bursátiles en base a proyecciones de inflación.",
        'tna-to-tea': "Calculá la tasa de interés efectiva anual (TEA) y mensual (TEM) a partir de una TNA según la capitalización de intereses.",
        'ipc-actualizer': "Ajustá montos de dinero del pasado según la inflación oficial del INDEC (IPC) en Argentina para calcular la pérdida de poder de compra."
      };

      title = toolTitles[activeTool] || title;
      desc = toolDescs[activeTool] || desc;
    } else if (activeTab === 'educacion') {
      title = "Educación Financiera y Guías de Inversión | Valia";
      desc = "Artículos prácticos sobre inversiones, interés compuesto, la regla del 4%, créditos UVA y optimización fiscal en Argentina.";
    } else if (activeTab === 'glosario') {
      title = "Glosario de Términos Financieros | Valia";
      desc = "Diccionario financiero: CEDEAR, Obligaciones Negociables, Cauciones, TNA, TEA, UVA, CER y otros conceptos clave explicados de forma sencilla.";
    } else if (activeTab === 'asesores') {
      title = "Asesores Financieros Asociados | Valia";
      desc = "Contactá con un asesor financiero idóneo matriculado ante la CNV para estructurar tu cartera de inversión y operar en el mercado local.";
    } else if (activeTab === 'acerca') {
      title = "Acerca de Valia | Portal Educativo Financiero";
      desc = "Conocé más sobre nuestro portal educativo independiente de finanzas personales, nuestros compromisos de confianza y rigor matemático.";
    } else if (activeTab === 'privacidad') {
      title = "Política de Privacidad | Valia";
      desc = "Leé nuestra política de privacidad: procesamiento local de datos financieros en el cliente y sin rastreo de cookies personales.";
    } else if (activeTab === 'terminos') {
      title = "Términos de Uso | Valia";
      desc = "Términos y condiciones de uso de las herramientas educativas e informativas y exclusión de asesoramiento financiero.";
    }

    document.title = title;
    const updateTag = (selector, val) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', val);
    };
    updateTag('meta[name="description"]', desc);
    updateTag('meta[property="og:title"]', title);
    updateTag('meta[property="og:description"]', desc);
    updateTag('meta[property="twitter:title"]', title);
    updateTag('meta[property="twitter:description"]', desc);

    // Dynamic Canonical Link Injection
    let canonicalUrl = `${window.location.origin}${window.location.pathname}`;
    if (activeTab === 'herramientas' && activeTool) {
      const toolUrlParam = toolMapReverse[activeTool] || activeTool;
      canonicalUrl += `?seccion=herramientas&herramienta=${toolUrlParam}`;
    } else if (activeTab !== 'inicio') {
      canonicalUrl += `?seccion=${activeTab}`;
    }
    
    let linkEl = document.querySelector('link[rel="canonical"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'canonical';
      document.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', canonicalUrl);

    // Dynamic JSON-LD Structured Data script injection for FinancialApplication
    let jsonLd = null;
    if (activeTab === 'herramientas' && activeTool) {
      const toolUrlParam = toolMapReverse[activeTool] || activeTool;
      const toolCanonicalUrl = `${window.location.origin}${window.location.pathname}?seccion=herramientas&herramienta=${toolUrlParam}`;

      jsonLd = {
        "@context": "https://schema.org",
        "@type": "FinancialApplication",
        "name": title,
        "description": desc,
        "url": toolCanonicalUrl,
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "countriesSupported": "AR",
        "offers": {
          "@type": "Offer",
          "price": "0.00",
          "priceCurrency": "ARS"
        }
      };
    }

    let scriptEl = document.getElementById('tool-jsonld');
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'tool-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else {
      if (scriptEl) {
        scriptEl.remove();
      }
    }

    // Dynamic JSON-LD Structured Data script injection for FAQPage
    let faqJsonLd = null;
    if (activeTab === 'herramientas' && activeTool && calculatorFaqs[activeTool]) {
      faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": calculatorFaqs[activeTool].map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };
    }

    let faqScriptEl = document.getElementById('tool-faq-jsonld');
    if (faqJsonLd) {
      if (!faqScriptEl) {
        faqScriptEl = document.createElement('script');
        faqScriptEl.id = 'tool-faq-jsonld';
        faqScriptEl.type = 'application/ld+json';
        document.head.appendChild(faqScriptEl);
      }
      faqScriptEl.textContent = JSON.stringify(faqJsonLd);
    } else {
      if (faqScriptEl) {
        faqScriptEl.remove();
      }
    }
  }, [activeTab, activeTool]);

  useEffect(() => {
    const handleChangeTab = (e) => {
      if (e.detail === 'asesores') {
        setActiveTab('asesores');
      } else if (e.detail === 'herramientas') {
        setActiveTab('herramientas');
      } else if (e.detail === 'inicio') {
        setActiveTab('inicio');
      } else if (e.detail === 'educacion') {
        setActiveTab('educacion');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('change-tab', handleChangeTab);
    return () => window.removeEventListener('change-tab', handleChangeTab);
  }, []);

  // El MutationObserver temporal para ocultar los botones de descarga ha sido removido para reactivar la descarga de gráficos.

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getTabStyle = (tabName) => {
    const isActive = activeTab === tabName;
    return {
      display: 'flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.45rem 0.85rem',
      backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
      border: '1px solid',
      borderColor: isActive ? 'rgba(6, 182, 212, 0.25)' : 'transparent',
      borderRadius: 'var(--border-radius-sm)',
      cursor: 'pointer',
      fontWeight: 500,
      fontSize: '0.875rem',
      transition: 'all 0.15s ease-in-out'
    };
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      {!isEmbedded && (
        <header style={{ 
          backgroundColor: 'rgba(15, 23, 42, 0.85)', 
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(51, 65, 85, 0.4)',
        padding: '0.75rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
      }}>
        <div className="container header-content">
          {/* Logo/Brand */}
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column',
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Wallet className="text-accent-primary" size={20} />
              <span style={{ fontWeight: '700', fontSize: '1.25rem', letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>Valia</span>
            </div>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: '600', marginTop: '0.15rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Portal Financiero Educativo
            </span>
          </div>

          {/* Navigation & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', maxWidth: '100%', justifyContent: 'center' }}>
            <nav className="nav-tabs">
              <a 
                href="?seccion=inicio" 
                onClick={(e) => { e.preventDefault(); setActiveTab('inicio'); }} 
                style={getTabStyle('inicio')}
                onMouseEnter={() => preloadPage('inicio')}
                onFocus={() => preloadPage('inicio')}
              >
                <Home size={16} />
                Inicio
              </a>
              <a 
                href="?seccion=herramientas" 
                onClick={(e) => { e.preventDefault(); setActiveTab('herramientas'); }} 
                style={getTabStyle('herramientas')}
                onMouseEnter={() => {
                  preloadPage('inicio'); // Preload inicio if not loaded
                  preloadTool(activeTool); // Preload active calculator
                }}
                onFocus={() => {
                  preloadPage('inicio');
                  preloadTool(activeTool);
                }}
              >
                <Wrench size={16} />
                Herramientas
              </a>
              <a 
                href="?seccion=educacion" 
                onClick={(e) => { e.preventDefault(); setActiveTab('educacion'); }} 
                style={getTabStyle('educacion')}
                onMouseEnter={() => preloadPage('educacion')}
                onFocus={() => preloadPage('educacion')}
              >
                <BookOpen size={16} />
                Educación
              </a>
              <a 
                href="?seccion=glosario" 
                onClick={(e) => { e.preventDefault(); setActiveTab('glosario'); }} 
                style={getTabStyle('glosario')}
                onMouseEnter={() => preloadPage('glosario')}
                onFocus={() => preloadPage('glosario')}
              >
                <Book size={16} />
                Glosario
              </a>
              <a 
                href="?seccion=asesores" 
                onClick={(e) => { e.preventDefault(); setActiveTab('asesores'); }} 
                style={getTabStyle('asesores')}
                onMouseEnter={() => preloadPage('asesores')}
                onFocus={() => preloadPage('asesores')}
              >
                <Users size={16} />
                Asesores
              </a>
              <a 
                href="?seccion=acerca" 
                onClick={(e) => { e.preventDefault(); setActiveTab('acerca'); }} 
                style={getTabStyle('acerca')}
                onMouseEnter={() => preloadPage('acerca')}
                onFocus={() => preloadPage('acerca')}
              >
                <Info size={16} />
                Acerca de
              </a>
            </nav>

            <button
              onClick={toggleTheme}
              className="btn btn-outline"
              title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                width: '38px',
                height: '38px',
                padding: 0,
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: isEmbedded ? '0.5rem 0' : '2rem 0' }}>
        <Suspense fallback={<LoadingState />}>
          <div key={activeTab} className="animate-fade-in">
          {activeTab === 'inicio' && (
            <Inicio 
              onSelectTool={(toolId) => {
                setActiveTab('herramientas');
                setActiveTool(toolId);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              preloadTool={preloadTool}
            />
          )}

          {activeTab === 'herramientas' && (
            <div>
              {/* Tool Selector Carousel Wrapper */}
              {!isEmbedded && (
                <div className="tool-selector-container container" style={{ position: 'relative', paddingLeft: '2.5rem', paddingRight: '2.5rem', display: 'flex', alignItems: 'center' }}>
                
                {/* Left Fade Edge */}
                <div style={{
                  position: 'absolute',
                  left: '2.5rem',
                  top: '6px',
                  bottom: '6px',
                  width: '40px',
                  background: 'linear-gradient(to right, var(--bg-primary) 0%, transparent 100%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  borderRadius: 'var(--border-radius-lg) 0 0 var(--border-radius-lg)'
                }} />

                {/* Right Fade Edge */}
                <div style={{
                  position: 'absolute',
                  right: '2.5rem',
                  top: '6px',
                  bottom: '6px',
                  width: '40px',
                  background: 'linear-gradient(to left, var(--bg-primary) 0%, transparent 100%)',
                  pointerEvents: 'none',
                  zIndex: 5,
                  borderRadius: '0 var(--border-radius-lg) var(--border-radius-lg) 0'
                }} />

                {/* Left Slide Button */}
                <button 
                  onClick={() => scroll('left')}
                  className="scroll-btn scroll-btn-left"
                  style={{
                    position: 'absolute',
                    left: '0.5rem',
                    zIndex: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronLeft size={20} />
                </button>

                <div 
                  ref={scrollRef}
                  className="tool-selector-scroll"
                  style={{
                    scrollBehavior: 'smooth',
                    width: '100%'
                  }}
                >
                  <a
                    href="?seccion=herramientas&herramienta=sueldo-neto"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('sueldo-neto'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'sueldo-neto' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'sueldo-neto' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'sueldo-neto' ? '600' : '500',
                      boxShadow: activeTool === 'sueldo-neto' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Sueldo Neto Freelancer
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=ganancias"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('ganancias'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'ganancias' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'ganancias' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'ganancias' ? '600' : '500',
                      boxShadow: activeTool === 'ganancias' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Simulador Ganancias
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=cuotas-o-efectivo"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('installments-vs-cash'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'installments-vs-cash' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'installments-vs-cash' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'installments-vs-cash' ? '600' : '500',
                      boxShadow: activeTool === 'installments-vs-cash' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    ¿Cuotas o Efectivo?
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=interes-compuesto"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('compound-interest'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'compound-interest' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'compound-interest' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'compound-interest' ? '600' : '500',
                      boxShadow: activeTool === 'compound-interest' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Interés Compuesto
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=comparador-de-ahorro"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('savings-comparison'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'savings-comparison' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'savings-comparison' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'savings-comparison' ? '600' : '500',
                      boxShadow: activeTool === 'savings-comparison' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    ¿UVA, Plazo Fijo o Caución?
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=hipotecario-uva"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('hipotecario-uva'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'hipotecario-uva' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'hipotecario-uva' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'hipotecario-uva' ? '600' : '500',
                      boxShadow: activeTool === 'hipotecario-uva' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Crédito UVA
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=conversor-tasa"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('tna-to-tea'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'tna-to-tea' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'tna-to-tea' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'tna-to-tea' ? '600' : '500',
                      boxShadow: activeTool === 'tna-to-tea' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Conversor TNA a TEA
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=actualizador-ipc"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('ipc-actualizer'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'ipc-actualizer' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'ipc-actualizer' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'ipc-actualizer' ? '600' : '500',
                      boxShadow: activeTool === 'ipc-actualizer' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Actualizador IPC (INDEC)
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=comprar-o-alquilar"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('buy-vs-rent'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'buy-vs-rent' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'buy-vs-rent' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'buy-vs-rent' ? '600' : '500',
                      boxShadow: activeTool === 'buy-vs-rent' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    ¿Alquilar o Comprar?
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=comparador-historico"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('comparador-historico'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'comparador-historico' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'comparador-historico' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'comparador-historico' ? '600' : '500',
                      boxShadow: activeTool === 'comparador-historico' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Dólar vs PF vs Merval
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=objetivo-de-ahorro"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('savings-goal'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'savings-goal' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'savings-goal' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'savings-goal' ? '600' : '500',
                      boxShadow: activeTool === 'savings-goal' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Objetivo de Ahorro
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=inflacion-historica"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('inflation'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'inflation' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'inflation' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'inflation' ? '600' : '500',
                      boxShadow: activeTool === 'inflation' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Inflación Histórica
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=simulador-de-retiro"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('fire'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'fire' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'fire' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'fire' ? '600' : '500',
                      boxShadow: activeTool === 'fire' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Simulador de Retiro
                  </a>
                  <a
                    href="?seccion=herramientas&herramienta=comparador-de-brokers"
                    className="btn"
                    onClick={(e) => { e.preventDefault(); setActiveTool('broker-comparator'); }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                      backgroundColor: activeTool === 'broker-comparator' ? 'var(--accent-primary)' : 'transparent',
                      color: activeTool === 'broker-comparator' ? '#090D16' : 'var(--text-secondary)',
                      fontWeight: activeTool === 'broker-comparator' ? '600' : '500',
                      boxShadow: activeTool === 'broker-comparator' ? 'var(--shadow-glow), var(--shadow-sm)' : 'none',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    Comparador de Brokers
                  </a>
                </div>

                {/* Right Slide Button */}
                <button 
                  onClick={() => scroll('right')}
                  className="scroll-btn scroll-btn-right"
                  style={{
                    position: 'absolute',
                    right: '0.5rem',
                    zIndex: 10,
                    backgroundColor: 'var(--bg-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              )}

              <div key={activeTool} className="animate-fade-in">
                {activeTool === 'buy-vs-rent' && <BuyVsRentCalculator />}
                {activeTool === 'compound-interest' && <CompoundInterestCalculator />}
                {activeTool === 'savings-goal' && <SavingsGoalCalculator />}
                {activeTool === 'fire' && <FireCalculator />}
                {activeTool === 'inflation' && <InflationCalculator />}
                {activeTool === 'hipotecario-uva' && <HipotecarioUvaCalculator />}
                {activeTool === 'comparador-historico' && <ComparadorHistorico />}
                {activeTool === 'sueldo-neto' && <SueldoNetoCalculator />}
                {activeTool === 'ganancias' && <GananciasCalculator />}
                {activeTool === 'broker-comparator' && <BrokerComparator onNavigateToAsesores={() => setActiveTab('asesores')} />}
                {activeTool === 'installments-vs-cash' && <InstallmentsVsCashCalculator />}
                {activeTool === 'savings-comparison' && <SavingsComparisonCalculator />}
                {activeTool === 'tna-to-tea' && <TnaToTeaCalculator />}
                {activeTool === 'ipc-actualizer' && <IpcActualizerCalculator />}
              </div>

              {!isEmbedded && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem', marginBottom: '1.5rem' }}>
                  <button 
                    onClick={() => setIsEmbedModalOpen(true)}
                    className="btn btn-outline"
                    style={{ 
                      fontSize: '0.875rem', 
                      padding: '0.5rem 1.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderColor: 'rgba(6, 182, 212, 0.25)',
                      color: 'var(--accent-primary)',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    <Code size={16} />
                    Incrustar esta calculadora en tu web
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'asesores' && <Asesores />}
          {activeTab === 'educacion' && <Blog />}
          {activeTab === 'glosario' && <Glosario />}
          {activeTab === 'acerca' && <AcercaDe />}
          {activeTab === 'privacidad' && <Privacidad />}
          {activeTab === 'terminos' && <Terminos />}
        </div>
        </Suspense>
      </main>



      {/* Footer */}
      {!isEmbedded && (
        <footer style={{ 
          backgroundColor: 'var(--bg-secondary)', 
          borderTop: '1px solid var(--border-color)', 
          padding: '3.5rem 0 2rem 0',
          marginTop: 'auto'
        }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '2.5rem'
        }}>
          {/* 4-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {/* Col 1: Brand Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div 
                onClick={() => {
                  setActiveTab('inicio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  fontWeight: '700',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  color: 'var(--text-primary)'
                }}
              >
                <Wallet size={20} className="text-accent-primary" />
                <span>Valia</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                Herramientas educativas gratuitas para simulación y planificación patrimonial autónoma. Privacidad garantizada por diseño local.
              </p>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem', 
                fontSize: '0.75rem', 
                color: 'var(--accent-success)',
                fontWeight: 600,
                marginTop: '0.25rem'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-success)' }} />
                Seguridad Local Auditada
              </div>
            </div>

            {/* Col 2: Simuladores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Simuladores
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Sueldo Neto Freelancer', tool: 'sueldo-neto', path: 'sueldo-neto' },
                  { label: 'Simulador de Ganancias', tool: 'ganancias', path: 'ganancias' },
                  { label: '¿Cuotas o Efectivo?', tool: 'installments-vs-cash', path: 'cuotas-o-efectivo' },
                  { label: 'Interés Compuesto', tool: 'compound-interest', path: 'interes-compuesto' },
                  { label: '¿UVA, Plazo Fijo o Caución?', tool: 'savings-comparison', path: 'comparador-de-ahorro' },
                  { label: 'Crédito Hipotecario UVA', tool: 'hipotecario-uva', path: 'hipotecario-uva' },
                  { label: 'Conversor TNA a TEA', tool: 'tna-to-tea', path: 'conversor-tasa' },
                  { label: 'Actualizador IPC (INDEC)', tool: 'ipc-actualizer', path: 'actualizador-ipc' },
                  { label: '¿Comprar o Alquilar?', tool: 'buy-vs-rent', path: 'comprar-o-alquilar' },
                  { label: 'Dólar vs PF vs Merval', tool: 'comparador-historico', path: 'comparador-historico' },
                  { label: 'Objetivo de Ahorro', tool: 'savings-goal', path: 'objetivo-de-ahorro' },
                  { label: 'Inflación Histórica', tool: 'inflation', path: 'inflacion-historica' },
                  { label: 'Simulador de Retiro', tool: 'fire', path: 'simulador-de-retiro' },
                  { label: 'Comparador de Brokers', tool: 'broker-comparator', path: 'comparador-de-brokers' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`?seccion=herramientas&herramienta=${item.path}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab('herramientas');
                      setActiveTool(item.tool);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      color: activeTool === item.tool && activeTab === 'herramientas' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 3: Recursos */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Recursos
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Educación Financiera', tab: 'educacion' },
                  { label: 'Glosario de Términos', tab: 'glosario' },
                  { label: 'Acerca de Valia', tab: 'acerca' },
                  { label: 'Contacto de Soporte', tab: 'acerca' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`?seccion=${item.tab}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      color: activeTab === item.tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Col 4: Seguridad & Legal */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Transparencia & Legal
              </strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                {[
                  { label: 'Términos de Uso', tab: 'terminos' },
                  { label: 'Política de Privacidad', tab: 'privacidad' },
                  { label: 'Fórmulas y Metodologías', tab: 'acerca' }
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`?seccion=${item.tab}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    style={{
                      color: activeTab === item.tab ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      textDecoration: 'none',
                      transition: 'color var(--transition-fast)'
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Legal Disclaimer & Copyright */}
          <div style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', maxWidth: '100%', margin: 0, lineHeight: '1.5', textAlign: 'justify' }}>
              <strong>Aviso Legal y Advertencia de Riesgo:</strong> Valia es una plataforma de contenido puramente educativo e ilustrativo. 
              Los cálculos, proyecciones, datos históricos y resultados simulados no constituyen asesoramiento financiero, recomendación de inversión, 
              oferta de adquisición o venta de valores, ni consultoría fiscal o legal. El rendimiento pasado de los activos financieros 
              no garantiza ni predice retornos futuros. Cada usuario es plenamente responsable de evaluar los riesgos y beneficios de sus decisiones 
              patrimoniales. Se recomienda la consulta con asesores financieros idóneos matriculados ante la Comisión Nacional de Valores (CNV) antes de operar.
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '0.5rem',
              fontSize: '0.75rem', 
              color: 'var(--text-tertiary)',
              marginTop: '0.25rem'
            }}>
              <div>
                &copy; {new Date().getFullYear()} Valia. Todos los derechos reservados.
              </div>
              <div style={{ color: 'var(--text-tertiary)' }}>
                Desarrollado con fines educativos 🇦🇷
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}

      <HelpModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        title="Incrustar calculadora en tu web"
      >
        <p style={{ fontSize: '0.9rem', marginBottom: '1.125rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Copia y pega este código HTML en tu blog, portal o sitio web para ofrecer esta calculadora interactiva a tus lectores de forma 100% gratuita y privada.
        </p>
        
        <div style={{ 
          position: 'relative', 
          backgroundColor: 'rgba(0, 0, 0, 0.3)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--border-radius-sm)',
          padding: '1rem',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          color: 'var(--accent-primary)',
          wordBreak: 'break-all',
          whiteSpace: 'pre-wrap',
          marginBottom: '1.5rem'
        }}>
          {`<iframe src="${window.location.origin}${window.location.pathname}?seccion=herramientas&herramienta=${toolMapReverse[activeTool] || activeTool}&embed=true" width="100%" height="800" style="border:none; border-radius:12px; background:transparent;" allowtransparency="true"></iframe>`}
        </div>

        <button
          onClick={() => {
            const code = `<iframe src="${window.location.origin}${window.location.pathname}?seccion=herramientas&herramienta=${toolMapReverse[activeTool] || activeTool}&embed=true" width="100%" height="800" style="border:none; border-radius:12px; background:transparent;" allowtransparency="true"></iframe>`;
            navigator.clipboard.writeText(code)
              .then(() => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
              })
              .catch(err => console.error('Error al copiar: ', err));
          }}
          className="btn"
          style={{ 
            width: '100%', 
            justifyContent: 'center',
            backgroundColor: isCopied ? 'var(--accent-success)' : 'var(--accent-primary)',
            color: isCopied ? '#FFFFFF' : 'var(--text-btn-primary)',
            fontWeight: 600,
            transition: 'all 0.3s ease'
          }}
        >
          {isCopied ? '¡Código Copiado al Portapapeles! ✓' : 'Copiar Código de Inserción'}
        </button>
      </HelpModal>
    </div>
  );
}

export default App;
