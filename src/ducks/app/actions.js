import {ALERT_TYPES, SET_ALERT, SET_ROWS_PER_PAGE} from "../../constants/actions";
import {fetchPOST} from '../../utils/fetch';
import localStore from "../../utils/LocalStore";
import {STORE_USER_PREFS} from "../../constants/stores";
import {createAction} from "@reduxjs/toolkit";


/**
 *
 * @param {Error} err
 * @param {String} context
 * @return {{type: string, props: {context: string, type: string, title: *, message: *}}}
 */
export const handleError = (err, context = '') => {
    console.trace(err.message, err.debug);
    return {
        type: SET_ALERT,
        props: {type: ALERT_TYPES.danger, title: err.name, message: err.message, context}
    };
};

export const toggleXSNavBar = createAction('app/toggleXSNavBar');

/**
 *
 * @type {PayloadActionCreator<string, "app/setSubNavBar">}
 */
export const setSubNavBar = createAction('app/setSubNavBar');

export const setRowsPerPage = createAction('app/setRowsPerPage', (arg) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS) || {}, rowsPerPage: arg});
    return {payload: arg};
})


export const _setRowsPerPage = (rowsPerPage) => (dispatch) => {
    localStore.setItem(STORE_USER_PREFS, {...localStore.getItem(STORE_USER_PREFS) || {}, rowsPerPage});
    dispatch({type: SET_ROWS_PER_PAGE, rowsPerPage});
};

export const setCustomerTab = createAction('app/setCustomerTab')
export const setLifestyle = createAction('app/setLifestyle');

export const logError = ({message, componentStack, debug}) => (dispatch, getState) => {
    try {
        const {app, user} = getState();
        const {versionNo = ''} = app.version;
        const {id = 0} = user?.profile;
        const url = '/api/error-reporting';
        const body = {
            message,
            componentStack: componentStack,
            user_id: id,
            version: versionNo,
            debug,
        };
        fetchPOST(url, body)
            .then(res => console.log(res))
            .catch(err => console.log(err.message));
    } catch (err) {
        console.log("()", err.message);
    }
}
