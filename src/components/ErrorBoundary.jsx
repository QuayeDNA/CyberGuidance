import React from 'react';
import PropTypes from 'prop-types'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Oops! Something went wrong.</h1>
          <p className="text-xl text-gray-700">We&apos;re sorry for the inconvenience. Please try refreshing the page.</p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired
    };

export default ErrorBoundary;