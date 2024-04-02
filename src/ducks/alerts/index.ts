import {
    AsyncThunkAction,
    createReducer,
    isAsyncThunkAction,
    isFulfilled,
    isRejected, PayloadAction,
    ThunkAction
} from "@reduxjs/toolkit";
import {ALERT_CONTEXT_LOGIN, SET_ALERT, SET_LOGGED_IN} from "../../constants/actions";
import {isDeprecatedSetAlertAction, isDeprecatedSetLoggedInAction} from "../../types/actions";
import {AlertColor} from "@mui/material/Alert";
import {setLoggedIn} from '../user/actions'
import {alertSorter} from "./utils";
import {dismissAlert, dismissContextAlert, setAlert} from "./actions";
import {Action} from "redux";


export interface B2BContextAlert {
    alertId: number;
    title?: string;
    message: string;
    context?: string;
    count: number;
    severity?: AlertColor
}

export interface AlertsState {
    index: number;
    list: B2BContextAlert[];
}

const initialAlertState = (): AlertsState => ({
    index: 0,
    list: [],
})

const alertsReducer = createReducer(initialAlertState, (builder) => {
    builder
        .addCase(setAlert, (state, action) => {
            state.index += 1;
            const [alert] = state.list.filter(alert => alert.context === action.payload.context ?? 'N/A');
            if (alert) {
                alert.count = (alert.count ?? 0) + 1;
                state.list = [
                    ...state.list.filter(a => a.alertId !== alert.alertId),
                    alert,
                ].sort(alertSorter);
            } else {
                const alert: B2BContextAlert = {
                    ...action.payload,
                    severity: action.payload.severity ?? 'warning',
                    alertId: state.index,
                    count: 1
                };
                state.list = [
                    ...state.list,
                    alert
                ].sort(alertSorter);
            }
        })
        .addCase(dismissAlert, (state, action) => {
            state.list = state.list
                .filter(alert => alert.alertId !== action.payload)
                .sort(alertSorter);
        })
        .addCase(dismissContextAlert, (state, action) => {
            state.list = state.list
                .filter(alert => alert.context !== action.payload)
                .sort(alertSorter);
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload?.loggedIn) {
                state.list = [];
            }
        })
        .addMatcher(isRejected,
            (state, action) => {
                state.index += 1;
                const context = action.type.replace('/rejected', '');
                const [alert] = state.list.filter(alert => alert.context === context ?? 'N/A');
                if (alert) {
                    state.list = [
                        ...state.list.filter(a => a.alertId !== alert.alertId),
                        {...alert, count: (alert.count ?? 0) + 1},
                    ].sort(alertSorter);
                } else if (isRejected(action)) {
                    const newAlert: B2BContextAlert = {
                        severity: 'warning',
                        message: action.error.message?.replace('\x8a', '') ?? '',
                        context,
                        alertId: state.index,
                        count: 1
                    };
                    state.list = [
                        ...state.list,
                        newAlert
                    ].sort(alertSorter);
                }
            })
        .addMatcher((action) => isFulfilled(action as PayloadAction),
            (state, action) => {
            const context = action.type.replace('/fulfilled', '');
            state.list = state.list.filter(alert => alert.context !== context).sort(alertSorter);
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_ALERT:
                    if (isDeprecatedSetAlertAction(action)) {
                        state.index += 1;
                        const [alert] = state.list.filter(alert => alert.context === action.props.context ?? 'N/A');
                        if (alert) {
                            state.list = [
                                ...state.list.filter(a => a.alertId !== alert.alertId),
                                {...alert, count: (alert.count ?? 0) + 1},
                            ].sort(alertSorter);
                        } else {
                            const newAlert: B2BContextAlert = {
                                severity: 'warning', ...action.props,
                                alertId: state.index,
                                count: 1
                            };
                            state.list = [
                                ...state.list,
                                newAlert
                            ].sort(alertSorter);
                        }
                    }
                    return;
                case SET_LOGGED_IN:
                    if (isDeprecatedSetLoggedInAction(action) && action.loggedIn) {
                        state.list = state.list.filter(alert => alert.context !== ALERT_CONTEXT_LOGIN).sort(alertSorter);
                    }
                    return;
            }
        })
});

export default alertsReducer;
