# Voice Tone Analysis 🎙️

Aplikasi web untuk analisis nada suara secara real-time menggunakan Web Audio API. Deteksi emosi, pitch, volume, dan tempo dari suara Anda.

![React](https://img.shields.io/badge/React-19-blue)
![Vite](https://img.shields.io/badge/Vite-6-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Fitur

- **Real-time Voice Analysis** - Analisis suara langsung dari microphone
- **Emotion Detection** - Deteksi emosi (Happy, Calm, Angry, Nervous, Confident, Sad, Neutral) berdasarkan karakteristik suara
- **Pitch Detection** - Deteksi pitch/frekuensi suara dalam Hz
- **Volume Meter** - Pengukuran volume dalam dB
- **Tempo Estimation** - Estimasi kecepatan bicara (WPM)
- **Voice Trainer** - Latihan suara dengan skenario simulasi
- **Session History** - Simpan dan lihat riwayat analisis

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js 18+
- npm atau yarn

### Installation

```bash
# Clone repository
git clone https://github.com/ridwanfirdaus96/voice-tone-analysis.git
cd voice-tone-analysis

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

### Production Build

```bash
npm run build
npm run preview
```

## 🏗️ Arsitektur

```
src/
├── components/       # Reusable UI components
│   ├── analysis/    # Emotion cards, tone timeline
│   ├── common/      # Buttons, cards
│   ├── layout/      # Layout, sidebar
│   ├── meters/      # Circular gauge
│   ├── trainer/     # Trainer components
│   └── visualizers/ # Waveform, spectrum, pitch graph
├── hooks/           # Custom React hooks
│   ├── useAudioEngine.js       # Microphone & AudioContext
│   ├── useEmotionClassifier.js # Emotion detection
│   ├── usePitchDetection.js   # Pitch analysis
│   ├── useVolumeAnalysis.js   # Volume processing
│   └── useTrainerScoring.js   # Training scoring
├── pages/           # Route pages
│   ├── Analyzer.jsx  # Main analysis dashboard
│   ├── Trainer.jsx   # Voice training
│   ├── History.jsx   # Session history
│   └── Landing.jsx   # Landing page
├── utils/           # Utility functions
│   ├── audioProcessing.js    # Audio calculations
│   ├── emotionRules.js       # Emotion classification
│   ├── pitchAlgorithms.js    # Pitch detection
│   ├── storage.js            # localStorage helpers
│   └── trainerScenarios.js   # Training scenarios
└── styles/          # CSS files
```

## 🔧 Teknologi

- **React 19** - UI Framework
- **Vite 6** - Build tool
- **Web Audio API** - Audio processing
- **React Router** - Client-side routing

## 📝 Lisensi

MIT License - lihat file [LICENSE](LICENSE) untuk detail.

## 👤 Author

[Ridwan Firdaus](https://github.com/ridwanfirdaus96)
