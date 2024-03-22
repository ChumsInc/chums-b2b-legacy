import {defaultSort} from "./index";
import Decimal from "decimal.js";
import {ExtendedInvoice, Invoice, InvoiceHeader, InvoiceHistoryHeader} from "b2b-types";
import {SortProps} from "../../types/generic";

export const invoiceTotal = (invoice: InvoiceHistoryHeader): Decimal => {
    return new Decimal(invoice.TaxableSalesAmt ?? 0).add(invoice.NonTaxableSalesAmt ?? 0).sub(invoice.DiscountAmt ?? 0);
}


export const invoicesSorter = (sort: SortProps<InvoiceHistoryHeader> = defaultSort) =>
    (a: InvoiceHistoryHeader, b: InvoiceHistoryHeader) => {
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

export function isInvoiceHeader(invoice: ExtendedInvoice | InvoiceHistoryHeader | null): invoice is InvoiceHistoryHeader {
    return !!invoice && (invoice as ExtendedInvoice).Detail === undefined;
}

export function isInvoice(invoice: ExtendedInvoice | InvoiceHistoryHeader | null): invoice is ExtendedInvoice {
    return !!invoice && 'undefined' !== typeof (invoice as ExtendedInvoice).Detail;
}
