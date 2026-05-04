import { useState, useRef, useCallback, useEffect } from 'react';
import { calculateRMS, rmsToDb, calculateZeroCrossingRate, detectSilence } from '../utils/audioProcessing';

/**
 * Core Audio Engine Hook
 * Manages microphone access, AudioContext, and real-time audio data extraction
 */
export function useAudioEngine() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState(null);
  const [volume, setVolume] = useState(-100);
  const [volumeRMS, setVolumeRMS] = useState(0);
  const [isSilent, setIsSilent] = useState(true);
  const [duration, setDuration] = useState(0);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const sourceRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const pausedDurationRef = useRef(0);

  // Buffers
  const timeDomainRef = useRef(null);
  const frequencyRef = useRef(null);
  const floatTimeDomainRef = useRef(null);

  /**
   * Start recording from microphone
   */
  const start = useCallback(async () => {
    try {
      setError(null);

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      streamRef.current = stream;

      // Create AudioContext
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;

      // Create AnalyserNode
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect source → analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      // Initialize buffers
      timeDomainRef.current = new Uint8Array(analyser.fftSize);
      frequencyRef.current = new Uint8Array(analyser.frequencyBinCount);
      floatTimeDomainRef.current = new Float32Array(analyser.fftSize);

      startTimeRef.current = Date.now();
      pausedDurationRef.current = 0;
      setIsRecording(true);
      setIsPaused(false);

    } catch (err) {
      console.error('Microphone access error:', err);
      setError(err.message || 'Could not access microphone');
    }
  }, []);

  /**
   * Stop recording and clean up
   */
  const stop = useCallback(() => {
    // Stop animation frame
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Disconnect audio nodes
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // Stop media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsRecording(false);
    setIsPaused(false);
    setVolume(-100);
    setVolumeRMS(0);
    setIsSilent(true);
  }, []);

  /**
   * Pause/resume recording
   */
  const togglePause = useCallback(() => {
    if (!audioContextRef.current) return;

    if (isPaused) {
      audioContextRef.current.resume();
      setIsPaused(false);
    } else {
      audioContextRef.current.suspend();
      setIsPaused(true);
    }
  }, [isPaused]);

  /**
   * Get current audio data (call in animation frame)
   */
  const getAudioData = useCallback(() => {
    const analyser = analyserRef.current;
    if (!analyser) return null;

    // Get time domain data
    analyser.getByteTimeDomainData(timeDomainRef.current);
    analyser.getFloatTimeDomainData(floatTimeDomainRef.current);
    analyser.getByteFrequencyData(frequencyRef.current);

    const rms = calculateRMS(floatTimeDomainRef.current);
    const db = rmsToDb(rms);
    const zcr = calculateZeroCrossingRate(floatTimeDomainRef.current);
    const silent = detectSilence(rms, 0.01);

    setVolumeRMS(rms);
    setVolume(db);
    setIsSilent(silent);

    // Update duration
    if (startTimeRef.current && !isPaused) {
      setDuration(Math.floor((Date.now() - startTimeRef.current - pausedDurationRef.current) / 1000));
    }

    return {
      timeDomain: timeDomainRef.current,
      floatTimeDomain: floatTimeDomainRef.current,
      frequency: frequencyRef.current,
      rms,
      db,
      zcr,
      silent,
      sampleRate: audioContextRef.current?.sampleRate || 44100
    };
  }, [isPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, [stop]);

  return {
    isRecording,
    isPaused,
    error,
    volume,
    volumeRMS,
    isSilent,
    duration,
    start,
    stop,
    togglePause,
    getAudioData,
    analyser: analyserRef.current,
    sampleRate: audioContextRef.current?.sampleRate || 44100
  };
}
