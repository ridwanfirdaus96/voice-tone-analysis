import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * ToneTimeline — Shows emotion changes over time
 */
export default function ToneTimeline({ emotionHistory }) {
  if (!emotionHistory || emotionHistory.length === 0) {
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
          Tone Timeline
        </div>
        <div className="empty-state" style={{ padding: 'var(--spacing-lg)' }}>
          <div className="empty-icon">📊</div>
          <span>Tone changes will appear here during recording</span>
        </div>
      </GlassCard>
    );
  }

  // Get unique emotion changes (when emotion switches)
  const changes = [];
  let lastEmotion = null;
  
  emotionHistory.forEach((entry) => {
    if (entry.key !== lastEmotion) {
      changes.push(entry);
      lastEmotion = entry.key;
    }
  });

  // Show last 8 changes
  const recentChanges = changes.slice(-8);

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
        Tone Timeline
      </div>
      <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
        {recentChanges.map((change, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: `${change.color}15`,
              border: `1px solid ${change.color}30`,
              fontSize: 'var(--font-size-xs)'
            }}
          >
            <span>{change.emoji}</span>
            <span style={{ color: change.color }}>{change.label}</span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
