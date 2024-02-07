import {createReducer} from "@reduxjs/toolkit";
import {isEditableSalesOrder, isOpenSalesOrder} from "../salesOrder/utils";
import {EmailResponse, SalesOrderHeader} from "b2b-types";
import {
    closeEmailResponse,
    loadOpenOrders,
    loadSalesOrder,
    sendOrderEmail,
    setCartsFilter,
    setOpenOrdersFilter,
    setSalesOrderSort,
    updateDetailLine
} from "./actions";
import {setCustomerAccount} from "../customer/actions";
import {customerSlug} from "../../utils/customer";
import {setLoggedIn, setUserAccess} from "../user/actions";
import {
    addCartComment,
    addToCart,
    duplicateSalesOrder,
    promoteCart,
    removeCart,
    saveCart,
    saveNewCart
} from "../cart/actions";
import {LoadStatus, SortProps} from "../../types/generic";
import {ActionStatusList, OpenOrderDetailList, OpenOrderList} from "./types";

export interface OpenOrdersState {
    customerKey: string | null;
    list: OpenOrderList;
    loading: boolean;
    loaded: boolean;
    sort: SortProps<SalesOrderHeader>;
    cartsFilter: string;
    openFilter: string;
    actionStatus: ActionStatusList;
    sendEmail: {
        status: LoadStatus | 'fulfilled';
        response: EmailResponse | null;
        error: string | null;
    }
}

export const initialOpenOrderState = (): OpenOrdersState => ({
    customerKey: null,
    list: {},
    loading: false,
    loaded: false,
    sort: {field: 'SalesOrderNo', ascending: true},
    cartsFilter: '',
    openFilter: '',
    actionStatus: {},
    sendEmail: {
        status: 'idle',
        response: null,
        error: null,
    },
})

const openOrdersReducer = createReducer(initialOpenOrderState, (builder) => {
    builder
        .addCase(setCustomerAccount.pending, (state, action) => {
            const key = customerSlug(action.meta.arg);
            if (state.customerKey !== key) {
                state.list = {};
                state.loaded = false;
                state.customerKey = key;
                state.openFilter = '';
                state.cartsFilter = '';
            }
        })
        .addCase(loadOpenOrders.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadOpenOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = {};
            action.payload.map(so => {
                if (!state.actionStatus[so.SalesOrderNo]) {
                    state.actionStatus[so.SalesOrderNo] = 'idle';
                }
                state.list[so.SalesOrderNo] = {...so, actionStatus: 'idle'};
            })
        })
        .addCase(loadOpenOrders.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.list = {};
                state.loaded = false;
                state.customerKey = null;
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && state.customerKey !== customerSlug(action.meta.arg)) {
                state.list = {};
                state.loaded = false;
                state.customerKey = customerSlug(action.meta.arg);
            }
        })
        .addCase(saveNewCart.fulfilled, (state, action) => {
            if (action.payload) {
                state.actionStatus[action.payload?.SalesOrderNo] = 'idle';
                state.list[action.payload.SalesOrderNo] = {...action.payload, actionStatus: 'idle'};
            }
        })
        .addCase(saveCart.pending, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'saving';
            if (state.list[action.meta.arg.SalesOrderNo]) {
                state.list[action.meta.arg.SalesOrderNo].actionStatus = 'saving';
            }
        })
        .addCase(saveCart.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'idle';
            if (action.payload) {
                state.list[action.payload.SalesOrderNo] = {...action.payload, actionStatus: 'idle'};
            }
        })
        .addCase(saveCart.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'rejected';
            if (state.list[action.meta.arg.SalesOrderNo]) {
                state.list[action.meta.arg.SalesOrderNo].actionStatus = 'rejected';
            }
        })
        .addCase(promoteCart.pending, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'promoting';
            if (state.list[action.meta.arg.SalesOrderNo]) {
                state.list[action.meta.arg.SalesOrderNo] = {
                    ...state.list[action.meta.arg.SalesOrderNo],
                    ...action.meta.arg,
                    actionStatus: 'promoting'
                }
            }
        })
        .addCase(promoteCart.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'idle';
            if (action.payload) {
                state.list[action.payload.SalesOrderNo] = {...action.payload, actionStatus: 'idle'};
            }
        })
        .addCase(promoteCart.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'rejected';
        })
        .addCase(removeCart.pending, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'deleting';
            if (state.list[action.meta.arg.SalesOrderNo]) {
                state.list[action.meta.arg.SalesOrderNo].actionStatus = 'deleting';
            }
            state.loading = true;
        })
        .addCase(removeCart.fulfilled, (state, action) => {
            delete state.actionStatus[action.meta.arg.SalesOrderNo];
            state.loaded = true;
            state.list = {};
            action.payload.forEach(so => {
                state.actionStatus[so.SalesOrderNo] = 'idle';
                state.list[so.SalesOrderNo] = {...so, actionStatus: 'idle'};
            });
        })
        .addCase(removeCart.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.SalesOrderNo] = 'rejected';
            if (state.list[action.meta.arg.SalesOrderNo]) {
                state.list[action.meta.arg.SalesOrderNo].actionStatus = 'rejected';
            }
            state.loading = false;
        })
        .addCase(loadSalesOrder.pending, (state, action) => {
            state.actionStatus[action.meta.arg] = 'pending';
            if (state.list[action.meta.arg]) {
                state.list[action.meta.arg].actionStatus = 'pending';
            }
        })
        .addCase(loadSalesOrder.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg] = 'idle';
            if (action.payload && isOpenSalesOrder(action.payload)) {
                const key = action.payload.SalesOrderNo;
                const detail: OpenOrderDetailList = {};
                action.payload.detail.forEach(line => {
                    detail[line.LineKey] = line;
                })
                state.list[key] = {
                    ...action.payload,
                    detail,
                }
            }
        })
        .addCase(loadSalesOrder.rejected, (state, action) => {
            state.actionStatus[action.meta.arg] = 'rejected';
            if (state.list[action.meta.arg]) {
                state.list[action.meta.arg].actionStatus = 'rejected';
            }
        })
        .addCase(addToCart.pending, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'saving';
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
            if (action.payload && isOpenSalesOrder(action.payload)) {
                const key = action.payload.SalesOrderNo;
                const detail: OpenOrderDetailList = {};
                action.payload.detail.forEach(line => {
                    detail[line.LineKey] = line;
                })
                state.list[key] = {
                    ...action.payload,
                    detail,
                }
            }
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
        })
        .addCase(addCartComment.pending, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'saving';
        })
        .addCase(addCartComment.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
            if (action.payload && isOpenSalesOrder(action.payload)) {
                const key = action.payload.SalesOrderNo;
                const detail: OpenOrderDetailList = {};
                action.payload.detail.forEach(line => {
                    detail[line.LineKey] = line;
                })
                state.list[key] = {
                    ...action.payload,
                    detail,
                }
            }
        })
        .addCase(addCartComment.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
        })
        .addCase(setCartsFilter, (state, action) => {
            state.cartsFilter = action.payload;
        })
        .addCase(setOpenOrdersFilter, (state, action) => {
            state.openFilter = action.payload;
        })
        .addCase(setSalesOrderSort, (state, action) => {
            state.sort = action.payload;
        })
        .addCase(updateDetailLine, (state, action) => {
            const {SalesOrderNo, LineKey, ...props} = action.payload;
            const so = state.list[SalesOrderNo];
            if (so && isEditableSalesOrder(so) && so.detail[LineKey]) {
                so.detail[LineKey] = {...so.detail[LineKey], ...props, changed: true};
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
        .addCase(duplicateSalesOrder.pending, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'pending';
        })
        .addCase(duplicateSalesOrder.fulfilled, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
            if (action.payload) {
                const detail: OpenOrderDetailList = {};
                action.payload.detail.forEach(line => {
                    detail[line.LineKey] = line;
                })
                state.list[action.payload.SalesOrderNo] = {...action.payload, detail};
            }
        })
        .addCase(duplicateSalesOrder.rejected, (state, action) => {
            state.actionStatus[action.meta.arg.salesOrderNo] = 'idle';
        })
})
export default openOrdersReducer;
