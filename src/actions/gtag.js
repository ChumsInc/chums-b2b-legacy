import {UPDATE_GA} from "../constants/actions";

const TAG_ID = 'G-KMH9RBEF98';

export const ga_viewItem = ({cartItem, selectedProduct}) => {
    if (!window || !window.gtag) {
        return;
    }
    const item = {
        item_id: cartItem.itemCode,
        price: cartItem.price,
    };
    window.gtag('event', 'view_item', {
        currency: 'USD',
        value: cartItem.price * cartItem.quantity,
        items: [{
            item_id: cartItem.itemCode,
            price: cartItem.price,
        }]
    });
};

export const ga_login = (user_id, method = 'Google') => {
    if (!window || !window.gtag) {
        return;
    }
    if (user_id) {
        gtag('config', TAG_ID, {'user_id': `${user_id ?? 0}`});
    }
    gtag('event', 'login', {method})
}

export const ga_addToCart = (itemCode, quantity, price) => {
    if (!window || !window.gtag) {
        return;
    }
    window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: quantity * price,
        items: [{
            item_id: itemCode,
            price: price,
            quantity: quantity
        }]
    });
}

export const ga_beginCheckout = (value, items) => {
    if (!window || !window.gtag) {
        return;
    }
    window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: value,
        items: items.map(item => ({item_id: item.ItemCode, price: item.UnitPrice, quantity: item.QuantityOrdered}))
    })
}

export const ga_purchase = (salesOrderNo, value, items) => {
    if (!window || !window.gtag) {
        return;
    }
    window.gtag('event', 'purchase', {
        currency: 'USD',
        transaction_id: salesOrderNo,
        value,
        items: items.map(item => ({
            item_id: item.ItemCode,
            item_name: item.ItemCodeDesc,
            price: item.UnitPrice,
            quantity: item.QuantityOrdered
        }))
    })
}

export const ga_search = (term) => {
    if (!window || !window.gtag) {
        return;
    }
    window.gtag('event', 'search', {
        search_term: term,
    });
}
