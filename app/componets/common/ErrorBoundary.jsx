// components/common/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) { 
    super(props); 
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    }; 
  }
  
  static getDerivedStateFromError(error) { 
    return { hasError: true, error }; 
  }
  
  componentDidCatch(error, errorInfo) { 
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true
      });
    }
  }
  
  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };
  
  handleReport = () => {
    const { error, errorInfo } = this.state;
    const report = {
      error: error?.toString(),
      componentStack: errorInfo?.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: new Date().toISOString()
    };
    
    console.log("Error Report:", report);
    alert("Error reported to development team. Thank you!");
  };
  
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="error-boundary">
          <div className="error-content">
            <h2>⚠️ Service Temporarily Unavailable</h2>
            <p>We're experiencing technical difficulties. Our engineering team has been notified.</p>
            
            <div className="error-actions">
              <button 
                onClick={this.handleReset} 
                className="btn-retry"
                aria-label="Retry loading the page"
              >
                ↻ Retry Page
              </button>
              
              <button 
                onClick={this.handleReport} 
                className="btn-report"
                aria-label="Report this error to support"
              >
                📋 Report Issue
              </button>
              
              <a 
                href="mailto:support@emersoneims.com?subject=Service%20Page%20Error&body=Please%20describe%20what%20happened..."
                className="btn-email"
                aria-label="Email support about this error"
              >
                📧 Email Support
              </a>
            </div>
            
            <div className="error-contact">
              <p><strong>Need immediate assistance?</strong></p>
              <p>Call: <a href="tel:+254768860655">+254 768 860 655</a> (Sales) or <a href="tel:+254782914717">+254 782 914 717</a> (Support)</p>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Debug Information (Development Only)</summary>
                <pre>{this.state.error.toString()}</pre>
                <pre>{this.state.errorInfo?.componentStack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}