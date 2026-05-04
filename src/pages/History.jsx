import React, { useState, useEffect } from 'react';
import GlassCard from '../components/common/GlassCard';
import GradientButton from '../components/common/GradientButton';
import { getSessions, clearAllSessions, deleteSession } from '../utils/storage';

/**
 * History — Session history page
 */
export default function History() {
  const [sessions, setSessions] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setSessions(getSessions());
  }, []);

  const handleClearAll = () => {
    clearAllSessions();
    setSessions([]);
    setShowConfirm(false);
  };

  const handleDelete = (id) => {
    const updated = deleteSession(id);
    setSessions(updated);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1>
          <span className="text-gradient">Session History</span>
        </h1>
        {sessions.length > 0 && (
          <div>
            {showConfirm ? (
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>Clear all?</span>
                <GradientButton variant="danger" size="sm" onClick={handleClearAll}>
                  Yes, clear
                </GradientButton>
                <GradientButton variant="secondary" size="sm" onClick={() => setShowConfirm(false)}>
                  Cancel
                </GradientButton>
              </div>
            ) : (
              <GradientButton variant="secondary" size="sm" onClick={() => setShowConfirm(true)}>
                🗑️ Clear History
              </GradientButton>
            )}
          </div>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="empty-state" style={{ minHeight: '50vh' }}>
          <div className="empty-icon">📋</div>
          <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>No sessions yet</h3>
          <p style={{ fontSize: 'var(--font-size-sm)', maxWidth: '400px' }}>
            Start analyzing your voice or complete a training session. Your history will appear here.
          </p>
        </div>
      ) : (
        <div className="history-list stagger-children">
          {sessions.map(session => (
            <GlassCard key={session.id} className="history-item">
              <span className="session-emotion" style={{ fontSize: '2rem' }}>
                {session.type === 'trainer' ? '🎯' : (session.emotion?.emoji || '🎙')}
              </span>
              <div className="session-info">
                <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                  {session.type === 'trainer' 
                    ? `${session.scenario} Training` 
                    : `Voice Analysis`}
                </div>
                <div className="session-date">
                  {formatDate(session.timestamp)}
                </div>
                <div className="session-duration">
                  Duration: {formatDuration(session.duration)}
                </div>
                {session.type === 'trainer' && session.scores && (
                  <div style={{ 
                    display: 'flex', 
                    gap: 'var(--spacing-md)', 
                    marginTop: 'var(--spacing-sm)',
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-secondary)'
                  }}>
                    <span>Clarity: {session.scores.clarity}</span>
                    <span>Engagement: {session.scores.engagement}</span>
                    <span>Confidence: {session.scores.confidence}</span>
                  </div>
                )}
                {session.type === 'analysis' && session.emotion && (
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: 'var(--spacing-sm)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    background: `${session.emotion.color}15`,
                    border: `1px solid ${session.emotion.color}30`,
                    fontSize: 'var(--font-size-xs)'
                  }}>
                    <span>{session.emotion.emoji}</span>
                    <span style={{ color: session.emotion.color }}>{session.emotion.label}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{session.emotion.confidence}%</span>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-sm)' }}>
                {session.type === 'trainer' && session.scores && (
                  <div className="session-score text-gradient">
                    {session.scores.overall}
                  </div>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(session.id); }}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px 8px',
                    borderRadius: 'var(--radius-sm)',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={e => e.target.style.color = 'var(--red)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
                >
                  ✕
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
