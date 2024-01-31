import {FETCH_INIT, FETCH_INVOICE, FETCH_SUCCESS, SELECT_INVOICE} from "../../constants/actions";
import {createReducer} from "@reduxjs/toolkit";
import {invoicesSorter, isInvoice, isInvoiceHeader} from "./utils";
import {loadInvoice, loadInvoices} from "./actions";
import {customerSlug} from "../../utils/customer";
import {setCustomerAccount} from "../customer/actions";
import {setLoggedIn, setUserAccess} from "../user/actions";
import {InvoicesState} from "./types";
import {SortProps} from "../../types/generic";
import {InvoiceHeader} from "b2b-types";
import {isDeprecatedFetchInvoiceAction, isDeprecatedSelectInvoiceAction} from "../../types/actions";

export const defaultSort: SortProps<InvoiceHeader> = {
    field: 'InvoiceNo',
    ascending: false,
}

export const initialInvoicesState = (): InvoicesState => ({
    customerKey: null,
    list: [],
    invoice: null,
    loading: false,
    loaded: false,
    invoiceLoading: false,
})

const invoicesReducer = createReducer(initialInvoicesState, builder => {
    builder
        .addCase(loadInvoices.pending, (state, action) => {
            state.loading = true;
            if (state.customerKey !== customerSlug(action?.meta?.arg)) {
                state.list = [];
                state.invoice = null;
                state.customerKey = customerSlug(action?.meta?.arg);
            }
        })
        .addCase(loadInvoices.fulfilled, (state, action) => {
            state.loading = false;
            state.list = [...action.payload].sort(invoicesSorter(defaultSort));
            state.loaded = true;
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
            const [invoice] = state.list
                .filter(inv => inv.InvoiceNo === action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType);
            if (invoice) {
                if (!isInvoice(invoice)) {
                    state.invoice = {...invoice, Detail: [], Tracking: [], Payments: []}
                } else {
                    state.invoice = invoice;
                }
            }
        })
        .addCase(loadInvoice.fulfilled, (state, action) => {
            state.invoiceLoading = false;
            state.invoice = action.payload;
            if (!action.payload) {
                state.list = state.list
                    .filter(inv => !(action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType))
                    .sort(invoicesSorter(defaultSort))
            } else {
                state.list = [
                    ...state.list
                        .filter(inv => !(action.meta.arg.InvoiceNo && inv.InvoiceType === action.meta.arg.InvoiceType)),
                    action.payload,
                ].sort(invoicesSorter(defaultSort));
            }
        })
        .addCase(loadInvoice.rejected, (state, action) => {
            state.invoiceLoading = false;
        })
        .addCase(setCustomerAccount.fulfilled, (state) => {
            state.list = [];
            state.loaded = false;
            state.invoice = null;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.list = [];
                state.invoice = null;
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && state.customerKey !== customerSlug(action?.meta?.arg)) {
                state.list = [];
                state.loaded = false;
                state.invoice = null;
                state.customerKey = customerSlug(action?.meta?.arg);
            }
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_INVOICE:
                    if (isDeprecatedFetchInvoiceAction(action)) {
                        state.invoiceLoading = action.status === FETCH_INIT;
                        if (action.status === FETCH_SUCCESS) {
                            state.list = [
                                ...state.list.filter(inv => inv.InvoiceNo !== action.invoice?.InvoiceNo),
                                action.invoice
                            ].sort(invoicesSorter(defaultSort));
                            state.invoice = action.invoice ?? null;
                        }
                    }
                    return;
                case SELECT_INVOICE:
                    if (isDeprecatedSelectInvoiceAction(action)) {
                        if (isInvoiceHeader(action.invoice)) {
                            state.invoice = {...action.invoice, Detail: [], Payments: [], Tracking: []};
                        } else {
                            state.invoice = action.invoice ?? null;
                        }
                    }
                    return;

            }
        })
})

export default invoicesReducer;
