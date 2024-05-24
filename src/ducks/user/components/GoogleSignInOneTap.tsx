import React from 'react';
import {signInWithGoogle} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {useGoogleOneTapLogin} from "@react-oauth/google";

const GoogleSignInOneTap = ({onDone}:{onDone?: () => void}) => {
    const dispatch = useAppDispatch();

    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            if (credentialResponse?.credential) {
                dispatch(signInWithGoogle(credentialResponse.credential));
            }
            if (onDone) {
                onDone();
            }
        },
        onError: () => {
            if (onDone) {
                onDone();
            }
        },
    })

    return (
        <span/>
    )
}

export default GoogleSignInOneTap;
