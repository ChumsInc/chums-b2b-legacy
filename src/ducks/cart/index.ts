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
    SET_CART_ITEM_QUANTITY,
    UPDATE_CART
} from "../../constants/actions";

import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER_SHIPPING_ACCOUNT} from "../../constants/stores";
import {isCartOrder, nextShipDate} from "../../utils/orders";
import {CART_PROGRESS_STATES, NEW_CART} from "../../constants/orders";
import {createReducer} from "@reduxjs/toolkit";
import Decimal from "decimal.js";
import {
    addToCart,
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
import {loadOpenOrders} from "../open-orders/actions";
import {ItemAvailability} from "../../types/product";
import {CartProgress} from "../../types/cart";
import {loadSalesOrder} from "../open-orders/actions";
import {Appendable} from "../../types/generic";
import {isEditableSalesOrder} from "../salesOrder/utils";


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
            if (!action.payload.loggedIn) {
                state.cartNo = NEW_CART;
                state.cartName = '';
                state.cartTotal = 0;
                state.cartQuantity = 0;
            }
        })
        .addCase(loadOpenOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOpenOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            let [cart] = action.payload.filter(so => so.OrderType === 'Q' && so.SalesOrderNo === state.cartNo);
            if (!cart && state.cartNo === NEW_CART) {
                [cart] = action.payload.filter(so => so.OrderType === 'Q');
            }
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
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_ORDERS:
                    if (action.status === FETCH_SUCCESS) {
                        const receivedOrders = (action.orders as SalesOrderHeader[]).filter(so => isCartOrder(so));
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
                                state.cartName = action.salesOrder.CustomerPONo;
                                state.cartTotal = new Decimal(action.salesOrder.TaxableAmt).add(action.salesOrder.NonTaxableAmt).toNumber();
                                state.cartQuantity = ((action.salesOrder.detail ?? []) as SalesOrderDetailLine[])
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
                    state.cartNo = action.cart?.SalesOrderNo ?? NEW_CART;
                    state.cartName = action.cart?.CustomerPONo ?? '';
                    state.cartTotal = new Decimal(action.cart?.TaxableAmt ?? 0).add(action.cart?.NonTaxableAmt ?? 0).toNumber();
                    return;
                case DELETE_CART:
                    state.cartNo = action.status === FETCH_SUCCESS ? NEW_CART : state.cartNo;
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
                        state.cartQuantity = ((action.salesOrder.detail ?? []) as SalesOrderDetailLine[])
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
