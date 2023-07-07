import {createReducer} from "@reduxjs/toolkit";
import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART, DELETE_CART, FETCH_INIT, FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS, PROMOTE_CART, RECEIVE_ORDERS,
    SELECT_SO, SEND_ORDER_EMAIL, SEND_ORDER_EMAIL_ACK,
    SET_CUSTOMER,
    SET_USER_ACCOUNT, UPDATE_CART, UPDATE_CART_ITEM
} from "../../constants/actions";
import {defaultDetailSorter} from "./sorter";
import {calcOrderType, isCartOrder} from "../../utils/orders";
import {ORDER_TYPE} from "../../constants/orders";

/**
 *
 * @type {SalesOrderState}
 */
const initialSalesOrderState = {
    salesOrderNo: '',
    header: {},
    detail: [],
    orderType: 'past',
    readOnly: true,
    processing: false,
    sendEmailStatus: null,
    sendingEmail: false,
    attempts: 0,
    loading: false,
}

const salesOrderReducer = createReducer(initialSalesOrderState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_USER_ACCOUNT:
                    state.salesOrderNo = '';
                    state.header = {};
                    state.detail = [];
                    state.orderType = ORDER_TYPE.past;
                    state.attempts = 0;
                    return;
                case SET_CUSTOMER:
                    state.salesOrderNo = '';
                    state.header = {};
                    state.detail = [];
                    state.orderType = ORDER_TYPE.past;
                    state.attempts = 0;
                    return;
                case SELECT_SO:
                    state.salesOrderNo = action.salesOrderNo ?? '';
                    state.header = {};
                    state.detail = [];
                    state.orderType = ORDER_TYPE.past;
                    state.attempts = 0;
                    return;
                case FETCH_SALES_ORDER:
                    state.processing = action.status === FETCH_INIT;
                    state.attempts = action.status === FETCH_INIT ? state.attempts + 1 : state;
                    if (action.status === FETCH_SUCCESS) {
                        const {detail, ...salesOrder} = action.salesOrder;
                        state.salesOrderNo = salesOrder?.SalesOrderNo ?? '';
                        state.header = salesOrder ?? {};
                        state.detail = detail ?? [];
                        state.orderType = calcOrderType(action.salesOrder);
                        state.readOnly = !isCartOrder(action.salesOrder);
                        state.attempts = 1;
                    }
                    return;
                case CREATE_NEW_CART:
                    state.salesOrderNo = '';
                    state.header = action.cart ?? {};
                    state.detail = [];
                    state.orderType = ORDER_TYPE.cart;
                    state.attempts = 0;
                    return;
                case DELETE_CART:
                    state.processing = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.salesOrderNo = '';
                        state.header = {};
                        state.detail = [];
                        state.orderType = ORDER_TYPE.past;
                        state.attempts = 0;
                    }
                    return;
                case UPDATE_CART:
                    if (state.header) {
                        state.header = {...state.header, ...action.props};
                        if (!action.checkoutInProcess) {
                            state.header.changed = true;
                        }
                    }
                    return;
                case FETCH_ORDERS:
                    if (action.status === FETCH_SUCCESS) {
                        const [salesOrder] = action.orders.filter(so => so.SalesOrderNo === state.salesOrderNo);
                        if (salesOrder) {
                            state.header = salesOrder;
                        }
                    }
                    return;
                case UPDATE_CART_ITEM: {
                    const [line] = state.detail.filter(line => line.LineKey === action.LineKey);
                    state.detail = [
                        ...state.detail.filter(line => line.LineKey !== action.LineKey),
                        {...line, ...action.prop, changed: true},
                    ].sort(defaultDetailSorter);
                    return;
                }
                case APPEND_ORDER_COMMENT:
                    if (action.commentText) {
                        const maxLineKey = state.detail
                            .map(line => Number(line.LineKey))
                            .reduce((a, b) => Math.max(a, b));
                        state.detail = [
                            ...state.detail,
                            {
                                LineKey: String(maxLineKey + 1).padStart(6, '0'),
                                ItemType: '4',
                                ItemCode: '/C',
                                CommentText: action.commentText ?? '',
                                newLine: true
                            }
                        ].sort(defaultDetailSorter);
                    }
                    return;
                case PROMOTE_CART:
                    state.processing = action.status === FETCH_INIT;
                    return;
                case RECEIVE_ORDERS:
                    state.processing = false;
                    return;
                case SEND_ORDER_EMAIL:
                    state.sendingEmail = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.sendEmailStatus = action.payload ?? null;
                    }
                    return;
                case SEND_ORDER_EMAIL_ACK:
                    state.sendEmailStatus = null;
                    return;
            }
        })
})

export default salesOrderReducer;
