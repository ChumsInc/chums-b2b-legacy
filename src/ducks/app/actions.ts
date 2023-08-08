import {ALERT_TYPES, SET_ALERT, SET_ROWS_PER_PAGE} from "../../constants/actions";
import {fetchPOST} from '../../utils/fetch';
import localStore from "../../utils/LocalStore";
import {STORE_USER_PREFS} from "../../constants/stores";
import {createAction} from "@reduxjs/toolkit";
import {AppDispatch, RootState} from "../../app/configureStore";
import {selectVersion} from "../version";
import {selectUserProfile} from "../user/selectors";


export const handleError = (err:Error, context:string = '') => {
    console.trace(err.message);
    return {
        type: SET_ALERT,
        props: {type: ALERT_TYPES.danger, title: err.name, message: err.message, context}
    };
};

export const toggleXSNavBar = createAction('app/toggleXSNavBar');
export const setSubNavBar = createAction<string>('app/setSubNavBar');
export const setRowsPerPage = createAction('app/setRowsPerPage', (arg) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS, {}) || {}, rowsPerPage: arg});
    return {payload: arg};
})


export const _setRowsPerPage = (rowsPerPage:number) => (dispatch:AppDispatch) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS, {}) || {}, rowsPerPage});
    dispatch({type: SET_ROWS_PER_PAGE, rowsPerPage});
};

export const setCustomerTab = createAction<number>('app/setCustomerTab')
export const setLifestyle = createAction<string|undefined|null>('app/setLifestyle');

export const logError = ({message, componentStack, debug}:{
    message: string;
    componentStack?: any;
    debug?:any;
}) => (dispatch:AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        const versionNo = selectVersion(state);
        const userProfile = selectUserProfile(state);
        const url = '/api/error-reporting';
        const body = {
            message,
            componentStack: componentStack,
            user_id: userProfile?.id ?? 0,
            version: versionNo ?? '',
            debug,
        };
        fetchPOST(url, body)
            .then(res => console.log(res))
            .catch(err => console.log(err.message));
    } catch (err) {
        if (err instanceof Error) {
            console.log("()", err.message);
        }
    }
}
