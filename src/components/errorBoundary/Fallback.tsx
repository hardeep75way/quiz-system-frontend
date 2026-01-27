import React from 'react';

interface FallbackProps {
    error: Error;
    resetErrorBoundary: () => void;
}

const styles = {
    container: {
        padding: '20px',
        border: '1px solid #f44336',
        borderRadius: '4px',
        backgroundColor: '#ffebee',
        color: '#b71c1c'
    },
    h2: {
        marginTop: 0
    },
    details: {
        whiteSpace: 'pre-wrap',
        margin: '10px 0'
    },
    button: {
        padding: '8px 16px',
        backgroundColor: '#d32f2f',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
}

export const Fallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
    return (
        <div role="alert" style={styles.container}>
            <h2 style={styles.h2}>Something went wrong.</h2>
            <details style={styles.details}>
                {error.message}
            </details>
            <button
                onClick={resetErrorBoundary}
                style={styles.button}
                type="button"
            >
                Try again
            </button>
        </div>
    );
};
