import {SalesOrderHeader} from "b2b-types";

export interface CartsState {
    list: SalesOrderHeader[];
    loading: boolean;
}
