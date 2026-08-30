import React, { useState } from 'react';
import { Shield, Users, Award, CheckCircle, MessageSquare } from 'lucide-react';
import FinancialInput from '../components/FinancialInput';
import { trackEvent } from '../utils/analytics';
import { useLanguage } from '../utils/LanguageContext';

const Asesores = () => {
  const { language } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState(() => {
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
  const [profile, setProfile] = useState('moderado');
  const [goal, setGoal] = useState(() => {
    const context = localStorage.getItem('valia_advisor_goal_context');
    if (context) return context;
    
    if (localStorage.getItem('valia_fire_portfolioValue')) return 'retiro';
    if (localStorage.getItem('valia_buyvsrent_propertyPrice')) return 'vivienda';
    return 'ahorro';
  });
  const [customGoal, setCustomGoal] = useState('');
  const [broker, setBroker] = useState('balanz');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      if (language === 'en') {
        alert('Please enter at least your name and WhatsApp number.');
      } else {
        alert('Por favor, ingresá al menos tu nombre y número de WhatsApp.');
      }
      return;
    }

    const brokerUrls = {
      balanz: 'https://www.balanz.com/abrir-cuenta-2.aspx?reference=juanpcavagnaro@gmail.com',
      ecovalores: 'https://www.ecovalores.com.ar/abrir_cuenta_persona_fisica.php?asesor=Juan%20Cavagnaro',
      iol: 'https://micuenta.invertironline.com/registrarme?codigoAsesor=Cavagnaro',
      bullmarket: 'http://bullmarketbrokers.com/Apertura/BullMarketBrokers?ID=MTM2MDc2'
    };

    const targetUrl = brokerUrls[broker] || brokerUrls.balanz;
    const amountFormatted = amount ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(amount) : 'no especificado';
    const goalText = goal === 'otro' ? customGoal : 
                     goal === 'ahorro' ? 'Ahorro a largo plazo' :
                     goal === 'retiro' ? 'Retiro anticipado' : 'Comprar una vivienda';
    const profileText = profile === 'conservador' ? 'Conservador (Preservar capital)' :
                        profile === 'moderado' ? 'Moderado (Crecimiento balanceado)' : 'Agresivo (Máximo crecimiento)';

    trackEvent('lead_generated_interest', { 
      fullName, 
      phone, 
      broker,
      amount, 
      profile, 
      goal: goal === 'otro' ? customGoal : goal,
      source: 'asesores_page'
    });

    const payload = {
      "Nombre Completo": fullName,
      "WhatsApp / Telefono": phone,
      "Broker Seleccionado": broker.toUpperCase(),
      "Capital a Invertir": amountFormatted,
      "Perfil de Riesgo": profileText,
      "Objetivo Principal": goalText,
      "_subject": `Nuevo Lead de Asesor: ${fullName} (${broker.toUpperCase()})`
    };

    setIsSubmitting(true);
    fetch('https://formsubmit.co/ajax/tomascalcagno76@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(() => {
      setIsSubmitting(false);
      window.open(targetUrl, '_blank');
    })
    .catch(error => {
      console.error('Error submitting lead:', error);
      setIsSubmitting(false);
      window.open(targetUrl, '_blank');
    });
  };

  const faqsEn = [
    {
      q: 'Is there any cost for the advisory service?',
      a: 'No. Advisory through Valia is 100% waived. The advisor is compensated via standard platform transaction fees, which are the same fees you would pay if trading alone.'
    },
    {
      q: 'Does the advisor have access to withdraw my money?',
      a: 'Absolutely not. Your account at the broker is personal, and funds are custodied by the Clearing and Settlement Agent (ALyC) under CNV regulations. The advisor is only authorized to suggest investment recommendations; you maintain full control to execute and withdraw your funds.'
    },
    {
      q: 'What is the minimum capital to start?',
      a: 'There are no strict minimums to open the account and receive advice, although starting with a capital of at least $500,000 ARS (or equivalent) is recommended to build a diversified portfolio in mutual funds, corporate bonds, and CEDEARs.'
    }
  ];

  const faqsEs = [
    {
      q: '¿Tiene algún costo el servicio de asesoramiento?',
      a: 'No. El asesoramiento a través de Valia está 100% bonificado. El asesor se financia con las comisiones estándar de operación de la plataforma, que son las mismas que pagarías si operases solo.'
    },
    {
      q: '¿El asesor tiene acceso a retirar mi dinero?',
      a: 'Absolutamente no. Tu cuenta en el broker es personal y los fondos están custodiados por el Agente de Liquidación y Compensación (ALyC) bajo regulación de la CNV. El asesor solo está habilitado para sugerirte recomendaciones de inversión; vos tenés el control total de ejecutar y retirar tus fondos.'
    },
    {
      q: '¿Cuál es el capital mínimo para empezar?',
      a: 'No hay mínimos estrictos para abrir la cuenta y recibir asesoría, aunque se recomienda comenzar con un capital a partir de $500.000 ARS (o equivalente) para poder conformar una cartera diversificada en fondos comunes, ONs y CEDEARs.'
    }
  ];

  const faqs = language === 'en' ? faqsEn : faqsEs;

  if (language === 'en') {
    return (
      <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
        
        {/* Header */}
        <header className="calculator-header" style={{ marginBottom: '3rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <Users size={32} className="text-accent-primary" />
            Preferred Financial Advisors
          </h1>
          <p>Connect with certified advisors registered with the National Securities Commission (CNV) to open your broker account at no management cost.</p>
        </header>

        {/* Grid: Value Prop & Form */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '3rem', alignItems: 'start' }}>
          
          {/* Left: Value Proposition */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>Why work with a Financial Advisor?</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Investing on your own in the capital markets can be complex. A registered financial advisor helps you structure your savings, choose the best instruments in leading brokers (such as Balanz, Ecovalores, IOL, or Bull Market), and optimize returns according to your real goals.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                  <Shield size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>100% Secure Operation</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Your assets are custodied under Central Bank and CNV regulations at the broker of your choice. Only you control withdrawal of funds.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                  <Award size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Waived Advisory Fees</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    No fixed charges or monthly fees. Unlimited access to a CNV-certified professional to consult on your daily investments.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ color: 'var(--accent-primary)', flexShrink: 0 }}>
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Diversified Portfolio</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    Access to mutual funds (FCI), CEDEARs of global companies, equities, bonds, and corporate bonds (ONs).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="taste-card" style={{ 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
            padding: '2rem'
          }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
              <MessageSquare size={20} className="text-accent-primary" />
              Request Advisor
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="e.g. John Doe"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">WhatsApp Contact</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="e.g. +1 555 123 4567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <label className="input-label">Preferred Broker</label>
                <select 
                  className="input-field" 
                  value={broker} 
                  onChange={e => setBroker(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="balanz">Balanz</option>
                  <option value="ecovalores">Eco Valores</option>
                  <option value="iol">InvertirOnline (IOL)</option>
                  <option value="bullmarket">Bull Market Brokers</option>
                </select>
              </div>

              <FinancialInput 
                label="Estimated capital to invest (ARS)"
                value={amount}
                onChange={setAmount}
                prefix="$"
                step={100000}
              />

              <div className="input-group">
                <label className="input-label">Risk Profile</label>
                <select 
                  className="input-field" 
                  value={profile} 
                  onChange={e => setProfile(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="conservador">Conservative (Preserve capital, Money Market/ONs)</option>
                  <option value="moderado">Moderate (Balanced growth, Cedears + ONs)</option>
                  <option value="agresivo">Aggressive (Growth stocks, pure equities)</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Main Goal</label>
                <select 
                  className="input-field" 
                  value={goal} 
                  onChange={e => setGoal(e.target.value)}
                  style={{ appearance: 'auto' }}
                >
                  <option value="ahorro">Long-term Savings and Preservation</option>
                  <option value="retiro">Early Retirement / FIRE</option>
                  <option value="vivienda">Buy a Property or Housing</option>
                  <option value="otro">Other goal</option>
                </select>
              </div>

              {goal === 'otro' && (
                <div className="input-group">
                  <label className="input-label">Specify Goal</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. Family trip, buying a car..."
                    value={customGoal}
                    onChange={e => setCustomGoal(e.target.value)}
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  padding: '0.875rem', 
                  fontWeight: 600, 
                  marginTop: '0.5rem',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Redirecting...' : 'Open Account & Contact Advisor'}
              </button>
            </form>
          </div>
        </div>

        {/* FAQs Section */}
        <section style={{ marginTop: '5rem', borderTop: '1px solid var(--border-color)', paddingTop: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center' }}>Frequently Asked Questions</h2>
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
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 0', maxWidth: '1000px' }}>
      
      {/* Header */}
      <header className="calculator-header" style={{ marginBottom: '3rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Users size={32} className="text-accent-primary" />
          Asesores Financieros Preferenciales
        </h1>
        <p>Conectá con asesores matriculados idóneos ante la Comisión Nacional de Valores (CNV) para abrir tu cuenta sin costo de gestión.</p>
      </header>

      {/* Grid: Value Prop & Form */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left: Value Proposition */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>¿Por qué operar con un Asesor Financiero?</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Invertir por tu cuenta en el mercado de capitales puede ser complejo. Un asesor financiero matriculado te ayuda a estructurar tus ahorros, elegir los mejores instrumentos en plataformas líderes (como Balanz, Ecovalores, IOL o Bull Market) y optimizar la rentabilidad de acuerdo a tus metas reales.
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
                  Tus activos están custodiados en el broker de tu elección bajo la regulación de la CNV y Caja de Valores. Solo vos controlás el retiro de fondos.
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
                  Acceso a Fondos Comunes de Inversión (FCI), CEDEARs de empresas globales, acciones, bonos y Obligaciones Negociables (ONs).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="taste-card" style={{ 
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
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

            <div className="input-group">
              <label className="input-label">Broker de Preferencia</label>
              <select 
                className="input-field" 
                value={broker} 
                onChange={e => setBroker(e.target.value)}
                style={{ appearance: 'auto' }}
              >
                <option value="balanz">Balanz</option>
                <option value="ecovalores">Eco Valores</option>
                <option value="iol">InvertirOnline (IOL)</option>
                <option value="bullmarket">Bull Market Brokers</option>
              </select>
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
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{ 
                width: '100%', 
                justifyContent: 'center', 
                padding: '0.875rem', 
                fontWeight: 600, 
                marginTop: '0.5rem',
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Redirigiendo...' : 'Abrir Cuenta y Contactar Asesor'}
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
