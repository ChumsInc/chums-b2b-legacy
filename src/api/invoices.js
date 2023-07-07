import {fetchGET} from "../utils/fetch";

/**
 *
 * @param {FetchInvoiceArg} arg
 * @return {Promise<Invoice|null>}
 */
export async function fetchInvoice(arg) {
    try {
        const url = '/api/sales/invoice/chums/:InvoiceType/:InvoiceNo'
            .replace(':InvoiceType', encodeURIComponent(arg.InvoiceType ?? 'IN'))
            .replace(':InvoiceNo', encodeURIComponent(arg.InvoiceNo));
        const response = await fetchGET(url);
        if (!response?.invoice?.InvoiceNo) {
            return Promise.reject(new Error(`Invoice '${arg.InvoiceNo}-${arg.InvoiceType}' was not found`));
        }
        return response.invoice;
    } catch(err) {
        if (err instanceof Error) {
            console.debug("loadInvoice()", err.message);
            return Promise.reject(err);
        }
        console.debug("loadInvoice()", err);
        return Promise.reject(new Error('Error in loadInvoice()'));
    }
}

/**
 *
 * @param {FetchInvoicesArg} arg
 * @return {Promise<InvoiceHeader[]>}
 */
export async function fetchInvoices(arg) {
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
