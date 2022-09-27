import React, {useEffect, useRef} from 'react';
import {GOOGLE_CLIENT_ID} from "../constants/app";
import {signInWithGoogle} from "../actions/user";
import {useDispatch, useSelector} from "react-redux";
import {loadScript} from "../utils/general";


const GoogleSignInOneTap = () => {
    const dispatch = useDispatch();
    const oneTapRef = useRef(null);
    const expires = useSelector(state => state?.user?.tokenExpires ?? 0);


    useEffect(() => {
        loadScript('https://accounts.google.com/gsi/client')
            .then(() => {
                if (expires > 0 && new Date().valueOf() > expires * 1000) {
                    return null;
                }
                if (window.google) {
                    window.google.accounts.id.initialize({
                        client_id: GOOGLE_CLIENT_ID,
                        callback: handleGoogleResponse,

                    })
                    window.google.accounts.id.prompt()
                }
            })
    }, [])

    const handleGoogleResponse = (response) => {
        console.log('GoogleSignInOneTap.handleGoogleResponse()', response);
        dispatch(signInWithGoogle(response.credential));
    }

    return (
        <span ref={oneTapRef} />
    )
}

export default GoogleSignInOneTap;
