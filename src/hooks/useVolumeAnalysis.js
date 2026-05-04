import { useState, useRef, useCallback } from 'react';

/**
 * Volume Analysis Hook
 * Tracks volume levels and provides smoothed dB readings
 */
export function useVolumeAnalysis() {
  const [volumeDb, setVolumeDb] = useState(-100);
  const [volumePercent, setVolumePercent] = useState(0);
  const [peakVolume, setPeakVolume] = useState(-100);
  const [volumeHistory, setVolumeHistory] = useState([]);

  const smoothedRef = useRef(-100);

  /**
   * Process volume from RMS and dB values
   */
  const processVolume = useCallback((rms, db) => {
    // Smooth volume
    const alpha = 0.3;
    smoothedRef.current = alpha * db + (1 - alpha) * smoothedRef.current;
    const smoothedDb = smoothedRef.current;

    // Convert to percentage (map -60..0 dB to 0..100%)
    const percent = Math.max(0, Math.min(100, ((smoothedDb + 60) / 60) * 100));

    setVolumeDb(Math.round(smoothedDb));
    setVolumePercent(percent);

    // Track peak
    if (smoothedDb > peakVolume) {
      setPeakVolume(smoothedDb);
    }

    // History
    setVolumeHistory(prev => {
      const next = [...prev, { time: Date.now(), value: Math.round(smoothedDb) }];
      return next.slice(-60);
    });
  }, [peakVolume]);

  /**
   * Reset volume state
   */
  const reset = useCallback(() => {
    setVolumeDb(-100);
    setVolumePercent(0);
    setPeakVolume(-100);
    setVolumeHistory([]);
    smoothedRef.current = -100;
  }, []);

  return {
    volumeDb,
    volumePercent,
    peakVolume,
    volumeHistory,
    processVolume,
    reset
  };
}
