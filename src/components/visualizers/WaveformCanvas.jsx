import React, { useRef, useEffect, useCallback } from 'react';

/**
 * WaveformCanvas — Real-time waveform visualization using Canvas API
 */
export default function WaveformCanvas({ timeDomainData, isRecording, duration = 0 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set canvas resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines (subtle)
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    for (let y = 0; y < height; y += height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (!timeDomainData || !isRecording) {
      // Draw idle state — flat line with subtle glow
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
      ctx.lineWidth = 2;
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      return;
    }

    const data = timeDomainData;
    const bufferLength = data.length;
    const sliceWidth = width / bufferLength;

    // Draw waveform with glow
    ctx.beginPath();
    ctx.lineWidth = 2;

    // Glow effect
    ctx.shadowColor = '#00d4aa';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = '#00d4aa';

    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    ctx.stroke();

    // Second pass — brighter inner line
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(0, 212, 170, 0.6)';

    x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = data[i] / 128.0;
      const y = (v * height) / 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();

  }, [timeDomainData, isRecording]);

  useEffect(() => {
    draw();
  }, [draw]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="waveform-container glass-card" style={{ padding: 0, height: '200px', position: 'relative' }}>
      {isRecording && (
        <div className="waveform-header">
          <div className="live-dot"></div>
          <span>Analyzing Live Audio — {formatTime(duration)}</span>
        </div>
      )}
      {!isRecording && (
        <div className="waveform-header">
          <span style={{ color: 'var(--text-tertiary)' }}>Press record to start analysis</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        id="waveform-canvas"
      />
    </div>
  );
}
