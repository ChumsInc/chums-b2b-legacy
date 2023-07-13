import React, {useEffect, useRef, useState} from 'react';
import {GOOGLE_CLIENT_ID} from "../constants/app";
import {signInWithGoogle} from "../ducks/user/actions";
import {useDispatch, useSelector} from "react-redux";
import {selectLoggedIn, selectLoginExpiry} from "../ducks/user/selectors";

/**
 *
 * @param {number} expires
 * @return boolean
 */
const isExpired = (expires) => {
    if (!expires || expires < 0) {
        return true;
    }
    return new Date(expires * 1000).valueOf() <= new Date().valueOf();
}

const GoogleSignInOneTap = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectLoggedIn);
    const expires = useSelector(selectLoginExpiry);
    const oneTapRef = useRef(null);
    const timerHandle = useRef(null);
    const [expired, setExpired] = useState(isExpired(expires));


    useEffect(() => {
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
        if (expired) {
            window.google?.accounts?.id?.prompt();
        }
    }, [expired]);

    if (isLoggedIn) {
        return null;
    }

    const handleGoogleResponse = (response) => {
        dispatch(signInWithGoogle(response.credential));
    }

    return (
        <span ref={oneTapRef}/>
    )
}

export default GoogleSignInOneTap;
