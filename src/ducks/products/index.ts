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
} from "../../constants/actions";
import {getDefaultColor, getItemPrice, keywordSorter} from "../../utils/products";
import {priceRecord,} from "../../utils/customer";
import {createReducer} from "@reduxjs/toolkit";
import {ProductsState} from "./types";
import {PreloadedState} from "../../_types";
import {isCartProduct} from "./utils";


export const initialProductsState = (preload: PreloadedState = window?.__PRELOADED_STATE__ ?? {}): ProductsState => ({
    keywords: preload?.keywords?.list ?? [],
    loadingKeywords: false,
    product: null,
    selectedProduct: null,
    colorCode: '',
    variantId: null,
    loading: false,
    msrp: [],
    customerPrice: [],
    salesUM: null,
    cartItem: null,
});

const productsReducer = createReducer(initialProductsState, (builder) => {
    builder
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case FETCH_KEYWORDS:
                    state.loadingKeywords = action.status === FETCH_INIT;
                    state.keywords = [...(action.list ?? [])].sort(keywordSorter);
                    return;
                case FETCH_PRODUCT:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.product = {...action.product};
                        if (action.variant) {
                            state.selectedProduct = {...action.variant.product};
                            state.colorCode = getDefaultColor(action.variant.product, state.colorCode);
                            state.variantId = action.variant.id;
                        } else {
                            state.selectedProduct = {...action.product};
                            state.colorCode = getDefaultColor(action.product, state.colorCode);
                            state.variantId = null;
                        }
                        state.msrp = action.msrp ?? [];
                        state.customerPrice = action.customerPrice ?? [];
                        state.salesUM = action.salesUM ?? null;
                        state.cartItem = action.cartItem ?? {};
                    }
                    return;
                case CLEAR_PRODUCT:
                    state.product = null;
                    return;
                case SELECT_VARIANT:
                    state.selectedProduct = {...action.variant.product};
                    state.colorCode = getDefaultColor(action.variant.product, state.colorCode);
                    state.variantId = action.variant.id ?? null;
                    state.msrp = action.msrp ?? [];
                    state.salesUM = action.salesUM ?? null;
                    state.cartItem = action.cartItem ?? null;
                    return;
                case SELECT_COLOR:
                    state.colorCode = action.colorCode;
                    state.cartItem = action.cartItem ?? {};
                    return;
                case RECEIVE_CUSTOMER:
                    if (action.status === FETCH_SUCCESS) {
                        state.customerPrice = action.customerPrice ?? [];
                    }
                    return;
                case FETCH_CUSTOMER:
                    if (action.status === FETCH_SUCCESS && isCartProduct(state.cartItem)) {
                        state.cartItem = {
                            ...state.cartItem,
                            priceCodeRecord: priceRecord({
                                pricing: action.pricing,
                                itemCode: state.cartItem.itemCode,
                                priceCode: state.cartItem.priceCode,
                            }),
                            priceLevel: action.customer.priceLevel,
                            price: getItemPrice({
                                item: state.cartItem,
                                priceField: PRICE_FIELDS.standard,
                                priceCodes: action.pricing
                            })
                        }
                    }
                    return;
                case SELECT_ITEM:
                    state.cartItem = action.cartItem ?? {};
                    return;
                case SET_CART_ITEM_QUANTITY:
                    if (state.cartItem) {
                        state.cartItem = {...state.cartItem, quantity: action.quantity};
                    }
                    return;
            }
        })
})

export default productsReducer;
