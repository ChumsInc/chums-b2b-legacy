export interface GtagItem {
    item_id: string;
    item_name?: string;
    price?: number;
    quantity?: number;
}

export interface GtagAddPaymentInfoArgs {
    currency: string;
    value: number;
    coupon?: string;
    payment_type?: string | null;
    items: GtagItem[]
}

export interface GtagAddShippingInfoArgs {
    currency: string;
    value: number;
    coupon?: string;
    shipping_tier?: string | null;
    items: GtagItem[]
}

export interface GtagAddToCartArgs {
    currency: string;
    value: number;
    items: GtagItem[];
}

export interface GtagBeginCheckoutArgs {
    currency: string;
    value: number;
    coupon?: string;
    items: GtagItem[];
}

export interface GtagLoginArgs {
    method?: 'credentials' | 'google';
}

export interface GtagExceptionArgs {
    description?: string;
    fatal?: boolean;
}

export interface GtagPageViewArgs {
    page_location?: string;
    client_id?: string;
    page_title?: string;
}

export interface GtagPurchaseArgs {
    currency: string;
    value: number;
    transaction_id: string;
    coupon?: string;
    shipping?: number;
    tax?: number;
    items: GtagItem[];
}
export interface GtagRemoveFromCartArgs {
    currency?: string;
    value?: number;
    items: GtagItem[];
}

export interface GtagSearchArgs {
    search_term: string;
}

export interface GtagSelectContentArgs {
    content_type?: 'variant' | 'color' | 'customer';
    content_id?: string;
}

export interface GtagSelectItemArgs {
    item_list_id?: string;
    item_list_name?: string;
    items: GtagItem[]
}

export interface GtagViewCartArgs {
    currency: string;
    value: number;
    items: GtagItem[]
}

export interface GtagViewItemArgs {
    items: GtagItem[];
}
export interface GtagViewItemListArgs {
    item_list_id: string;
    item_list_name: string;
    items: GtagItem[];
}

export interface GtagConfigArgs {
    user_id: string;
}

export type GtagFn = (event: 'event' | 'config', eventName: string, options?: any) => void;

export type GtagEventName = 'add_payment_info' | 'add_shipping_info' | 'add_to_cart' | 'begin_checkout' |
    'exception' | 'login' | 'page_view' | 'purchase' | 'remove_from_cart' | 'search' | 'select_content'
    | 'select_item' | 'sign_up' | 'view_cart' | 'view_item' | 'view_item_list';

export function sendGtagEvent(eventName: 'add_payment_info', options: GtagAddPaymentInfoArgs): void;
export function sendGtagEvent(eventName: 'add_shipping_info', options: GtagAddShippingInfoArgs): void;
export function sendGtagEvent(eventName: 'add_to_cart', options: GtagAddToCartArgs): void;
export function sendGtagEvent(eventName: 'begin_checkout', options: GtagBeginCheckoutArgs): void;
export function sendGtagEvent(eventName: 'exception', options: GtagExceptionArgs): void;
export function sendGtagEvent(eventName: 'login', options?: GtagLoginArgs): void;
export function sendGtagEvent(eventName: 'page_view', options?: GtagPageViewArgs): void;
export function sendGtagEvent(eventName: 'purchase', options: GtagPurchaseArgs): void;
export function sendGtagEvent(eventName: 'remove_from_cart', options: GtagRemoveFromCartArgs): void;
export function sendGtagEvent(eventName: 'search', options: GtagSearchArgs): void;
export function sendGtagEvent(eventName: 'select_content', options: GtagSelectContentArgs): void;
export function sendGtagEvent(eventName: 'select_item', options: GtagSelectItemArgs): void;
export function sendGtagEvent(eventName: 'sign_up', options?: GtagLoginArgs): void
export function sendGtagEvent(eventName: 'view_cart', options?: GtagViewCartArgs): void
export function sendGtagEvent(eventName: 'view_item', options?: GtagViewItemArgs): void
export function sendGtagEvent(eventName: 'view_item_list', options?: GtagViewItemListArgs): void

export function sendGtagEvent(eventName: GtagEventName, options?: unknown) {
    if (typeof global.window !== 'undefined' && typeof global.window.gtag !== 'undefined') {
        global.window.gtag('event', eventName, options ?? {});
    }
}

export function configGtag(options?: GtagConfigArgs) {
    if (typeof global.window !== 'undefined'
        && typeof global.window.gtag !== 'undefined'
        && typeof global.window.Chums?.gtagID !== 'undefined') {
        global.window.gtag('config', global.window.Chums.gtagID, options ?? {});
    }
}
