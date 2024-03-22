import {createAction} from "@reduxjs/toolkit";
import {B2BContextAlert} from "./index";

export const setAlert = createAction<Omit<B2BContextAlert, 'alertId'|'count'>>('alerts/setAlert');
export const dismissAlert = createAction<number>('alerts/dismissAlert');
export const dismissContextAlert = createAction<string>('alerts/dismissByContext');
