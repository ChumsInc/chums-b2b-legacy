export default class B2BError extends Error {
    url?: string;
    debug?: any;
    code?: string | number;

    constructor(message: string, url?: string, debug?: any, code?: string | number) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.debug = debug;
        this.url = url;
        this.code = code;
    }
}

export interface SortProps<T = any> {
    field: keyof T,
    ascending: boolean,
}

export interface FieldValue<T = any> {
    field: keyof T,
    value: any
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

export interface KeyedObject<T = any> {
    [key:string]: T
}
