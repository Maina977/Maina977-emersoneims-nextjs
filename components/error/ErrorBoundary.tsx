'use client';

import { Component, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
	/** Optional hook for callers that need to react to errors (e.g., switch to a fallback renderer). */
	onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
		this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const showDebugDetails = process.env.NODE_ENV !== 'production';
      return this.props.fallback || (
        <motion.div
          className="min-h-screen bg-black flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-heading-1 font-display text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-body text-text-secondary mb-8">
              We're sorry for the inconvenience. Please refresh the page or contact support.
            </p>
            {showDebugDetails && this.state.error ? (
              <pre className="mb-6 max-h-48 overflow-auto rounded-xl bg-white/5 p-4 text-left text-xs text-white/70">
                {this.state.error.message}
              </pre>
            ) : null}
            <button
              onClick={() => window.location.reload()}
              className="cta-button-sci-fi-primary"
            >
              Refresh Page
            </button>
          </div>
        </motion.div>
      );
    }

    return this.props.children;
  }
}











