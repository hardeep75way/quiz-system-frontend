import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Fallback } from './Fallback';

interface ErrorBoundaryProps {
    children: ReactNode;
    FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>;
    onReset?: () => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    resetErrorBoundary = (): void => {
        this.props.onReset?.();
        this.state = {
            hasError: false,
            error: null,
        };
        this.setState({ hasError: false, error: null });
    };

    render(): ReactNode {
        const { hasError, error } = this.state;
        const { children, FallbackComponent } = this.props;

        if (hasError && error) {
            if (FallbackComponent) {
                return <FallbackComponent error={error} resetErrorBoundary={this.resetErrorBoundary} />;
            }
            return <Fallback error={error} resetErrorBoundary={this.resetErrorBoundary} />;
        }

        return children;
    }
}
