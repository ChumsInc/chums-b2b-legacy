import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import SignUpCustomer from "./SignUpCustomer";
import {DOCUMENT_TITLES, PATH_SET_PASSWORD} from "../constants/paths";
import MAPPolicy from "./MAPPolicy";
import UsagePolicy from "./UsagePolicy";
import DocumentTitle from "./DocumentTitle";
import {selectLoggedIn} from "../ducks/user/selectors";
import {useLocation} from "react-router";

const SignUp = () => {
    const location = useLocation();
    const loggedIn = useSelector(selectLoggedIn);

    useEffect(() => {
        const params = new URLSearchParams(document.location.search);
        const hash = params.get('h') ?? '';
        const key = params.get('key') ?? '';
        if (!loggedIn && !!hash && !!key) {
            location.replace(PATH_SET_PASSWORD + document.location.search)
        }
    }, [])

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
