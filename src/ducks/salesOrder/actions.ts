import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {CustomerKey, SalesOrder, SalesOrderHeader} from "b2b-types";
import {fetchSalesOrder, fetchSalesOrders} from "@/api/sales-order";
import {SortProps} from "@/types/generic";
import {RootState} from "@/app/configureStore";
import {selectCurrentCustomer} from "@/ducks/user/selectors";
import {selectProcessing, selectSOLoading} from "@/ducks/salesOrder/selectors";
import {generatePath, redirect} from "react-router-dom";
import {customerSlug} from "@/utils/customer";

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
            return !!arg && !!customer && !selectProcessing(state) && !selectSOLoading(state);
        }
    }
)

export const setShipToFilter = createAction<string>('orders/filters/setShipToCode');
export const setPOFilter = createAction<string>('orders/filters/setCustomerPONo');
export const setSort = createAction<SortProps<SalesOrderHeader>>('orders/setSort');
export const setPage = createAction<number>('orders/setPage');
export const setRowsPerPage = createAction<number>('orders/setRowsPerPage');
