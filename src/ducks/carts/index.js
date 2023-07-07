import {combineReducers} from 'redux';
import {
    CREATE_NEW_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT,
    UPDATE_CART
} from "../../constants/actions";
import {isCartOrder} from "../../utils/orders";
import {createReducer} from "@reduxjs/toolkit";
import {salesOrderSorter} from "../salesOrder/sorter";

/**
 *
 * @type {CartsState}
 */
export const initialCartsState = {
    list: [],
    loading: false,
}

const cartsReducer = createReducer(initialCartsState, builder => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_USER_ACCOUNT:
                    state.list = [];
                    return;
                case FETCH_ORDERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.list = action.orders
                            .filter(so => isCartOrder(so))
                            .sort(salesOrderSorter);
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (action.status === FETCH_SUCCESS && action.isCart) {
                        state.list = isCartOrder(action.salesOrder)
                            ? [
                                ...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo),
                                action.salesOrder,
                            ].sort(salesOrderSorter)
                            : [...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo)].sort(salesOrderSorter);
                    }
                    return;
                case PROMOTE_CART:
                    if (action.status === FETCH_SUCCESS) {
                        state.list = [
                            ...state.list.filter(so => so.SalesOrderNo !== action.salesOrder.SalesOrderNo)
                        ].sort(salesOrderSorter);
                    }
                    return;
                case UPDATE_CART:
                    if (!!action.props.SalesOrderNo && action.props.CustomerPONo !== undefined) {
                        state.list = [
                            ...state.list.filter(so => so.SalesOrderNo !== action.props.SalesOrderNo),
                            ...state.list.filter(so => so.SalesOrderNo === action.props.SalesOrderNo)
                                .map(so => ({...so, ...action.props}))
                        ].sort(salesOrderSorter);
                    }
                    return;
                case CREATE_NEW_CART:
                    state.list = [...state.list, action.cart].sort(salesOrderSorter);
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
