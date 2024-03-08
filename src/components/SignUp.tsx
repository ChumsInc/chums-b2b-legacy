import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import CustomerSignUp from "./CustomerSignUp";
import {DOCUMENT_TITLES, PATH_SET_PASSWORD} from "../constants/paths";
import MAPPolicy from "./MAPPolicy";
import UsagePolicy from "./UsagePolicy";
import DocumentTitle from "./DocumentTitle";
import {selectLoggedIn} from "../ducks/user/selectors";
import {useLocation, useNavigate} from "react-router";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Grid2 from "@mui/material/Unstable_Grid2";

const SignUp = () => {
    const navigate = useNavigate();
    const loggedIn = useSelector(selectLoggedIn);

    useEffect(() => {
        if (loggedIn) {
            navigate('/profile', {replace: true});
        }
    }, [loggedIn]);

    useEffect(() => {
        const params = new URLSearchParams(document.location.search);
        const hash = params.get('h') ?? '';
        const key = params.get('key') ?? '';
        if (!loggedIn && !!hash && !!key) {
            navigate(PATH_SET_PASSWORD + document.location.search, {replace: true});
        }
    }, [])

    return (
        <div>
            <DocumentTitle documentTitle={DOCUMENT_TITLES.signUp}/>
            <Typography variant="h1" component="h1" sx={{my: 3}}>Chums B2B Portal</Typography>
            <Typography component="h2" variant="h2" gutterBottom>Sign Up</Typography>
            <Grid2 container spacing={2}>
                <Grid2 xs={12} md={6}>
                    <Stack direction="column" spacing={2}>
                        <UsagePolicy/>
                        <MAPPolicy/>
                    </Stack>
                </Grid2>
                <Grid2 xs={12} md={6}>
                    <CustomerSignUp />
                </Grid2>
            </Grid2>
        </div>
    );
}
export default SignUp;
