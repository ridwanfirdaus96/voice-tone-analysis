/**
 * Emotion Classification Rules
 * Heuristic-based emotion detection from voice features
 */

/**
 * Emotion definitions with their feature patterns
 */
export const EMOTIONS = {
  happy: {
    label: 'Happy',
    emoji: '😊',
    color: '#eab308',
    description: 'Excited and positive',
    patterns: {
      pitch: 'high',        // > 200 Hz
      volume: 'high',       // > -20 dB
      tempo: 'fast',        // > 150 WPM
      variability: 'high'   // Lots of pitch variation
    }
  },
  calm: {
    label: 'Calm',
    emoji: '😌',
    color: '#06b6d4',
    description: 'Relaxed and peaceful',
    patterns: {
      pitch: 'low',
      volume: 'low',
      tempo: 'slow',
      variability: 'low'
    }
  },
  angry: {
    label: 'Angry',
    emoji: '😠',
    color: '#ef4444',
    description: 'Frustrated or intense',
    patterns: {
      pitch: 'low',
      volume: 'high',
      tempo: 'fast',
      variability: 'medium'
    }
  },
  nervous: {
    label: 'Nervous',
    emoji: '😰',
    color: '#f97316',
    description: 'Anxious or uncertain',
    patterns: {
      pitch: 'high',
      volume: 'medium',
      tempo: 'fast',
      variability: 'high'
    }
  },
  confident: {
    label: 'Confident',
    emoji: '💪',
    color: '#22c55e',
    description: 'Strong and assured',
    patterns: {
      pitch: 'medium',
      volume: 'high',
      tempo: 'medium',
      variability: 'low'
    }
  },
  sad: {
    label: 'Sad',
    emoji: '😢',
    color: '#8b5cf6',
    description: 'Low energy or melancholic',
    patterns: {
      pitch: 'low',
      volume: 'low',
      tempo: 'slow',
      variability: 'low'
    }
  },
  neutral: {
    label: 'Neutral',
    emoji: '😐',
    color: '#94a3b8',
    description: 'Balanced and even',
    patterns: {
      pitch: 'medium',
      volume: 'medium',
      tempo: 'medium',
      variability: 'medium'
    }
  }
};

/**
 * Feature thresholds for classification
 */
const THRESHOLDS = {
  pitch: {
    low: 130,     // Below 130 Hz
    medium: 200,  // 130-200 Hz
    high: 280     // Above 200 Hz
  },
  volume: {
    low: -40,     // Below -40 dB
    medium: -25,  // -40 to -25 dB
    high: -10     // Above -25 dB
  },
  tempo: {
    slow: 100,    // Below 100 WPM
    medium: 150,  // 100-150 WPM
    fast: 180     // Above 150 WPM
  },
  variability: {
    low: 20,      // Below 20 Hz std dev
    medium: 40,   // 20-40 Hz std dev
    high: 60      // Above 40 Hz std dev
  }
};

/**
 * Categorize a feature value into low/medium/high
 */
function categorize(value, thresholds) {
  if (value < thresholds.low) return 'low';
  if (value < thresholds.high) return 'medium';
  return 'high';
}

/**
 * Calculate match score between feature categories and emotion pattern
 */
function calculateMatchScore(features, pattern) {
  let score = 0;
  const weights = { pitch: 0.3, volume: 0.25, tempo: 0.2, variability: 0.25 };
  
  for (const [feature, expected] of Object.entries(pattern)) {
    const actual = features[feature];
    if (actual === expected) {
      score += weights[feature] * 1.0;
    } else if (
      (actual === 'medium' && (expected === 'low' || expected === 'high')) ||
      (expected === 'medium' && (actual === 'low' || actual === 'high'))
    ) {
      score += weights[feature] * 0.4;
    }
  }
  
  return score;
}

/**
 * Classify emotion from audio features
 * @param {object} features - { pitch, volume, tempo, variability }
 * @returns {object} { emotion, confidence, emoji, label, color }
 */
export function classifyEmotion(features) {
  const { pitch, volume, tempo, variability } = features;
  
  // Categorize each feature
  const categorized = {
    pitch: categorize(pitch, THRESHOLDS.pitch),
    volume: categorize(volume, THRESHOLDS.volume),
    tempo: categorize(tempo, THRESHOLDS.tempo),
    variability: categorize(variability, THRESHOLDS.variability)
  };
  
  // Calculate match score for each emotion
  let bestMatch = { key: 'neutral', score: 0 };
  
  for (const [key, emotion] of Object.entries(EMOTIONS)) {
    const score = calculateMatchScore(categorized, emotion.patterns);
    if (score > bestMatch.score) {
      bestMatch = { key, score };
    }
  }
  
  const emotion = EMOTIONS[bestMatch.key];
  const confidence = Math.min(Math.round(bestMatch.score * 100), 100);
  
  return {
    key: bestMatch.key,
    label: emotion.label,
    emoji: emotion.emoji,
    color: emotion.color,
    description: emotion.description,
    confidence: Math.max(confidence, 15) // Minimum 15% confidence
  };
}
