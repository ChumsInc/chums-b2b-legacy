import React from 'react';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../ducks/user/selectors";
import ErrorBoundary from "../common-components/ErrorBoundary";

const RequireLogin = ({children}:{
    children: React.ReactNode
}) => {
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
