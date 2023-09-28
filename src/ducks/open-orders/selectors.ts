import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {detailSequenceSorter, isEditableSalesOrder, salesOrderSorter} from "../salesOrder/utils";

export const selectOpenOrders = (state: RootState) => state.openOrders.list;
export const selectOpenOrdersLoading = (state: RootState) => state.openOrders.loading ?? false;
export const selectOpenOrdersLoaded = (state: RootState) => state.openOrders.loaded ?? false;
export const selectOpenOrdersSort = (state: RootState) => state.openOrders.sort;
export const selectOpenOrdersFilter = (state: RootState) => state.openOrders.openFilter;
export const selectCartsFilter = (state: RootState) => state.openOrders.cartsFilter;

export const selectSendEmailResponse = (state: RootState) => state.openOrders.sendEmail.response;
export const selectSendEmailStatus = (state: RootState) => state.openOrders.sendEmail.status;
export const selectSendEmailError = (state: RootState) => state.openOrders.sendEmail.error;

export const selectActionStatus = (state: RootState) => state.openOrders.actionStatus;

export const selectSalesOrder = createSelector(
    [selectOpenOrders, (state: RootState, salesOrderNo: string) => salesOrderNo],
    (list, salesOrderNo) => list[salesOrderNo] ?? null
)

export const selectOpenOrdersLength = createSelector(
    [selectOpenOrders],
    (list) => {
        return Object.values(list).filter(so => so.OrderType !== 'Q').length;
    }
)

export const selectCartsLength = createSelector(
    [selectOpenOrders],
    (list) => {
        return Object.values(list).filter(so => so.OrderType === 'Q').length;
    }
)

export const selectOpenOrdersList = createSelector(
    [selectOpenOrders, selectOpenOrdersFilter, selectOpenOrdersSort],
    (list, filter, sort) => {
        return Object.values(list)
            .filter(so => so.OrderType !== 'Q')
            .filter(so => !filter || so.SalesOrderNo.includes(filter) || so.CustomerPONo?.includes(filter))
            .sort(salesOrderSorter(sort));
    }
)
export const selectCartsList = createSelector(
    [selectOpenOrders, selectCartsFilter, selectOpenOrdersSort],
    (list, filter, sort) => {
        return Object.values(list)
            .filter(so => so.OrderType === 'Q')
            .filter(so => !filter || so.SalesOrderNo.includes(filter) || so.CustomerPONo?.includes(filter))
            .sort(salesOrderSorter(sort));
    }
)

export const selectSalesOrderDetail = createSelector(
    [selectOpenOrders, (state: RootState, salesOrderNo: string) => salesOrderNo],
    (list, salesOrderNo) => {
        const so = list[salesOrderNo]
        if (!so || !isEditableSalesOrder(so)) {
            return [];
        }
        return Object.values(so.detail).sort(detailSequenceSorter);
    }
)

export const selectSalesOrderIsCart = createSelector(
    [selectOpenOrders, (state: RootState, salesOrderNo: string) => salesOrderNo],
    (list, salesOrderNo) => list[salesOrderNo]?.OrderType === 'Q'
)

export const selectDetailChanged = createSelector(
    [selectOpenOrders, (state: RootState, salesOrderNo: string) => salesOrderNo],
    (list, salesOrderNo) => {
        const so = list[salesOrderNo]
        if (!so || !isEditableSalesOrder(so)) {
            return false;
        }
        return Object.values(so.detail).filter(line => line.changed).length > 0;
    }
)



export const selectSalesOrderLoading = createSelector(
    [selectActionStatus, (state, salesOrderNo) => salesOrderNo],
    (list, salesOrderNo) => {
        return !list[salesOrderNo] || list[salesOrderNo] !== 'idle';
    }
)

export const selectSalesOrderActionStatus = createSelector(
    [selectActionStatus, (state, salesOrderNo) => salesOrderNo],
    (list, salesOrderNo) => {
        return list[salesOrderNo] ?? 'idle';
    }
)

export const selectSalesOrderInvoices = createSelector(
    [selectOpenOrders, (state: RootState, salesOrderNo: string) => salesOrderNo],
    (list, salesOrderNo) => {
        const so = list[salesOrderNo]
        if (!so || !isEditableSalesOrder(so)) {
            return [];
        }
        return so.invoices.sort();
    }
)
