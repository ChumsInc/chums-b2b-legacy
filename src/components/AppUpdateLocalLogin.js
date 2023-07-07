import React, {useEffect} from 'react';
import {updateLocalAuth} from "../actions/user";
import {useSelector} from 'react-redux';
import {AUTH_LOCAL} from "../constants/app";
import {useAppDispatch} from "../app/configureStore";
import {selectAuthType, selectLoggedIn} from "../selectors/user";


const AppUpdateLocalLogin = () => {
    const dispatch = useAppDispatch();
    const loggedIn = useSelector(selectLoggedIn);
    const authType = useSelector(selectAuthType);

    useEffect(() => {
        if (loggedIn) {
            dispatch(updateLocalAuth())
        }
    }, [loggedIn]);

    if (!loggedIn || authType !== AUTH_LOCAL) {
        return null;
    }

    return (
        <div className="login-container" style={{display: 'none'}}/>
    )
}

export default AppUpdateLocalLogin;
