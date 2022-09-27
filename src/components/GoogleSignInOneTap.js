import React, {useEffect, useRef, useState} from 'react';
import {GOOGLE_CLIENT_ID} from "../constants/app";
import {signInWithGoogle} from "../actions/user";
import {useDispatch, useSelector} from "react-redux";
import {loadScript} from "../utils/general";


const GoogleSignInOneTap = () => {
    const dispatch = useDispatch();
    const oneTapRef = useRef(null);
    const expires = useSelector(state => state?.user?.tokenExpires ?? 0);
    const [expired, setExpired] = useState(expires === 0 || (new Date(expires * 1000) < new Date()));
    const [tHandle, setTHandle] = useState(0);


    useEffect(() => {
        loadScript('https://accounts.google.com/gsi/client')
            .then(() => {
                if (window.google) {
                    window.google.accounts?.id?.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleResponse,
                    });
                }
            });
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

    const handleGoogleResponse = (response) => {
        console.log('GoogleSignInOneTap.handleGoogleResponse()', response);
        dispatch(signInWithGoogle(response.credential));
    }

    return (
        <span ref={oneTapRef} />
    )
}

export default GoogleSignInOneTap;
