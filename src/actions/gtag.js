import {UPDATE_GA} from "../constants/actions";

const TAG_ID = 'G-KMH9RBEF98';

/**
 * @deprecated
 * @param title
 * @param path
 * @return {{path, action: string, type: string, title}}
 */
export const ga_config = ({title, path}) => {
    if (!!window && window.gtag) {
        const page_title = `${title} | Chums B2B`;
        const page_path = path;
        const page_location = !!document ? `${document.location.origin}${page_path}` : page_path;
        window.gtag('config', 'UA-3648826-6', {page_title, page_path, page_location});
    }
    return {type: UPDATE_GA, action: 'config', title, path};
};

/**
 * @deprecated
 * @param title
 * @param path
 * @return {{path, action: string, type: string, title}}
 */
export const ga_screenView = ({title, path}) => {
    if (!!window && window.gtag) {
        const page_title = title;
        const page_path = path;
        const page_location = !!document ? `${document.location.origin}${page_path}` : page_path;
        window.gtag('event', 'screen_view', {page_title, page_path, page_location});
    }
    return {type: UPDATE_GA, action: 'screen_view', title, path};
};

export const ga_viewItem = ({cartItem, selectedProduct}) => {
    if (!window || !window.gtag) {
        return;
    }
    const item = {
        item_id: cartItem.itemCode,
        price: cartItem.price,
    };
    window.gtag('event', 'view_item', [item]);
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

export const ga_purchase = (salesOrderNo, value, items) => {
    if (!window || !window.gtag) {
        return;
    }
    window.gtag('event', 'purchase', {
        currency: 'USD',
        transaction_id: salesOrderNo,
        value,
        items: items.map(item => ({item_id: item.ItemCode, price: item.UnitPrice, quantity: item.QuantityOrdered}))
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
