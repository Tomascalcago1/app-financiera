import React from 'react';
import { useLanguage } from '../utils/LanguageContext';

const PrintReportHeader = ({ title, subtitle, params = [] }) => {
  const { language } = useLanguage();
  
  const defaultSubtitle = language === 'en' ? 'Financial Planning Sheet' : 'Ficha de Planificación Financiera';
  const displaySubtitle = subtitle || defaultSubtitle;

  const currentDate = new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="print-only-section" style={{ width: '100%' }}>
      {/* Brand Header */}
      <div className="print-header">
        <div className="print-header-left">
          <h1>VALIA</h1>
          <p>{displaySubtitle}</p>
        </div>
        <div className="print-header-right">
          <div>{language === 'en' ? 'Issued' : 'Emisión'}: {currentDate}</div>
          <div><a href="https://valiafinanzas.com" target="_blank" rel="noopener noreferrer">valiafinanzas.com</a></div>
        </div>
      </div>

      {/* Title of the Report */}
      <h2 style={{ fontSize: '1.25rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 700 }}>
        {title}
      </h2>

      {/* Parameter Cards Grid */}
      {params && params.length > 0 && (
        <div className="print-params-card">
          <h3 className="print-params-title">
            {language === 'en' ? 'Simulation Parameters' : 'Parámetros de Simulación'}
          </h3>
          <div className="print-params-grid">
            {params.map((param, index) => (
              <div key={index}>
                <span>{param.label}:</span>
                <strong>{param.value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PrintReportHeader;
