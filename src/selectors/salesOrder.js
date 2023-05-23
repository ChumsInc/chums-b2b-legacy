import {isSalesOrderHeader} from "../utils/typeguards";
import {ORDER_TYPE} from "../constants/orders";
import {createSelector} from "@reduxjs/toolkit";
import {selectCartNo} from "./cart";

export const selectSalesOrderNo = (state) => state.salesOrder.salesOrderNo;
export const selectProcessing = (state) => state.salesOrder.processing;
export const selectSendingEmailStatus = (state) => state.salesOrder.sendEmailStatus;
export const selectIsSendingEmail = (state) => state.salesOrder.sendEmailStatus?.sending || false;
export const selectAttempts = (state) => state.salesOrder.attempts;
export const selectSalesOrderHeader = (state) => state.salesOrder.header ?? null;
export const selectIsCart = (state) => {
    return isSalesOrderHeader(state.salesOrder.header) && state.salesOrder.orderType === ORDER_TYPE.cart;
}

export const selectIsCurrentCart = createSelector(
    [selectSalesOrderHeader, selectIsCart, selectCartNo],
    (header, isCart, currentCartNo) => {
        return isSalesOrderHeader(header) && isCart && header.SalesOrderNo === currentCartNo;
    }
)
