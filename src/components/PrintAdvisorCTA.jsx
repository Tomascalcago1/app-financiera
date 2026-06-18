import React from 'react';
import { useLanguage } from '../utils/LanguageContext';

const PrintAdvisorCTA = () => {
  const { language } = useLanguage();

  if (language === 'en') {
    return (
      <div className="print-only-section print-advisor-cta" style={{ width: '100%' }}>
        <h4>Recommended Next Steps</h4>
        <p>
          This simulation is a mathematical projection model. To implement this planning and optimize your investments (ETFs, Mutual Funds, Bonds), you can open a waived account at <strong>Balanz</strong> and receive <strong>professional advisory services (CNV) 100% waived</strong>. Register your details in the <em>Advisors</em> section of our website, and we will contact you via WhatsApp to coordinate a call.
        </p>
      </div>
    );
  }

  return (
    <div className="print-only-section print-advisor-cta" style={{ width: '100%' }}>
      <h4>Próximos Pasos Recomendados</h4>
      <p>
        Esta simulación es un modelo matemático de proyección financiera. Para llevar esta planificación a la práctica y optimizar tus inversiones (CEDEARs, Fondos Comunes de Inversión, Cauciones u ONs), recordá que podés abrir una cuenta bonificada en <strong>Balanz</strong> y contar con <strong>asesoramiento profesional idóneo (CNV) 100% bonificado</strong>. Registrá tus datos en la sección <em>Asesores</em> de nuestra web para que te contactemos por WhatsApp y coordinemos una llamada.
      </p>
    </div>
  );
};

export default PrintAdvisorCTA;
