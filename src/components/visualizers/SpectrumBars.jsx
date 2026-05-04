import React, { useMemo } from 'react';

/**
 * SpectrumBars — Frequency spectrum analyzer visualization
 */
export default function SpectrumBars({ frequencyData, isRecording }) {
  const barCount = 64;

  const bars = useMemo(() => {
    if (!frequencyData || !isRecording) {
      return Array(barCount).fill(0);
    }

    const data = frequencyData;
    const step = Math.floor(data.length / barCount);
    const result = [];

    for (let i = 0; i < barCount; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += data[i * step + j] || 0;
      }
      result.push(sum / step);
    }

    return result;
  }, [frequencyData, isRecording]);

  return (
    <div className="spectrum-container glass-card" style={{ padding: 0, height: '180px', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 'var(--spacing-md)',
        left: 'var(--spacing-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-tertiary)'
      }}>
        Frequency Spectrum
      </div>
      <div className="spectrum-bars" style={{ paddingTop: '40px' }}>
        {bars.map((value, i) => {
          const height = isRecording ? Math.max(2, (value / 255) * 140) : 2;
          const hue = 170 + (i / barCount) * 100; // teal to purple gradient
          
          return (
            <div
              key={i}
              className="spectrum-bar"
              style={{
                height: `${height}px`,
                background: `linear-gradient(to top, 
                  hsl(${hue}, 80%, 50%), 
                  hsl(${hue + 30}, 80%, 65%))`,
                opacity: isRecording ? 0.9 : 0.3,
                transition: 'height 0.06s ease-out'
              }}
            />
          );
        })}
      </div>
      {/* X-axis labels */}
      <div style={{
        position: 'absolute',
        bottom: '4px',
        left: 'var(--spacing-md)',
        right: 'var(--spacing-md)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: 'var(--text-muted)'
      }}>
        <span>0 Hz</span>
        <span>5 kHz</span>
        <span>10 kHz</span>
        <span>15 kHz</span>
        <span>20 kHz</span>
      </div>
    </div>
  );
}
