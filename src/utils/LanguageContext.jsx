/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  es: {
    'brand.subtitle': 'Portal Financiero Educativo',
    'nav.inicio': 'Inicio',
    'nav.herramientas': 'Herramientas',
    'nav.educacion': 'Educación',
    'nav.glosario': 'Glosario',
    'nav.asesores': 'Asesores',
    'nav.acerca': 'Acerca de',
    'nav.privacidad': 'Privacidad',
    'nav.terminos': 'Términos y Condiciones',
    'theme.toggle': 'Cambiar de tema',
    'loading.calculator': 'Cargando simulador...',
    'security.local': 'Seguridad Local Auditada',
    'footer.desc': 'Herramientas educativas gratuitas para simulación y planificación patrimonial autónoma. Privacidad garantizada por diseño local.',
    'footer.col.simulators': 'Simuladores',
    'footer.col.resources': 'Recursos',
    'footer.col.legal': 'Transparencia & Legal',
    'footer.contact': 'Contacto de Soporte',
    'footer.disclaimer': 'Aviso Legal y Advertencia de Riesgo: Valia es una plataforma de contenido puramente educativo e ilustrativo. Los cálculos, proyecciones, datos históricos y resultados simulados no constituyen asesoramiento financiero, recomendación de inversión, oferta de adquisición o venta de valores, ni consultoría fiscal o legal. El rendimiento pasado de los activos financieros no garantiza ni predice retornos futuros. Cada usuario es plenamente responsable de evaluar los riesgos y beneficios de sus decisiones patrimoniales. Se recomienda la consulta con asesores financieros idóneos matriculados ante la Comisión Nacional de Valores (CNV) antes de operar.',
    'footer.copyright': 'Todos los derechos reservados.',
    'footer.developed': 'Desarrollado con fines educativos 🇦🇷',
    'footer.formulas': 'Fórmulas y Metodologías',
    'footer.resources.edu': 'Educación Financiera',
    'footer.resources.glossary': 'Glosario de Términos',
    'footer.resources.about': 'Acerca de Valia',
    'cta.advisor': '¿Querés ayuda para invertir esto? Hablá con un asesor certificado.',
    'cta.advisor.btn': 'Hablar con un Asesor',
    'embed.btn': 'Incrustar esta calculadora en tu web',
    'embed.modal.title': 'Incrustar Widget',
    'embed.modal.desc': 'Copia el código a continuación para incrustar esta calculadora en tu blog o sitio web de forma interactiva.',
    'embed.modal.copy': 'Copiar Código',
    'embed.modal.copied': '¡Copiado!',
    'embed.modal.close': 'Cerrar',
  },
  en: {
    'brand.subtitle': 'Educational Financial Portal',
    'nav.inicio': 'Home',
    'nav.herramientas': 'Tools',
    'nav.educacion': 'Education',
    'nav.glosario': 'Glossary',
    'nav.asesores': 'Advisors',
    'nav.acerca': 'About',
    'nav.privacidad': 'Privacy Policy',
    'nav.terminos': 'Terms & Conditions',
    'theme.toggle': 'Toggle theme',
    'loading.calculator': 'Loading calculator...',
    'security.local': 'Audited Local Security',
    'footer.desc': 'Free educational tools for simulation and autonomous wealth planning. Privacy guaranteed by local client-side design.',
    'footer.col.simulators': 'Calculators',
    'footer.col.resources': 'Resources',
    'footer.col.legal': 'Transparency & Legal',
    'footer.contact': 'Support Contact',
    'footer.disclaimer': 'Legal Disclaimer & Risk Warning: Valia is a purely educational and illustrative platform. Calculations, projections, historical data, and simulated results do not constitute financial advice, investment recommendations, offers to buy or sell securities, or tax or legal consulting. Past performance of financial assets does not guarantee or predict future returns. Each user is fully responsible for evaluating the risks and benefits of their wealth management decisions. Consult with certified financial advisors before trading.',
    'footer.copyright': 'All rights reserved.',
    'footer.developed': 'Developed for educational purposes 🌐',
    'footer.formulas': 'Formulas & Methodologies',
    'footer.resources.edu': 'Financial Education',
    'footer.resources.glossary': 'Glossary of Terms',
    'footer.resources.about': 'About Valia',
    'cta.advisor': 'Need help investing? Talk to a certified financial advisor.',
    'cta.advisor.btn': 'Talk to an Advisor',
    'embed.btn': 'Embed this calculator on your website',
    'embed.modal.title': 'Embed Widget',
    'embed.modal.desc': 'Copy the code below to embed this calculator interactively on your blog or website.',
    'embed.modal.copy': 'Copy Code',
    'embed.modal.copied': 'Copied!',
    'embed.modal.close': 'Close',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // 1. Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang === 'en' || urlLang === 'es') {
      return urlLang;
    }
    // 2. Check localStorage
    const saved = localStorage.getItem('valia-lang');
    if (saved === 'en' || saved === 'es') {
      return saved;
    }
    // 3. Fallback to browser language
    const browserLang = navigator.language || navigator.userLanguage;
    if (browserLang && browserLang.startsWith('en')) {
      return 'en';
    }
    return 'es'; // default
  });

  const setLanguage = (lang) => {
    if (lang === 'es' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('valia-lang', lang);
      
      // Update URL lang parameter dynamically
      const url = new URL(window.location.href);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url.toString());
    }
  };

  useEffect(() => {
    // Sync html lang attribute
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = (key) => {
    return translations[language][key] || translations['es'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
