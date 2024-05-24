import {FetchInvoiceArg, LoadInvoicesProps} from "../ducks/invoices/types";
import {ExtendedInvoice, InvoiceHistoryHeader} from "b2b-types";
import {fetchJSON} from "./fetch";

export interface FetchInvoiceResponse {
    invoice: ExtendedInvoice | null;
}

export async function fetchInvoice(arg: FetchInvoiceArg): Promise<ExtendedInvoice | null> {
    try {
        const url = '/api/sales/invoice/chums/:InvoiceType/:InvoiceNo'
            .replace(':InvoiceType', encodeURIComponent(arg.InvoiceType ?? 'IN'))
            .replace(':InvoiceNo', encodeURIComponent(arg.InvoiceNo));
        const response = await fetchJSON<FetchInvoiceResponse>(url, {cache: 'no-cache'});
        if (!response?.invoice || !response?.invoice?.InvoiceNo) {
            return Promise.reject(new Error(`Invoice '${arg.InvoiceNo}-${arg.InvoiceType}' was not found`));
        }

        return response.invoice;
    } catch (err) {
        if (err instanceof Error) {
            console.debug("deprecated_loadInvoice()", err.message);
            return Promise.reject(err);
        }
        console.debug("deprecated_loadInvoice()", err);
        return Promise.reject(new Error('Error in deprecated_loadInvoice()'));
    }
}


export async function fetchInvoices(arg: LoadInvoicesProps): Promise<InvoiceHistoryHeader[]> {
    try {
        if (!arg.key) {
            return [];
        }
        const params = new URLSearchParams();
        params.set('start', String(arg.start ?? 0));
        params.set('limit', String(arg.limit ?? 500));
        const url = `/api/sales/b2b/invoices/chums/:ARDivisionNo-:CustomerNo?${params.toString()}`
            .replace(':ARDivisionNo', encodeURIComponent(arg.key.ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(arg.key.CustomerNo));
        const response = await fetchJSON<{ list?: InvoiceHistoryHeader[] }>(url, {cache: 'no-cache'});
        return response?.list ?? [];
    } catch (err) {
        if (err instanceof Error) {
            console.debug("fetchInvoices()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchInvoices()", err);
        return Promise.reject(new Error('Error in fetchInvoices()'));
    }
}
