import React from 'react';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../selectors/user";
import ErrorBoundary from "../common-components/ErrorBoundary";

/**
 *
 * @param {React.ReactNode} children
 * @return {JSX.Element|null}
 * @constructor
 */
const RequireLogin = ({children}) => {
    const loggedIn = useSelector(selectLoggedIn);
    if (!loggedIn || !children) {
        return null;
    }
    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    )
}

export default RequireLogin;
