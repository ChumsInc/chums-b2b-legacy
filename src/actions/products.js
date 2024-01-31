import {fetchGET} from '../utils/fetch';
import 'core-js/actual/structured-clone'
import {
    CLEAR_PRODUCT,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_KEYWORDS,
    FETCH_PRODUCT,
    FETCH_SUCCESS,
    PRICE_FIELDS,
    SELECT_COLOR,
    SELECT_VARIANT,
    SELL_AS_COLOR,
    SELL_AS_MIX
} from "../constants/actions";
import {handleError} from "../ducks/app/actions";
import {
    colorCartItem,
    defaultCartItem,
    defaultVariant,
    getItemPrice,
    getMSRP,
    getPrices,
    getSalesUM,
    hasVariants
} from '../utils/products';
import {API_PATH_KEYWORDS, API_PATH_PRODUCT} from "../constants/paths";
import {priceRecord} from "../utils/customer";
import {selectProductCartItem} from "../ducks/products/selectors";
import {createAction} from "@reduxjs/toolkit";


export const fetchKeywords = () => (dispatch, getState) => {
    dispatch({type: FETCH_KEYWORDS, status: FETCH_INIT});
    fetchGET(API_PATH_KEYWORDS)
        .then(res => {
            dispatch({type: FETCH_KEYWORDS, status: FETCH_SUCCESS, list: res.result});
        })
        .catch(err => {
            dispatch(handleError(err, FETCH_KEYWORDS));
            dispatch({type: FETCH_KEYWORDS, status: FETCH_FAILURE});
        })
};

export const clearProduct = () => ({type: CLEAR_PRODUCT});

export const fetchProduct = (keyword) => (dispatch, getState) => {
    if (!keyword) {
        return;
    }

    const {product} = getState().products;
    const url = API_PATH_PRODUCT.replace(':keyword', encodeURIComponent(keyword));
    dispatch({type: FETCH_PRODUCT, status: FETCH_INIT});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {user, customer} = getState();
            const [product = {}] = res.products;
            const variant = hasVariants(product) ? defaultVariant(product) : null;
            const msrp = variant ? getMSRP(variant.product) : getMSRP(product);
            const customerPrice = user.loggedIn
                ? (variant
                        ? getPrices(variant.product, customer.pricing)
                        : getPrices(product, customer.pricing)
                )
                : [...msrp];
            const salesUM = variant ? getSalesUM(variant.product) : getSalesUM(product);
            const cartItem = variant ? defaultCartItem(variant.product) : defaultCartItem(product);
            if (customerPrice.length) {
                cartItem.price = customerPrice[0];
            }
            if (user.loggedIn) {
                cartItem.priceCodeRecord = priceRecord({
                    pricing: customer.pricing,
                    priceCode: cartItem.priceCode,
                    itemCode: cartItem.itemCode
                });
                cartItem.priceLevel = customer.account?.PriceLevel ?? '';
            }
            dispatch({
                type: FETCH_PRODUCT,
                status: FETCH_SUCCESS,
                product,
                variant,
                msrp,
                customerPrice,
                salesUM,
                cartItem
            });
        })
        .catch(err => {
            dispatch(handleError(err, FETCH_PRODUCT));
            dispatch({type: FETCH_PRODUCT, status: FETCH_FAILURE});
        })

};

export const setCurrentVariant = (variant, colorCode) => (dispatch, getState) => {
    const {user, customer} = getState();
    const msrp = getMSRP(variant.product);
    const customerPrice = user.loggedIn ? getPrices(variant.product, customer.pricing) : [...msrp];
    const salesUM = getSalesUM(variant.product);
    const cartItem = defaultCartItem(variant.product, colorCode);
    if (!!customerPrice.length) {
        cartItem.price = customerPrice[0];
    }
    if (user.loggedIn) {
        cartItem.priceCodeRecord = priceRecord({
            pricing: customer.pricing,
            priceCode: cartItem.priceCode,
            itemCode: cartItem.itemCode
        });
        cartItem.priceLevel = customer.account.PriceLevel;
    }
    dispatch({type: SELECT_VARIANT, variant, msrp, customerPrice, salesUM, cartItem});
};

export const setColorCode = (colorCode) => (dispatch, getState) => {
    const state = getState();
    const {user, products, customer} = getState();
    const {selectedProduct} = products;
    const {season_code, season_available} = selectedProduct;
    let cartItem = structuredClone(selectProductCartItem(state));
    cartItem.stdUM = selectedProduct.stdUM;
    const quantity = Math.max(cartItem.quantity || 0, 1);
    const {pricing} = customer;
    if (selectedProduct.sellAs === SELL_AS_COLOR) {
        [cartItem] = selectedProduct.items
            .filter(item => item.colorCode === colorCode)
            .map(item => ({...colorCartItem(item), quantity, season_code, season_available}));
    } else if (selectedProduct.sellAs === SELL_AS_MIX) {
        if (cartItem.additionalData === undefined) {
            cartItem.additionalData = {};
        }
        const [colorName] = selectedProduct.mix.items
            .filter(item => item.color.code === colorCode)
            .map(item => item.color.name);
        if (colorName) {
            cartItem.colorName = colorName;
        }
        const [image_filename] = selectedProduct.mix.items
            .filter(item => item.color.code === colorCode)
            .map(item => {
                if (item.additionalData && item.additionalData.image_filename) {
                    return item.additionalData.image_filename;
                }
                return null;
            });
        cartItem.additionalData.image_filename = image_filename || undefined;
    }

    cartItem.price = user.loggedIn
        ? getItemPrice({item: cartItem, priceField: PRICE_FIELDS.standard, priceCodes: pricing})
        : cartItem.msrp;
    if (user.loggedIn) {
        cartItem.priceCodeRecord = priceRecord({pricing, priceCode: cartItem.priceCode, itemCode: cartItem.itemCode});
        cartItem.priceLevel = customer.account.PriceLevel;
    }
    dispatch({type: SELECT_COLOR, colorCode, cartItem});

};


