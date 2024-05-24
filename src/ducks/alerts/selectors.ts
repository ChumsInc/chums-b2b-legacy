import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {alertSorter} from "./utils";

export const selectAlerts = (state: RootState) => state.alerts.list ?? [];
export const selectContextAlerts = createSelector(
    [selectAlerts, (state:RootState, context?:string) => context],
    (list, context) => {
        return list.filter(alert => !context || alert.context === context).sort(alertSorter);
    }
)
