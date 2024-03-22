import {fetchGET} from "../utils/fetch";
import {FetchInvoiceArg, FetchInvoicesArg} from "../ducks/invoices/types";
import {ExtendedInvoice, Invoice, InvoiceHeader, InvoiceHistoryHeader} from "b2b-types";
import {fetchJSON} from "./fetch";
import {InvoiceTracking} from "b2b-types/src/invoice";

export interface FetchInvoiceResponse {
    invoice: ExtendedInvoice|null;
}

export async function fetchInvoice(arg:FetchInvoiceArg):Promise<ExtendedInvoice|null> {
    try {
        const url = '/api/sales/invoice/chums/:InvoiceType/:InvoiceNo'
            .replace(':InvoiceType', encodeURIComponent(arg.InvoiceType ?? 'IN'))
            .replace(':InvoiceNo', encodeURIComponent(arg.InvoiceNo));
        const response = await fetchJSON<FetchInvoiceResponse>(url);
        if (!response?.invoice || !response?.invoice?.InvoiceNo) {
            return Promise.reject(new Error(`Invoice '${arg.InvoiceNo}-${arg.InvoiceType}' was not found`));
        }

        return response.invoice;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("deprecated_loadInvoice()", err.message);
            return Promise.reject(err);
        }
        console.debug("deprecated_loadInvoice()", err);
        return Promise.reject(new Error('Error in deprecated_loadInvoice()'));
    }
}


export async function fetchInvoices(arg:FetchInvoicesArg):Promise<InvoiceHistoryHeader[]> {
    try {
        const url = '/api/sales/b2b/invoices/chums/:ARDivisionNo-:CustomerNo'
            .replace(':ARDivisionNo', encodeURIComponent(arg.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.CustomerNo));
        const response = await fetchGET(url, {cache: 'no-cache'});
        return response?.list ?? [];
    } catch(err) {
        if (err instanceof Error) {
            console.debug("fetchInvoices()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchInvoices()", err);
        return Promise.reject(new Error('Error in fetchInvoices()'));
    }
}
