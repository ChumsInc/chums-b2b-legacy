import {createReducer} from "@reduxjs/toolkit";
import {
    APPEND_ORDER_COMMENT,
    CREATE_NEW_CART,
    DELETE_CART,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    RECEIVE_ORDERS,
    SELECT_SO,
    UPDATE_CART,
    UPDATE_CART_ITEM
} from "../../constants/actions";
import {defaultDetailSorter, emptyDetailLine, isEditableSalesOrder} from "./utils";
import {calcOrderType, isCartOrder} from "../../utils/orders";
import {loadCustomer, setCustomerAccount} from "../customer/actions";
import {setLoggedIn, setUserAccess} from "../user/actions";
import {isCartHeader} from "../../utils/typeguards";
import {
    BillToCustomer,
    Editable,
    EmailResponse,
    SalesOrderDetailLine,
    SalesOrderHeader,
    SalesOrderItemType
} from "b2b-types";
import {customerSlug} from "../../utils/customer";
import {Appendable, LoadStatus} from "../../types/generic";
import {OrderType} from "../../types/salesorder";
import {closeEmailResponse, sendOrderEmail, updateDetailLine} from "./actions";
import {promoteCart, removeCart, saveCart, saveNewCart, setCurrentCart} from "../cart/actions";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER} from "../../constants/stores";
import {loadOpenOrders} from "../open-orders/actions";

export interface SalesOrderState {
    customerKey: string | null;
    salesOrderNo: string;
    header: (SalesOrderHeader & Editable) | null;
    detail: (SalesOrderDetailLine & Editable & Appendable)[];
    invoices: string[];
    payment: unknown[],
    orderType: OrderType | null;
    readOnly: boolean;
    processing: LoadStatus;
    sendEmail: {
        status: LoadStatus | 'fulfilled';
        response: EmailResponse | null;
        error: string | null;
    }
    attempts: number;
    loading: boolean;
    loaded: boolean;
}

export const initialSalesOrderState = (): SalesOrderState => ({
    customerKey: customerSlug(localStore.getItem<BillToCustomer | null>(STORE_CUSTOMER, null)),
    salesOrderNo: localStore.getItem<string>(STORE_CURRENT_CART, ''),
    header: null,
    detail: [],
    invoices: [],
    payment: [],
    orderType: 'past',
    readOnly: true,
    processing: 'idle',
    sendEmail: {
        status: 'idle',
        response: null,
        error: null,
    },
    attempts: 0,
    loading: false,
    loaded: false,
})

const salesOrderReducer = createReducer(initialSalesOrderState, (builder) => {
    builder
        .addCase(setCustomerAccount.fulfilled, (state, action) => {
            const customerKey = customerSlug(action.meta.arg);
            if (state.customerKey !== customerKey) {
                state.customerKey = customerKey;
                state.salesOrderNo = '';
                state.header = null;
                state.detail = [];
                state.invoices = [];
                state.payment = [];
                state.orderType = 'past';
                state.attempts = 0;
                state.loaded = false;
            }
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.salesOrderNo = '';
                state.header = null;
                state.detail = [];
                state.invoices = [];
                state.payment = [];
                state.orderType = 'past';
                state.attempts = 0;
                state.loaded = false;
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && customerSlug(action.meta.arg) !== customerSlug(state.header)) {
                const customerKey = customerSlug(action.meta.arg);
                state.header = null;
                state.salesOrderNo = '';
                state.detail = [];
                state.invoices = [];
                state.payment = [];
                state.orderType = 'past';
                state.attempts = 0;
                state.loaded = false;
            }
        })
        .addCase(loadCustomer.pending, (state, action) => {
            const customerKey = customerSlug(action.meta.arg);
            if (state.customerKey !== customerKey) {
                state.customerKey = customerKey;
                state.salesOrderNo = '';
                state.header = null;
                state.detail = [];
                state.invoices = [];
                state.payment = [];
                state.orderType = 'past';
                state.attempts = 0;
                state.loaded = false;
            }
        })
        .addCase(sendOrderEmail.pending, (state) => {
            state.sendEmail.status = 'pending';
            state.sendEmail.response = null;
            state.sendEmail.error = null;
        })
        .addCase(sendOrderEmail.fulfilled, (state, action) => {
            state.sendEmail.response = action.payload;
            state.sendEmail.status = 'fulfilled';
        })
        .addCase(sendOrderEmail.rejected, (state, action) => {
            state.sendEmail.status = 'idle';
            state.sendEmail.response = null;
            state.sendEmail.error = action?.error?.message ?? null;
        })
        .addCase(closeEmailResponse, (state) => {
            state.sendEmail.status = 'idle';
            state.sendEmail.response = null;
            state.sendEmail.error = null;
        })
        .addCase(saveCart.pending, (state) => {
            state.processing = 'pending';
        })
        .addCase(saveCart.fulfilled, (state, action) => {
            state.processing = 'idle';
            if (action.payload) {
                const {detail, invoices, payment, ...header} = action.payload
                state.header = header;
                state.detail = [...detail].sort(defaultDetailSorter);
                state.invoices = invoices ?? [];
                state.payment = payment ?? [];
                state.orderType = calcOrderType(action.payload);
                state.readOnly = !isCartOrder(action.payload);
                state.loaded = true;
            }
        })
        .addCase(saveCart.rejected, (state) => {
            state.processing = 'idle';
        })
        .addCase(promoteCart.pending, (state) => {
            state.processing = 'pending';
        })
        .addCase(promoteCart.fulfilled, (state, action) => {
            state.processing = 'idle';
            if (action.payload) {
                const {detail, invoices, payment, ...header} = action.payload
                state.header = header;
                state.detail = [...detail].sort(defaultDetailSorter);
                state.invoices = invoices ?? [];
                state.payment = payment ?? [];
                state.orderType = calcOrderType(action.payload);
                state.readOnly = !isCartOrder(action.payload);
                state.loaded = true;
            } else {
                state.header = null;
                state.detail = [];
                state.invoices = [];
                state.payment = [];
                state.orderType = null;
                state.readOnly = true;
                state.loaded = false;
            }
        })
        .addCase(promoteCart.rejected, (state) => {
            state.processing = 'idle';
        })
        .addCase(loadOpenOrders.fulfilled, (state, action) => {
            const [so] = action.payload.filter(so => so.SalesOrderNo === state.salesOrderNo);
            state.header = so ?? null;
            state.orderType = calcOrderType(so);
            state.readOnly = !isCartOrder(so);
            if (!so) {
                state.detail = [];
                state.invoices = [];
                state.payment = [];
            }
        })
        .addCase(saveNewCart.fulfilled, (state, action) => {
            if (action.payload) {
                const {detail, invoices, payment, ...header} = action.payload;
                state.customerKey = customerSlug(action.payload);
                state.header = header;
                state.detail = [...detail].sort(defaultDetailSorter);
                state.invoices = invoices ?? [];
                state.payment = payment ?? [];
                state.orderType = calcOrderType(action.payload);
                state.readOnly = !isCartOrder(action.payload);
                state.loaded = true;
            }
        })
        .addCase(removeCart.pending, (state) => {
            state.processing = 'pending';
        })
        .addCase(removeCart.fulfilled, (state) => {
            state.processing = 'idle';
            state.header = null;
            state.orderType = null;
            state.readOnly = true;
            state.detail = [];
            state.invoices = [];
            state.payment = [];
        })
        .addCase(removeCart.rejected, (state) => {
            state.processing = 'idle';
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
                    if (action.status === FETCH_INIT) {
                        state.processing = 'pending';
                        state.attempts = state.attempts + 1;
                    } else if (action.status === FETCH_FAILURE) {
                        state.processing = 'rejected';

                    }
                    if (action.status === FETCH_SUCCESS) {
                        state.processing = 'idle';
                        const {detail, ...salesOrder} = action.salesOrder;
                        state.salesOrderNo = salesOrder?.SalesOrderNo ?? '';
                        state.header = salesOrder ?? {};
                        state.detail = (detail ?? []).sort(defaultDetailSorter);
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
                    if (action.status === FETCH_INIT) {
                        state.processing === 'pending';
                    } else if (action.status === FETCH_FAILURE) {
                        state.processing = 'rejected';
                    }
                    if (action.status === FETCH_SUCCESS) {
                        state.processing = 'idle';
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
                case RECEIVE_ORDERS:
                    state.processing = 'idle';
                    return;
            }
        })
})

export default salesOrderReducer;
