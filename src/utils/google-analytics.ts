import {CartItem, CartProduct} from "b2b-types";
import Decimal from "decimal.js";

export const googleTagId = 'G-KMH9RBEF98';

export function ga_search(term:string) {
    if (typeof window === 'undefined') {
        return;
    }
    if (window.gtag) {
        window.gtag('event', 'search', {
            search_term: term,
        })
    }
}

export function ga_selectContent(contentType: string, contentId: string) {
    if (typeof window === 'undefined' || !window.gtag) {
        return;
    }
    window.gtag('event', 'select_content', {
        content_type: contentType,
        content_id: contentId,
    })
}



export function ga_viewItem(cartItem:CartProduct) {
    if (typeof window === 'undefined' || !window || !window.gtag) {
        return;
    }
    window.gtag('event', 'view_item', {
        currency: 'USD',
        value: new Decimal(cartItem.price ?? 0).times(cartItem.quantity ?? 1).toNumber(),
        items: [{
            item_id: cartItem.itemCode,
            price: cartItem.price ?? cartItem.msrp ?? 0,
        }]
    });
};

export function ga_login(user_id:number, method = 'Google') {
    if (typeof window === 'undefined' || !window || !window.gtag) {
        return;
    }
    if (user_id) {
        window.gtag('config', googleTagId, {'user_id': `${user_id ?? 0}`});
    }
    window.gtag('event', 'login', {method})
}

export function ga_addToCart(itemCode:string, quantity:string|number, price:string|number) {
    if (typeof window === 'undefined' || !window || !window.gtag) {
        return;
    }
    window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: new Decimal(quantity ?? 1).times(price ?? 0),
        items: [{
            item_id: itemCode,
            price: price,
            quantity: quantity
        }]
    });
}

export function ga_beginCheckout(value: string|number, items:CartProduct[]) {
    if (typeof window === 'undefined' || !window || !window.gtag) {
        return;
    }
    window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: value,
        items: items.map(item => ({item_id: item.itemCode, price: item.price, quantity: item.quantity}))
    })
}

export function ga_purchase(salesOrderNo:string, value:string|number, items:CartProduct[]) {
    if (typeof window === 'undefined' || !window || !window.gtag) {
        return;
    }
    window.gtag('event', 'purchase', {
        currency: 'USD',
        transaction_id: salesOrderNo,
        value,
        items: items.map(item => ({
            item_id: item.itemCode,
            item_name: item.name,
            price: +(item.price ?? item.msrp ?? 0),
            quantity: item.quantity ?? 1,
        }))
    })
}
