import React, {useEffect, useRef, useState} from 'react';
import {GOOGLE_CLIENT_ID} from "../../../constants/app";
import {signInWithGoogle} from "../actions";
import {useSelector} from "react-redux";
import {selectLoggedIn, selectLoginExpiry} from "../selectors";
import {useAppDispatch} from "../../../app/configureStore";
import {redirect} from "react-router-dom";

const isExpired = (expires: number) => {
    if (!expires || expires < 0) {
        return true;
    }
    return new Date(expires * 1000).valueOf() <= new Date().valueOf();
}

const GoogleSignInOneTap = ({onSignIn}:{
    onSignIn: () => void;
}) => {
    const dispatch = useAppDispatch();
    const isLoggedIn = useSelector(selectLoggedIn);
    const expires = useSelector(selectLoginExpiry);
    const oneTapRef = useRef(null);
    const timerHandle = useRef(0);
    const [expired, setExpired] = useState(isExpired(expires));

    const handleGoogleResponse = (response: google.accounts.id.CredentialResponse) => {
        dispatch(signInWithGoogle(response.credential));
        onSignIn();
    }

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (window?.google && google.accounts?.id) {
            google.accounts?.id?.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
        }
        if (!isLoggedIn && window.google) {
            google.accounts.id.prompt()
        }
        return () => window.clearInterval(timerHandle.current);
    }, [window?.google]);

    useEffect(() => {
        if (isLoggedIn) {
            redirect('/profile');
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        window.clearInterval(timerHandle.current);
        if (expires > 0) {
            const now = new Date();
            const checkTime = new Date(expires * 1000).valueOf() - now.valueOf();
            timerHandle.current = window.setInterval(() => {
                setExpired(isExpired(expires));
            }, 60000);
        }
    }, [expires]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (expired) {
            window.google?.accounts?.id?.prompt();
        }
    }, [expired]);

    if (isLoggedIn) {
        return null;
    }

    if (typeof window === 'undefined') {
        return null;
    }

    return (
        <span ref={oneTapRef}/>
    )
}

export default GoogleSignInOneTap;
