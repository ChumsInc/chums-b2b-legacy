import React from 'react';
import {selectLoggedIn} from "../ducks/user/selectors";
import {useSelector} from "react-redux";
import AppUpdateLocalLogin from "../components/AppUpdateLocalLogin";
import AlertList from "../ducks/alerts/AlertList";
import {Outlet, Route, Routes} from "react-router-dom";
import ErrorBoundary from "../common-components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


const MainOutlet = () => {
    const loggedIn = useSelector(selectLoggedIn);

    return (
        <>
            <Header/>
            <main>
                <div className="container main-container">
                    {loggedIn && <AppUpdateLocalLogin/>}
                    <AlertList />
                    <ErrorBoundary >
                        <Outlet />
                    </ErrorBoundary>
                </div>
            </main>
            <Footer/>
        </>
    )
}

export default MainOutlet;
