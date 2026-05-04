import React from 'react';

/**
 * CircularGauge — SVG-based circular progress meter
 */
export default function CircularGauge({
  value = 0,
  min = 0,
  max = 100,
  label = '',
  unit = '',
  color = 'var(--teal)',
  size = 120,
  strokeWidth = 8
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // Clamp value between min and max
  const clampedValue = Math.max(min, Math.min(max, value));
  const percentage = (clampedValue - min) / (max - min);
  const dashOffset = circumference * (1 - percentage);

  return (
    <div className="circular-gauge" style={{ '--gauge-color': color }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg className="gauge-svg" width={size} height={size}>
          {/* Background circle */}
          <circle
            className="gauge-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Value arc */}
          <circle
            className="gauge-fill"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ '--gauge-color': color, stroke: color }}
          />
        </svg>
        {/* Center value */}
        <div className="gauge-center">
          <div className="gauge-value" style={{ color }}>
            {typeof value === 'number' ? Math.round(value) : value}
          </div>
          <div className="gauge-unit">{unit}</div>
        </div>
      </div>
      <div className="gauge-label">{label}</div>
      {/* Min/Max labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: size,
        fontSize: '10px',
        color: 'var(--text-muted)',
        marginTop: '-4px'
      }}>
        <span>{min}</span>
        <span>{Math.round(value)}</span>
      </div>
    </div>
  );
}
