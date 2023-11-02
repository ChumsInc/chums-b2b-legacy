import {
    CLEAR_PRODUCT,
    FETCH_INIT,
    FETCH_KEYWORDS,
    FETCH_PRODUCT,
    FETCH_SUCCESS,
    SELECT_COLOR,
    SELECT_ITEM,
    SELECT_VARIANT,
    SET_CART_ITEM_QUANTITY
} from "../../constants/actions";
import {defaultCartItem, getDefaultColor, getMSRP, getPrices, keywordSorter} from "../../utils/products";
import {customerPriceRecordSorter, customerSlug,} from "../../utils/customer";
import {createReducer} from "@reduxjs/toolkit";
import {PreloadedState} from "../../types/preload";
import {isCartProduct, isSellAsColors, isSellAsMix, updateCartProductPricing} from "./utils";
import {loadCustomer} from "../customer/actions";
import {CartProduct, CustomerPriceRecord, Keyword, Product} from "b2b-types";
import {loadProduct, setCartItemQuantity, setColorCode} from "./actions";
import {setLoggedIn} from "../user/actions";
import {parseImageFilename} from "../../common/image";


export interface ProductsState {
    keywords: Keyword[],
    loadingKeywords: boolean;
    product: Product | null;
    selectedProduct: Product | null;
    image: string|null;
    colorCode: string;
    variantId: number | null;
    loading: boolean;
    msrp: (string | number)[],
    customerPrice: (string | number)[],
    salesUM: string | null;
    cartItem: CartProduct | null;
    pricing: CustomerPriceRecord[];
    customerKey: string | null;
}

export const initialProductsState = (preload: PreloadedState = {}): ProductsState => ({
    keywords: preload?.keywords?.list ?? [],
    loadingKeywords: false,
    product: null,
    selectedProduct: null,
    image: null,
    colorCode: '',
    variantId: null,
    loading: false,
    msrp: [],
    customerPrice: [],
    salesUM: null,
    cartItem: null,
    pricing: [],
    customerKey: null,
});

const productsReducer = createReducer(initialProductsState, (builder) => {
    builder
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload) {
                state.customerKey = null;
                state.pricing = [];
            }
        })
        .addCase(loadCustomer.pending, (state) => {
            state.pricing = [];
        })
        .addCase(loadCustomer.fulfilled, (state, action) => {
            state.customerKey = customerSlug(action.payload?.customer ?? null);
            state.pricing = [...(action.payload?.pricing ?? [])].sort(customerPriceRecordSorter);
            state.msrp = getMSRP(state.selectedProduct);
            state.customerPrice = !!state.customerKey ? getPrices(state.selectedProduct, state.pricing) : state.msrp;
            if (isCartProduct(state.cartItem)) {
                state.cartItem.priceLevel = action.payload?.customer.PriceLevel ?? '';
                state.cartItem = updateCartProductPricing(state.cartItem, state.pricing);
            }
        })
        .addCase(loadProduct.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload?.product ?? null;
            state.selectedProduct = action.payload?.variant?.product ?? action.payload?.product ?? null;
            state.colorCode = getDefaultColor(state.selectedProduct, state.colorCode);
            state.variantId = action.payload?.variant?.id ?? null;
            state.msrp = action.payload?.msrp ?? [];
            state.salesUM = action.payload?.salesUM ?? null;
            state.customerPrice = action.payload?.customerPrice ?? [];
            state.cartItem = action.payload?.cartItem ?? null;
            state.colorCode = action.payload?.cartItem?.colorCode
                ?? action.payload?.variant?.product?.defaultColor
                ?? action.payload?.product?.defaultColor
                ?? '';
            state.image = parseImageFilename(state.cartItem?.image ?? state.selectedProduct?.image, state.colorCode);
        })
        .addCase(loadProduct.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(setColorCode.fulfilled, (state, action) => {
            state.colorCode = action.meta.arg;
            state.cartItem = action.payload;
            state.image = parseImageFilename(state.cartItem?.image ?? state.selectedProduct?.image, state.colorCode);
        })
        .addCase(setCartItemQuantity, (state, action) => {
            if (state.cartItem) {
                state.cartItem.quantity = action.payload;
            }
        })
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
