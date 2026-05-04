import { useState, useRef, useCallback } from 'react';

/**
 * Trainer Scoring Hook
 * Evaluates speaking quality in real-time against scenario targets
 */
export function useTrainerScoring() {
  const [scores, setScores] = useState({
    clarity: 0,
    engagement: 0,
    confidence: 0,
    overall: 0
  });

  const clarityHistoryRef = useRef([]);
  const engagementHistoryRef = useRef([]);
  const confidenceHistoryRef = useRef([]);

  /**
   * Update scores based on current metrics and scenario targets
   */
  const updateScores = useCallback((metrics, targets) => {
    if (!metrics || !targets) return;

    const { pitch, volumeDb, variability } = metrics;

    // ---- Clarity Score ----
    // Based on pitch consistency and volume stability
    let clarity = 50; // Base score
    
    if (pitch > 0) {
      // Pitch within target range = good clarity
      if (pitch >= targets.pitch.min && pitch <= targets.pitch.max) {
        clarity += 25;
      } else {
        const distance = pitch < targets.pitch.min 
          ? targets.pitch.min - pitch 
          : pitch - targets.pitch.max;
        clarity -= Math.min(25, distance * 0.5);
      }
    }
    
    if (volumeDb > -100) {
      // Volume within target range = clear
      if (volumeDb >= targets.volume.min && volumeDb <= targets.volume.max) {
        clarity += 25;
      } else {
        clarity -= 15;
      }
    }
    
    clarity = Math.max(0, Math.min(100, clarity));
    clarityHistoryRef.current.push(clarity);
    if (clarityHistoryRef.current.length > 30) clarityHistoryRef.current.shift();

    // ---- Engagement Score ----
    // Based on pitch variation and tempo dynamics
    let engagement = 50;
    
    if (variability !== undefined) {
      if (variability >= targets.variability.min && variability <= targets.variability.max) {
        engagement += 30;
      } else if (variability < targets.variability.min) {
        engagement -= 20; // Too monotone
      } else {
        engagement -= 10; // Too erratic
      }
    }
    
    // Add some variation bonus
    if (pitch > 0 && Math.random() > 0.5) {
      engagement += Math.min(20, variability * 0.5);
    }
    
    engagement = Math.max(0, Math.min(100, engagement));
    engagementHistoryRef.current.push(engagement);
    if (engagementHistoryRef.current.length > 30) engagementHistoryRef.current.shift();

    // ---- Confidence Score ----
    // Based on volume level and pitch steadiness
    let confidence = 50;
    
    if (volumeDb > -100) {
      if (volumeDb >= targets.volume.min) {
        confidence += 25;
      } else {
        confidence -= 15; // Too quiet = not confident
      }
    }
    
    if (variability !== undefined && variability < targets.variability.max) {
      confidence += 15; // Steady = confident
    }
    
    if (pitch > 0 && pitch >= targets.pitch.min) {
      confidence += 10;
    }
    
    confidence = Math.max(0, Math.min(100, confidence));
    confidenceHistoryRef.current.push(confidence);
    if (confidenceHistoryRef.current.length > 30) confidenceHistoryRef.current.shift();

    // ---- Overall Score (weighted average) ----
    const avgClarity = average(clarityHistoryRef.current);
    const avgEngagement = average(engagementHistoryRef.current);
    const avgConfidence = average(confidenceHistoryRef.current);
    
    const overall = Math.round(
      avgClarity * 0.35 + avgEngagement * 0.3 + avgConfidence * 0.35
    );

    setScores({
      clarity: Math.round(avgClarity),
      engagement: Math.round(avgEngagement),
      confidence: Math.round(avgConfidence),
      overall
    });
  }, []);

  /**
   * Reset scores
   */
  const reset = useCallback(() => {
    setScores({ clarity: 0, engagement: 0, confidence: 0, overall: 0 });
    clarityHistoryRef.current = [];
    engagementHistoryRef.current = [];
    confidenceHistoryRef.current = [];
  }, []);

  return {
    scores,
    updateScores,
    reset
  };
}

function average(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((sum, v) => sum + v, 0) / arr.length;
}
