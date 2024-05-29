export default class B2BError extends Error {
    url?: string;
    debug?: unknown;
    code?: string | number;

    constructor(message: string, url?: string, debug?: unknown, code?: string | number) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.debug = debug;
        this.url = url;
        this.code = code;
    }
}

export interface SortProps<T = KeyedObject> {
    field: keyof T;
    ascending: boolean;
}

export interface FieldValue<T = KeyedObject> {
    field: keyof T;
    value: unknown;
}

export interface Appendable {
    newLine?: boolean;
}

export interface Selectable {
    selected?: boolean;
}

export interface EmptyObject {
}

export type LoadStatus = 'pending' | 'rejected' | 'idle';
export type OrderActionStatus = LoadStatus | 'saving' | 'promoting' | 'deleting';
export type EmailActionStatus = LoadStatus | 'fulfilled'

export interface KeyedObject<T = unknown> {
    [key:string]: T
}

export interface APIErrorResponse {
    error?: string;
    name?: string;
}
