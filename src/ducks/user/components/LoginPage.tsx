import React, {useEffect} from 'react';
import {redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoginLocal from "./LoginLocal";
import {DOCUMENT_TITLES, PATH_HOME} from "../../../constants/paths";
import Alert from '@mui/material/Alert';
import GoogleSignInButton from "./GoogleSignInButton";
import DocumentTitle from "../../../components/DocumentTitle";
import {selectLoggedIn} from "../selectors";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router";

const LoginPage = () => {
    const loggedIn = useSelector(selectLoggedIn);
    const navigate = useNavigate();

    useEffect(() => {
        if (loggedIn) {
            navigate(PATH_HOME, {replace: true});
        }
    }, [loggedIn])

    return (
        <div>
            <DocumentTitle documentTitle={DOCUMENT_TITLES.login}/>
            <div className="jumbotron">
                <h1>Chums B2B Portal</h1>
                <h3>Hey there friend! This site is for authorized Chums dealers only. Please login / sign up
                    here.
                </h3>
                <hr/>
                <h4>Not an authorized dealer? Feel as though you've lost your way? {' '}
                    <a href="https://www.chums.com">Click here to shop chums.com</a>
                </h4>
            </div>
            <div>
                <div className="row">
                    <div className="col-sm-6">
                        <h3>Login with Google</h3>
                        <div><small>Login with a trusted provider.</small></div>
                        <GoogleSignInButton/>
                    </div>
                    <div className="col-sm-6">
                        <LoginLocal/>
                    </div>
                </div>
            </div>
            <Alert severity="error" title="WARNING:" sx={{my: 3, p:5}}>
                <Typography sx={{fontWeight: 'bold', marginRight: 1}}>WARNING:</Typography>
                <Typography>
                    Unauthorized access to this system is forbidden and will be prosecuted
                    by law. By accessing this system, you agree that your actions may be monitored if unauthorized
                    usage is suspected.
                </Typography>
            </Alert>
        </div>
    )
}

export default LoginPage;
