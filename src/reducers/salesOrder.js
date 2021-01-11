import {combineReducers} from 'redux';
import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    RECEIVE_ORDERS,
    SELECT_SO,
    SEND_ORDER_EMAIL,
    SEND_ORDER_EMAIL_ACK,
    SET_CUSTOMER,
    SET_USER_ACCOUNT,
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../constants/actions";

import {calcOrderType as calcOrderType, isCartOrder} from "../utils/orders";
import {ORDER_TYPE} from "../constants/orders";

const salesOrderNo = (state = '', action) => {
    const {type, status, salesOrderNo, salesOrder, cart} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
    case SET_CUSTOMER:
        return '';
    case SELECT_SO:
        return salesOrderNo;
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS
            ? salesOrder.SalesOrderNo
            : state;
    case CREATE_NEW_CART:
        return cart.SalesOrderNo;
    case DELETE_CART:
        return status === FETCH_SUCCESS ? '' : state;
    default:
        return state;
    }
};


const header = (state = {}, action) => {
    const {type, status, salesOrder, salesOrderNo, orders, props, checkoutInProcess, cart} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        if (status === FETCH_SUCCESS) {
            const {detail, ...so} = salesOrder;
            return {...so};
        }
        return state;
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            const [salesOrder = {}] = orders.filter(so => so.SalesOrderNo === state.SalesOrderNo);
            return {...state, ...salesOrder};
        }
        return state;
    case UPDATE_CART:
        return {...state, ...props, changed: !checkoutInProcess};
    case SET_USER_ACCOUNT:
    case SET_CUSTOMER:
        return {};

    case DELETE_CART:
        return status === FETCH_SUCCESS ? {} : state;
    case CREATE_NEW_CART:
        return cart;
    default:
        return state;
    }
};

const detail = (state = [], action) => {
    const {type, status, salesOrder, LineKey, prop, commentText} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        if (status === FETCH_SUCCESS) {
            const {detail = [], ...so} = salesOrder;
            return [...detail];
        }
        return state;
    case UPDATE_CART_ITEM:
        const [line] = state.filter(line => line.LineKey === LineKey);
        return [
            ...state.filter(l => l.LineKey !== LineKey),
            {...line, ...prop, changed: true},
        ];
    case APPEND_ORDER_COMMENT:
        const maxLineKey = state
            .map(line => Number(line.LineKey))
            .reduce((a, b) => Math.max(a, b));
        return [
            ...state,
            {
                LineKey: String(maxLineKey + 1).padStart(6, '0'),
                ItemType: '4',
                ItemCode: '/C',
                CommentText: commentText,
                newLine: true
            },
        ];
    case SET_USER_ACCOUNT:
    case SET_CUSTOMER:
    case SELECT_SO:
        return [];
    case CREATE_NEW_CART:
        return [];
    case DELETE_CART:
        return status === FETCH_SUCCESS ? [] : state;
    default:
        return state;
    }
};

const orderType = (state = ORDER_TYPE.past, action) => {
    const {type, status, salesOrder} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS ? calcOrderType(salesOrder) : state;
    case DELETE_CART:
        return status === FETCH_SUCCESS ? '' : state;
    case SET_CUSTOMER:
    case SET_USER_ACCOUNT:
        return '';
    case CREATE_NEW_CART:
        return ORDER_TYPE.cart;
    default:
        return state;
    }
};

const readOnly = (state = null, action) => {
    const {type, status, salesOrder} = action;
    switch (type) {
    case FETCH_SALES_ORDER:
        return status === FETCH_SUCCESS ? !isCartOrder(salesOrder) : state;
    case CREATE_NEW_CART:
        return false;
    default:
        return state;
    }
};

const processing = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case DELETE_CART:
    case FETCH_SALES_ORDER:
        return status === FETCH_INIT;
    case PROMOTE_CART:
        return status === FETCH_INIT;
    case RECEIVE_ORDERS:
        return false;
    default:
        return state;
    }
};

const sendEmailStatus = (state = {}, action) => {
    const {type, status, payload} = action;
    switch (type) {
    case SEND_ORDER_EMAIL:
        if (status === FETCH_INIT) {
            return {sending: true};
        }
        if (status === FETCH_SUCCESS) {
            return {...payload};
        }
        return {};
    case SEND_ORDER_EMAIL_ACK:
        return {};
    default:
        return state;
    }
};

const attempts = (state = 0, action) => {
    const {type, status} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
    case SET_CUSTOMER:
    case SELECT_SO:
    case CREATE_NEW_CART:
    case DELETE_CART:
        return 0;
    case FETCH_SALES_ORDER:
        if (status === FETCH_INIT) {
            return state + 1;
        }
        if (status === FETCH_SUCCESS) {
            return 1;
        }
        return state;
    default:
        return state;
    }
};


export default combineReducers({
    salesOrderNo,
    processing,
    header,
    detail,
    readOnly,
    orderType,
    sendEmailStatus,
    attempts,
});
