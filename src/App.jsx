import React, { useState, useRef, useEffect } from 'react';
import BuyVsRentCalculator from './modules/BuyVsRent/BuyVsRentCalculator';
import CompoundInterestCalculator from './modules/CompoundInterest/CompoundInterestCalculator';
import SavingsGoalCalculator from './modules/SavingsGoal/SavingsGoalCalculator';
import FireCalculator from './modules/FireCalc/FireCalculator';
import InflationCalculator from './modules/Inflation/InflationCalculator';
import HipotecarioUvaCalculator from './modules/HipotecarioUva/HipotecarioUvaCalculator';
import ComparadorHistorico from './modules/ComparadorHistorico/ComparadorHistorico';
import SueldoNetoCalculator from './modules/SueldoNeto/SueldoNetoCalculator';
import BrokerComparator from './modules/BrokerComparator/BrokerComparator';

import AcercaDe from './pages/AcercaDe';
import Privacidad from './pages/Privacidad';
import Terminos from './pages/Terminos';
import Inicio from './pages/Inicio';
import Asesores from './pages/Asesores';
import { Home, Wrench, Wallet, Info, ChevronLeft, ChevronRight, Users } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('herramientas');
  const [activeTool, setActiveTool] = useState('buy-vs-rent');
  const scrollRef = useRef(null);

  useEffect(() => {
    const handleChangeTab = (e) => {
      if (e.detail === 'asesores') {
        setActiveTab('asesores');
      } else if (e.detail === 'herramientas') {
        setActiveTab('herramientas');
      } else if (e.detail === 'inicio') {
        setActiveTab('inicio');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('change-tab', handleChangeTab);
    return () => window.removeEventListener('change-tab', handleChangeTab);
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Bar */}
      <header style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container header-content">
          {/* Logo/Brand */}
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              fontWeight: 'bold', 
              fontSize: '1.25rem',
              cursor: 'pointer'
            }}
          >
            <Wallet className="text-accent-primary" />
            <span>Valia</span>
          </div>

          {/* Navigation Tabs */}
          <nav className="nav-tabs">
            <button
              onClick={() => setActiveTab('inicio')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'inicio' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'inicio' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Home size={18} />
              Inicio
            </button>
            <button
              onClick={() => setActiveTab('herramientas')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'herramientas' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'herramientas' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Wrench size={18} />
              Herramientas
            </button>
            <button
              onClick={() => setActiveTab('asesores')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'asesores' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'asesores' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Users size={18} />
              Asesores
            </button>
            <button
              onClick={() => setActiveTab('acerca')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: activeTab === 'acerca' ? 'var(--bg-tertiary)' : 'transparent',
                color: activeTab === 'acerca' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--border-radius-sm)',
                cursor: 'pointer',
                fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              <Info size={18} />
              Acerca de
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {activeTab === 'inicio' && (
          <Inicio 
            onSelectTool={(toolId) => {
              setActiveTab('herramientas');
              setActiveTool(toolId);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'herramientas' && (
          <div className="animate-fade-in">
            {/* Tool Selector Carousel Wrapper */}
            <div className="tool-selector-container container" style={{ position: 'relative', paddingLeft: '2.5rem', paddingRight: '2.5rem', display: 'flex', alignItems: 'center' }}>
              
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
                <button
                  className="btn"
                  onClick={() => setActiveTool('buy-vs-rent')}
                  style={{
                    backgroundColor: activeTool === 'buy-vs-rent' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'buy-vs-rent' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'buy-vs-rent' ? '600' : '500',
                    boxShadow: activeTool === 'buy-vs-rent' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  ¿Alquilar o Comprar?
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('compound-interest')}
                  style={{
                    backgroundColor: activeTool === 'compound-interest' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'compound-interest' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'compound-interest' ? '600' : '500',
                    boxShadow: activeTool === 'compound-interest' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Interés Compuesto
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('savings-goal')}
                  style={{
                    backgroundColor: activeTool === 'savings-goal' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'savings-goal' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'savings-goal' ? '600' : '500',
                    boxShadow: activeTool === 'savings-goal' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Objetivo de Ahorro
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('fire')}
                  style={{
                    backgroundColor: activeTool === 'fire' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'fire' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'fire' ? '600' : '500',
                    boxShadow: activeTool === 'fire' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Simulador FIRE
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('inflation')}
                  style={{
                    backgroundColor: activeTool === 'inflation' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'inflation' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'inflation' ? '600' : '500',
                    boxShadow: activeTool === 'inflation' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Inflación Histórica
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('hipotecario-uva')}
                  style={{
                    backgroundColor: activeTool === 'hipotecario-uva' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'hipotecario-uva' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'hipotecario-uva' ? '600' : '500',
                    boxShadow: activeTool === 'hipotecario-uva' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Crédito UVA
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('comparador-historico')}
                  style={{
                    backgroundColor: activeTool === 'comparador-historico' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'comparador-historico' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'comparador-historico' ? '600' : '500',
                    boxShadow: activeTool === 'comparador-historico' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Dólar vs PF vs Merval
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('sueldo-neto')}
                  style={{
                    backgroundColor: activeTool === 'sueldo-neto' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'sueldo-neto' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'sueldo-neto' ? '600' : '500',
                    boxShadow: activeTool === 'sueldo-neto' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Sueldo Neto Freelancer
                </button>
                <button
                  className="btn"
                  onClick={() => setActiveTool('broker-comparator')}
                  style={{
                    backgroundColor: activeTool === 'broker-comparator' ? 'var(--accent-primary)' : 'transparent',
                    color: activeTool === 'broker-comparator' ? '#090D16' : 'var(--text-secondary)',
                    fontWeight: activeTool === 'broker-comparator' ? '600' : '500',
                    boxShadow: activeTool === 'broker-comparator' ? 'var(--shadow-sm)' : 'none',
                  }}
                >
                  Comparador de Brokers
                </button>
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

            {activeTool === 'buy-vs-rent' && <BuyVsRentCalculator />}
            {activeTool === 'compound-interest' && <CompoundInterestCalculator />}
            {activeTool === 'savings-goal' && <SavingsGoalCalculator />}
            {activeTool === 'fire' && <FireCalculator />}
            {activeTool === 'inflation' && <InflationCalculator />}
            {activeTool === 'hipotecario-uva' && <HipotecarioUvaCalculator />}
            {activeTool === 'comparador-historico' && <ComparadorHistorico />}
            {activeTool === 'sueldo-neto' && <SueldoNetoCalculator />}
            {activeTool === 'broker-comparator' && <BrokerComparator onNavigateToAsesores={() => setActiveTab('asesores')} />}
          </div>
        )}

        {activeTab === 'asesores' && <Asesores />}
        {activeTab === 'acerca' && <AcercaDe />}
        {activeTab === 'privacidad' && <Privacidad />}
        {activeTab === 'terminos' && <Terminos />}
      </main>

      {/* Advertisement Banner Placeholder */}
      <div style={{ padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div 
          className="ad-banner"
          style={{ 
            width: '100%', 
            maxWidth: '728px', 
            height: '90px', 
            backgroundColor: 'var(--bg-tertiary)', 
            border: '1px dashed var(--text-tertiary)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            color: 'var(--text-tertiary)', 
            fontSize: '0.875rem', 
            borderRadius: '4px' 
          }}
        >
          <span className="ad-text-desktop">Espacio Publicitario (728x90)</span>
          <span className="ad-text-mobile" style={{ display: 'none' }}>Espacio Publicitario (320x50)</span>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        padding: '2.5rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '1.25rem',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div 
            onClick={() => setActiveTab('inicio')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            <Wallet size={20} className="text-accent-primary" />
            <span>Valia</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Herramientas educativas gratuitas para ayudarte a tomar decisiones financieras informadas. 
            Todos los cálculos se realizan localmente en tu navegador.
          </p>
          <nav style={{ 
            display: 'flex', 
            gap: '1.5rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center',
            margin: '0.5rem 0'
          }}>
            <button 
              onClick={() => {
                setActiveTab('acerca');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'acerca' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Acerca de
            </button>
            <button 
              onClick={() => {
                setActiveTab('privacidad');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'privacidad' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Política de Privacidad
            </button>
            <button 
              onClick={() => {
                setActiveTab('terminos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: activeTab === 'terminos' ? 'var(--accent-primary)' : 'var(--text-secondary)', 
                cursor: 'pointer', 
                fontSize: '0.875rem', 
                fontWeight: 500,
                transition: 'color var(--transition-fast)' 
              }}
            >
              Términos de Uso
            </button>
          </nav>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            &copy; {new Date().getFullYear()} Valia. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
