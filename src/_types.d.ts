import {
    CartProduct,
    ProductCategory,
    ContentPage,
    CustomerPriceRecord,
    Keyword,
    Menu,
    Message, PromoCode,
    SalesOrderDetailLine,
    SalesOrderHeader, Slide, Product
} from "b2b-types";

export {SalesOrderHeader} from 'b2b-types'

export interface EmptyObject {
}

export interface Appendable {
    newLine?: boolean;
}

export type ChangeDetailLine = Pick<SalesOrderDetailLine, 'LineKey' | 'ItemCode' | 'QuantityOrdered' | 'CommentText'>

export type NewCommentLine = Pick<SalesOrderDetailLine, 'LineKey' | 'CommentText'>

export type CartAction =
    'append'
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
}

export interface CartAppendBody extends CartQuoteBase {
    action: 'append';
    ItemCode: string;
    QuantityOrdered: string;
}

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
    LineKey: string;
    ItemCode: string;
    QuantityOrdered: number;
    Comment: string;
}

export interface NewCartBody extends CartQuoteBase {
    action: 'new',
    CartName: string;
    ItemCode: string;
    QuantityOrdered: string;
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
    changeLines: ChangeDetailLine[];
    newLines: NewCommentLine[];
}

export type CartActionBody =
    CartAppendBody
    | CartAppendCommentBody
    | CartDeleteItemBody
    | PromoteCartBody
    | DeleteCartBody
    | UpdateCartItemBody
    | NewCartBody
    | UpdateCartBody;

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


export interface ItemAvailability {
    ItemCode: string;
    ItemCodeDesc: string;
    PriceCode: string;
    SalesUnitOfMeasure: string;
    StandardUnitOfMeasure: string;
    StandardUnitPrice: number | string;
    SuggestedRetailPrice: string;
    SalesUMConvFactor: number;
    QuantityAvailable: number;
}

export type CartProgress_Cart = 0;
export type CartProgress_Delivery = 1;
export type CartProgress_Payment = 2;
export type CartProgress_Confirm = 3;

export type CartProgress = CartProgress_Cart | CartProgress_Delivery | CartProgress_Payment | CartProgress_Confirm;

export interface ShippingAccountState {
    enabled: boolean;
    value: string;
}

export interface CartItemDetailProps extends Pick<CartProduct, 'itemCode' | 'quantity' | 'salesUM' | 'salesUMFactor'
    | 'msrp' | 'priceLevel'> {
    stdUM: string;
    QuantityAvailable: number
    price: number;
    priceCodeRecord: CustomerPriceRecord,
}

export interface Selectable {
    selected?: boolean;
}


export interface SortProps<T = any> {
    field: keyof T,
    ascending: boolean,
}


export interface PreloadedState {
    app?: {
        keywords?: Keyword[];
        messages?: Message[];
        productMenu?: Menu;
        slides?: Slide[],
    }
    category?: {
        keywords?: Keyword[];
        content?: ProductCategory|null;
    }
    keywords?: {
        list?: Keyword[];
        loading?: boolean;
    }
    menu?: {
        loaded: boolean;
        productMenu?: Menu;
    }
    messages?: {
        list?: Message[];
    }
    page?: {
        list?: Keyword[];
        content?: ContentPage|null;
    }
    products?: {
        keywords?: Keyword[];
        product?: Product|null;
    },
    promo_code?: {
        promo_code?: PromoCode|null;
        promo_codes?: PromoCode[];
    }
    slides?: {
        list?: Slide[];
        loaded?: boolean;
    }
    version?: {
        versionNo?: string;
    }
}
