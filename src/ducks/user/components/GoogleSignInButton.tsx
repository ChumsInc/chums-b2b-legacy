import React from 'react';
import {signInWithGoogle} from "../actions";
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {selectAppNonce} from "../../app/selectors";

const GoogleSignInButton = () => {
    const dispatch = useAppDispatch();
    const nonce = useAppSelector(selectAppNonce);

    const handleGoogleResponse = (credentialResponse: CredentialResponse) => {
        if (credentialResponse.credential) {
            dispatch(signInWithGoogle(credentialResponse.credential));
        }
    }


    return (
        <GoogleLogin onSuccess={handleGoogleResponse} useOneTap use_fedcm_for_prompt={true} nonce={nonce ?? undefined}/>
    )
}

export default GoogleSignInButton;
