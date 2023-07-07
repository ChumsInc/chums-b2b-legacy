import {defaultSort} from "./index";
import Decimal from "decimal.js";

/**
 *
 * @param {InvoiceHeader} invoice
 * @return {Decimal}
 */
export const invoiceTotal = (invoice) => {
    return new Decimal(a.TaxableSalesAmt ?? 0).add(a.NonTaxableSalesAmt ?? 0).sub(a.DiscountAmt ?? 0)
}
/**
 *
 * @param {InvoiceSortProps} sort
 * @return {function(InvoiceHeader, InvoiceHeader): number}
 */
export const invoicesSorter = (sort = defaultSort) => (a, b) => {
    const sortMod = sort.ascending ? 1 : -1;
    switch (sort.field) {
        case 'InvoiceDate':
            return ((a.InvoiceDate === b.InvoiceDate)
                ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1)
                : (a.InvoiceDate > b.InvoiceDate ? 1 : -1)
            ) * sortMod;
        case "SalesOrderNo":
        case 'CustomerPONo':
        case 'OrderDate':
            return (((a.SalesOrderNo ?? '') === (b.SalesOrderNo ?? ''))
                    ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1)
                    : ((a.SalesOrderNo ?? '') > (b.SalesOrderNo ?? '') ? 1 : -1)
            ) * sortMod;
        case 'TaxableSalesAmt':
        case 'NonTaxableSalesAmt': {
            const aTotal = invoiceTotal(a).toNumber();
            const bTotal = invoiceTotal(b).toNumber();
            return (
                (aTotal === bTotal) ? (a.InvoiceNo > b.InvoiceNo ? 1 : -1) : (aTotal - bTotal)
            ) * sortMod
        }
        default:
            return (a.InvoiceNo > b.InvoiceNo ? 1 : -1) * sortMod;
    }
}
