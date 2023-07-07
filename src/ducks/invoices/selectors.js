export const selectInvoicesList = (state) => state.invoices.list ?? [];
export const selectCurrentInvoice = (state) => state.invoices.invoice ?? null;
export const selectInvoicesLoading = (state) => state.invoices.loading ?? false;
export const selectCurrentInvoiceLoading = (state) => state.invoices.invoiceLoading ?? false;
export const selectInvoicesSort = (state) => state.invoices.sort;
export const selectInvoicesPage = (state) => state.invoices.page;
export const selectInvoicesRowsPerPage = (state) => state.invoices.rowsPerPage;
