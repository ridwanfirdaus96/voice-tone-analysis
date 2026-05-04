import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Analyzer from './pages/Analyzer';
import Trainer from './pages/Trainer';
import History from './pages/History';

/**
 * App — Root application component with routing
 */
export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyzer" element={<Analyzer />} />
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Layout>
    </Router>
  );
}
