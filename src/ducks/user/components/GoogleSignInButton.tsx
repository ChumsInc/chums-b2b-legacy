import React, {useEffect, useRef} from 'react';
import {GOOGLE_CLIENT_ID} from "@/constants/app";
import {signInWithGoogle} from "../actions";
import {useAppDispatch} from "@/app/configureStore";

const GoogleSignInButton = () => {
    const dispatch = useAppDispatch();
    const googleButtonRef = useRef(null);

    useEffect(() => {
        if (window.google && googleButtonRef.current) {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            })
            window.google.accounts.id.renderButton(
                googleButtonRef.current,
                {text: 'signin_with', theme: 'filled_blue', shape: 'rectangular', size: 'large', type: 'standard'}
            );
            window.google.accounts.id.prompt()
        }
    }, [])

    const handleGoogleResponse = (response: google.accounts.id.CredentialResponse) => {
        // console.log('handleGoogleResponse()', response);
        dispatch(signInWithGoogle(response.credential));
    }

    return (
        <div ref={googleButtonRef}/>
    )
}

export default GoogleSignInButton;
