import React from 'react';

/**
 * GlassCard — Reusable glassmorphism card component
 */
export default function GlassCard({ children, className = '', style = {}, onClick = null }) {
  return (
    <div
      className={`glass-card ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
