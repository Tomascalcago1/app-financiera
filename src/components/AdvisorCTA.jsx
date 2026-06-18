import React from 'react';
import { MessageSquare } from 'lucide-react';
import { trackEvent } from '../utils/analytics';
import { useLanguage } from '../utils/LanguageContext';

const AdvisorCTA = ({ 
  title,
  description,
  goalContext = 'ahorro' // 'ahorro' | 'retiro' | 'vivienda' | 'otro'
}) => {
  const { language } = useLanguage();
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.setItem('valia_advisor_goal_context', goalContext);
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
  };

  const defaultTitle = language === 'en' ? 'Ready to start investing?' : '¿Listo para empezar a invertir?';
  const defaultDesc = language === 'en'
    ? 'Contact our associate advisor at Balanz to structure your ideal portfolio and reach your financial goals.'
    : 'Contactá a nuestro asesor asociado en Balanz para armar tu portafolio ideal y alcanzar tus metas financieras.';

  const displayTitle = title || defaultTitle;
  const displayDesc = description || defaultDesc;

  return (
    <div className="card no-print" style={{ 
      marginTop: '1.5rem', 
      background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.08), rgba(6, 182, 212, 0.03))', 
      border: '1px solid rgba(6, 182, 212, 0.25)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      flexWrap: 'wrap', 
      gap: '1.5rem',
      padding: '1.5rem',
      borderRadius: 'var(--border-radius-md)'
    }}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', minWidth: '280px', flex: '1' }}>
        <div style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '44px', 
          height: '44px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          color: 'var(--accent-primary)',
          flexShrink: 0
        }}>
          <MessageSquare size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>
            {displayTitle}
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            {displayDesc}
          </p>
        </div>
      </div>
      <div 
        onClick={() => trackEvent('lead_generated_interest', { context: goalContext, source: 'advisor_cta' })}
        style={{ display: 'inline-block', cursor: 'not-allowed' }}
      >
        <button 
          disabled
          className="btn" 
          style={{ 
            pointerEvents: 'none',
            whiteSpace: 'nowrap', 
            display: 'inline-flex', 
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            fontWeight: 600,
            border: 'none',
            backgroundColor: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
            opacity: 0.7
          }}
        >
          {language === 'en' ? 'Coming Soon' : 'Próximamente'}
        </button>
      </div>
    </div>
  );
};

export default AdvisorCTA;
