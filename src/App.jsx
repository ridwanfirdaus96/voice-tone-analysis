import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

// Lazy load pages for better performance
const Landing = lazy(() => import('./pages/Landing'));
const Analyzer = lazy(() => import('./pages/Analyzer'));
const Trainer = lazy(() => import('./pages/Trainer'));
const History = lazy(() => import('./pages/History'));

// Loading fallback
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#1a1a2e',
      color: '#fff'
    }}>
      <div className="loading-spinner">Loading...</div>
    </div>
  );
}

/**
 * App — Root application component with routing
 */
export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/trainer" element={<Trainer />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </ErrorBoundary>
  );
}
