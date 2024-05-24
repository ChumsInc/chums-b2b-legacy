import React from 'react';
import {FallbackProps} from "react-error-boundary";

export default function ErrorFallback({error, resetErrorBoundary}:FallbackProps) {
    return (
        <div className="text-danger">
            <p>Sorry! Something went wrong.</p>
            <pre>{error.message}</pre>
        </div>
    )
}
