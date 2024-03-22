import React, {useEffect, useRef} from 'react';
import {updateLocalAuth} from "../ducks/user/actions";
import {useSelector} from 'react-redux';
import {AUTH_LOCAL} from "../constants/app";
import {useAppDispatch} from "../app/configureStore";
import {selectAuthType, selectLoggedIn, selectLoginExpiry} from "../ducks/user/selectors";
import {getTokenExpirationDate} from "../utils/jwtHelper";

const oneMinute = 60 * 1000;
const fiveMinutes = 5 * oneMinute;

const AppUpdateLocalLogin = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const authType = useSelector(selectAuthType);
    const expires = useSelector(selectLoginExpiry);
    const timer = useRef<number>(0);

    useEffect(() => {
        if (!loggedIn || authType !== AUTH_LOCAL) {
            return;
        }
        dispatch(updateLocalAuth())
        if (typeof global.window !== 'undefined') {
            const now = new Date().valueOf();
            if (expires <= now) {
                return;
            }
            const expiresIn = expires - now;
            if (expiresIn > fiveMinutes) {
                timer.current = window.setTimeout(() => {
                    dispatch(updateLocalAuth())
                }, expiresIn - fiveMinutes );
            } else {
                timer.current = window.setTimeout(() => {
                    dispatch(updateLocalAuth())
                }, Math.max(expiresIn - oneMinute, 0));
            }
        }
        return () => {
            if (typeof window !== 'undefined') {
                window.clearInterval(timer.current);
            }
        }
    }, [loggedIn, authType]);

    if (!loggedIn || authType !== AUTH_LOCAL) {
        return null;
    }

    return (
        <div className="login-container" style={{display: 'none'}}/>
    )
}

export default AppUpdateLocalLogin;
