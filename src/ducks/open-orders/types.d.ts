import {Editable, SalesOrder, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {Appendable, OrderActionStatus} from "../../types/generic";

export type EditableDetailLine = SalesOrderDetailLine & Editable & Appendable;

export interface OpenOrderDetailList {
    [key:string]: EditableDetailLine
}

export interface EditableSalesOrderHeader extends SalesOrderHeader {
    actionStatus: OrderActionStatus;
    changed?: boolean;
}
export interface EditableSalesOrder extends SalesOrder {
    actionStatus?: OrderActionStatus;
    changed?: boolean;
    detail: OpenOrderDetailList;
}

export interface OpenOrderList {
    [key:string]: EditableSalesOrder|EditableSalesOrderHeader;
}

export interface ActionStatusList {
    [key:string]: OrderActionStatus;
}
