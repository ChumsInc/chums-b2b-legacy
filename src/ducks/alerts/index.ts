import {createAction, createReducer, isRejected} from "@reduxjs/toolkit";
import {ALERT_CONTEXT_LOGIN, SET_ALERT, SET_LOGGED_IN} from "@/constants/actions";
import {RootState} from "@/app/configureStore";
import {AlertsState, B2BContextAlert} from "./types";
import {setLoggedIn} from "../user/actions";


const initialAlertState = (): AlertsState => ({
    index: 0,
    list: [],
})

export const setAlert = createAction<Omit<B2BContextAlert, 'id'>>('alerts/setAlert');
export const dismissAlert = createAction<number>('alerts/dismissAlert');
export const dismissContextAlert = createAction<string>('alerts/dismissByContext');

export const selectAlerts = (state: RootState) => state.alerts.list ?? [];
export const selectContextAlerts = (context: string) => (state: RootState) => state.alerts.list.filter(alert => alert.context === context);

const alertSorter = (a: B2BContextAlert, b: B2BContextAlert): number => a.id - b.id;

const alertsReducer = createReducer(initialAlertState, (builder) => {
    builder
        .addCase(setAlert, (state, action) => {
            state.index += 1;
            const [alert] = state.list.filter(alert => alert.context === action.payload.context ?? 'N/A');
            if (alert) {
                state.list = [
                    ...state.list.filter(a => a.id !== alert.id),
                    {...alert, count: (alert.count ?? 0) + 1},
                ].sort(alertSorter);
            } else {
                state.list = [
                    ...state.list,
                    {...action.payload, type: action.payload.type ?? 'warning', id: state.index, count: 1}
                ].sort(alertSorter);
            }
        })
        .addCase(dismissAlert, (state, action) => {
            state.list = state.list
                .filter(alert => alert.id !== action.payload)
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
                        ...state.list.filter(a => a.id !== alert.id),
                        {...alert, count: (alert.count ?? 0) + 1},
                    ].sort(alertSorter);
                } else {
                    const newAlert: B2BContextAlert = {
                        type: 'warning',
                        message: action.error.message ?? '',
                        context,
                        id: state.index,
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
                    state.index += 1;
                    const [alert] = state.list.filter(alert => alert.context === action.props.context ?? 'N/A');
                    if (alert) {
                        state.list = [
                            ...state.list.filter(a => a.id !== alert.id),
                            {...alert, count: (alert.count ?? 0) + 1},
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
