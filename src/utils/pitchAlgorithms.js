/**
 * Pitch Detection Algorithms
 * Autocorrelation-based fundamental frequency detection
 */

/**
 * Autocorrelation pitch detection
 * Detects the fundamental frequency (F0) from an audio buffer
 * @param {Float32Array} buffer - Time domain audio data
 * @param {number} sampleRate - Audio sample rate (e.g., 44100)
 * @returns {number} Detected frequency in Hz, or -1 if no pitch detected
 */
export function autoCorrelate(buffer, sampleRate) {
  const SIZE = buffer.length;
  const MAX_SAMPLES = Math.floor(SIZE / 2);
  let bestOffset = -1;
  let bestCorrelation = 0;
  let foundGoodCorrelation = false;

  // Find the RMS to check if there's enough signal
  let rms = 0;
  for (let i = 0; i < SIZE; i++) {
    rms += buffer[i] * buffer[i];
  }
  rms = Math.sqrt(rms / SIZE);

  // Not enough signal
  if (rms < 0.01) return -1;

  let lastCorrelation = 1;

  for (let offset = 0; offset < MAX_SAMPLES; offset++) {
    let correlation = 0;

    for (let i = 0; i < MAX_SAMPLES; i++) {
      correlation += Math.abs(buffer[i] - buffer[i + offset]);
    }

    correlation = 1 - correlation / MAX_SAMPLES;

    if (correlation > 0.9 && correlation > lastCorrelation) {
      foundGoodCorrelation = true;
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestOffset = offset;
      }
    } else if (foundGoodCorrelation) {
      // We've found a good correlation and now it's declining
      break;
    }

    lastCorrelation = correlation;
  }

  if (bestCorrelation > 0.01 && bestOffset > 0) {
    // Parabolic interpolation for more accuracy
    const shift = getParabolicShift(buffer, bestOffset, MAX_SAMPLES);
    return sampleRate / (bestOffset + shift);
  }

  return -1;
}

/**
 * Parabolic interpolation for sub-sample accuracy
 */
function getParabolicShift(buffer, offset, maxSamples) {
  if (offset <= 0 || offset >= maxSamples - 1) return 0;
  
  const prev = correlateAtOffset(buffer, offset - 1, maxSamples);
  const curr = correlateAtOffset(buffer, offset, maxSamples);
  const next = correlateAtOffset(buffer, offset + 1, maxSamples);
  
  const denominator = 2 * (2 * curr - prev - next);
  if (denominator === 0) return 0;
  
  return (prev - next) / denominator;
}

function correlateAtOffset(buffer, offset, maxSamples) {
  let correlation = 0;
  for (let i = 0; i < maxSamples; i++) {
    correlation += Math.abs(buffer[i] - buffer[i + offset]);
  }
  return 1 - correlation / maxSamples;
}

/**
 * Convert frequency (Hz) to musical note
 * @param {number} frequency - Frequency in Hz
 * @returns {object} {note, octave, cents} or null
 */
export function getNote(frequency) {
  if (frequency <= 0) return null;

  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const A4 = 440;
  const semitonesFromA4 = 12 * Math.log2(frequency / A4);
  const noteIndex = Math.round(semitonesFromA4) + 57; // A4 is the 57th semitone from C0
  const cents = Math.round((semitonesFromA4 - Math.round(semitonesFromA4)) * 100);
  
  const note = noteNames[((noteIndex % 12) + 12) % 12];
  const octave = Math.floor(noteIndex / 12);

  return { note, octave, cents, name: `${note}${octave}` };
}

/**
 * Smooth pitch values using exponential moving average
 * @param {number[]} history - Array of recent pitch values
 * @param {number} newValue - New pitch value to add
 * @param {number} alpha - Smoothing factor (0-1, lower = smoother)
 * @returns {number} Smoothed pitch value
 */
export function smoothPitch(history, newValue, alpha = 0.3) {
  if (history.length === 0) return newValue;
  
  const lastSmoothed = history[history.length - 1];
  return alpha * newValue + (1 - alpha) * lastSmoothed;
}

/**
 * Calculate pitch variability (standard deviation of recent pitches)
 * @param {number[]} pitchHistory - Recent pitch values
 * @returns {number} Standard deviation of pitch
 */
export function calculatePitchVariability(pitchHistory) {
  if (pitchHistory.length < 2) return 0;
  
  const mean = pitchHistory.reduce((sum, v) => sum + v, 0) / pitchHistory.length;
  const squaredDiffs = pitchHistory.map(v => Math.pow(v - mean, 2));
  const variance = squaredDiffs.reduce((sum, v) => sum + v, 0) / pitchHistory.length;
  
  return Math.sqrt(variance);
}
