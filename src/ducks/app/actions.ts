import {ALERT_TYPES, SET_ALERT, SET_ROWS_PER_PAGE} from "../../constants/actions";
import localStore from "../../utils/LocalStore";
import {STORE_USER_PREFS} from "../../constants/stores";
import {createAction} from "@reduxjs/toolkit";
import {AppDispatch} from "../../app/configureStore";


export const handleError = (err: Error, context: string = '') => {
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


export const _setRowsPerPage = (rowsPerPage: number) => (dispatch: AppDispatch) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS, {}) || {}, rowsPerPage});
    dispatch({type: SET_ROWS_PER_PAGE, rowsPerPage});
};

export const setCustomerTab = createAction<number>('app/setCustomerTab')
export const setLifestyle = createAction<string | undefined | null>('app/setLifestyle');
