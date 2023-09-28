import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {EmailResponse, SalesOrder, SalesOrderHeader} from "b2b-types";
import {fetchSalesOrder, postOrderEmail} from "../../api/sales-order";
import {SortProps} from "../../types/generic";
import {RootState} from "../../app/configureStore";
import {selectCurrentCustomer, selectLoggedIn} from "../user/selectors";
import {
    selectSalesOrderHeader,
    selectSalesOrderProcessing,
    selectSendEmailStatus,
    selectSOLoading
} from "./selectors";
import {DetailLineChangeProps} from "../../types/salesorder";

export const loadSalesOrder = createAsyncThunk<SalesOrder | null, string>(
    'salesOrder/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCurrentCustomer(state)!;
        return await fetchSalesOrder({...customer, SalesOrderNo: arg});
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCurrentCustomer(state);
            return !!arg && !!customer && selectSalesOrderProcessing(state) === 'idle' && !selectSOLoading(state);
        }
    }
)

export const setShipToFilter = createAction<string>('orders/filters/setShipToCode');
export const setPOFilter = createAction<string>('orders/filters/setCustomerPONo');
export const setSort = createAction<SortProps<SalesOrderHeader>>('orders/setSort');
export const setPage = createAction<number>('orders/setPage');
export const setRowsPerPage = createAction<number>('orders/setRowsPerPage');

export const sendOrderEmail = createAsyncThunk<EmailResponse | null, SalesOrderHeader>(
    'salesOrder/sendEmail',
    async (arg) => {
        return await postOrderEmail(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && !!arg
                && selectSendEmailStatus(state) === 'idle'
                && !!selectSalesOrderHeader(state);
        }
    }
)

export const closeEmailResponse = createAction('orders/sendEmail/confirmed');

export const updateDetailLine = createAction<DetailLineChangeProps>('salesOrder/detail/update');
