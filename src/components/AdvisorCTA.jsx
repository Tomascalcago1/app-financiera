import React from 'react';
import { MessageSquare } from 'lucide-react';

const AdvisorCTA = ({ 
  title = '¿Listo para empezar a invertir?',
  description = 'Contactá a nuestro asesor asociado en Balanz para armar tu portafolio ideal y alcanzar tus metas financieras.',
  whatsappText = 'Hola! Vengo de Valia y me gustaría recibir asesoramiento para armar mi portafolio de inversiones.'
}) => {
  const whatsappNumber = '5491130843105'; // Teléfono del asesor asociado (Balanz)
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

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
      <a 
        href={whatsappUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="btn btn-primary" 
        style={{ 
          whiteSpace: 'nowrap', 
          textDecoration: 'none', 
          display: 'inline-flex', 
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          fontWeight: 600
        }}
      >
        Contactar Asesor
      </a>
    </div>
  );
};

export default AdvisorCTA;
