import {Editable, EmailResponse, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {Appendable, EmptyObject} from "../../_types";

export interface SalesOrderState {
    salesOrderNo: string;
    header: (SalesOrderHeader & Editable) | EmptyObject;
    detail: (SalesOrderDetailLine & Editable & Appendable)[];
    orderType: 'cart'|'open'|'past'|'master'|'invoices';
    readOnly: boolean;
    processing: boolean;
    sendEmailStatus: EmailResponse | null;
    sendingEmail: boolean;
    attempts: number;
    loading: boolean;
}

