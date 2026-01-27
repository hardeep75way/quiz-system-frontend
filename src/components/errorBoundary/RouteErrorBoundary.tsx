import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Fallback } from './Fallback';

export const RouteErrorBoundary = () => {
    const error = useRouteError();

    let normalizedError: Error;

    if (isRouteErrorResponse(error)) {
        normalizedError = new Error(`${error.status} ${error.statusText}: ${error.data}`);
    } else if (error instanceof Error) {
        normalizedError = error;
    } else {
        normalizedError = new Error('Unknown route error occurred');
    }

    const reset = () => {
        window.location.href = '/dashboard';
    };

    return <Fallback error={normalizedError} resetErrorBoundary={reset} />;
};