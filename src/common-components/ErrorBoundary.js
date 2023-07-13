import React from 'react';
import {useSelector} from 'react-redux';
import {selectVersion} from "../ducks/version";
import {selectUserProfile} from "../ducks/user/selectors";
import {ErrorBoundary as ReactErrorBoundary} from 'react-error-boundary';
import {postErrors} from "../api/log-errors";
import Alert from "@mui/material/Alert";

function ErrorFallback({error, resetErrorBoundary}) {
    return (
        <Alert severity="danger">
            <strong>Sorry! Something went wrong.</strong>
            <div className="text-danger" style={{whiteSpace: 'pre-wrap'}}>{error.message}</div>
        </Alert>
    )
}


export default function ErrorBoundary({children}) {
    const version = useSelector(selectVersion);
    const userProfile = useSelector(selectUserProfile);

    const logError = (error, info) => {
        postErrors({
            message: error.message,
            version,
            userId: userProfile?.id,
            componentStack: info.componentStack
        })
            .catch(err => console.log(err.message));
    }

    return (
        <ReactErrorBoundary onError={logError} FallbackComponent={ErrorFallback}>
            {children}
        </ReactErrorBoundary>
    )
}
