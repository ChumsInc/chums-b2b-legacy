import {createReducer} from "@reduxjs/toolkit";
import {invoiceKey, invoicesSorter, isInvoice} from "./utils";
import {
    loadInvoice,
    loadInvoices,
    setInvoicesFilterSearch,
    setInvoicesFilterShipToCode,
    setInvoicesSort,
    setShowPaidInvoices
} from "./actions";
import {customerSlug} from "../../utils/customer";
import {loadCustomer, setCustomerAccount} from "../customer/actions";
import {setLoggedIn, setUserAccess} from "../user/actions";
import {InvoicesState} from "./types";
import {SortProps} from "../../types/generic";
import {InvoiceHistoryHeader} from "b2b-types";
import {STORE_INVOICES_SORT} from "../../constants/stores";
import localStore from "../../utils/LocalStore";

export const defaultSort: SortProps<InvoiceHistoryHeader> = {
    field: 'InvoiceNo',
    ascending: false,
}

export const defaultUserSort:SortProps<InvoiceHistoryHeader> = {
    field: 'InvoiceDate',
    ascending: false,
}

export const initialInvoicesState = (): InvoicesState => ({
    customerKey: null,
    list: {
        invoices: [],
        limitReached: false,
        offset: 0,
        limit: 500,
    },
    invoice: null,
    loading: false,
    loaded: false,
    invoiceLoading: false,
    filters: {
        showPaidInvoices: false,
        shipToCode: null,
        search: '',
    },
    sort: localStore.getItem<SortProps<InvoiceHistoryHeader>>(STORE_INVOICES_SORT, defaultUserSort),
})

const invoicesReducer = createReducer(initialInvoicesState, builder => {
    builder
        .addCase(loadInvoices.pending, (state, action) => {
            state.loading = true;
            if (state.customerKey !== customerSlug(action?.meta?.arg?.key)) {
                state.list.invoices = [];
                state.list.offset = action.meta.arg.start ?? 0;
                state.list.limitReached = false;
                state.invoice = null;
                state.customerKey = customerSlug(action?.meta?.arg?.key);
            }
        })
        .addCase(loadInvoices.fulfilled, (state, action) => {
            state.loading = false;
            const invoiceNos = action.payload.map(inv => invoiceKey(inv));
            state.list.offset = action.meta.arg.start ?? 0;
            if (action.meta.arg.start === 0) {
                state.list.limitReached = false;
                state.list.invoices = [];
            }
            state.list.invoices = [
                ...state.list.invoices.filter(inv => !invoiceNos.includes(invoiceKey(inv))),
                ...action.payload
            ].sort(invoicesSorter(defaultSort));
            state.loaded = true;
            state.list.limitReached = action.payload.length < state.list.limit;
            if (state.invoice) {
                const invoiceNo = state.invoice.InvoiceNo;
                const [invoice] = action.payload.filter(inv => inv.InvoiceNo === invoiceNo);
                state.invoice = !invoice ? null : {...state.invoice, ...invoice};
            }
        })
        .addCase(loadInvoices.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadInvoice.pending, (state, action) => {
            state.invoiceLoading = true;
            const [invoice] = state.list.invoices
                .filter(inv => inv.InvoiceNo === action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType);
            if (invoice) {
                if (!isInvoice(invoice)) {
                    state.invoice = {...invoice, Detail: [], Track: [], Payments: []}
                } else {
                    state.invoice = invoice;
                }
            }
        })
        .addCase(loadInvoice.fulfilled, (state, action) => {
            state.invoiceLoading = false;
            state.invoice = action.payload;
            if (!action.payload) {
                state.list.invoices = state.list.invoices
                    .filter(inv => !(action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType))
                    .sort(invoicesSorter(defaultSort))
            } else {
                state.list.invoices = [
                    ...state.list.invoices
                        .filter(inv => !(action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType)),
                    action.payload,
                ].sort(invoicesSorter(defaultSort));
            }
        })
        .addCase(loadInvoice.rejected, (state, action) => {
            state.invoiceLoading = false;
        })
        .addCase(setCustomerAccount.fulfilled, (state) => {
            state.list.offset = 0;
            state.list.limitReached = false;
            state.list.invoices = [];
            state.loaded = false;
            state.invoice = null;
            state.filters.shipToCode = null;
            state.filters.search = '';
        })
        .addCase(loadCustomer.pending, (state, action) => {
            if (state.customerKey !== customerSlug(action.meta.arg)) {
                state.list.offset = 0;
                state.list.limitReached = false;
                state.list.invoices = [];
                state.loaded = false;
                state.invoice = null;
                state.filters.shipToCode = null;
                state.filters.search = '';
            }
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload?.loggedIn) {
                state.list.offset = 0;
                state.list.limitReached = false;
                state.list.invoices = [];
                state.invoice = null;
                state.filters.search = '';
                state.filters.shipToCode = null;
                state.customerKey = null;
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && state.customerKey !== customerSlug(action?.meta?.arg)) {
                state.list.offset = 0;
                state.list.limitReached = false;
                state.list.invoices = [];
                state.loaded = false;
                state.invoice = null;
                state.customerKey = customerSlug(action?.meta?.arg);
                state.filters.shipToCode = null;
                state.filters.search = '';
            }
        })
        .addCase(setShowPaidInvoices, (state, action) => {
            state.filters.showPaidInvoices = action.payload ?? !state.filters.showPaidInvoices;
        })
        .addCase(setInvoicesFilterShipToCode, (state, action) => {
            state.filters.shipToCode = action.payload;
        })
        .addCase(setInvoicesFilterSearch, (state, action) => {
            state.filters.search = action.payload;
        })
        .addCase(setInvoicesSort, (state, action) => {
            state.sort = action.payload;
        })
})

export default invoicesReducer;
