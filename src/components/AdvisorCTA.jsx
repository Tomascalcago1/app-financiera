import React from 'react';
import { MessageSquare } from 'lucide-react';

const AdvisorCTA = ({ 
  title = '¿Listo para empezar a invertir?',
  description = 'Contactá a nuestro asesor asociado en Balanz para armar tu portafolio ideal y alcanzar tus metas financieras.',
  goalContext = 'ahorro' // 'ahorro' | 'retiro' | 'vivienda' | 'otro'
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    localStorage.setItem('valia_advisor_goal_context', goalContext);
    window.dispatchEvent(new CustomEvent('change-tab', { detail: 'asesores' }));
  };

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
            {title}
          </h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
            {description}
          </p>
        </div>
      </div>
      <button 
        disabled
        className="btn" 
        style={{ 
          whiteSpace: 'nowrap', 
          display: 'inline-flex', 
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          fontWeight: 600,
          border: 'none',
          cursor: 'not-allowed',
          backgroundColor: 'var(--bg-tertiary)',
          color: 'var(--text-secondary)',
          opacity: 0.7
        }}
      >
        Próximamente
      </button>
    </div>
  );
};

export default AdvisorCTA;
