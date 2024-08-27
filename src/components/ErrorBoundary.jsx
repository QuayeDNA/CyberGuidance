import React from 'react';
import PropTypes from 'prop-types';
import { FaExclamationTriangle, FaRedoAlt } from 'react-icons/fa';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  handleTryAgain = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <div className="flex items-center justify-center mb-6">
              <FaExclamationTriangle className="text-5xl text-yellow-500 mr-4" />
              <h1 className="text-2xl font-bold text-gray-800">Oops! Something went wrong.</h1>
            </div>
            <p className="text-gray-600 mb-4">
              We&apos;re sorry for the inconvenience. An unexpected error has occurred.
            </p>
            {this.state.error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p className="font-bold">Error:</p>
                <p>{this.state.error.toString()}</p>
              </div>
            )}
            <div className="flex justify-between">
              <button
                onClick={this.handleTryAgain}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
              >
                <FaRedoAlt className="mr-2" /> Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  onReset: PropTypes.func,
};

export default ErrorBoundary;