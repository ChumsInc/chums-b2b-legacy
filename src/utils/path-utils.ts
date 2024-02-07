import {OrderType} from "../types/salesorder";
import {BasicCustomer} from "b2b-types";
import {generatePath} from "react-router-dom";
import {customerSlug} from "./customer";


export const getSalesOrderPath = (orderType: OrderType | null): string => {
    switch (orderType) {
        case 'cart':
            return '/account/:customerSlug/carts/:salesOrderNo';
        case 'past':
        case 'invoice':
            return '/account/:customerSlug/invoices/so/:salesOrderNo';
        default:
            return '/account/:customerSlug/orders/:salesOrderNo';
    }
}

export const genSalesOrderPath = (customer: BasicCustomer, salesOrderNo: string, orderType: OrderType | null) => {
    return generatePath(getSalesOrderPath(orderType), {customerSlug: customerSlug(customer), salesOrderNo});
}

export const genInvoicePath = (customer: BasicCustomer, invoiceNo: string, invoiceType?: string) => {
    return generatePath(`/account/:customerSlug/invoices/:invoiceType/:invoiceNo`, {
        customerSlug: customerSlug(customer),
        invoiceType: invoiceType ?? 'IN',
        invoiceNo: invoiceNo,
    })
};

export const customerUserPath = '/account/:customerSlug/users/:id?';
