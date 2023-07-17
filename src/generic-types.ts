import {PreloadedState} from "./_types";

export type TextInputChangeHandler<T = any> = { field?: keyof T | null, value: string | number | null }
export type SelectChangeHandler<T = any> = { field?: keyof T | null, value: string };

export interface CustomerShippingAccount {
    enabled: boolean;
    value: string;
}

declare global {
    interface Window {
        __PRELOADED_STATE__?: PreloadedState;
    }
}
