import React from 'react';
import {selectLoggedIn} from "../ducks/user/selectors";
import {useSelector} from "react-redux";
import AppUpdateLocalLogin from "../components/AppUpdateLocalLogin";
import AlertList from "../ducks/alerts/AlertList";
import {Outlet} from "react-router-dom";
import ErrorBoundary from "../common-components/ErrorBoundary";
import Header from "./Header";
import Footer from "./Footer";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";


const MainOutlet = () => {
    const loggedIn = useSelector(selectLoggedIn);

    return (
        <>
            <Header/>
            <Box component="main" sx={{marginTop: '100px', marginBottom: '3rem'}}>
                <Container maxWidth="xl">
                    {loggedIn && <AppUpdateLocalLogin/>}
                    <AlertList/>
                    <ErrorBoundary>
                        <Outlet/>
                    </ErrorBoundary>
                </Container>
            </Box>
            <Footer/>
        </>
    )
}

export default MainOutlet;
