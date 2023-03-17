import {RootState} from "../ducks/index";
import {Editable, SalesOrderHeader} from "b2b-types";
import {isSalesOrderHeader} from "../utils/typeguards";
import {ORDER_TYPE} from "../constants/orders";
import {createSelector} from "@reduxjs/toolkit";
import {selectCartNo} from "./cart";

export const selectSalesOrderNo = (state:RootState):string => state.salesOrder.salesOrderNo;
export const selectProcessing = (state:RootState):boolean => state.salesOrder.processing;
export const selectSendingEmailStatus = (state:RootState) => state.salesOrder.sendEmailStatus;
export const selectAttempts = (state:RootState) => state.salesOrder.attempts;
export const selectSalesOrderHeader = (state:RootState):SalesOrderHeader & Editable|{}|null => state.salesOrder.header ?? null;
export const selectIsCart = (state:RootState):boolean => {
    return isSalesOrderHeader(state.salesOrder.header) && state.salesOrder.orderType === ORDER_TYPE.cart;
}

export const selectIsCurrentCart = createSelector(
    [selectSalesOrderHeader, selectIsCart, selectCartNo],
    (header, isCart, currentCartNo) => {
        return isSalesOrderHeader(header) && isCart && header.SalesOrderNo === currentCartNo;
    }
)
