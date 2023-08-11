import {createReducer} from "@reduxjs/toolkit";
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
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../../constants/actions";
import {defaultDetailSorter, emptyDetailLine} from "./utils";
import {calcOrderType, isCartOrder} from "../../utils/orders";
import {setCustomerAccount} from "../customer/actions";
import {setLoggedIn, setUserAccount} from "../user/actions";
import {SalesOrderState} from "./types";
import {isCartHeader} from "../../utils/typeguards";
import {SalesOrderHeader, SalesOrderItemType} from "b2b-types";
import {customerSlug} from "@/utils/customer";

export const initialSalesOrderState = (): SalesOrderState => ({
    salesOrderNo: '',
    header: null,
    detail: [],
    orderType: 'past',
    readOnly: true,
    processing: false,
    sendEmailStatus: null,
    sendingEmail: false,
    attempts: 0,
    loading: false,
})

const salesOrderReducer = createReducer(initialSalesOrderState, (builder) => {
    builder
        .addCase(setCustomerAccount.fulfilled, (state) => {
            state.salesOrderNo = '';
            state.header = null;
            state.detail = [];
            state.orderType = 'past';
            state.attempts = 0;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.salesOrderNo = '';
                state.header = null;
                state.detail = [];
                state.orderType = 'past';
                state.attempts = 0;
            }
        })
        .addCase(setUserAccount.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && customerSlug(action.meta.arg) !== customerSlug(state.header)) {
                state.header = null;
                state.salesOrderNo = '';
                state.detail = [];
                state.orderType = 'past';
                state.attempts = 0;
            }
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SELECT_SO:
                    state.salesOrderNo = action.salesOrderNo ?? '';
                    state.header = null;
                    state.detail = [];
                    state.orderType = 'past';
                    state.attempts = 0;
                    return;
                case FETCH_SALES_ORDER:
                    state.processing = action.status === FETCH_INIT;
                    if (action.status === FETCH_INIT) {
                        state.attempts = state.attempts + 1;
                    }
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
                    state.orderType = 'cart';
                    state.attempts = 0;
                    return;
                case DELETE_CART:
                    state.processing = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.salesOrderNo = '';
                        state.header = null;
                        state.detail = [];
                        state.orderType = 'past';
                        state.attempts = 0;
                    }
                    return;
                case UPDATE_CART:
                    if (isCartHeader(state.header)) {
                        state.header = {...state.header, ...action.props};
                        if (!action.checkoutInProcess) {
                            // @ts-ignore
                            state.header.changed = true;
                        }
                    }
                    return;
                case FETCH_ORDERS:
                    if (action.status === FETCH_SUCCESS) {
                        const [salesOrder] = (action.orders as SalesOrderHeader[]).filter((so) => so.SalesOrderNo === state.salesOrderNo);
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
                                ...emptyDetailLine,
                                LineKey: String(maxLineKey + 1).padStart(6, '0'),
                                ItemType: '4' as SalesOrderItemType,
                                ItemCode: '/C',
                                CommentText: action.commentText ?? '',
                                newLine: true,
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
