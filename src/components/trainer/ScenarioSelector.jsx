import React from 'react';
import GlassCard from '../common/GlassCard';

/**
 * ScenarioSelector — Grid of training scenario cards
 */
export default function ScenarioSelector({ scenarios, onSelect }) {
  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-xl)' }}>
        <h2 className="text-gradient" style={{ marginBottom: 'var(--spacing-sm)' }}>
          Speaking Trainer
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Choose a scenario to practice your speaking skills
        </p>
      </div>
      <div className="scenario-grid stagger-children">
        {scenarios.map(scenario => (
          <GlassCard
            key={scenario.id}
            className="scenario-card"
            onClick={() => onSelect(scenario)}
          >
            <span className="scenario-icon">{scenario.icon}</span>
            <div className="scenario-name">{scenario.name}</div>
            <div className="scenario-desc">{scenario.description}</div>
            <div style={{
              marginTop: 'var(--spacing-md)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--text-muted)'
            }}>
              {Math.floor(scenario.duration / 60)}:{(scenario.duration % 60).toString().padStart(2, '0')} min
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
