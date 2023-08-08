import React from 'react';
import {selectLoggedIn} from "../ducks/user/selectors";
import {useSelector} from "react-redux";
import AppUpdateLocalLogin from "../components/AppUpdateLocalLogin";
import AlertList from "../ducks/alerts/AlertList";
import {Outlet} from "react-router-dom";
import ErrorBoundary from "../common-components/ErrorBoundary";


const MainOutlet = () => {
    const loggedIn = useSelector(selectLoggedIn);

    return (
        <div className="container main-container">
            {loggedIn && <AppUpdateLocalLogin/>}
            <AlertList />
            <ErrorBoundary >
                <Outlet />
            </ErrorBoundary>
        </div>
    )
}

export default MainOutlet;
