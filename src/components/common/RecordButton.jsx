import React from 'react';

/**
 * RecordButton — Mic record button with animation states
 */
export default function RecordButton({ state = 'idle', onClick }) {
  const getIcon = () => {
    switch (state) {
      case 'recording': return '⏹';
      case 'paused': return '▶';
      default: return '🎙';
    }
  };

  return (
    <button
      className={`record-btn ${state}`}
      onClick={onClick}
      aria-label={
        state === 'recording' ? 'Stop recording' :
        state === 'paused' ? 'Resume recording' :
        'Start recording'
      }
      id="record-button"
    >
      {getIcon()}
    </button>
  );
}
