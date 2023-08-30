import {Invoice, InvoiceHeader, CustomerKey} from "b2b-types";
import {SortProps} from "@/types/generic";

export interface InvoicesState {
    customerKey: string|null;
    list: InvoiceHeader[];
    invoice: Invoice | null;
    loading: boolean;
    loaded: boolean;
    invoiceLoading: boolean;
}


export type FetchInvoiceArg = Pick<InvoiceHeader, 'InvoiceNo'|'InvoiceType'>;
export type FetchInvoicesArg = CustomerKey;
export type InvoiceSortProps = SortProps<InvoiceHeader>;
