import React from 'react';

/**
 * GradientButton — Styled button with gradient variants
 */
export default function GradientButton({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick, 
  disabled = false,
  className = '',
  ...props 
}) {
  return (
    <button
      className={`gradient-btn ${variant} ${size === 'sm' ? 'sm' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}
      {...props}
    >
      {children}
    </button>
  );
}
