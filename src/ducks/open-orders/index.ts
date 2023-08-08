import {combineReducers} from 'redux';
import {
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SET_USER_ACCOUNT
} from "../../constants/actions";
import {isOpenOrder} from "../../utils/orders";
import {createReducer} from "@reduxjs/toolkit";
import {salesOrderSorter} from "../salesOrder/utils";
import {OpenOrdersState} from "./types";
import {SalesOrderHeader} from "b2b-types";

export const initialOpenOrderState = ():OpenOrdersState => ({
    list: [],
    loading: false,
})

const openOrdersReducer = createReducer(initialOpenOrderState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_USER_ACCOUNT:
                    state.list = [];
                    return;
                case FETCH_ORDERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = (action.orders as SalesOrderHeader[]).filter(so => isOpenOrder(so)).sort(salesOrderSorter);
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (action.status === FETCH_SUCCESS) {
                        if (isOpenOrder(action.salesOrder)) {
                            state.list = [
                                ...(action.orders as SalesOrderHeader[]).filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo),
                                action.salesOrder
                            ].sort(salesOrderSorter);
                        }
                    }
                    return;
                case PROMOTE_CART:
                    if (action.status === FETCH_SUCCESS) {
                        state.list = [
                            ...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo),
                            action.salesOrder
                        ].sort(salesOrderSorter);
                    }
                    return;
            }


        })
})
export default openOrdersReducer;
