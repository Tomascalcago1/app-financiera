import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      style={{ 
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 0',
        transition: 'all 0.2s ease'
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'none',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontWeight: 600,
          textAlign: 'left',
          cursor: 'pointer',
          padding: '0.25rem 0',
          gap: '1rem'
        }}
      >
        <span>{question}</span>
        <ChevronDown 
          size={18} 
          style={{ 
            color: 'var(--accent-primary)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0
          }} 
        />
      </button>
      
      <div 
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          marginTop: isOpen ? '0.5rem' : '0'
        }}
      >
        <div 
          style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '0.9rem', 
            lineHeight: 1.6,
            paddingBottom: '0.5rem'
          }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
};

const FAQSection = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div 
      className="card"
      style={{ 
        marginTop: '2.5rem',
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--border-radius-lg)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.2)'
      }}
    >
      <h3 
        style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          color: 'var(--text-primary)',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          borderBottom: '2px solid var(--accent-primary)',
          paddingBottom: '0.5rem',
          width: 'fit-content'
        }}
      >
        Preguntas Frecuentes
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
