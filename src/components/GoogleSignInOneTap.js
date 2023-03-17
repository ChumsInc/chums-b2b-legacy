import React, {useEffect, useRef, useState} from 'react';
import {GOOGLE_CLIENT_ID} from "../constants/app";
import {signInWithGoogle} from "../actions/user";
import {useDispatch, useSelector} from "react-redux";
import {loadScript} from "../utils/general";
import {selectLoggedIn} from "../selectors/user";


const GoogleSignInOneTap = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectLoggedIn);
    const oneTapRef = useRef(null);
    const expires = useSelector(state => state?.user?.tokenExpires ?? 0);
    const [expired, setExpired] = useState(expires === 0 || (new Date(expires * 1000) < new Date()));
    const [tHandle, setTHandle] = useState(0);


    useEffect(() => {
        if (!isLoggedIn && window.google) {
            google.accounts?.id?.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: handleGoogleResponse,
            });
            google.accounts.id.prompt()
        }
        return () => window.clearInterval(tHandle);
    }, []);

    useEffect(() => {
        window.clearInterval(tHandle);
        if (expires > 0) {
            const timer = window.setInterval(() => {
                const expired = new Date(expires * 1000).valueOf() <= new Date().valueOf();
                setExpired(expired);
            }, 1000);
            setTHandle(timer);
        }
    }, [expires]);

    useEffect(() => {
        if (expired && window.google) {
            window.google.accounts.id.prompt();
        }
    }, [expired]);

    if (isLoggedIn) {
        return null;
    }

    const handleGoogleResponse = (response) => {
        console.log('GoogleSignInOneTap.handleGoogleResponse()', response);
        dispatch(signInWithGoogle(response.credential));
    }

    return (
        <span ref={oneTapRef} />
    )
}

export default GoogleSignInOneTap;
