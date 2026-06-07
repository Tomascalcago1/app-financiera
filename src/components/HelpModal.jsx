import React from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose, title = '¿Cómo funcionan los cálculos?', children }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100, // Por encima de todo, incluyendo header sticky
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div 
        className="card animate-fade-in" 
        style={{
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-secondary)',
          padding: '2rem'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '0.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingRight: '2rem' }}>
          <Info className="text-accent-primary" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.35rem', color: 'var(--text-primary)' }}>{title}</h2>
        </div>

        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1rem', 
          color: 'var(--text-secondary)', 
          lineHeight: '1.6', 
          fontSize: '0.925rem' 
        }}>
          {children}
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1.75rem', justifyContent: 'center' }}
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>,
    document.body
  );
};

export default HelpModal;
