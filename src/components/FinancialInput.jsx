import React, { useState, useEffect } from 'react';

const FinancialInput = ({
  label,
  value,
  onChange,
  prefix = '',
  suffix = '',
  min,
  max,
  step
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar el valor local cuando cambia desde el exterior
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value);
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    // Si el valor es 0, mostramos vacío para facilitar la edición
    setLocalValue(value === 0 || value === '0' ? '' : value.toString());
  };

  const handleBlur = () => {
    setIsFocused(false);
    
    let finalValue = value;
    if (value !== '' && value !== undefined && value !== null) {
      let num = Number(value);
      if (min !== undefined && num < min) {
        num = min;
      }
      if (max !== undefined && num > max) {
        num = max;
      }
      finalValue = num;
    }
    setLocalValue(finalValue);
    onChange(finalValue);
  };

  const handleChange = (e) => {
    const raw = e.target.value;
    setLocalValue(raw);
    
    if (raw === '') {
      onChange('');
    } else {
      const parsed = Number(raw);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'e' || e.key === 'E') {
      e.preventDefault();
    }
  };

  // Formatear el valor cuando el input no tiene el foco
  const displayValue = isFocused 
    ? localValue 
    : (value === '' || value === undefined || value === null
        ? ''
        : new Intl.NumberFormat('es-AR', { maximumFractionDigits: 5 }).format(Number(value))
      );

  return (
    <div className="input-group">
      <label className="input-label">
        {label}
      </label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && (
          <span style={{
            position: 'absolute',
            left: '1rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }}>
            {prefix}
          </span>
        )}
        <input
          type={isFocused ? 'number' : 'text'}
          className="input-field"
          style={{
            paddingLeft: prefix ? '2rem' : '1rem',
            paddingRight: suffix ? '2rem' : '1rem'
          }}
          value={displayValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          min={min}
          max={max}
          step={step}
        />
        {suffix && (
          <span style={{
            position: 'absolute',
            right: '1rem',
            color: 'var(--text-secondary)',
            pointerEvents: 'none'
          }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default FinancialInput;
