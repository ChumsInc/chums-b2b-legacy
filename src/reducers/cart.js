import {combineReducers} from 'redux';
import {
    CLEAR_PRODUCT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_CART,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_ITEM_AVAILABILITY,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    SAVE_CART,
    SELECT_COLOR,
    SELECT_VARIANT,
    SET_CART,
    SET_CART_ITEM_QUANTITY,
    SET_CART_PROGRESS,
    SET_CUSTOMER,
    SET_SHIP_DATE,
    SET_SHIPPING_ACCOUNT,
    UPDATE_CART
} from "../constants/actions";

import localStore from "../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER_SHIPPING_ACCOUNT} from "../constants/stores";
import {isCartOrder, nextShipDate} from "../utils/orders";
import {CART_PROGRESS_STATES, NEW_CART} from "../constants/orders";
import {DEFAULT_SHIPPING_ACCOUNT} from "../constants/account";


const defaults = {
    currentCart: localStore.getItem(STORE_CURRENT_CART) || '',
    shippingAccount: localStore.getItem(STORE_CUSTOMER_SHIPPING_ACCOUNT) || {...DEFAULT_SHIPPING_ACCOUNT},
};

const cartNo = (state = defaults.currentCart, action) => {
    const {type, status, cart, orders, salesOrder, isCart = false} = action;
    switch (type) {
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            return state === NEW_CART || orders.filter(so => isCartOrder(so) && so.SalesOrderNo === state).length
                ? state
                : '';
        }
        return state;
    case FETCH_SALES_ORDER:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        /*
            check to see if the loaded sales order is a cart - it could be that it's no longer a cart
            because it was promoted
         */
        return [salesOrder].filter(so => so.SalesOrderNo === state).length
            ? ([salesOrder].filter(so => isCartOrder(so)).length === 1
                ? state
                : '')
            : state;
    case CREATE_NEW_CART:
    case SET_CART:
        return cart.SalesOrderNo || '';
    case SET_CUSTOMER:
        return '';
    case DELETE_CART:
        if (status === FETCH_SUCCESS && isCart) {
            return '';
        }
        return state;
    default:
        return state;
    }
};

const cartName = (state = '', action) => {
    const {type, status, cart, orders, salesOrder, cartNo, isCart, props} = action;
    switch (type) {
    case CREATE_NEW_CART:
    case SET_CART:
        return cart.CustomerPONo || '';
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS && isCart
            ? salesOrder.CustomerPONo || ''
            : state;
    case DELETE_CART:
        if (status === FETCH_SUCCESS && isCart) {
            return '';
        }
        return state;
    case UPDATE_CART:
        if (props.CustomerPONo !== undefined) {
            return props.CustomerPONo;
        }
        if (props.cartName !== undefined) {
            return props.cartName;
        }
        return state;
    case SET_CUSTOMER:
        return '';
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            if (cartNo === NEW_CART) {
                return state;
            }
            const receivedOrders = orders.filter(so => isCartOrder(so));
            const [exists] = receivedOrders.filter(so => so.SalesOrderNo === cartNo);

            return receivedOrders.length === 1
                ? (receivedOrders[0].CustomerPONo || '')
                : (exists ? exists.CustomerPONo : '');
        }
        return state;
    default:
        return state;
    }
};

const cartTotal = (state = 0, action) => {
    const {type, status, cart, orders, salesOrder, cartNo, isCart} = action;
    switch (type) {
    case SET_CART:
    case CREATE_NEW_CART:
        return (cart.TaxableAmt || 0) + (cart.NonTaxableAmt || 0);
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS && isCart
            ? salesOrder.TaxableAmt + salesOrder.NonTaxableAmt
            : state;
    case FETCH_CART:
        if (status === FETCH_SUCCESS) {
            return salesOrder.TaxableAmt + salesOrder.NonTaxableAmt;
        }
        return state;
    case DELETE_CART:
        if (status === FETCH_SUCCESS && isCart) {
            return 0;
        }
        return state;
    case SET_CUSTOMER:
        return 0;
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            const receivedOrders = orders.filter(so => isCartOrder(so));
            const [exists] = receivedOrders.filter(so => {
                return so.SalesOrderNo === cartNo
            });
            return receivedOrders.length === 1
                ? receivedOrders[0].TaxableAmt + receivedOrders[0].NonTaxableAmt
                : (exists ? exists.TaxableAmt + exists.NonTaxableAmt : 0);
        }
        return state;
    default:
        return state;
    }
};

const cartQuantity = (state = 0, action) => {
    const {type, status, cart, isCart, salesOrder} = action;
    switch (type) {
    case SET_CART:
        return (cart.detail || []).map(row => row.QuantityOrdered * row.UnitOfMeasureConvFactor).reduce((acc, cv) => acc + cv, 0);
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS && isCart
            ? (salesOrder.detail || []).map(row => row.QuantityOrdered * row.UnitOfMeasureConvFactor).reduce((acc, cv) => acc + cv, 0)
            : state;
    case CREATE_NEW_CART:
    case DELETE_CART:
    case SET_CUSTOMER:
        return 0;
    default:
        return state;
    }
};

const loaded = (state = false, action) => {
    const {type, status, isCart} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        return state || (isCart && status === FETCH_SUCCESS);
    case SAVE_CART:
        return state || (status === FETCH_SUCCESS);
    case FETCH_CART:
        return status === FETCH_SUCCESS;
    case CREATE_NEW_CART:
    case SET_CUSTOMER:
        return false;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status, isCart} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        return isCart && status === FETCH_INIT;
    case SAVE_CART:
        return status === FETCH_INIT;

    case FETCH_CART:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const itemAvailability = (state = {}, action) => {
    const {type, item, status} = action;
    switch (type) {
    case FETCH_ITEM_AVAILABILITY:
        if (status === FETCH_FAILURE) {
            return {};
        }
        return {...item, loading: status === FETCH_INIT};
    default:
        return state;
    }
};

const cartProgress = (state = CART_PROGRESS_STATES.cart, action) => {
    const {type, value, status, isCart} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS && isCart
            ? CART_PROGRESS_STATES.cart
            : state;
    case SET_CART_PROGRESS:
        return value;
    default:
        return state;
    }
};

const shipDate = (state = nextShipDate(), action) => {
    const {type, shipDate} = action;
    switch (type) {
    case SET_SHIP_DATE:
        if (!!shipDate && new Date(shipDate).valueOf() < nextShipDate().valueOf()) {
            return nextShipDate();
        }
        return shipDate;
    default:
        return state;
    }
};

const shippingAccount = (state = defaults.shippingAccount, action) => {
    const {type, enabled, value} = action;
    switch (type) {
    case SET_CART:
        return {...DEFAULT_SHIPPING_ACCOUNT};
    case SET_SHIPPING_ACCOUNT:
        return {enabled, value};
    default:
        return state;
    }
};

const cartMessage = (state = '', action) => {
    const {type, status, message} = action;
    switch (type) {
    case SET_CART:
        return status === FETCH_SUCCESS
            ? message || ''
            : state;
    case SAVE_CART:
        return message || '';
    case SELECT_COLOR:
    case SELECT_VARIANT:
    case CLEAR_PRODUCT:
    case SET_CART_ITEM_QUANTITY:
        return '';
    default:
        return state;
    }
};


export default combineReducers({
    cartNo,
    cartName,
    cartTotal,
    cartQuantity,
    loading,
    loaded,
    itemAvailability,
    cartProgress,
    shipDate,
    shippingAccount,
    cartMessage,
});
