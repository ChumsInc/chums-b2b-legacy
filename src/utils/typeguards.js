import {BillToCustomer, SalesOrderHeader} from "b2b-types";

export function isBillToCustomer(customer) {
    if (!customer) {
        return false;
    }
    return (customer).ARDivisionNo !== undefined;
}


export function isSalesOrderHeader(header) {
    return !!header && (header).SalesOrderNo !== undefined;
}
