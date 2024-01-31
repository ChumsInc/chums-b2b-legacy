import {UnknownAction} from "@reduxjs/toolkit";
import {
    Keyword,
    ContentPage,
    Product,
    ProductVariant,
    CartProduct,
    SalesOrderHeader,
    SalesOrder,
    SalesOrderDetailLine, InvoiceHeader, Invoice
} from "b2b-types";
import {EmptyObject} from "./generic";
import {AlertType} from "../ducks/alerts/types";


export interface DeprecatedAsyncAction extends UnknownAction {
    status: 'FETCH_INIT'|'FETCH_SUCCESS'|'FETCH_FAILURE';
}

export const isAsyncAction = (action:UnknownAction|DeprecatedAsyncAction): action is DeprecatedAsyncAction => {
    return typeof action.status === 'string'
        && ['FETCH_INIT','FETCH_SUCCESS','FETCH_FAILURE'].includes(action.status);
}
export interface DeprecatedKeywordsAction extends DeprecatedAsyncAction {
    list: Keyword[]
}

export interface DeprecatedPageAction extends DeprecatedAsyncAction {
    page: ContentPage;
}

export interface DeprecatedProductsAction extends DeprecatedAsyncAction {
    type: 'FETCH_PRODUCT',
    product: Product|null;
    variant: ProductVariant|null;
    msrp: string[];
    customerPrice: string[];
    salesUM: string;
    cartItem:CartProduct|null;
}

export interface DeprecatedSelectVariantAction extends DeprecatedAsyncAction {
    type: 'SELECT_VARIANT',
    variant: ProductVariant|null;
    msrp: string[];
    customerPrice: string[];
    salesUM: string;
    cartItem:CartProduct|null;
}

export interface DeprecatedSelectColorAction extends DeprecatedAsyncAction {
    type: 'SELECT_COLOR';
    colorCode: string;
    cartItem: CartProduct|null;
}

export interface DeprecatedFetchOrdersAction extends DeprecatedAsyncAction {
    type: 'FETCH_ORDERS';
    orders: SalesOrderHeader[];
    cartNo?: string;
    salesOrderNo?: string;
}

export interface DeprecatedFetchSalesOrderAction extends DeprecatedAsyncAction {
    type: 'FETCH_SALES_ORDER';
    isCart?: boolean;
    salesOrder?: SalesOrder|null;
}

export interface DeprecatedCreateNewCartAction extends UnknownAction {
    type: 'CREATE_NEW_CART';
    cart: SalesOrderHeader|null;
}

export interface DeprecatedDeleteCartAction extends DeprecatedAsyncAction {
    type: 'DELETE_CART';
}

export interface DeprecatedSaveCartAction extends DeprecatedAsyncAction {
    type: 'SAVE_CART';
    payload?: string;
    message?: string;
}

export interface DeprecatedUpdateCartItemAction extends UnknownAction {
    type: 'UPDATE_CART_ITEM';
    LineKey: string;
    prop: Partial<SalesOrderDetailLine>;
}

export interface DeprecatedFetchInvoiceAction extends DeprecatedAsyncAction {
    type: 'FETCH_INVOICE',
    invoice: Invoice;
}

export function isDeprecatedFetchInvoiceAction(action:UnknownAction|DeprecatedFetchInvoiceAction): action is DeprecatedFetchInvoiceAction {
    return action.type === "FETCH_INVOICE";
}

export interface DeprecatedSelectInvoiceAction extends UnknownAction {
    type: 'SELECT_INVOICE';
    invoice: Invoice|InvoiceHeader;
}

export function isDeprecatedSelectInvoiceAction(action:UnknownAction|DeprecatedSelectInvoiceAction): action is DeprecatedSelectInvoiceAction {
    return action.type === 'SELECT_INVOICE';
}

export interface DeprecatedAppendOrderCommentAction extends UnknownAction {
    type: 'APPEND_ORDER_COMMENT';
    commentText: string;
}
export function isDeprecatedAppendOrderCommentAction(action:UnknownAction|DeprecatedAppendOrderCommentAction): action is DeprecatedAppendOrderCommentAction {
    return action.type === "APPEND_ORDER_COMMENT";
}

export interface DeprecatedSetLoggedInAction extends UnknownAction {
    type: 'SET_LOGGED_IN',
    authType?: string;
    token?: string;
    loggedIn?: boolean;
}
export function isDeprecatedSetLoggedInAction(action:UnknownAction|DeprecatedSetLoggedInAction):action is DeprecatedSetLoggedInAction {
    return action.type === 'SET_LOGGED_IN';
}

export interface DeprecatedSetAlertAction extends UnknownAction {
    type: 'SET_ALERT',
    props: {
        type?: AlertType;
        title: string;
        message: string;
        context: string;
    }
}

export function isDeprecatedSetAlertAction(action:UnknownAction|DeprecatedSetAlertAction): action is DeprecatedSetAlertAction {
    return action.type === 'SET_ALERT';
}
