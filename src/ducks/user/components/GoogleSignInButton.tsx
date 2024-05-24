import React, {useRef} from 'react';
import {signInWithGoogle} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

const GoogleSignInButton = () => {
    const dispatch = useAppDispatch();

    const handleGoogleResponse = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            dispatch(signInWithGoogle(credentialResponse.credential));
        }
    }

    return (
        <GoogleLogin onSuccess={handleGoogleResponse} useOneTap use_fedcm_for_prompt/>
    )
}

export default GoogleSignInButton;
