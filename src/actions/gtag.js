import {UPDATE_GA} from "../constants/actions";


export const ga_config = ({title, path}) => {
    if (!!window && window.gtag) {
        const page_title = `${title} | Chums B2B`;
        const page_path = path;
        const page_location = !!document ? `${document.location.origin}${page_path}` : page_path;
        window.gtag('config', 'UA-3648826-6', {page_title, page_path, page_location});
    }
    return {type: UPDATE_GA, action: 'config', title, path};
};

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
    if (!!window && window.gtag) {
        const item = {
            brand: 'Chums',
            category: selectedProduct.defaultCategoryKeyword,
            id: cartItem.itemCode,
            name: selectedProduct.name,
            price: cartItem.price,
        };
        window.gtag('event', 'view_items', [item]);
        return {type: UPDATE_GA, action: 'view_items'};
    }
};
