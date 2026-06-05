import React, { useState } from 'react';
import BuyVsRentCalculator from './modules/BuyVsRent/BuyVsRentCalculator';
import CompoundInterestCalculator from './modules/CompoundInterest/CompoundInterestCalculator';
import SavingsGoalCalculator from './modules/SavingsGoal/SavingsGoalCalculator';
import FireCalculator from './modules/FireCalc/FireCalculator';
import InflationCalculator from './modules/Inflation/InflationCalculator';
import { Home, Wrench, Wallet } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('herramientas');
  const [activeTool, setActiveTool] = useState('buy-vs-rent');

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 'bold', fontSize: '1.25rem' }}>
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
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        {activeTab === 'inicio' && (
          <div className="container animate-fade-in" style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ marginBottom: '1rem' }}>Bienvenido a Valia</h1>
            <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Tu plataforma integral para tomar decisiones financieras inteligentes. 
              Navega a la pestaña de <strong>Herramientas</strong> para empezar.
            </p>
            <button 
              className="btn btn-primary" 
              style={{ marginTop: '2rem' }}
              onClick={() => setActiveTab('herramientas')}
            >
              Ver Herramientas
            </button>
          </div>
        )}

        {activeTab === 'herramientas' && (
          <div className="animate-fade-in">
            {/* Tool Selector */}
            <div className="tool-selector-container container">
              <div className="tool-selector-scroll">
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
              </div>
            </div>

            {activeTool === 'buy-vs-rent' && <BuyVsRentCalculator />}
            {activeTool === 'compound-interest' && <CompoundInterestCalculator />}
            {activeTool === 'savings-goal' && <SavingsGoalCalculator />}
            {activeTool === 'fire' && <FireCalculator />}
            {activeTool === 'inflation' && <InflationCalculator />}
          </div>
        )}
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
    </div>
  );
}

export default App;

