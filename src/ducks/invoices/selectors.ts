import {RootState} from "../../app/configureStore";

export const selectInvoicesList = (state:RootState) => state.invoices.list ?? [];
export const selectCurrentInvoice = (state:RootState) => state.invoices.invoice ?? null;
export const selectCurrentInvoiceNo = (state:RootState) => state.invoices.invoice?.InvoiceNo ?? null;
export const selectInvoicesLoading = (state:RootState) => state.invoices.loading ?? false;
export const selectInvoicesLoaded = (state:RootState) => state.invoices.loaded ?? false;
export const selectCurrentInvoiceLoading = (state:RootState) => state.invoices.invoiceLoading ?? false;
