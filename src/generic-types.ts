import {SalesOrderHeader} from "b2b-types";

export type TextInputChangeHandler<T = any> = { field?: keyof T | null, value: string | number | null }
export type SelectChangeHandler<T = any> = { field?: keyof T | null, value: string };

export interface CustomerShippingAccount {
    enabled: boolean;
    value: string;
}

