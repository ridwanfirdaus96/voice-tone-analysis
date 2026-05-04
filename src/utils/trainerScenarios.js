/**
 * Trainer Scenarios — Definitions and coaching tips
 */

export const SCENARIOS = [
  {
    id: 'interview',
    name: 'Job Interview',
    icon: '👔',
    description: 'Practice professional speaking for interviews',
    duration: 120, // seconds
    targets: {
      pitch: { min: 130, max: 200, label: 'Moderate, professional pitch' },
      volume: { min: -30, max: -18, label: 'Clear and audible' },
      tempo: { min: 120, max: 150, label: 'Measured and confident' },
      variability: { min: 15, max: 35, label: 'Engaging but controlled' }
    },
    tips: [
      'Speak with authority — keep your pitch steady and confident.',
      'Pause between key points for emphasis.',
      'Maintain a consistent volume throughout.',
      'Avoid rushing — take your time to articulate clearly.'
    ]
  },
  {
    id: 'presentation',
    name: 'Presentation',
    icon: '📊',
    description: 'Deliver engaging presentations with confidence',
    duration: 180,
    targets: {
      pitch: { min: 140, max: 220, label: 'Dynamic, engaging pitch' },
      volume: { min: -25, max: -15, label: 'Project your voice' },
      tempo: { min: 130, max: 160, label: 'Energetic but clear' },
      variability: { min: 25, max: 50, label: 'High variation for engagement' }
    },
    tips: [
      'Vary your pitch to keep the audience engaged.',
      'Project your voice — imagine speaking to the back row.',
      'Use strategic pauses after important points.',
      'Emphasize keywords with volume changes.'
    ]
  },
  {
    id: 'storytelling',
    name: 'Storytelling',
    icon: '📖',
    description: 'Tell captivating stories with emotional range',
    duration: 150,
    targets: {
      pitch: { min: 100, max: 280, label: 'Wide range for expression' },
      volume: { min: -35, max: -12, label: 'Dynamic volume for drama' },
      tempo: { min: 100, max: 170, label: 'Vary for dramatic effect' },
      variability: { min: 30, max: 60, label: 'Expressive variation' }
    },
    tips: [
      'Use your full vocal range — highs for excitement, lows for suspense.',
      'Slow down at dramatic moments for impact.',
      'Whisper for intimacy, project for action.',
      'Let emotions flow naturally through your voice.'
    ]
  },
  {
    id: 'debate',
    name: 'Debate',
    icon: '⚖️',
    description: 'Argue persuasively with conviction and clarity',
    duration: 120,
    targets: {
      pitch: { min: 120, max: 190, label: 'Assertive and firm' },
      volume: { min: -25, max: -15, label: 'Strong and clear' },
      tempo: { min: 140, max: 170, label: 'Fast but articulate' },
      variability: { min: 15, max: 30, label: 'Controlled emphasis' }
    },
    tips: [
      'Speak with conviction — avoid vocal fry or trailing off.',
      'Use emphatic stress on key arguments.',
      'Keep a steady, strong volume to project authority.',
      'Pace yourself — rushing weakens your argument.'
    ]
  }
];

/**
 * Generate contextual coaching tips based on current metrics
 */
export function generateCoachingTip(metrics, scenario) {
  const tips = [];
  const targets = scenario.targets;

  // Pitch feedback
  if (metrics.pitch > 0) {
    if (metrics.pitch < targets.pitch.min) {
      tips.push({ text: 'Try raising your pitch a bit — you sound too monotone.', type: 'warning' });
    } else if (metrics.pitch > targets.pitch.max) {
      tips.push({ text: 'Lower your pitch slightly for more authority.', type: 'warning' });
    } else {
      tips.push({ text: 'Great pitch range! Keep it up.', type: 'success' });
    }
  }

  // Volume feedback
  if (metrics.volume > -100) {
    if (metrics.volume < targets.volume.min) {
      tips.push({ text: 'Speak louder — project your voice more.', type: 'warning' });
    } else if (metrics.volume > targets.volume.max) {
      tips.push({ text: 'Tone it down a bit — you\'re a little too loud.', type: 'warning' });
    } else {
      tips.push({ text: 'Great volume control!', type: 'success' });
    }
  }

  // Tempo feedback
  if (metrics.tempo > 0) {
    if (metrics.tempo < targets.tempo.min) {
      tips.push({ text: 'Speed up a little — you\'re speaking too slowly.', type: 'warning' });
    } else if (metrics.tempo > targets.tempo.max) {
      tips.push({ text: 'Slow down your pace — take a breath.', type: 'warning' });
    } else {
      tips.push({ text: 'Perfect pace! Keep going.', type: 'success' });
    }
  }

  // Variability feedback
  if (metrics.variability !== undefined) {
    if (metrics.variability < targets.variability.min) {
      tips.push({ text: 'Try varying your pitch more — it sounds flat.', type: 'warning' });
    } else if (metrics.variability > targets.variability.max) {
      tips.push({ text: 'Steady your pitch a bit — too much variation.', type: 'warning' });
    }
  }

  return tips.length > 0 ? tips : [{ text: 'Keep speaking naturally...', type: 'info' }];
}
