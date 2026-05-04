import { useState, useRef, useCallback } from 'react';
import { autoCorrelate, getNote, smoothPitch, calculatePitchVariability } from '../utils/pitchAlgorithms';

/**
 * Pitch Detection Hook
 * Consumes float time-domain data and extracts fundamental frequency
 */
export function usePitchDetection() {
  const [pitch, setPitch] = useState(0);
  const [note, setNote] = useState(null);
  const [pitchHistory, setPitchHistory] = useState([]);
  const [variability, setVariability] = useState(0);

  const smoothedHistoryRef = useRef([]);
  const rawHistoryRef = useRef([]);

  /**
   * Process a frame of audio data for pitch
   * @param {Float32Array} floatTimeDomain - Float time-domain data
   * @param {number} sampleRate - Audio sample rate
   */
  const processPitch = useCallback((floatTimeDomain, sampleRate) => {
    if (!floatTimeDomain) return;

    const detectedPitch = autoCorrelate(floatTimeDomain, sampleRate);

    if (detectedPitch > 0 && detectedPitch < 1000) {
      // Smooth the pitch
      const smoothed = smoothPitch(smoothedHistoryRef.current, detectedPitch, 0.3);
      smoothedHistoryRef.current.push(smoothed);
      
      // Keep last 100 values
      if (smoothedHistoryRef.current.length > 100) {
        smoothedHistoryRef.current.shift();
      }

      // Raw history for variability
      rawHistoryRef.current.push(detectedPitch);
      if (rawHistoryRef.current.length > 50) {
        rawHistoryRef.current.shift();
      }

      setPitch(Math.round(smoothed));
      setNote(getNote(smoothed));

      // Update pitch history for graph (last 60 values)
      setPitchHistory(prev => {
        const next = [...prev, { time: Date.now(), value: Math.round(smoothed) }];
        return next.slice(-60);
      });

      // Calculate variability
      setVariability(calculatePitchVariability(rawHistoryRef.current));
    }
  }, []);

  /**
   * Reset pitch detection state
   */
  const reset = useCallback(() => {
    setPitch(0);
    setNote(null);
    setPitchHistory([]);
    setVariability(0);
    smoothedHistoryRef.current = [];
    rawHistoryRef.current = [];
  }, []);

  return {
    pitch,
    note,
    pitchHistory,
    variability,
    processPitch,
    reset
  };
}
