'use client';

import React from "react";

/**
 * @typedef {Object} ErrorBoundaryProps
 * @property {React.ReactNode} children
 * @property {React.ReactNode} [fallback]
 */

/**
 * @typedef {Object} ErrorBoundaryState
 * @property {boolean} hasError
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert" className="error-fallback">
          Something went wrong. Please reload.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
