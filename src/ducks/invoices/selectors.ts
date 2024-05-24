import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import {invoicesSorter} from "./utils";

export const selectInvoicesList = (state:RootState) => state.invoices.list.invoices ?? [];
export const selectInvoicesListLimit = (state:RootState) => state.invoices.list.limit;
export const selectInvoicesListLimitReached = (state:RootState) => state.invoices.list.limitReached;
export const selectInvoicesListOffset = (state:RootState) => state.invoices.list.offset;
export const selectCurrentInvoice = (state:RootState) => state.invoices.invoice ?? null;
export const selectCurrentInvoiceNo = (state:RootState) => state.invoices.invoice?.InvoiceNo ?? null;
export const selectInvoicesLoading = (state:RootState) => state.invoices.loading ?? false;
export const selectInvoicesLoaded = (state:RootState) => state.invoices.loaded ?? false;
export const selectCurrentInvoiceLoading = (state:RootState) => state.invoices.invoiceLoading ?? false;

export const selectInvoicesShowPaid = (state:RootState) => state.invoices.filters.showPaidInvoices;
export const selectInvoicesShipToFilter = (state:RootState) => state.invoices.filters.shipToCode;
export const selectInvoicesSearch = (state:RootState) => state.invoices.filters.search;
export const selectInvoicesSort = (state:RootState) => state.invoices.sort;

export const selectFilteredInvoicesList = createSelector(
    [selectInvoicesList, selectInvoicesShowPaid, selectInvoicesShipToFilter,
        selectInvoicesSearch, selectInvoicesSort],
    (list, showPaid, shipTo, search, sort) => {
        return list
            .filter(inv => showPaid || !new Decimal(inv.Balance ?? '0').eq(0))
            .filter(inv => !shipTo || inv.ShipToCode === shipTo)
            .filter(inv => !search
                || inv.CustomerPONo?.toLowerCase()?.includes(search.toLowerCase())
                || inv.InvoiceNo.toLowerCase().includes(search.toLowerCase())
                || inv.SalesOrderNo?.toLowerCase()?.includes(search.toLowerCase())
            )
            .sort(invoicesSorter(sort));
    }
)
