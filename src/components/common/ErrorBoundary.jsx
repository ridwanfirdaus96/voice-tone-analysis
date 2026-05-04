import React from 'react';

/**
 * Error Boundary Component
 * Catches JavaScript errors in child components
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Voice Tone Analysis Error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          color: '#fff',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #00d4aa, #7c3aed)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
