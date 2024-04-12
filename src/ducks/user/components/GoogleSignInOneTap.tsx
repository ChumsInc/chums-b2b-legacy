import React from 'react';
import {signInWithGoogle} from "../actions";
import {useAppDispatch} from "../../../app/configureStore";
import {useGoogleOneTapLogin} from "@react-oauth/google";

const isExpired = (expires: number) => {
    if (!expires || expires < 0) {
        return true;
    }
    return new Date(expires * 1000).valueOf() <= new Date().valueOf();
}

const GoogleSignInOneTap = () => {
    const dispatch = useAppDispatch();

    useGoogleOneTapLogin({
        onSuccess: credentialResponse => {
            if (credentialResponse?.credential) {
                dispatch(signInWithGoogle(credentialResponse.credential));
            }
        }
    })

    return (
        <span/>
    )
}

export default GoogleSignInOneTap;
