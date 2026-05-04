import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { usePitchDetection } from '../hooks/usePitchDetection';
import { useVolumeAnalysis } from '../hooks/useVolumeAnalysis';
import { useTrainerScoring } from '../hooks/useTrainerScoring';
import ScenarioSelector from '../components/trainer/ScenarioSelector';
import SessionTimer from '../components/trainer/SessionTimer';
import ScoreDisplay from '../components/trainer/ScoreDisplay';
import CoachingPanel from '../components/trainer/CoachingPanel';
import RecordButton from '../components/common/RecordButton';
import GradientButton from '../components/common/GradientButton';
import GlassCard from '../components/common/GlassCard';
import { SCENARIOS, generateCoachingTip } from '../utils/trainerScenarios';
import { saveSession } from '../utils/storage';

/**
 * Trainer — Speaking trainer page
 */
export default function Trainer() {
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [phase, setPhase] = useState('select'); // select, active, results
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [coachingTips, setCoachingTips] = useState([
    { text: 'Press Record to start your training session.', type: 'info' }
  ]);

  const audio = useAudioEngine();
  const pitchDetect = usePitchDetection();
  const volumeAnalysis = useVolumeAnalysis();
  const trainerScoring = useTrainerScoring();

  const animFrameRef = useRef(null);
  const timerRef = useRef(null);
  const coachingTimerRef = useRef(null);

  // Select scenario
  const handleSelectScenario = useCallback((scenario) => {
    setSelectedScenario(scenario);
    setTimeRemaining(scenario.duration);
    setPhase('active');
  }, []);

  // Start training session
  const handleStart = useCallback(async () => {
    await audio.start();

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up — end session
          handleStop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [audio]);

  // Stop training session
  const handleStop = useCallback(() => {
    audio.stop();

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (coachingTimerRef.current) {
      clearInterval(coachingTimerRef.current);
      coachingTimerRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    // Save session
    if (selectedScenario) {
      saveSession({
        type: 'trainer',
        scenario: selectedScenario.name,
        duration: selectedScenario.duration - timeRemaining,
        scores: trainerScoring.scores
      });
    }

    setPhase('results');
  }, [audio, selectedScenario, timeRemaining, trainerScoring.scores]);

  // Reset to selection
  const handleReset = useCallback(() => {
    pitchDetect.reset();
    volumeAnalysis.reset();
    trainerScoring.reset();
    setSelectedScenario(null);
    setPhase('select');
    setCoachingTips([{ text: 'Press Record to start your training session.', type: 'info' }]);
  }, [pitchDetect, volumeAnalysis, trainerScoring]);

  // Audio processing loop
  const processFrame = useCallback(() => {
    const data = audio.getAudioData();
    if (data && selectedScenario) {
      pitchDetect.processPitch(data.floatTimeDomain, data.sampleRate);
      volumeAnalysis.processVolume(data.rms, data.db);

      trainerScoring.updateScores(
        {
          pitch: pitchDetect.pitch,
          volumeDb: volumeAnalysis.volumeDb,
          variability: pitchDetect.variability
        },
        selectedScenario.targets
      );
    }
    animFrameRef.current = requestAnimationFrame(processFrame);
  }, [audio, pitchDetect, volumeAnalysis, trainerScoring, selectedScenario]);

  // Start/stop animation loop
  useEffect(() => {
    if (audio.isRecording && !audio.isPaused) {
      animFrameRef.current = requestAnimationFrame(processFrame);

      // Update coaching tips every 3 seconds
      coachingTimerRef.current = setInterval(() => {
        if (selectedScenario) {
          const tips = generateCoachingTip(
            {
              pitch: pitchDetect.pitch,
              volume: volumeAnalysis.volumeDb,
              tempo: 130,
              variability: pitchDetect.variability
            },
            selectedScenario
          );
          setCoachingTips(tips);
        }
      }, 3000);
    }
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (coachingTimerRef.current) clearInterval(coachingTimerRef.current);
    };
  }, [audio.isRecording, audio.isPaused, processFrame, selectedScenario, pitchDetect.pitch, volumeAnalysis.volumeDb, pitchDetect.variability]);

  // Scenario selection view
  if (phase === 'select') {
    return (
      <div className="animate-fadeInUp" style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--spacing-2xl) 0' }}>
        <ScenarioSelector scenarios={SCENARIOS} onSelect={handleSelectScenario} />
      </div>
    );
  }

  // Results view
  if (phase === 'results') {
    const { scores } = trainerScoring;
    const getGrade = (score) => {
      if (score >= 90) return { grade: 'A+', color: '#22c55e' };
      if (score >= 80) return { grade: 'A', color: '#22c55e' };
      if (score >= 70) return { grade: 'B', color: '#eab308' };
      if (score >= 60) return { grade: 'C', color: '#f97316' };
      return { grade: 'D', color: '#ef4444' };
    };
    const grade = getGrade(scores.overall);

    return (
      <div className="animate-fadeInUp" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <GlassCard className="session-results">
          <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>Session Complete! 🎉</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            {selectedScenario?.name} Training
          </p>

          <div className="overall-score text-gradient" style={{ color: grade.color }}>
            {scores.overall}
          </div>
          <div style={{
            fontSize: 'var(--font-size-3xl)',
            fontWeight: 800,
            color: grade.color,
            marginBottom: 'var(--spacing-lg)'
          }}>
            Grade: {grade.grade}
          </div>

          <div className="results-grid">
            <div className="result-item">
              <div className="result-value" style={{ color: '#22c55e' }}>{scores.clarity}</div>
              <div className="result-label">Clarity</div>
            </div>
            <div className="result-item">
              <div className="result-value" style={{ color: '#ef4444' }}>{scores.engagement}</div>
              <div className="result-label">Engagement</div>
            </div>
            <div className="result-item">
              <div className="result-value" style={{ color: '#7c3aed' }}>{scores.confidence}</div>
              <div className="result-label">Confidence</div>
            </div>
          </div>

          <div style={{ marginTop: 'var(--spacing-xl)', display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center' }}>
            <GradientButton variant="primary" onClick={handleReset}>
              🔄 Try Again
            </GradientButton>
            <GradientButton variant="secondary" onClick={handleReset}>
              📋 Back to Scenarios
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Active training view
  return (
    <div className="animate-fadeInUp">
      <div className="page-header">
        <h1>
          <span className="text-gradient">{selectedScenario?.name}</span>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginLeft: 'var(--spacing-md)' }}>
            {selectedScenario?.icon}
          </span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
          <RecordButton
            state={audio.isRecording ? 'recording' : 'idle'}
            onClick={audio.isRecording ? handleStop : handleStart}
          />
          <GradientButton variant="danger" size="sm" onClick={handleStop}>
            ⏹ End Session
          </GradientButton>
        </div>
      </div>

      <div className="trainer-session">
        {/* Left: Score meters */}
        <div>
          <ScoreDisplay scores={trainerScoring.scores} />
        </div>

        {/* Center: Timer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
          <SessionTimer
            timeRemaining={timeRemaining}
            totalTime={selectedScenario?.duration || 120}
          />
          {!audio.isRecording && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textAlign: 'center' }}>
              Press the record button to begin
            </p>
          )}
        </div>

        {/* Right: Coaching tips */}
        <div>
          <CoachingPanel tips={coachingTips} />
        </div>
      </div>
    </div>
  );
}
