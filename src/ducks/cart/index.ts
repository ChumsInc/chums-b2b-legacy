import {
    CLEAR_PRODUCT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    SAVE_CART,
    SELECT_COLOR,
    SELECT_VARIANT
} from "../../constants/actions";

import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER_SHIPPING_ACCOUNT} from "../../constants/stores";
import {isCartOrder, isDeprecatedFetchSalesOrderAction, nextShipDate} from "../../utils/orders";
import {CART_PROGRESS_STATES, NEW_CART} from "../../constants/orders";
import {createReducer} from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import {
    addToCart, duplicateSalesOrder,
    getItemAvailability,
    promoteCart,
    removeCart,
    saveNewCart,
    setCartProgress,
    setCurrentCart,
    setShipDate,
    setShippingAccount
} from "./actions";
import {setCustomerAccount} from "../customer/actions";
import {setLoggedIn} from "../user/actions";
import {Editable, SalesOrderDetailLine, SalesOrderHeader} from "b2b-types";
import {CustomerShippingAccount} from "../../types/customer";
import {loadOpenOrders, loadSalesOrder} from "../open-orders/actions";
import {ItemAvailability} from "../../types/product";
import {CartProgress} from "../../types/cart";
import {Appendable} from "../../types/generic";
import {isEditableSalesOrder} from "../sales-order/utils";
import {
    isDeprecatedCreateNewCartAction,
    isDeprecatedDeleteCartAction,
    isDeprecatedFetchOrdersAction, isDeprecatedSaveCartAction
} from "../../utils/cart";


export interface CartState {
    cartNo: string;
    cartName: string;
    cartQuantity: number;
    cartTotal: number;
    promoCode: string | null;
    header: (SalesOrderHeader & Editable) | null;
    detail: (SalesOrderDetailLine & Editable & Appendable)[];
    loading: boolean;
    loaded: boolean;
    itemAvailability: ItemAvailability | null;
    itemAvailabilityLoading: boolean;
    cartProgress: CartProgress;
    shipDate: string;
    shippingAccount: CustomerShippingAccount;
    cartMessage: string;
}

export const initialCartState = (): CartState => ({
    cartNo: localStore.getItem<string>(STORE_CURRENT_CART, NEW_CART),
    cartName: '',
    cartQuantity: 0,
    cartTotal: 0,
    promoCode: null,
    header: null,
    detail: [],
    loading: false,
    loaded: false,
    itemAvailability: null,
    itemAvailabilityLoading: false,
    cartProgress: CART_PROGRESS_STATES.cart,
    shipDate: nextShipDate(),
    shippingAccount: {
        enabled: localStore.getItem<CustomerShippingAccount | null>(STORE_CUSTOMER_SHIPPING_ACCOUNT, null)?.enabled ?? false,
        value: localStore.getItem<CustomerShippingAccount | null>(STORE_CUSTOMER_SHIPPING_ACCOUNT, null)?.value ?? '',
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
        .addCase(setCustomerAccount.fulfilled, (state) => {
            state.cartNo = NEW_CART;
            state.cartName = '';
            state.cartTotal = 0;
            state.cartQuantity = 0;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload?.loggedIn) {
                state.cartNo = NEW_CART;
                state.cartName = '';
                state.cartTotal = 0;
                state.cartQuantity = 0;
                state.header = null;
                state.detail = [];
                state.itemAvailability = null;
                state.cartProgress = CART_PROGRESS_STATES.cart;
                state.shippingAccount.enabled = false;
                state.shippingAccount.value = '';
            }
        })
        .addCase(loadOpenOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOpenOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            let [cart] = action.payload.filter(so => so.OrderType === 'Q' && so.SalesOrderNo === state.cartNo);
            if (!cart && action.payload.filter(so => isCartOrder(so)).length === 1) {
                [cart] =  action.payload.filter(so => isCartOrder(so));
            }
            // if (!cart && state.cartNo === NEW_CART) {
            //     [cart] = action.payload.filter(so => so.OrderType === 'Q');
            // }
            if (!cart) {
                state.cartNo = NEW_CART;
                state.cartName = '';
                state.cartTotal = 0;
                state.cartQuantity = 0;
                state.cartProgress = CART_PROGRESS_STATES.cart;
                state.promoCode = null;
            } else {
                state.cartNo = cart.SalesOrderNo;
                state.cartName = cart.CustomerPONo ?? state.cartName;
                state.cartTotal = new Decimal(cart.TaxableAmt).add(cart.NonTaxableAmt).sub(cart.DiscountAmt).toNumber();
                state.promoCode = cart.UDF_PROMO_DEAL ?? null;
            }
        })
        .addCase(loadOpenOrders.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveNewCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(saveNewCart.fulfilled, (state, action) => {
            state.loading = false;
            if (!action.payload) {
                state.cartNo = NEW_CART;
                state.cartTotal = 0;
                state.cartQuantity = 0;
                state.cartProgress = CART_PROGRESS_STATES.cart;
                state.promoCode = null;
                return;
            }
            state.cartNo = action.payload?.SalesOrderNo ?? '';
            state.cartName = action.payload?.CustomerPONo ?? '';
            state.cartTotal = new Decimal(action.payload?.TaxableAmt).add(action.payload.NonTaxableAmt).toNumber();
            state.cartQuantity = (action.payload.detail ?? [])
                .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                .reduce((row, cv) => row + cv, 0);
            state.cartProgress = CART_PROGRESS_STATES.cart;
        })
        .addCase(saveNewCart.rejected, (state) => {
            state.loading = false;
        })
        .addCase(addToCart.pending, (state) => {
            state.loading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.loading = false;
            if (!action.payload) {
                state.cartNo = NEW_CART;
                state.cartTotal = 0;
                state.cartQuantity = 0;
                state.cartProgress = CART_PROGRESS_STATES.cart;
                state.promoCode = null;
                return;
            }
            state.cartNo = action.payload?.SalesOrderNo ?? '';
            state.cartName = action.payload?.CustomerPONo ?? '';
            state.cartTotal = new Decimal(action.payload?.TaxableAmt).add(action.payload.NonTaxableAmt).toNumber();
            state.cartQuantity = (action.payload.detail ?? [])
                .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                .reduce((row, cv) => row + cv, 0);
            state.cartProgress = CART_PROGRESS_STATES.cart;
        })
        .addCase(addToCart.rejected, (state) => {
            state.loading = false;
        })
        .addCase(loadSalesOrder.fulfilled, (state, action) => {
            if (action.payload && state.cartNo === action.payload?.SalesOrderNo) {
                state.loaded = true;
                state.cartName = action.payload.CustomerPONo ?? '';
                state.cartTotal = new Decimal(action.payload?.TaxableAmt).add(action.payload.NonTaxableAmt).toNumber();
                state.cartQuantity = (action.payload.detail ?? [])
                    .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                    .reduce((row, cv) => row + cv, 0);
                state.cartProgress = CART_PROGRESS_STATES.cart;
            }
        })
        .addCase(loadSalesOrder.rejected, (state, action) => {
            if (action.payload && state.cartNo === action.meta.arg) {
                state.loaded = true;
            }
        })
        .addCase(setShippingAccount, (state, action) => {
            state.shippingAccount.value = action.payload.value;
            state.shippingAccount.enabled = action.payload.enabled;
        })
        .addCase(promoteCart.fulfilled, (state, action) => {
            state.cartNo = NEW_CART;
            state.cartTotal = 0;
            state.cartQuantity = 0;
            state.cartProgress = CART_PROGRESS_STATES.cart;
            state.promoCode = null;
        })
        .addCase(removeCart.fulfilled, (state) => {
            state.loading = false;
            state.cartNo = NEW_CART;
            state.cartTotal = 0;
            state.cartQuantity = 0;
            state.cartProgress = CART_PROGRESS_STATES.cart;
            state.promoCode = null;
        })
        .addCase(setCurrentCart.fulfilled, (state, action) => {
            state.cartNo = action.payload?.SalesOrderNo ?? 'new';
            state.cartName = action.payload?.CustomerPONo ?? '';
            state.cartTotal = 0;
            state.cartQuantity = 0;
            if (action.payload) {
                state.cartTotal = new Decimal(action.payload?.TaxableAmt).add(action.payload.NonTaxableAmt).toNumber();
            }
            if (isEditableSalesOrder(action.payload)) {
                state.cartQuantity = Object.values(action.payload.detail)
                    .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                    .reduce((row, cv) => row + cv, 0);
            }
            state.cartProgress = CART_PROGRESS_STATES.cart;
        })
        .addCase(duplicateSalesOrder.pending, (state) => {
            state.loading = true;
        })
        .addCase(duplicateSalesOrder.fulfilled, (state, action) => {
            state.loading = false;
            if (!state.cartNo || state.cartNo === NEW_CART) {
                if (action.payload) {
                    state.cartNo = action.payload.SalesOrderNo;
                    state.cartName = action.payload.CustomerPONo ?? action.meta.arg.cartName;
                    state.cartTotal = new Decimal(action.payload?.TaxableAmt).add(action.payload.NonTaxableAmt).toNumber();
                    state.cartQuantity = 0;
                    if (isEditableSalesOrder(action.payload)) {
                        state.cartQuantity = Object.values(action.payload.detail)
                            .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                            .reduce((row, cv) => row + cv, 0);
                    }
                    state.cartProgress = CART_PROGRESS_STATES.cart;
                }
            }
        })
        .addCase(duplicateSalesOrder.rejected, (state) => {
            state.loading = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_ORDERS:
                    if (isDeprecatedFetchOrdersAction(action) && action.status === FETCH_SUCCESS) {
                        const receivedOrders = action.orders.filter(so => isCartOrder(so));
                        const [existing] = receivedOrders.filter(so => so.SalesOrderNo === state.cartNo);

                        if (state.cartNo !== NEW_CART && !existing) {
                            state.cartNo = NEW_CART;
                            state.cartName = '';
                            state.cartTotal = 0;
                            state.cartQuantity = 0;
                        } else if (!!existing) {
                            state.cartNo = existing.SalesOrderNo;
                            state.cartName = existing.CustomerPONo ?? '';
                            state.cartTotal = new Decimal(existing.TaxableAmt).add(existing.NonTaxableAmt).toNumber();
                        } else if (receivedOrders.length === 1) {
                            state.cartNo = receivedOrders[0].SalesOrderNo;
                            state.cartName = receivedOrders[0].CustomerPONo ?? '';
                            state.cartTotal = new Decimal(receivedOrders[0].TaxableAmt).add(receivedOrders[0].NonTaxableAmt).toNumber();
                        }
                    }
                    return;
                case FETCH_SALES_ORDER:
                    if (isDeprecatedFetchSalesOrderAction(action)) {
                        if (action.status === FETCH_SUCCESS) {
                            if (action.salesOrder && action.salesOrder.SalesOrderNo === state.cartNo) {
                                if (!isCartOrder(action.salesOrder)) {
                                    state.cartNo = NEW_CART;
                                    state.cartName = '';
                                    state.cartTotal = 0;
                                    state.cartQuantity = 0;
                                    state.cartProgress = CART_PROGRESS_STATES.cart;
                                } else {
                                    state.cartNo = action.salesOrder.SalesOrderNo;
                                    state.cartName = action.salesOrder.CustomerPONo ?? '';
                                    state.cartTotal = new Decimal(action.salesOrder.TaxableAmt).add(action.salesOrder.NonTaxableAmt).toNumber();
                                    state.cartQuantity = ((action.salesOrder.detail ?? []) as SalesOrderDetailLine[])
                                        .map(row => new Decimal(row.QuantityOrdered).times(row.UnitOfMeasureConvFactor).toNumber())
                                        .reduce((row, cv) => row + cv, 0);
                                    state.cartProgress = CART_PROGRESS_STATES.cart;
                                }
                            }
                        }
                        state.loaded = state.loaded || (action.isCart && action.status === FETCH_SUCCESS) || false;
                        state.loading = (action.isCart ?? false) && action.status === FETCH_INIT;
                    }
                    return;
                case CREATE_NEW_CART:
                    if (isDeprecatedCreateNewCartAction(action)) {
                        state.cartNo = action.cart?.SalesOrderNo ?? NEW_CART;
                        state.cartName = action.cart?.CustomerPONo ?? '';
                        state.cartTotal = new Decimal(action.cart?.TaxableAmt ?? 0).add(action.cart?.NonTaxableAmt ?? 0).toNumber();
                    }
                    return;
                case DELETE_CART:
                    if (isDeprecatedDeleteCartAction(action)) {
                        state.cartNo = action.status === FETCH_SUCCESS ? NEW_CART : state.cartNo;
                        state.cartName = action.status === FETCH_SUCCESS ? '' : state.cartName;
                        state.cartTotal = 0;
                        state.cartQuantity = 0;
                    }
                    return;
                case SAVE_CART:
                    if (isDeprecatedSaveCartAction(action)) {
                        if (state.cartNo === NEW_CART && action.payload) {
                            state.cartNo = action.payload;
                        }
                        state.cartMessage = action.message ?? '';
                    }
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
            }
        })
})

export default cartReducer;
