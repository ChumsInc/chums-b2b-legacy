export default class B2BError extends Error {
    url: string;
    debug: any;

    constructor(message: string, url: string, debug: any = null) {
        super(message);
        Object.setPrototypeOf(this, new.target.prototype);
        this.debug = debug;
        this.url = url;
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
