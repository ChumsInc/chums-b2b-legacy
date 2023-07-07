import {
    FETCH_INIT,
    FETCH_INVOICE,
    FETCH_SUCCESS,
    SELECT_INVOICE,
    SET_CUSTOMER,
    SET_USER_ACCOUNT
} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";
import {invoicesSorter} from "./utils";
import localStore from "../../utils/LocalStore";
import {STORE_INVOICES_ROWS_PER_PAGE} from "../../constants/stores";
import {loadInvoices, setInvoicesPage, setInvoicesRowsPerPage, setInvoicesSort} from "./actions";
import {shortCustomerKey} from "../customer/utils";

/**
 *
 * @type {InvoiceSortProps}
 */
export const defaultSort = {
    field: 'InvoiceNo',
    ascending: false,
}
/**
 *
 * @type {InvoicesState}
 */
export const initialInvoicesState = {
    customerKey: '',
    list: [],
    invoice: null,
    loading: false,
    loaded: false,
    invoiceLoading: false,
    sort: {...defaultSort},
    page: 0,
    rowsPerPage: localStore.getItem(STORE_INVOICES_ROWS_PER_PAGE) ?? 10,
}

const invoicesReducer = createReducer(initialInvoicesState, builder => {
    builder
        .addCase(setInvoicesSort, (state, action) => {
            state.sort = action.payload ?? defaultSort;
            state.page = 0;
        })
        .addCase(setInvoicesPage, (state, action) => {
            state.page = action.payload ?? 0;
        })
        .addCase(setInvoicesRowsPerPage, (state, action) => {
            state.rowsPerPage = action.payload ?? 10;
            state.page = 0;
        })
        .addCase(loadInvoices.pending, (state, action) => {
            state.loading = true;
            if (state.customerKey !== shortCustomerKey(action?.meta?.arg)) {
                state.list = [];
                state.invoice = null;
                state.customerKey = shortCustomerKey(action?.meta?.arg);
            }
        })
        .addCase(loadInvoices.fulfilled, (state, action) => {
            state.loading = false;
            state.list = [...action.payload].sort(invoicesSorter(defaultSort));
            if (state.invoice) {
                const [invoice] = action.payload.filter(inv => inv.InvoiceNo === state.invoice.InvoiceNo);
                state.invoice = !invoice ? null : {...state.invoice, ...invoice};
            }
        })
        .addCase(loadInvoices.rejected, (state) => {
            state.loading = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_INVOICE:
                    state.invoiceLoading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = [
                            ...state.list.filter(inv => inv.InvoiceNo !== action.invoice?.InvoiceNo),
                            action.invoice
                        ].sort(invoicesSorter(defaultSort));
                        state.invoice = action.invoice ?? null;
                    }
                    return;
                case SET_CUSTOMER:
                    state.list = [];
                    state.page = 0;
                    state.invoice = null;
                    return;
                case SET_USER_ACCOUNT:
                    state.list = [];
                    state.page = 0;
                    state.invoice = null;
                    return;
                case SELECT_INVOICE:
                    state.invoice = action.invoice ?? null;
                    return;

            }
        })
})

export default invoicesReducer;
