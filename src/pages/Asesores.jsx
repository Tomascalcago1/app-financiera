import React, { useState } from 'react';
import { Shield, Users, Award, CheckCircle, ArrowRight, MessageSquare } from 'lucide-react';
import FinancialInput from '../components/FinancialInput';

const Asesores = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(() => {
    // Intenta precargar de las simulaciones activas del usuario
    const compoundAmount = localStorage.getItem('valia_compound_initialInvestment');
    if (compoundAmount && compoundAmount !== '') return compoundAmount;
    
    const fireAmount = localStorage.getItem('valia_fire_portfolioValue');
    if (fireAmount && fireAmount !== '') return fireAmount;

    const savingsInit = localStorage.getItem('valia_savings_initialInvestment');
    if (savingsInit && savingsInit !== '') return savingsInit;

    const savingsGoal = localStorage.getItem('valia_savings_goalAmount');
    if (savingsGoal && savingsGoal !== '') return savingsGoal;

    const rentBuyInit = localStorage.getItem('valia_buyvsrent_initialCapital');
    if (rentBuyInit && rentBuyInit !== '') return rentBuyInit;

    return '';
  });
  const [profile, setProfile] = useState('moderado'); // 'conservador' | 'moderado' | 'agresivo'
  const [goal, setGoal] = useState(() => {
    const context = localStorage.getItem('valia_advisor_goal_context');
    if (context) return context;
    
    if (localStorage.getItem('valia_fire_portfolioValue')) return 'retiro';
    if (localStorage.getItem('valia_buyvsrent_propertyPrice')) return 'vivienda';
    return 'ahorro';
  });
  const [customGoal, setCustomGoal] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      alert('Por favor, ingresá al menos tu nombre y número de WhatsApp.');
      return;
    }

    const advisorPhone = '5491130843105'; // WhatsApp del asesor Balanz
    const goalText = goal === 'otro' ? customGoal : 
                     goal === 'ahorro' ? 'Ahorro a largo plazo' :
                      goal === 'retiro' ? 'Retiro anticipado' : 'Comprar una vivienda';

    const profileText = profile === 'conservador' ? 'Conservador (Preservar capital)' :
                        profile === 'moderado' ? 'Moderado (Crecimiento balanceado)' : 'Agresivo (Máximo crecimiento)';

    const amountFormatted = amount ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount) : 'no especificado';

    const text = `Hola! Vengo de la plataforma Valia. Mi nombre es ${fullName}. Estoy buscando un asesor en Balanz para abrir mi cuenta impositiva y operativamente bonificada.
Mis datos de planificación son:
- Teléfono/WhatsApp: ${phone}
- Capital estimado a invertir: ${amountFormatted}
- Perfil de riesgo: ${profileText}
- Objetivo principal: ${goalText}

Me gustaría coordinar una breve llamada para analizar mis opciones y armar mi cartera.`;

    const url = `https://wa.me/${advisorPhone}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const faqs = [
    {
      q: '¿Tiene algún costo el servicio de asesoramiento?',
      a: 'No. El asesoramiento a través de Valia y Balanz está 100% bonificado. El asesor se financia con las comisiones estándar de operación de la plataforma, que son las mismas que pagarías si operases solo.'
    },
    {
      q: '¿El asesor tiene acceso a retirar mi dinero?',
      a: 'Absolutamente no. Tu cuenta en Balanz es personal y los fondos están custodiados por el Agente de Liquidación y Compensación (ALyC) bajo regulación de la CNV. El asesor solo está habilitado para sugerirte recomendaciones de inversión; vos tenés el control total de ejecutar y retirar tus fondos.'
    },
    {
      q: '¿Cuál es el capital mínimo para empezar?',
      a: 'No hay mínimos estrictos para abrir la cuenta y recibir asesoría, aunque se recomienda comenzar con un capital a partir de $500.000 ARS (o equivalente) para poder conformar una cartera diversificada en fondos comunes, ONs y CEDEARs.'
    }
  ];

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
      
      {/* Header */}
      <header className="calculator-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Users size={32} className="text-accent-primary" />
          Asesores Financieros Balanz
        </h1>
        <p>Conectá con asesores matriculados idóneos ante la Comisión Nacional de Valores (CNV) sin costo de gestión.</p>
      </header>

      {/* Grid: Value Prop & Form */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left: Value Proposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>¿Por qué operar con un Asesor de Balanz?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Invertir por tu cuenta en el mercado de capitales puede ser complejo. Un asesor financiero te ayuda a estructurar tus ahorros, elegir los mejores instrumentos y optimizar la rentabilidad de acuerdo a tus metas reales.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Operación 100% Segura</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Tus activos están custodiados en Balanz bajo la regulación del Banco Central y la CNV. Solo vos controlás el retiro de fondos.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                <Award size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Asesoría idónea bonificada</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Sin cargos fijos ni abonos mensuales. Acceso ilimitado a un profesional matriculado en CNV para consultar tus inversiones diarias.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Cartera Diversificada</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                  Acceso a Fondos Comunes de Inversión (FCI) preferenciales de Balanz, CEDEARs de empresas de EE.UU., acciones argentinas y Obligaciones Negociables (ONs).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="card" style={{ 
          background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(15, 23, 42, 0.4) 100%)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          boxShadow: 'var(--shadow-glow), var(--shadow-md)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} className="text-accent-primary" />
            Solicitar Asesor Preferencial
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className="input-group">
              <label className="input-label">Nombre Completo</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Ej. Juan Pérez"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">WhatsApp de Contacto</label>
              <input 
                type="tel" 
                className="input-field" 
                placeholder="Ej. +54 9 11 1234 5678"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <FinancialInput 
              label="Capital aproximado a invertir (ARS)"
              value={amount}
              onChange={setAmount}
              prefix="$"
              step={100000}
            />

            <div className="input-group">
              <label className="input-label">Perfil de Riesgo</label>
              <select 
                className="input-field" 
                value={profile} 
                onChange={e => setProfile(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="conservador">Conservador (Cuidar capital, FCI Money Market/ONs)</option>
                <option value="moderado">Moderado (Crecimiento balanceado, Cedears + ONs)</option>
                <option value="agresivo">Agresivo (Acciones de crecimiento, renta variable pura)</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Objetivo Principal</label>
              <select 
                className="input-field" 
                value={goal} 
                onChange={e => setGoal(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="ahorro">Ahorro y Preservación a Largo Plazo</option>
                <option value="retiro">Retiro Temprano / Jubilación</option>
                <option value="vivienda">Comprar una Propiedad o Vivienda</option>
                <option value="otro">Otro objetivo</option>
              </select>
            </div>

            {goal === 'otro' && (
              <div className="input-group">
                <label className="input-label">Especificar Objetivo</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Ej. Viaje familiar, comprar un auto..."
                  value={customGoal}
                  onChange={e => setCustomGoal(e.target.value)}
                />
              </div>
            )}

            <button 
              type="button" 
              disabled
              className="btn"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '0.875rem', 
                fontWeight: 600, 
                marginTop: '0.5rem',
                cursor: 'not-allowed',
                backgroundColor: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                opacity: 0.7
              }}
            >
              Próximamente
            </button>
          </form>
        </div>
      </div>

      {/* FAQs Section */}
      <section style={{ marginTop: '5rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Preguntas Frecuentes sobre el Asesoramiento</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
          {faqs.map((faq, index) => (
            <div key={index} className="card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{faq.q}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Asesores;
