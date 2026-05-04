import { useState, useRef, useCallback } from 'react';
import { classifyEmotion } from '../utils/emotionRules';

/**
 * Emotion Classifier Hook
 * Heuristic-based emotion classification from audio features
 */
export function useEmotionClassifier() {
  const [emotion, setEmotion] = useState({
    key: 'neutral',
    label: 'Neutral',
    emoji: '😐',
    color: '#94a3b8',
    description: 'Waiting for audio...',
    confidence: 0
  });
  const [emotionHistory, setEmotionHistory] = useState([]);

  const lastUpdateRef = useRef(0);
  const tempoRef = useRef(120); // Estimated WPM

  /**
   * Update tempo estimation
   * Uses zero-crossing rate as a proxy for speaking rate
   */
  const updateTempo = useCallback((zcr, isSilent) => {
    if (!isSilent && zcr > 0) {
      // Rough mapping: ZCR correlates with speech activity
      // Higher ZCR = more active speech = faster tempo
      const estimatedTempo = Math.min(200, Math.max(60, zcr * 1500));
      const alpha = 0.1;
      tempoRef.current = alpha * estimatedTempo + (1 - alpha) * tempoRef.current;
    }
  }, []);

  /**
   * Classify emotion from current audio features
   * Throttled to update every 500ms
   */
  const classify = useCallback((pitch, volumeDb, variability, zcr, isSilent) => {
    const now = Date.now();
    if (now - lastUpdateRef.current < 500) return;
    lastUpdateRef.current = now;

    // Update tempo estimate
    updateTempo(zcr, isSilent);

    if (pitch <= 0 || isSilent) return;

    const features = {
      pitch,
      volume: volumeDb,
      tempo: tempoRef.current,
      variability
    };

    const result = classifyEmotion(features);
    setEmotion(result);

    // Track emotion over time
    setEmotionHistory(prev => {
      const next = [...prev, { time: now, ...result }];
      return next.slice(-120); // Keep 2 minutes of history
    });
  }, [updateTempo]);

  /**
   * Get estimated tempo/WPM
   */
  const getTempo = useCallback(() => Math.round(tempoRef.current), []);

  /**
   * Reset classifier state
   */
  const reset = useCallback(() => {
    setEmotion({
      key: 'neutral',
      label: 'Neutral',
      emoji: '😐',
      color: '#94a3b8',
      description: 'Waiting for audio...',
      confidence: 0
    });
    setEmotionHistory([]);
    tempoRef.current = 120;
    lastUpdateRef.current = 0;
  }, []);

  return {
    emotion,
    emotionHistory,
    classify,
    getTempo,
    reset
  };
}
