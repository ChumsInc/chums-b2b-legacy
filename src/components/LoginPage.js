import React from 'react';
import {Redirect} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoginLocal from "./LoginLocal";
import {DOCUMENT_TITLES, PATH_HOME} from "../constants/paths";
import Alert from '../common-components/Alert';
import GoogleSignInButton from "./GoogleSignInButton";
import DocumentTitle from "./DocumentTitle";
import {selectLoggedIn} from "../selectors/user";

const LoginPage = () => {
    const loggedIn = useSelector(selectLoggedIn);
    if (!!loggedIn) {
        return (<Redirect to={PATH_HOME}/>)
    }

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
            <Alert type="alert-danger" title="WARNING:" className="mt-5">
                Unauthorized access to this system is forbidden and will be prosecuted
                by law. By accessing this system, you agree that your actions may be monitored if unauthorized
                usage is suspected.
            </Alert>
        </div>
    )
}

export default LoginPage;
