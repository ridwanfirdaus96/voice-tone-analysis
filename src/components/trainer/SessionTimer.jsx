import React from 'react';

/**
 * SessionTimer — Circular countdown timer for training sessions
 */
export default function SessionTimer({ timeRemaining, totalTime }) {
  const size = 200;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? timeRemaining / totalTime : 0;
  const dashOffset = circumference * (1 - progress);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="session-timer">
      <div className="timer-circle">
        <svg width={size} height={size}>
          <circle
            className="timer-bg"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <circle
            className="timer-progress"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="timer-text">
          <div className="timer-time">{timeStr}</div>
          <div className="timer-label">remaining</div>
        </div>
      </div>
    </div>
  );
}
