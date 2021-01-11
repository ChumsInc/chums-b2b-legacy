import {combineReducers} from 'redux';
import {
    CLEAR_PRODUCT,
    FETCH_CUSTOMER,
    FETCH_INIT,
    FETCH_KEYWORDS,
    FETCH_PRODUCT,
    FETCH_SUCCESS,
    PRICE_FIELDS,
    RECEIVE_CUSTOMER,
    SELECT_COLOR,
    SELECT_ITEM,
    SELECT_VARIANT,
    SET_CART_ITEM_QUANTITY
} from "../constants/actions";
import {getDefaultColor, getItemPrice} from "../utils/products";
import {priceRecord,} from "../utils/customer";

if (!window.__PRELOADED_STATE__) {
    window.__PRELOADED_STATE__ = {};
}
const defaults = {
    keywords: window.__PRELOADED_STATE__.keywords || [],
};


const keywords = (state = defaults.keywords, action) => {
    const {type, status, list} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        return status === FETCH_SUCCESS ? [...list] : [];
    default:
        return state;
    }
};

const loadingKeywords = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_KEYWORDS:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const product = (state = {}, action) => {
    const {type, status, product} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS ? {...product} : state;
    case CLEAR_PRODUCT:
        return {};
    default:
        return state;
    }
};

const selectedProduct = (state = {}, action) => {
    const {type, status, product, variant} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS
            ? (variant ? {...variant.product} : {...product})
            : state;
    case SELECT_VARIANT:
        return {...variant.product};
    default:
        return state;
    }
};

const colorCode = (state = '', action) => {
    const {type, status, product, variant, colorCode} = action;
    switch (type) {
    case FETCH_PRODUCT:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        return getDefaultColor(variant ? variant.product : product, state);
    case SELECT_VARIANT:
        return getDefaultColor(variant.product, state);
    case SELECT_COLOR:
        return colorCode;
    default:
        return state;
    }
};

const variantId = (state = null, action) => {
    const {type, status, variant} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS
            ? (variant ? variant.id : null)
            : state;
    case SELECT_VARIANT:
        return variant.id || null;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

const msrp = (state = [], action) => {
    const {type, status, msrp = []} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS
            ? [...msrp]
            : state;
    case SELECT_VARIANT:
        return [...msrp];
    default:
        return state;
    }
};

const customerPrice = (state = [], action) => {
    const {type, status, customerPrice = []} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS ? [...customerPrice] : state;
    case SELECT_VARIANT:
        return [...customerPrice];
    case RECEIVE_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            return [...customerPrice];
        }
        return state;
    default:
        return state;
    }
};

const salesUM = (state = null, action) => {
    const {type, status, salesUM = null} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS ? salesUM : state;
    case SELECT_VARIANT:
        return salesUM;
    default:
        return state;
    }
};

const cartItem = (state = {}, action) => {
    const {type, status, cartItem = {}, quantity, pricing, customer} = action;
    switch (type) {
    case FETCH_PRODUCT:
        return status === FETCH_SUCCESS ? {...cartItem} : state;
    case SELECT_VARIANT:
    case SELECT_ITEM:
        return {...cartItem};
    case SET_CART_ITEM_QUANTITY:
        return {...state, quantity};
    case SELECT_COLOR:
        return {...cartItem};
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS && !!state.itemCode) {
            return {
                ...state,
                priceCodeRecord: priceRecord({pricing, itemCode: state.itemCode, priceCode: state.priceCode}),
                priceLevel: customer.PriceLevel,
                price: getItemPrice({item: state, priceField: PRICE_FIELDS.standard, priceCodes: pricing})
            };
        }
        return state;
    default:
        return state;
    }
};

export default combineReducers({
    keywords,
    loadingKeywords,
    product,
    loading,
    selectedProduct,
    variantId,
    colorCode,
    msrp,
    customerPrice,
    salesUM,
    cartItem,
});
