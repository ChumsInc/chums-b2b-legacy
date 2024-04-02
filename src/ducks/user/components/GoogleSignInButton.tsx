import React, {useEffect, useRef} from 'react';
import {GOOGLE_CLIENT_ID} from "../../../constants/app";
import {signInWithGoogle} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";

const GoogleSignInButton = () => {
    const dispatch = useAppDispatch();
    const googleButtonRef = useRef(null);

    const handleGoogleResponse = (credentialResponse: CredentialResponse) => {
        console.log('handleGoogleResponse()', credentialResponse);
        if (credentialResponse.credential) {
            dispatch(signInWithGoogle(credentialResponse.credential));
        }
    }

    // useEffect(() => {
    //     if (typeof window === 'undefined') {
    //         return;
    //     }
    //     if (window.google) {
    //         window.google.accounts.id.initialize({
    //             client_id: GOOGLE_CLIENT_ID,
    //             callback: handleGoogleResponse,
    //         });
    //
    //         if (googleButtonRef.current) {
    //             window.google.accounts.id.renderButton(
    //                 googleButtonRef.current,
    //                 {
    //                     text: 'signin_with',
    //                     theme: 'outline',
    //                     shape: 'rectangular',
    //                     size: 'large',
    //                     type: 'standard',
    //                 }
    //             );
    //         }
    //         // window.google.accounts.id.prompt()
    //     }
    // }, [])


    return (
        <GoogleLogin onSuccess={handleGoogleResponse} useOneTap use_fedcm_for_prompt />
    )
}

export default GoogleSignInButton;
