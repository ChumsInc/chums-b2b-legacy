import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import SignUpCustomer from "./SignUpCustomer";
import {Redirect, useHistory} from "react-router-dom";
import {DOCUMENT_TITLES, PATH_HOME, PATH_SET_PASSWORD} from "../constants/paths";
import MAPPolicy from "./MAPPolicy";
import UsagePolicy from "./UsagePolicy";
import DocumentTitle from "./DocumentTitle";
import {selectLoggedIn} from "../ducks/user/selectors";

const SignUp = () => {
    const history = useHistory();
    const loggedIn = useSelector(selectLoggedIn);

    useEffect(() => {
        const params = new URLSearchParams(document.location.search);
        const hash = params.get('h') ?? '';
        const key = params.get('key') ?? '';
        if (!loggedIn && !!hash && !!key) {
            history.push(PATH_SET_PASSWORD + document.location.search);
        }
    }, [])

    if (!!loggedIn) {
        return (<Redirect to={PATH_HOME}/>)
    }

    return (
        <div>
            <DocumentTitle documentTitle={DOCUMENT_TITLES.signUp}/>
            <h2>Sign Up</h2>
            <div className="row">
                <div className="col-md-6">
                    <UsagePolicy/>
                    <MAPPolicy/>
                </div>
                <div className="col-md-6">
                    <SignUpCustomer/>
                </div>
            </div>
        </div>
    );
}
export default SignUp;
