import {createAction, createReducer, createSelector, isRejected} from "@reduxjs/toolkit";
import {ALERT_CONTEXT_LOGIN, SET_ALERT, SET_LOGGED_IN} from "../../constants/actions";
import {RootState} from "../../app/configureStore";
import {setLoggedIn} from "../user/actions";
import {isDeprecatedSetAlertAction, isDeprecatedSetLoggedInAction} from "../../types/actions";
import {AlertColor} from "@mui/material/Alert";


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

export const setAlert = createAction<Omit<B2BContextAlert, 'alertId'|'count'>>('alerts/setAlert');
export const dismissAlert = createAction<number>('alerts/dismissAlert');
export const dismissContextAlert = createAction<string>('alerts/dismissByContext');

export const selectAlerts = (state: RootState) => state.alerts.list ?? [];
export const selectContextAlerts = createSelector(
    [selectAlerts, (state:RootState, context?:string) => context],
    (list, context) => {
        return list.filter(alert => !context || alert.context === context).sort(alertSorter);
    }
)// (state: RootState, context?: string) => state.alerts.list.filter(alert => !context || alert.context === context).sort(alertSorter);

const alertSorter = (a: B2BContextAlert, b: B2BContextAlert): number => a.alertId - b.alertId;

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
                const alert:B2BContextAlert = {...action.payload, severity: action.payload.severity ?? 'warning', alertId: state.index, count: 1};
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
        .addMatcher((action) => isRejected(action) && !!action.error,
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
                            const newAlert:B2BContextAlert = {severity: 'warning', ...action.props, alertId: state.index, count: 1};
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
