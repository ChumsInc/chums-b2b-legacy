import {
    CLEAR_PRODUCT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    SAVE_CART,
    SELECT_COLOR,
    SELECT_VARIANT,
    SET_CART,
    SET_CART_ITEM_QUANTITY,
    SET_CUSTOMER,
    UPDATE_CART
} from "../../constants/actions";

import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER_SHIPPING_ACCOUNT} from "../../constants/stores";
import {isCartOrder, nextShipDate} from "../../utils/orders";
import {CART_PROGRESS_STATES, NEW_CART} from "../../constants/orders";
import {DEFAULT_SHIPPING_ACCOUNT} from "../../constants/account";
import {createReducer} from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import {getItemAvailability, setCartProgress, setShipDate} from "./actions";


/**
 *
 * @return {CartState}
 */
export const initialCartState = () => ({
    cartNo: localStore.getItem(STORE_CURRENT_CART, ''),
    cartName: '',
    cartQuantity: 0,
    cartTotal: 0,
    loading: false,
    loaded: false,
    itemAvailability: null,
    itemAvailabilityLoading: false,
    cartProgress: CART_PROGRESS_STATES.cart,
    shipDate: nextShipDate(),
    shippingAccount: {
        enabled: localStore.getItem(STORE_CUSTOMER_SHIPPING_ACCOUNT, {})?.enabled ?? false,
        value: localStore.getItem(STORE_CUSTOMER_SHIPPING_ACCOUNT, {})?.value ?? '',
    },
    cartMessage: '',
})

const cartReducer = createReducer(initialCartState, builder => {
    builder
        .addCase(getItemAvailability.pending, (state) => {
            state.itemAvailabilityLoading = true;
        })
        .addCase(getItemAvailability.fulfilled, (state, action) => {
            state.itemAvailabilityLoading = false;
            state.itemAvailability = action.payload ?? null;
        })
        .addCase(getItemAvailability.rejected, (state) => {
            state.itemAvailabilityLoading = false;
        })
        .addCase(setCartProgress, (state, action) => {
            state.cartProgress = action.payload ?? CART_PROGRESS_STATES.cart;
        })
        .addCase(setShipDate, (state, action) => {
            localStore.setItem(STORE_CUSTOMER_SHIPPING_ACCOUNT, action.payload);
            state.shipDate = action.payload ?? nextShipDate();
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_ORDERS:
                    if (action.status === FETCH_SUCCESS) {
                        const receivedOrders = action.orders.filter(so => isCartOrder(so));
                        const [existing] = receivedOrders.filter(so => so.SalesOrderNo === state.cartNo);

                        if (state.cartNo !== NEW_CART && !existing) {
                            state.cartNo = '';
                            state.cartName = '';
                            state.cartTotal = 0;
                            state.cartQuantity = 0;
                        } else if (!!existing) {
                            state.cartNo = existing.SalesOrderNo;
                            state.cartName = existing.CustomerPONo ?? '';
                            state.cartTotal = existing.cartTotal = new Decimal(existing.TaxableAmt).add(existing.NonTaxableAmt).toNumber();
                        } else if (receivedOrders.length === 1) {
                            state.cartNo = receivedOrders[0].SalesOrderNo;
                            state.cartName = receivedOrders[0].CustomerPONo ?? '';
                            state.cartTotal = receivedOrders[0].cartTotal = new Decimal(receivedOrders[0].TaxableAmt).add(receivedOrders[0].NonTaxableAmt).toNumber();
                        }
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (action.status === FETCH_SUCCESS) {
                        if (action.salesOrder && action.salesOrder.SalesOrderNo === state.cartNo) {
                            if (!isCartOrder(action.salesOrder)) {
                                state.cartNo = '';
                                state.cartName = '';
                                state.cartTotal = 0;
                                state.cartQuantity = 0;
                                state.cartProgress = CART_PROGRESS_STATES.cart;
                            } else {
                                state.cartNo = action.salesOrder.SalesOrderNo;
                                state.cartName = action.salesOrder.CustomerPONo;
                                state.cartTotal = new Decimal(action.salesOrder.TaxableAmt).add(action.salesOrder.NonTaxableAmt).toNumber();
                                state.cartQuantity = (action.salesOrder.detail ?? [])
                                    .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                                    .reduce((row, cv) => row + cv, 0);
                                state.cartProgress = CART_PROGRESS_STATES.cart;
                            }
                        }
                    }
                    state.loaded = state.loaded || (action.isCart && action.status === FETCH_SUCCESS);
                    state.loading = action.isCart && action.status === FETCH_INIT;
                    return;
                case CREATE_NEW_CART:
                    state.cartNo = action.cart?.SalesOrderNo ?? '';
                    state.cartName = action.cart?.CustomerPONo ?? '';
                    state.cartTotal = new Decimal(action.cart?.TaxableAmt ?? 0).add(action.cart?.NonTaxableAmt ?? 0).toNumber();
                    return;
                case SET_CART:
                    state.cartNo = action.cart?.SalesOrderNo ?? '';
                    state.cartName = action.cart?.CustomerPONo ?? '';
                    state.cartTotal = new Decimal(action.cart?.TaxableAmt ?? 0).add(action.cart?.NonTaxableAmt ?? 0).toNumber();
                    state.shippingAccount = DEFAULT_SHIPPING_ACCOUNT;
                    if (action.status === FETCH_SUCCESS) {
                        state.cartMessage = action.message ?? '';
                    }
                    return;
                case SET_CUSTOMER:
                    state.cartNo = '';
                    state.cartName = '';
                    state.cartTotal = 0;
                    state.cartQuantity = 0;
                    return;
                case DELETE_CART:
                    state.cartNo = action.status === FETCH_SUCCESS ? '' : state.cartNo;
                    state.cartName = action.status === FETCH_SUCCESS ? '' : state.cartName;
                    state.cartTotal = 0;
                    state.cartQuantity = 0;
                    return;
                case UPDATE_CART:
                    state.cartName = action.props?.CustomerPONo ?? action.props?.cartName ?? state.cartName;
                    return;
                case FETCH_CART:
                    if (action.status === FETCH_SUCCESS) {
                        state.cartTotal = new Decimal(action.salesOrder?.TaxableAmt ?? 0).add(action.salesOrder?.NonTaxableAmt ?? 0).toNumber();
                        state.cartQuantity = (action.salesOrder.detail ?? [])
                            .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                            .reduce((row, cv) => row + cv, 0);
                        state.loaded = true;
                    }
                    state.loading = action.status === FETCH_INIT;
                    return;
                case SAVE_CART:
                    if (state.cartNo === NEW_CART && action.payload) {
                        state.cartNo = action.payload;
                    }
                    state.cartMessage = action.message ?? '';
                    return;
                case SELECT_COLOR:
                    state.cartMessage = '';
                    return;
                case SELECT_VARIANT:
                    state.cartMessage = '';
                    return;
                case CLEAR_PRODUCT:
                    state.cartMessage = '';
                    return;
                case SET_CART_ITEM_QUANTITY:
                    state.cartMessage = '';
                    return;
            }
        })
})

export default cartReducer;
