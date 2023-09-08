import {FETCH_INIT, FETCH_ORDERS, FETCH_SALES_ORDER, FETCH_SUCCESS} from "@/constants/actions";
import {isOpenOrder} from "@/utils/orders";
import {createReducer} from "@reduxjs/toolkit";
import {defaultSalesOrderSort, salesOrderSorter} from "../salesOrder/utils";
import {SalesOrderHeader} from "b2b-types";
import {loadOrders} from "@/ducks/open-orders/actions";
import {setCustomerAccount} from "@/ducks/customer/actions";
import {customerSlug} from "@/utils/customer";
import {setLoggedIn, setUserAccess} from "@/ducks/user/actions";
import {promoteCart, saveCart, saveNewCart} from "@/ducks/cart/actions";

export interface OpenOrdersState {
    customerKey: string | null;
    list: SalesOrderHeader[],
    loading: boolean;
    loaded: boolean;
}

export const initialOpenOrderState = (): OpenOrdersState => ({
    customerKey: null,
    list: [],
    loading: false,
    loaded: false
})

const openOrdersReducer = createReducer(initialOpenOrderState, (builder) => {
    builder
        .addCase(setCustomerAccount.pending, (state, action) => {
            const key = customerSlug(action.meta.arg);
            if (state.customerKey !== key) {
                state.list = [];
                state.loaded = false;
                state.customerKey = key;
            }
        })
        .addCase(loadOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload
                .filter(so => so.OrderType !== 'Q')
                .sort(salesOrderSorter(defaultSalesOrderSort));
        })
        .addCase(loadOrders.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.list = [];
                state.loaded = false;
                state.customerKey = null;
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && state.customerKey !== customerSlug(action.meta.arg)) {
                state.list = [];
                state.loaded = false;
            }
        })
        .addCase(saveNewCart.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(so => so.SalesOrderNo !== action.payload?.SalesOrderNo),
                    action.payload,
                ].sort(salesOrderSorter(defaultSalesOrderSort));
            }
        })
        .addCase(saveCart.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(so => so.SalesOrderNo !== action.meta.arg.SalesOrderNo),
                    action.payload
                ].sort(salesOrderSorter(defaultSalesOrderSort));
            }
        })
        .addCase(promoteCart.fulfilled, (state, action) => {
            if (action.payload) {
                state.list = [
                    ...state.list.filter(so => so.SalesOrderNo !== action.meta.arg.SalesOrderNo),
                    action.payload
                ].sort(salesOrderSorter(defaultSalesOrderSort));
            }
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_ORDERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = (action.orders as SalesOrderHeader[]).filter(so => isOpenOrder(so)).sort(salesOrderSorter(defaultSalesOrderSort));
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (action.status === FETCH_SUCCESS) {
                        if (isOpenOrder(action.salesOrder)) {
                            state.list = [
                                ...(action.orders as SalesOrderHeader[]).filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo),
                                action.salesOrder
                            ].sort(salesOrderSorter(defaultSalesOrderSort));
                        }
                    }
                    return;
            }


        })
})
export default openOrdersReducer;
