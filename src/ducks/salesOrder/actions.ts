import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CustomerKey, EmailResponse, SalesOrder, SalesOrderHeader} from "b2b-types";
import {fetchSalesOrder, fetchSalesOrders, postOrderEmail} from "@/api/sales-order";
import {SortProps} from "@/types/generic";
import {RootState} from "@/app/configureStore";
import {selectCurrentCustomer, selectLoggedIn} from "@/ducks/user/selectors";
import {
    selectSendEmailStatus,
    selectSalesOrderHeader,
    selectSalesOrderNo,
    selectSalesOrderProcessing,
    selectSOLoading
} from "@/ducks/salesOrder/selectors";
import {generatePath, redirect} from "react-router-dom";
import {customerSlug} from "@/utils/customer";
import {selectCustomerAccount} from "@/ducks/customer/selectors";

export const loadSalesOrder = createAsyncThunk<SalesOrder | null, string>(
    'orders/loadSalesOrder',
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

export const sendOrderEmail = createAsyncThunk<EmailResponse|null, SalesOrderHeader>(
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

export const submitSalesOrder = createAsyncThunk
