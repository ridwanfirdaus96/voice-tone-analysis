import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * CoachingPanel — Real-time coaching tips display
 */
export default function CoachingPanel({ tips }) {
  return (
    <GlassCard>
      <div style={{
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-tertiary)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600,
        marginBottom: 'var(--spacing-md)'
      }}>
        Real-time Coaching Tips
      </div>
      <div className="coaching-panel">
        {tips.map((tip, i) => (
          <div key={i} className={`coaching-tip ${tip.type}`}>
            <span style={{ marginRight: '8px' }}>
              {tip.type === 'success' ? '✅' : tip.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            {tip.text}
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
