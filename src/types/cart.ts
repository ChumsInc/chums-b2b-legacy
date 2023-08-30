import {SalesOrderDetailLine} from "b2b-types";

export interface Appendable {
    newLine?: boolean;
}

export type ChangeDetailLine = Pick<SalesOrderDetailLine, 'LineKey' | 'ItemCode' | 'QuantityOrdered' | 'CommentText'>

export type NewCommentLine = Pick<SalesOrderDetailLine, 'LineKey' | 'CommentText'>

export type CartAction =
    'append'
    | 'append-comment'
    | 'apply-discount'
    | 'delete'
    | 'delete-line'
    | 'duplicate'
    | 'line-comment'
    | 'new'
    | 'promote'
    | 'test-freight'
    | 'update-item'
    | 'update-line'
    | 'update';

export interface CartQuoteBase {
    action: CartAction;
    SalesOrderNo: string;
    promo_code?: string;
}

export interface CartAppendBody extends CartQuoteBase {
    action: 'append';
    ItemCode: string;
    QuantityOrdered: string;
}

//@TODO: Verify this is valid!
export interface CartAppendCommentBody extends CartQuoteBase {
    action: 'append-comment';
    LineKey: string;
    Comment: string;
}

export interface CartDeleteItemBody extends CartQuoteBase {
    action: 'delete-line';
    LineKey: string;
}

export interface PromoteCartBody extends CartQuoteBase {
    action: 'promote',
    CartName: string;
    ShipExpireDate: string;
    ShipVia: string;
    PaymentType: string;
    ShipToCode: string;
    Comment: string;
    promo_code: string;
}

export interface DeleteCartBody extends CartQuoteBase {
    action: 'delete'
}

export interface UpdateCartItemBody extends CartQuoteBase {
    action: 'update-item' | 'append';
    LineKey?: string;
    ItemCode: string;
    QuantityOrdered: number;
    Comment: string;
}

export interface NewCartBody extends CartQuoteBase {
    action: 'new',
    CartName: string;
    ItemCode: string;
    QuantityOrdered: string|number;
    Comment: string;
    SalesOrderNo: '',
    promo_code: string;
}

export interface UpdateCartBody extends CartQuoteBase {
    action: 'update';
    CartName: string;
    ShipToCode: string;
    ShipToName: string;
    ShipToAddress1: string;
    ShipToAddress2: string;
    ShipToAddress3: string;
    ShipToCity: string;
    ShipToState: string;
    ShipToZipCode: string;
    ConfirmTo: string | null;
    changedLines: ChangeDetailLine[];
    newLines: NewCommentLine[];
}

export interface ApplyPromoCodeBody extends CartQuoteBase {
    action: 'apply-discount',
    promo_code: string;
    SalesOrderNo: string;
}

export interface DuplicateSalesOrderBody extends CartQuoteBase {
    action: 'duplicate',
    CartName: string;
    SalesOrderNo:string;
    promo_code?: string;
}

export type CartActionBody =
    CartAppendBody
    | CartAppendCommentBody
    | CartDeleteItemBody
    | PromoteCartBody
    | DeleteCartBody
    | UpdateCartItemBody
    | NewCartBody
    | UpdateCartBody
    | ApplyPromoCodeBody
    | DuplicateSalesOrderBody;

// export interface CartQuoteBody {
//     action: CartAction;
//     SalesOrderNo: string;
//     ItemCode?: string;
//     QuantityOrdered?: number;
//     Comment?: string;
//     CartName?: string;
//     LineKey?: string;
//     promo_code?: string;
// }


export interface CartQuoteResponse {
    SalesOrderNo: string;
    historyStatus: { 0: string; 1: number | null; 2: string | null };
    debug: unknown;
    success: boolean;
    error: string;
    account: {
        0: string;
        1: string;
        2: string;
        3: string,
        ARDivisionNo: string;
        CustomerNo: string;
        ShipToCode: string
    };
    values: unknown
}

export type CartProgress_Cart = 0;
export type CartProgress_Delivery = 1;
export type CartProgress_Payment = 2;
export type CartProgress_Confirm = 3;

export type CartProgress = CartProgress_Cart | CartProgress_Delivery | CartProgress_Payment | CartProgress_Confirm;

export const cartProgress_Cart:CartProgress = 0;
export const cartProgress_Delivery:CartProgress = 1;
export const cartProgress_Payment:CartProgress = 2;
export const cartProgress_Confirm:CartProgress = 3;

export function nextCartProgress(cartProgress:CartProgress):CartProgress {
    if (cartProgress < cartProgress_Confirm) {
        return cartProgress + 1 as CartProgress
    }
    return cartProgress;
}
export interface Selectable {
    selected?: boolean;
}
