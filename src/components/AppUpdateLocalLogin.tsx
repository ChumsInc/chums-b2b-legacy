import React, {useEffect, useRef} from 'react';
import {updateLocalAuth} from "../ducks/user/actions";
import {useSelector} from 'react-redux';
import {useAppDispatch} from "../app/configureStore";
import {selectLoggedIn, selectLoginExpiry} from "../ducks/user/selectors";
import {useIsSSR} from "../hooks/is-server-side";

const oneMinute = 60 * 1000;
const fiveMinutes = 5 * oneMinute;

const AppUpdateLocalLogin = () => {
    const dispatch = useAppDispatch();
    const isSSR = useIsSSR();
    const isLoggedIn = useSelector(selectLoggedIn);
    const expires = useSelector(selectLoginExpiry);
    const timer = useRef<number>(0);

    useEffect(() => {
        if (isSSR || !isLoggedIn) {
            return;
        }
        if (typeof global.window !== 'undefined') {
            const now = new Date().valueOf();
            const willExpire = new Date(expires * 1000).valueOf();
            if (willExpire <= now) {
                return;
            }
            const expiresIn = willExpire - now;
            if (expiresIn > fiveMinutes) {
                timer.current = window.setTimeout(() => {
                    dispatch(updateLocalAuth())
                }, expiresIn - fiveMinutes);
            } else {
                timer.current = window.setTimeout(() => {
                    dispatch(updateLocalAuth())
                }, Math.max(expiresIn - oneMinute, 0));
            }
        }
        return () => {
            if (!isSSR) {
                window.clearInterval(timer.current);
            }
        }
    }, [isLoggedIn]);

    if (!isLoggedIn) {
        return null;
    }

    return (
        <div className="login-container" style={{display: 'none'}}/>
    )
}

export default AppUpdateLocalLogin;
