import React, { useRef, useEffect, useCallback } from 'react';

/**
 * PitchGraph — Pitch over time line chart
 */
export default function PitchGraph({ pitchHistory, isRecording }) {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, bottom: 20, left: 10, right: 10 };
    const graphWidth = width - padding.left - padding.right;
    const graphHeight = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.05)';
    ctx.lineWidth = 1;
    const gridLines = [100, 200, 300, 400];
    gridLines.forEach(hz => {
      const y = padding.top + graphHeight - ((hz / 500) * graphHeight);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
      ctx.font = '10px Inter';
      ctx.fillText(`${hz}`, padding.left, y - 3);
    });

    if (!pitchHistory || pitchHistory.length < 2) return;

    // Draw pitch line
    const maxPoints = 60;
    const data = pitchHistory.slice(-maxPoints);
    const stepX = graphWidth / (maxPoints - 1);

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#7c3aed';
    ctx.shadowColor = '#7c3aed';
    ctx.shadowBlur = 8;

    data.forEach((point, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + graphHeight - ((Math.min(point.value, 500) / 500) * graphHeight);

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw dots at each point
    data.forEach((point, i) => {
      const x = padding.left + i * stepX;
      const y = padding.top + graphHeight - ((Math.min(point.value, 500) / 500) * graphHeight);

      if (i === data.length - 1) {
        // Current point — glowing
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#7c3aed';
        ctx.shadowColor = '#7c3aed';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

  }, [pitchHistory]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="glass-card" style={{ padding: 0, height: '150px', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 'var(--spacing-sm)',
        left: 'var(--spacing-md)',
        fontSize: 'var(--font-size-xs)',
        color: 'var(--text-tertiary)'
      }}>
        Pitch Over Time
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
        id="pitch-graph"
      />
    </div>
  );
}
