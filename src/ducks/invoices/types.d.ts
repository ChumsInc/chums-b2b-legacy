import {CustomerKey, ExtendedInvoice, InvoiceHistoryHeader} from "b2b-types";
import {SortProps} from "../../types/generic";

export interface InvoicesState {
    customerKey: string | null;
    list: {
        invoices: InvoiceHistoryHeader[];
        offset: number;
        limitReached: boolean;
        limit: number;
    };
    invoice: ExtendedInvoice | null;
    loading: boolean;
    loaded: boolean;
    invoiceLoading: boolean;
    filters: {
        showPaidInvoices: boolean;
        shipToCode: string | null;
        search: string;
    }
    sort: SortProps<InvoiceHistoryHeader>
}


export type FetchInvoiceArg = Pick<InvoiceHistoryHeader, 'InvoiceNo' | 'InvoiceType'>;
export type FetchInvoicesArg = CustomerKey;

export interface LoadInvoicesProps {
    key: CustomerKey|null;
    start?: number;
    limit?: number;
}
