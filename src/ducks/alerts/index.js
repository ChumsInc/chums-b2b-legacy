import {createAction, createReducer, isRejected} from "@reduxjs/toolkit";
import {ALERT_CONTEXT_LOGIN, SET_ALERT, SET_LOGGED_IN} from "../../constants/actions";

/**
 *
 * @type {AlertsState}
 */
const initialAlertState = {
    index: 0,
    list: [],
}

/**
 *
 * @type {PayloadActionCreator<B2BAlert, "alerts/setAlert">}
 */
export const setAlert = createAction('alerts/setAlert');

/**
 *
 * @type {PayloadActionCreator<number, "alerts/dismissAlert">}
 */
export const dismissAlert = createAction('alerts/dismissAlert');

export const selectAlerts = (state) => state.alerts.list;
export const selectContextAlerts = (context) => (state) => state.list.filter(alert => alert.context === context);


/**
 *
 * @param {B2BAlert} a
 * @param {B2BAlert} b
 * @return {number}
 */
const alertSorter = (a, b) => a.id - b.id;

const alertsReducer = createReducer(initialAlertState, (builder) => {
    builder
        .addCase(setAlert, (state, action) => {
            state.index += 1;
            const [alert] = state.list.filter(alert => alert.context === action.payload.context ?? 'N/A');
            if (alert) {
                state.list = [
                    ...state.list.filter(a => a.id !== alert.id),
                    {...alert, count: alert.count + 1},
                ].sort(alertSorter);
            } else {
                state.list = [
                    ...state.list,
                    {type: 'warning', ...action.payload, id: state.index, count: 1}
                ].sort(alertSorter);
            }
        })
        .addCase(dismissAlert, (state, action) => {
            state.list = state.list.filter(alert => alert.id !== action.payload).sort(alertSorter);
        })
        .addMatcher((action) => isRejected(action) && !!action.error,
            (state, action) => {
                state.index += 1;
                const context = action.type.replace('/rejected', '');
                const [alert] = state.list.filter(alert => alert.context === context ?? 'N/A');
                if (alert) {
                    state.list = [
                        ...state.list.filter(a => a.id !== alert.id),
                        {...alert, count: alert.count + 1},
                    ].sort(alertSorter);
                } else {
                    state.list = [
                        ...state.list,
                        {type: 'warning', ...action.payload, id: state.index, count: 1}
                    ].sort(alertSorter);
                }
            })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_ALERT:
                    state.index += 1;
                    const [alert] = state.list.filter(alert => alert.context === action.props.context ?? 'N/A');
                    if (alert) {
                        state.list = [
                            ...state.list.filter(a => a.id !== alert.id),
                            {...alert, count: alert.count + 1},
                        ].sort(alertSorter);
                    } else {
                        state.list = [
                            ...state.list,
                            {type: 'warning', ...action.props, id: state.index, count: 1}
                        ].sort(alertSorter);
                    }
                    return;
                case SET_LOGGED_IN:
                    if (action.loggedIn) {
                        state.list = state.list.filter(alert => alert.context !== ALERT_CONTEXT_LOGIN).sort(alertSorter);
                    }
                    return;
            }
        })
});

export default alertsReducer;
