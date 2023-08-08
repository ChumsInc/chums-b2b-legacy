import {Editable, EmailResponse, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {Appendable, EmptyObject} from "../../_types";

export type OrderType = 'cart'|'open'|'past'|'master'|'invoice';

export interface SalesOrderState {
    salesOrderNo: string;
    header: (SalesOrderHeader & Editable) | null;
    detail: (SalesOrderDetailLine & Editable & Appendable)[];
    orderType: OrderType|null;
    readOnly: boolean;
    processing: boolean;
    sendEmailStatus: EmailResponse | null;
    sendingEmail: boolean;
    attempts: number;
    loading: boolean;
}

