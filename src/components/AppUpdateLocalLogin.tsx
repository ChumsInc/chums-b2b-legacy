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
    const now = useRef<number>(0);

    useEffect(() => {
        if (isSSR || !isLoggedIn) {
            return;
        }
        const _now = new Date().valueOf();
        now.current = _now;
        const willExpire = new Date(expires * 1000).valueOf();
        const expiresIn = willExpire - _now;
        if (expiresIn < fiveMinutes) {
            dispatch(updateLocalAuth())
        } else {
            timer.current = window.setInterval(() => {
                now.current = new Date().valueOf();
            }, oneMinute);
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
        <div className="login-container" style={{display: 'none'}} data-now={now.current}/>
    )
}

export default AppUpdateLocalLogin;
