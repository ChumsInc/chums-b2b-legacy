import {RootState} from "../../app/configureStore";

export const selectInvoicesList = (state:RootState) => state.invoices.list ?? [];
export const selectCurrentInvoice = (state:RootState) => state.invoices.invoice ?? null;
export const selectCurrentInvoiceNo = (state:RootState) => state.invoices.invoice?.InvoiceNo ?? null;
export const selectInvoicesLoading = (state:RootState) => state.invoices.loading ?? false;
export const selectCurrentInvoiceLoading = (state:RootState) => state.invoices.invoiceLoading ?? false;
export const selectInvoicesSort = (state:RootState) => state.invoices.sort;
export const selectInvoicesPage = (state:RootState) => state.invoices.page;
export const selectInvoicesRowsPerPage = (state:RootState) => state.invoices.rowsPerPage;
