import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import GradientButton from '../components/common/GradientButton';

/**
 * Landing — Animated hero landing page
 */
export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: '📊',
      title: 'Real-time Analysis',
      description: 'Analyze your voice pitch, volume, and tempo in real-time with stunning visualizations.'
    },
    {
      icon: '🎯',
      title: 'Speaking Trainer',
      description: 'Practice with guided scenarios — job interviews, presentations, storytelling, and debates.'
    },
    {
      icon: '🧠',
      title: 'Emotion Detection',
      description: 'AI-powered emotion classification detects your vocal tone — confident, nervous, calm, and more.'
    }
  ];

  return (
    <div style={{ marginLeft: 'calc(var(--sidebar-width) * -1)', padding: 0 }}>
      <div className="landing-hero">
        {/* Background animated elements */}
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0,212,170,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite reverse',
          pointerEvents: 'none'
        }} />

        {/* Hero content */}
        <div className="animate-fadeInUp" style={{ zIndex: 1 }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--spacing-md)' }}>🎙</div>
          <h1>
            <span className="text-gradient">Voice Tone</span>
            <br />
            Analysis
          </h1>
          <p className="hero-subtitle">
            Understand your voice like never before. Real-time pitch, volume, and emotion analysis 
            powered by advanced audio processing — all in your browser.
          </p>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <GradientButton variant="primary" onClick={() => navigate('/analyzer')}>
              🎤 Start Analyzing
            </GradientButton>
            <GradientButton variant="secondary" onClick={() => navigate('/trainer')}>
              🎯 Speaking Trainer
            </GradientButton>
          </div>
        </div>

        {/* Feature cards */}
        <div className="feature-cards stagger-children" style={{ zIndex: 1 }}>
          {features.map((feature, i) => (
            <GlassCard key={i} className="feature-card">
              <span className="feature-icon">{feature.icon}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </GlassCard>
          ))}
        </div>

        {/* Privacy badge */}
        <div className="animate-fadeIn" style={{
          marginTop: 'var(--spacing-2xl)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-sm)',
          padding: '8px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid rgba(34, 197, 94, 0.2)',
          fontSize: 'var(--font-size-xs)',
          color: 'var(--green)',
          zIndex: 1
        }}>
          🔒 Privacy First — All audio processing happens locally in your browser
        </div>
      </div>
    </div>
  );
}
