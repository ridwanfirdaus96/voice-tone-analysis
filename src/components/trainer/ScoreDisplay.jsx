import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * ScoreDisplay — Real-time score meters for training
 */
export default function ScoreDisplay({ scores }) {
  const scoreItems = [
    { label: 'Clarity', value: scores.clarity, gradient: 'linear-gradient(90deg, #22c55e, #86efac)' },
    { label: 'Engagement', value: scores.engagement, gradient: 'linear-gradient(90deg, #ef4444, #fca5a5)' },
    { label: 'Confidence', value: scores.confidence, gradient: 'linear-gradient(90deg, #7c3aed, #c4b5fd)' }
  ];

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
        Real-time Score
      </div>
      <div className="score-bars">
        {scoreItems.map(item => (
          <div key={item.label} className="score-bar-item">
            <div className="score-bar-header">
              <span className="score-bar-label">{item.label}</span>
              <span className="score-bar-value">{item.value}</span>
            </div>
            <div className="score-bar-track">
              <div
                className="score-bar-fill"
                style={{
                  width: `${item.value}%`,
                  background: item.gradient
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
