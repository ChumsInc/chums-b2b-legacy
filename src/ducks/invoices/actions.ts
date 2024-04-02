import {isValidCustomer} from "../../utils/customer";
import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {STORE_INVOICES_ROWS_PER_PAGE, STORE_INVOICES_SORT} from "../../constants/stores";
import localStore from "../../utils/LocalStore";
import {fetchInvoice, fetchInvoices} from "../../api/invoices";
import {selectCurrentInvoiceLoading, selectInvoicesLoading} from "./selectors";
import {RootState} from "../../app/configureStore";
import {CustomerKey, ExtendedInvoice, InvoiceHistoryHeader} from "b2b-types";
import {selectLoggedIn} from "../user/selectors";
import {FetchInvoiceArg} from "./types";
import {SortProps} from "../../types/generic";


export const setInvoicesPage = createAction('invoices/setPage');
export const setInvoicesRowsPerPage = createAction('invoices/setRowsPerPage', (rowsPerPage) => {
    localStore.setItem(STORE_INVOICES_ROWS_PER_PAGE, rowsPerPage);
    return {
        payload: rowsPerPage
    }
});


export const loadInvoice = createAsyncThunk<ExtendedInvoice | null, FetchInvoiceArg>(
    'invoices/loadInvoice',
    async (arg) => {
        return await fetchInvoice(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCurrentInvoiceLoading(state);
        }
    }
)

export const loadInvoices = createAsyncThunk<InvoiceHistoryHeader[], CustomerKey | null>(
    'invoices/loadInvoices',
    async (arg) => {
        return await fetchInvoices(arg as CustomerKey);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !!arg && !selectInvoicesLoading(state) && isValidCustomer(arg);
        }
    }
)

export const setShowPaidInvoices = createAction<boolean | undefined>('invoices/filter/setShowPaidInvoices');
export const setInvoicesFilterShipToCode = createAction<string | null>('invoices/filter/setShipToCode');
export const setInvoicesFilterSearch = createAction<string>('invoices/filter/setSearch');
export const setInvoicesSort = createAction('invoices/setSort', (arg:SortProps<InvoiceHistoryHeader>) => {
   localStore.setItem<SortProps<InvoiceHistoryHeader>>(STORE_INVOICES_SORT, arg);
   return {
       payload: arg
   };
});
