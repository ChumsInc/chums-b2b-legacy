import {BillToCustomer, Editable, SalesOrderHeader, UserRole} from "b2b-types";
import {EmptyObject} from "../_types";

export function isBillToCustomer(customer:BillToCustomer|EmptyObject|null): customer is BillToCustomer {
    if (!customer) {
        return false;
    }
    return (customer as BillToCustomer).ARDivisionNo !== undefined;
}


export function isSalesOrderHeader(header:SalesOrderHeader|null): header is SalesOrderHeader {
    return !!header && (header as SalesOrderHeader).SalesOrderNo !== undefined;
}

export function isCartHeader(header:SalesOrderHeader|null): header is (SalesOrderHeader & Editable) {
    return isSalesOrderHeader(header) && header.OrderType === 'Q';
}

export const isUserRole = (role:string|UserRole): role is UserRole => {
    return (role as UserRole).role !== undefined;
}
