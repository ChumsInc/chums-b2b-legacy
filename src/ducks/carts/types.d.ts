import {SalesOrderHeader} from "b2b-types";

export interface CartsState {
    customerKey: string|null;
    list: SalesOrderHeader[];
    loading: boolean;
}
