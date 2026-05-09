'use client';

/**
 * Error Boundary for Generator Oracle panels
 * Provides graceful degradation when a panel crashes
 */

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Generator Oracle Error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-slate-900/50 rounded-xl border border-red-500/30">
          <div className="flex items-center gap-3 text-red-400 mb-4">
            <AlertTriangle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h3>
          </div>

          <p className="text-slate-400 mb-4">
            This panel encountered an error and couldn&apos;t load properly.
          </p>

          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre className="p-3 bg-slate-950 rounded-lg text-xs text-red-300 overflow-auto mb-4 max-h-32">
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-lg text-cyan-400 transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
