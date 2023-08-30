import {
    CREATE_NEW_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SET_LOGGED_IN,
    UPDATE_CART
} from "@/constants/actions";
import {isCartOrder} from "@/utils/orders";
import {createReducer} from "@reduxjs/toolkit";
import {defaultSalesOrderSort, salesOrderSorter} from "../salesOrder/utils";
import {SalesOrderHeader} from "b2b-types";
import {setUserAccess} from "@/ducks/user/actions";
import {customerSlug} from "@/utils/customer";
import {loadCustomer} from "@/ducks/customer/actions";
import {loadOrders} from "@/ducks/open-orders/actions";

export interface CartsState {
    customerKey: string | null;
    list: SalesOrderHeader[];
    loading: boolean;
    loaded: boolean;
}

export const initialCartsState = (): CartsState => ({
    customerKey: null,
    list: [],
    loading: false,
    loaded: false,
})


const cartsReducer = createReducer(initialCartsState, builder => {
    builder
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && state.customerKey !== customerSlug(action.meta.arg)) {
                state.list = [];
                state.loaded = false;
                state.customerKey = customerSlug(action.meta.arg);
            }
        })
        .addCase(loadCustomer.pending, (state, action) => {
            const key = customerSlug(action.meta.arg);
            if (state.customerKey !== key) {
                state.list = [];
                state.loaded = false;
                state.customerKey = key
            }
        })
        .addCase(loadOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload
                .filter(so => so.OrderType === 'Q')
                .sort(salesOrderSorter(defaultSalesOrderSort));
        })
        .addCase(loadOrders.rejected, (state) => {
            state.loading = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_ORDERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = (action.orders as SalesOrderHeader[])
                            .filter(so => isCartOrder(so))
                            .sort(salesOrderSorter((defaultSalesOrderSort)));
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (action.status === FETCH_SUCCESS && action.isCart) {
                        state.list = isCartOrder(action.salesOrder)
                            ? [
                                ...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo),
                                action.salesOrder,
                            ].sort(salesOrderSorter((defaultSalesOrderSort)))
                            : [...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo)]
                                .sort(salesOrderSorter((defaultSalesOrderSort)));
                    }
                    return;
                case PROMOTE_CART:
                    if (action.status === FETCH_SUCCESS) {
                        state.list = [
                            ...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo)
                        ].sort(salesOrderSorter((defaultSalesOrderSort)));
                    }
                    return;
                case UPDATE_CART:
                    if (!!action.props.SalesOrderNo && action.props.CustomerPONo !== undefined) {
                        state.list = [
                            ...state.list.filter(so => so.SalesOrderNo !== action.props.SalesOrderNo),
                            ...state.list.filter(so => so.SalesOrderNo === action.props.SalesOrderNo)
                                .map(so => ({...so, ...action.props}))
                        ].sort(salesOrderSorter((defaultSalesOrderSort)));
                    }
                    return;
                case CREATE_NEW_CART:
                    state.list = [...state.list, action.cart].sort(salesOrderSorter((defaultSalesOrderSort)));
                    return;
                case SET_LOGGED_IN:
                    if (action.loggedIn === false) {
                        state.list = [];
                    }
                    return;
            }

        })
})

export default cartsReducer;
