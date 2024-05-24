import React from 'react';
import {useSelector} from 'react-redux';
import {selectUserProfile} from "../ducks/user/selectors";
import {ErrorBoundary as ReactErrorBoundary, FallbackProps} from 'react-error-boundary';
import {postErrors} from "../api/fetch";
import Alert from "@mui/material/Alert";

function ErrorFallback({error, resetErrorBoundary}: FallbackProps) {
    resetErrorBoundary();
    return (
        <Alert severity="error">
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
        </Alert>
    )
}

export default function ErrorBoundary({children}: {
    children: React.ReactNode
}) {
    const userProfile = useSelector(selectUserProfile);

    const logError = (error: Error, info: React.ErrorInfo) => {
        postErrors({
            message: error.message,
            userId: userProfile?.id,
            componentStack: info.componentStack ?? ''
        })
            .catch(err => console.log(err.message));
    }

    return (
        <ReactErrorBoundary onError={logError} FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    )
}
