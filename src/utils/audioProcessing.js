/**
 * Audio Processing Utilities
 * Low-level audio math functions for voice analysis
 */

/**
 * Calculate Root Mean Square (RMS) — volume level
 * @param {Float32Array} buffer - Time domain audio data
 * @returns {number} RMS value (0-1)
 */
export function calculateRMS(buffer) {
  let sum = 0;
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i];
  }
  return Math.sqrt(sum / buffer.length);
}

/**
 * Convert RMS to decibels
 * @param {number} rms - RMS value
 * @returns {number} dB value
 */
export function rmsToDb(rms) {
  if (rms <= 0) return -100;
  return 20 * Math.log10(rms);
}

/**
 * Calculate Zero Crossing Rate — voice activity detection
 * @param {Float32Array} buffer
 * @returns {number} ZCR (crossings per sample)
 */
export function calculateZeroCrossingRate(buffer) {
  let crossings = 0;
  for (let i = 1; i < buffer.length; i++) {
    if ((buffer[i] >= 0 && buffer[i - 1] < 0) ||
        (buffer[i] < 0 && buffer[i - 1] >= 0)) {
      crossings++;
    }
  }
  return crossings / buffer.length;
}

/**
 * Normalize audio buffer
 * @param {Float32Array} buffer
 * @returns {Float32Array} Normalized buffer
 */
export function normalizeBuffer(buffer) {
  const max = Math.max(...Array.from(buffer).map(Math.abs));
  if (max === 0) return buffer;
  const normalized = new Float32Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    normalized[i] = buffer[i] / max;
  }
  return normalized;
}

/**
 * Detect silence in audio
 * @param {number} rms - Current RMS value
 * @param {number} threshold - Silence threshold (default 0.01)
 * @returns {boolean} True if silent
 */
export function detectSilence(rms, threshold = 0.01) {
  return rms < threshold;
}

/**
 * Calculate spectral centroid (brightness of sound)
 * @param {Uint8Array} frequencyData
 * @param {number} sampleRate
 * @returns {number} Spectral centroid in Hz
 */
export function calculateSpectralCentroid(frequencyData, sampleRate) {
  let weightedSum = 0;
  let sum = 0;
  const nyquist = sampleRate / 2;
  
  for (let i = 0; i < frequencyData.length; i++) {
    const frequency = (i / frequencyData.length) * nyquist;
    const amplitude = frequencyData[i];
    weightedSum += frequency * amplitude;
    sum += amplitude;
  }
  
  return sum === 0 ? 0 : weightedSum / sum;
}
