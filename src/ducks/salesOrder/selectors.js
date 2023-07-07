import {isSalesOrderHeader} from "../../utils/typeguards";
import {ORDER_TYPE} from "../../constants/orders";
import {createSelector} from "@reduxjs/toolkit";
import {selectCartNo} from "../cart/selectors";

export const selectSalesOrderNo = (state) => state.salesOrder.salesOrderNo;
export const selectProcessing = (state) => state.salesOrder.processing;
export const selectSendingEmailStatus = (state) => state.salesOrder.sendEmailStatus;
export const selectIsSendingEmail = (state) => state.salesOrder.sendEmailStatus?.sending || false;
export const selectAttempts = (state) => state.salesOrder.attempts;

/**
 *
 * @param state
 * @return {SalesOrderHeader|null}
 */
export const selectSalesOrderHeader = (state) => state.salesOrder.header ?? null;

/**
 *
 * @param state
 * @return {(SalesOrderDetail & Editable & Appendable)[]}
 */
export const selectSalesOrderDetail = (state) => state.salesOrder.detail ?? [];
export const selectIsCart = (state) => {
    return isSalesOrderHeader(state.salesOrder.header) && state.salesOrder.orderType === ORDER_TYPE.cart;
}

export const selectIsCurrentCart = createSelector(
    [selectSalesOrderHeader, selectIsCart, selectCartNo],
    (header, isCart, currentCartNo) => {
        return isSalesOrderHeader(header) && isCart && header?.SalesOrderNo === currentCartNo;
    }
)
