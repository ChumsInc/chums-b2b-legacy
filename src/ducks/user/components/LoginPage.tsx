import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import LoginLocal from "./LoginLocal";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../../../constants/paths";
import Alert from '@mui/material/Alert';
import GoogleSignInButton from "./GoogleSignInButton";
import DocumentTitle from "../../../components/DocumentTitle";
import {selectLoggedIn} from "../selectors";
import Typography from "@mui/material/Typography";
import {useLocation, useNavigate} from "react-router";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

const LoginPage = () => {
    const loggedIn = useSelector(selectLoggedIn);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (loggedIn && location.pathname === '/login') {
            navigate(PATH_PROFILE, {replace: true});
        }
    }, [loggedIn]);

    return (
        <Container maxWidth="sm">
            <DocumentTitle documentTitle={DOCUMENT_TITLES.login}/>
            <Typography variant="h1" component="h1" sx={{my: 3}}>Chums B2B Portal</Typography>
            <Typography variant="body1">Hey there friend! This site is for authorized Chums dealers only.</Typography>

            <Stack direction="column" sx={{mt: 5}} spacing={3}>
                <Typography component="h2" variant="h3">Login</Typography>
                <Box>
                    <Typography component="h3">Login with Google</Typography>
                    <GoogleSignInButton/>
                </Box>
                <Divider/>
                <LoginLocal/>
            </Stack>
            <Alert severity="error" title="WARNING:" sx={{my: 3, p: 5}}>
                <Typography sx={{fontWeight: 'bold', marginRight: 1}}>WARNING:</Typography>
                <Typography>
                    Unauthorized access to this system is forbidden and will be prosecuted
                    by law. By accessing this system, you agree that your actions may be monitored if unauthorized
                    usage is suspected.
                </Typography>
            </Alert>
        </Container>
    )
}

export default LoginPage;
