import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * EmotionCard — Displays current emotion classification
 */
export default function EmotionCard({ emotion }) {
  return (
    <GlassCard className="emotion-card">
      <div style={{ 
        fontSize: 'var(--font-size-xs)', 
        color: 'var(--text-tertiary)', 
        marginBottom: 'var(--spacing-md)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        fontWeight: 600
      }}>
        Emotion Classification
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
        <span className="emotion-emoji">{emotion.emoji}</span>
        <div>
          <div className="emotion-label" style={{ color: emotion.color }}>
            {emotion.label}
          </div>
          <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
            {emotion.description}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>Confidence</span>
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, marginLeft: 'auto' }}>
          {emotion.confidence}%
        </span>
      </div>

      <div className="confidence-bar-bg">
        <div 
          className="confidence-bar-fill" 
          style={{ 
            width: `${emotion.confidence}%`,
            background: `linear-gradient(90deg, ${emotion.color}, ${emotion.color}aa)`
          }} 
        />
      </div>
    </GlassCard>
  );
}
