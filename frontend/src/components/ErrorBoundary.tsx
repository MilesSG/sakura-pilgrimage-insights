import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('错误边界捕获到错误:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // 默认错误UI
      return (
        <div className="p-6 bg-dark-base rounded-lg text-center">
          <h2 className="text-xl mb-4 neon-text-pink">渲染出错了</h2>
          <p className="text-gray-300 mb-4">
            {this.state.error?.message || '发生了未知错误'}
          </p>
          <button
            className="px-4 py-2 bg-neon-blue bg-opacity-20 rounded-md neon-text-blue"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            重试
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 