import {SalesOrderHeader} from "b2b-types";

export interface OpenOrdersState {
    list: SalesOrderHeader[],
    loading: boolean;
}
