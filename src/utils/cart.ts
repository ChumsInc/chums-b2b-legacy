import {SalesOrderDetailLine} from "b2b-types";
import {ChangeDetailLine, NewCommentLine} from "../types/cart";
import {UnknownAction} from "@reduxjs/toolkit";
import {
    DeprecatedCreateNewCartAction,
    DeprecatedDeleteCartAction,
    DeprecatedFetchOrdersAction,
    DeprecatedSaveCartAction
} from "../types/actions";

export const changedDetailLine = (line:SalesOrderDetailLine):ChangeDetailLine => {
    const {LineKey, ItemCode, QuantityOrdered, CommentText} = line;
    return {LineKey, ItemCode, QuantityOrdered, CommentText};
}

export const newCommentLine = (line:SalesOrderDetailLine):NewCommentLine => {
    const {LineKey, CommentText} = line;
    return {LineKey, CommentText};
}

export function isDeprecatedFetchOrdersAction(action:UnknownAction|DeprecatedFetchOrdersAction): action is DeprecatedFetchOrdersAction {
    return action.type === 'FETCH_ORDERS';
}

export function isDeprecatedCreateNewCartAction(action:UnknownAction|DeprecatedCreateNewCartAction):action is DeprecatedCreateNewCartAction {
    return action.type === 'CREATE_NEW_CART';
}

export function isDeprecatedDeleteCartAction(action:UnknownAction|DeprecatedDeleteCartAction):action is DeprecatedDeleteCartAction {
    return action.type === "DELETE_CART";
}

export function isDeprecatedSaveCartAction(action:UnknownAction|DeprecatedSaveCartAction): action is DeprecatedSaveCartAction {
    return action.type === 'SAVE_CART';
}
