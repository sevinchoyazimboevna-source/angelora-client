import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ANGELORA runtime error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{ minHeight: '100vh', padding: 40, fontFamily: 'Inter, Arial, sans-serif', background: '#fff', color: '#1b1b1b' }}>
        <h1 style={{ marginBottom: 12 }}>ANGELORA</h1>
        <p style={{ marginBottom: 20 }}>The application encountered a runtime error.</p>
        <pre style={{ whiteSpace: 'pre-wrap', background: '#f7f5f2', padding: 20, borderRadius: 8, overflow: 'auto' }}>
          {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
        </pre>
        <button onClick={() => window.location.reload()} style={{ marginTop: 20, padding: '10px 18px', cursor: 'pointer' }}>
          Reload
        </button>
      </div>
    );
  }
}
