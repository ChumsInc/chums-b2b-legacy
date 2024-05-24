import {defaultSort} from "./index";
import Decimal from "decimal.js";
import {ExtendedInvoice, Invoice, InvoiceHeader, InvoiceHistoryHeader} from "b2b-types";
import {SortProps} from "../../types/generic";

export const invoiceTotal = (invoice: InvoiceHistoryHeader): Decimal => {
    return new Decimal(invoice.TaxableSalesAmt ?? 0).add(invoice.NonTaxableSalesAmt ?? 0).sub(invoice.DiscountAmt ?? 0);
}

export const invoiceKey = (invoice: InvoiceHistoryHeader) => `${invoice.InvoiceNo}-${invoice.InvoiceType}`;

export const invoicesSorter = (sort: SortProps<InvoiceHistoryHeader> = defaultSort) =>
    (a: InvoiceHistoryHeader, b: InvoiceHistoryHeader) => {
        const {field, ascending} = sort;
        const sortMod = ascending ? 1 : -1;
        switch (field) {
            case 'InvoiceDate':
            case "SalesOrderNo":
            case 'CustomerPONo':
            case 'OrderDate':
            case 'ShipToName':
            case 'ShipToCity':
            case 'InvoiceDueDate':
                return (((a[field] ?? '') === (b[field] ?? ''))
                        ? (invoiceKey(a) > invoiceKey(b) ? 1 : -1)
                        : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1)
                ) * sortMod;
            case 'TaxableSalesAmt':
            case 'NonTaxableSalesAmt': {
                const aTotal = invoiceTotal(a);
                const bTotal = invoiceTotal(b);
                return (
                    aTotal.eq(bTotal)
                        ? (invoiceKey(a) > invoiceKey(b) ? 1 : -1)
                        : (aTotal.gt(bTotal) ? 1 : -1)
                ) * sortMod
            }
            case 'Balance':
                return (
                    new Decimal(a[field] ?? 0).sub(b[field] ?? 0).toNumber()
                    ||(invoiceKey(a) > invoiceKey(b) ? 1 : -1)
                ) * sortMod
            default:
                return (invoiceKey(a) > invoiceKey(b) ? 1 : -1) * sortMod;
        }
    }

export function isInvoiceHeader(invoice: ExtendedInvoice | InvoiceHistoryHeader | null): invoice is InvoiceHistoryHeader {
    return !!invoice && (invoice as ExtendedInvoice).Detail === undefined;
}

export function isInvoice(invoice: ExtendedInvoice | InvoiceHistoryHeader | null): invoice is ExtendedInvoice {
    return !!invoice && 'undefined' !== typeof (invoice as ExtendedInvoice).Detail;
}
