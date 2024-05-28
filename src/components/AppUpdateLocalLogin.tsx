import React, {useEffect, useRef, useState} from 'react';
import {updateLocalAuth} from "../ducks/user/actions";
import {useSelector} from 'react-redux';
import {useAppDispatch} from "../app/configureStore";
import {selectLoggedIn, selectLoginExpiry} from "../ducks/user/selectors";
import {useIsSSR} from "../hooks/is-server-side";

const oneMinute = 60 * 1000;
const fiveMinutes = 5 * oneMinute;

function useExpiresIn(expiry:number) {
    const [expiresIn, setExpiresIn] = useState(0);
    const timer = useRef(0);
    useEffect(() => {
        timer.current = window.setInterval(() => {
            const expiresIn = (expiry * 1000) - new Date().valueOf();
            setExpiresIn(expiresIn);
        }, oneMinute);
        return () => {
            window.clearInterval(timer.current);
        }
    }, [expiry])
    return expiresIn
}

const AppUpdateLocalLogin = () => {
    const dispatch = useAppDispatch();
    const isSSR = useIsSSR();
    const isLoggedIn = useSelector(selectLoggedIn);
    const expires = useSelector(selectLoginExpiry);
    const expiresIn = useExpiresIn(expires);

    useEffect(() => {
        if (isSSR || !isLoggedIn) {
            return;
        }
        if (isLoggedIn && expiresIn < fiveMinutes) {
            console.log('dispatching updateLocalAuth()');
            dispatch(updateLocalAuth())
        }
    }, [dispatch, isLoggedIn, expiresIn]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="login-container" style={{display: 'none'}} data-expires-in={expiresIn}/>
    )
}

export default AppUpdateLocalLogin;
