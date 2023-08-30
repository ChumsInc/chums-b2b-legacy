import {compile} from "path-to-regexp";
import {OrderType} from "@/types/salesorder";
import {BasicCustomer} from "b2b-types";
import {generatePath} from "react-router-dom";
import {customerSlug} from "@/utils/customer";


export const getSalesOrderPath = (orderType:OrderType|null):string => {
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

export const genSalesOrderPath = (customer:BasicCustomer, salesOrderNo: string, orderType:OrderType|null) => {
    return generatePath(getSalesOrderPath(orderType), {customerSlug: customerSlug(customer), salesOrderNo});
}

export const genInvoicePath = (customer:BasicCustomer, invoiceNo: string, invoiceType?:string) => {
    return generatePath(`/account/:customerSlug/invoices/:invoiceType/:invoiceNo`, {
        customerSlug: customerSlug(customer),
        invoiceType: invoiceType ?? 'IN',
        invoiceNo: invoiceNo,
    })
};

export const buildPath = (path:string, props:Object):string => {
    try {
        let query;
        let compiledQuery;
        if (Array.isArray(path)) {
            [path, query] = path;
        }
        const toPath = compile(path, {encode: encodeURIComponent});
        const pathname = toPath({...props});
        if (!!query) {
            const toQuery = compile(query, {encode: encodeURIComponent});
            compiledQuery = toQuery({...props});
        }
        return !!compiledQuery ? [pathname, compiledQuery].join('?') : pathname;
    } catch (e:unknown) {
        if (e instanceof Error) {
            console.log('buildPath()', e.message, path, props);
        }
        return path;
    }
};
