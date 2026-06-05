import React from 'react';
import { Info, X } from 'lucide-react';

const HelpModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '1rem'
    }}>
      <div className="card animate-fade-in" style={{
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative'
      }}>
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <Info className="text-accent-primary" size={28} />
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>¿Cómo funcionan los cálculos?</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-secondary)' }}>
          <p>
            Esta calculadora no es una simple fórmula de interés compuesto. Su objetivo es comparar 
            de manera justa los escenarios de comprar y alquilar, asumiendo que en ambos casos 
            <strong> gastas exactamente la misma cantidad de dinero de tu bolsillo cada mes</strong>.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>1. Escenario: Alquilar e Invertir</h3>
          <p>
            En este escenario, tu <strong>Capital Inicial</strong> se invierte inmediatamente (por ejemplo, en la bolsa o bonos) 
            al porcentaje de rendimiento que hayas definido. 
            Pero eso no es todo: cada mes, la calculadora revisa si pagar tu alquiler te sale más barato que 
            pagar la cuota de la hipoteca y el mantenimiento de una casa. <strong>Ese dinero mensual que te ahorras por alquilar, 
            también se invierte mes a mes</strong>. Por eso, al final de 20 años, tu patrimonio suele ser mucho mayor 
            que si solo hubieras invertido el capital inicial.
          </p>

          <h3 style={{ color: 'var(--text-primary)', marginTop: '0.5rem' }}>2. Escenario: Comprar Inmueble</h3>
          <p>
            Aquí, tu Capital Inicial se usa como pago inicial (adelanto) de la propiedad. 
            El resto se financia con una hipoteca a la tasa que indiques.
            A lo largo de los años, el inmueble se revaloriza (sube de precio). 
            Al mismo tiempo, tienes gastos mensuales obligatorios: la cuota del banco y los gastos de mantenimiento/impuestos.
            Si en algún momento pagar esto es más barato que alquilar, la diferencia mensual se ahorra y se invierte.
          </p>
          <p>
            Al final del horizonte temporal, tu patrimonio si compraste es igual a: 
            <strong> (Valor Final de la Propiedad) - (Lo que le debes al banco) + (Tus ahorros invertidos)</strong>.
          </p>

          <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginTop: '0.5rem' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              <strong>Conclusión:</strong> El gráfico te muestra qué decisión, a largo plazo, te deja con más riqueza neta en el bolsillo, 
              teniendo en cuenta todos tus costos de vida reales y el poder del interés compuesto sobre tus ahorros mensuales.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{ width: '100%', marginTop: '1.5rem' }}
          onClick={onClose}
        >
          Entendido
        </button>
      </div>
    </div>
  );
};

export default HelpModal;
