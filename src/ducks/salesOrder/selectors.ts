import {isSalesOrderHeader} from "../../utils/typeguards";
import {ORDER_TYPE} from "../../constants/orders";
import {createSelector} from "@reduxjs/toolkit";
import {selectCartNo} from "../cart/selectors";
import {RootState} from "../../app/configureStore";

export const selectSalesOrderNo = (state: RootState) => state.salesOrder.salesOrderNo;
export const selectProcessing = (state: RootState) => state.salesOrder.processing;
export const selectSendingEmailStatus = (state: RootState) => state.salesOrder.sendEmailStatus;
export const selectIsSendingEmail = (state: RootState) => state.salesOrder.sendingEmail;
export const selectAttempts = (state: RootState) => state.salesOrder.attempts;
export const selectSalesOrderHeader = (state: RootState) => state.salesOrder.header ?? null;
export const selectSalesOrderDetail = (state: RootState) => state.salesOrder.detail ?? [];

export const selectIsCart = (state: RootState) => {
    return isSalesOrderHeader(state.salesOrder.header) && state.salesOrder.orderType === ORDER_TYPE.cart;
}

export const selectIsCurrentCart = createSelector(
    [selectSalesOrderHeader, selectIsCart, selectCartNo],
    (header, isCart, currentCartNo) => {
        return isSalesOrderHeader(header) && isCart && header?.SalesOrderNo === currentCartNo;
    }
)
