import React from 'react';

const FinancialInput = ({
  label,
  value,
  onChange,
  prefix = '',
  suffix = '',
  type = 'number',
  min,
  max,
  step
}) => {
  return (
    <div className="input-group">
      <label className="input-label">{label}</label>
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
          type={type}
          className="input-field"
          style={{
            paddingLeft: prefix ? '2rem' : '1rem',
            paddingRight: suffix ? '2rem' : '1rem'
          }}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
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
