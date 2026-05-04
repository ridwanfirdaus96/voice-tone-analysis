import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { usePitchDetection } from '../hooks/usePitchDetection';
import { useVolumeAnalysis } from '../hooks/useVolumeAnalysis';
import { useEmotionClassifier } from '../hooks/useEmotionClassifier';
import WaveformCanvas from '../components/visualizers/WaveformCanvas';
import SpectrumBars from '../components/visualizers/SpectrumBars';
import PitchGraph from '../components/visualizers/PitchGraph';
import CircularGauge from '../components/meters/CircularGauge';
import EmotionCard from '../components/analysis/EmotionCard';
import ToneTimeline from '../components/analysis/ToneTimeline';
import RecordButton from '../components/common/RecordButton';
import GradientButton from '../components/common/GradientButton';
import { saveSession } from '../utils/storage';

/**
 * Analyzer — Main voice analysis dashboard
 */
export default function Analyzer() {
  const audio = useAudioEngine();
  const pitchDetect = usePitchDetection();
  const volumeAnalysis = useVolumeAnalysis();
  const emotionClassifier = useEmotionClassifier();

  const [timeDomainData, setTimeDomainData] = useState(null);
  const [frequencyData, setFrequencyData] = useState(null);
  const [tempo, setTempo] = useState(0);

  const animFrameRef = useRef(null);

  // Animation loop for real-time processing
  const processFrame = useCallback(() => {
    const data = audio.getAudioData();
    if (data) {
      // Update visualizer data
      setTimeDomainData(new Uint8Array(data.timeDomain));
      setFrequencyData(new Uint8Array(data.frequency));

      // Process pitch
      pitchDetect.processPitch(data.floatTimeDomain, data.sampleRate);

      // Process volume
      volumeAnalysis.processVolume(data.rms, data.db);

      // Classify emotion
      emotionClassifier.classify(
        pitchDetect.pitch,
        volumeAnalysis.volumeDb,
        pitchDetect.variability,
        data.zcr,
        data.silent
      );

      // Update tempo
      setTempo(emotionClassifier.getTempo());
    }

    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [audio, pitchDetect, volumeAnalysis, emotionClassifier]);

  // Start/stop animation loop
  useEffect(() => {
    if (audio.isRecording && !audio.isPaused) {
      animFrameRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [audio.isRecording, audio.isPaused, processFrame]);

  // Handle record button click
  const handleRecord = useCallback(() => {
    if (audio.isRecording) {
      // Save session before stopping
      saveSession({
        type: 'analysis',
        duration: audio.duration,
        emotion: emotionClassifier.emotion,
        avgPitch: pitchDetect.pitch,
        avgVolume: volumeAnalysis.volumeDb,
        tempo
      });
      audio.stop();
      pitchDetect.reset();
      volumeAnalysis.reset();
      emotionClassifier.reset();
      setTimeDomainData(null);
      setFrequencyData(null);
    } else {
      audio.start();
    }
  }, [audio, pitchDetect, volumeAnalysis, emotionClassifier, tempo]);

  return (
    <div className="animate-fadeInUp">
      {/* Header */}
      <div className="page-header">
        <h1>
          <span className="text-gradient">Voice Analyzer</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          {audio.error && (
            <span style={{ color: 'var(--red)', fontSize: 'var(--font-size-sm)' }}>
              ⚠️ {audio.error}
            </span>
          )}
          <RecordButton
            state={audio.isRecording ? (audio.isPaused ? 'paused' : 'recording') : 'idle'}
            onClick={handleRecord}
          />
          {audio.isRecording && (
            <GradientButton variant="secondary" size="sm" onClick={audio.togglePause}>
              {audio.isPaused ? '▶ Resume' : '⏸ Pause'}
            </GradientButton>
          )}
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="analyzer-grid">
        {/* Left: Visualizers */}
        <div className="analyzer-visualizers">
          <WaveformCanvas
            timeDomainData={timeDomainData}
            isRecording={audio.isRecording}
            duration={audio.duration}
          />
          <SpectrumBars
            frequencyData={frequencyData}
            isRecording={audio.isRecording}
          />
        </div>

        {/* Right: Meters */}
        <div className="analyzer-meters">
          <CircularGauge
            value={pitchDetect.pitch}
            min={0}
            max={400}
            label="Pitch"
            unit="Hz"
            color="#00d4aa"
          />
          <CircularGauge
            value={volumeAnalysis.volumeDb}
            min={-60}
            max={0}
            label="Volume"
            unit="dB"
            color="#7c3aed"
          />
          <CircularGauge
            value={tempo}
            min={0}
            max={250}
            label="Tempo"
            unit="WPM"
            color="#f97316"
          />
        </div>

        {/* Bottom: Analysis */}
        <div className="analyzer-bottom">
          <div style={{ flex: 1 }}>
            <EmotionCard emotion={emotionClassifier.emotion} />
          </div>
          <div style={{ flex: 1 }}>
            <ToneTimeline emotionHistory={emotionClassifier.emotionHistory} />
          </div>
          <div style={{ flex: 1 }}>
            <PitchGraph
              pitchHistory={pitchDetect.pitchHistory}
              isRecording={audio.isRecording}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
