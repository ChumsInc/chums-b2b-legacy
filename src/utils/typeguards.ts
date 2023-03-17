import {BillToCustomer, SalesOrderHeader} from "b2b-types";

export function isBillToCustomer(customer:BillToCustomer|{}|null):customer is BillToCustomer {
    if (!customer) {
        return false;
    }
    return (customer as BillToCustomer).ARDivisionNo !== undefined;
}


export function isSalesOrderHeader(header:SalesOrderHeader|{}|null):header is SalesOrderHeader {
    return !!header && (header as SalesOrderHeader).SalesOrderNo !== undefined;
}
