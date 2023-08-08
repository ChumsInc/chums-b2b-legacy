import {FETCH_INIT, FETCH_INVOICE, FETCH_SUCCESS, SELECT_INVOICE, SET_USER_ACCOUNT} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";
import {invoicesSorter} from "./utils";
import localStore from "../../utils/LocalStore";
import {STORE_INVOICES_ROWS_PER_PAGE} from "../../constants/stores";
import {loadInvoices, setInvoicesPage, setInvoicesRowsPerPage, setInvoicesSort} from "./actions";
import {shortCustomerKey} from "../customer/utils";
import {setCustomerAccount} from "../customer/actions";
import {setLoggedIn} from "../user/actions";
import {InvoicesState} from "./types";
import {SortProps} from "../../_types";
import {InvoiceHeader} from "b2b-types";

export const defaultSort: SortProps<InvoiceHeader> = {
    field: 'InvoiceNo',
    ascending: false,
}

export const initialInvoicesState = (): InvoicesState => ({
    customerKey: '',
    list: [],
    invoice: null,
    loading: false,
    loaded: false,
    invoiceLoading: false,
    sort: {...defaultSort},
    page: 0,
    rowsPerPage: localStore.getItem<number>(STORE_INVOICES_ROWS_PER_PAGE, 10) ?? 10,
})

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
                const invoiceNo = state.invoice.InvoiceNo;
                const [invoice] = action.payload.filter(inv => inv.InvoiceNo === invoiceNo);
                state.invoice = !invoice ? null : {...state.invoice, ...invoice};
            }
        })
        .addCase(loadInvoices.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCustomerAccount.fulfilled, (state) => {
            state.list = [];
            state.page = 0;
            state.invoice = null;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.list = [];
                state.page = 0;
                state.invoice = null;
            }
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
