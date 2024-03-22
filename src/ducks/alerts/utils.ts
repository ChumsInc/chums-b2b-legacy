import {B2BContextAlert} from "./index";

export const alertSorter = (a: B2BContextAlert, b: B2BContextAlert): number => a.alertId - b.alertId;
