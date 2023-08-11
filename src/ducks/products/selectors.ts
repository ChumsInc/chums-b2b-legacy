import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {isCartProduct, isProduct} from "./utils";
import {Product} from "b2b-types";

export const selectProductKeywords = (state: RootState) => state.products.keywords ?? [];
export const selectProductKeywordsLoading = (state: RootState) => state.products.loadingKeywords ?? false;
export const selectCurrentProduct = (state: RootState) => state.products.product;
export const selectProductLoading = (state: RootState) => state.products.loading;
export const selectSelectedProduct = (state: RootState) => state.products.selectedProduct;
export const selectProductColorCode = (state: RootState) => state.products.colorCode;
export const selectProductMSRP = (state: RootState) => state.products.msrp;
export const selectProductSalesUM = (state: RootState) => state.products.salesUM;
export const selectProductCustomerPrice = (state: RootState) => state.products.customerPrice;
export const selectProductVariantId = (state: RootState) => state.products.variantId;
export const selectProductCartItem = (state: RootState) => state.products.cartItem;

export const selectProductSeasonActive = createSelector(
    [selectSelectedProduct],
    (product):boolean => isProduct(product) ? product?.season_active ?? true : true);

export const selectProductSeasonCode = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem):string|null => {
        return (isProduct(product) ? product.season_code : null)
            ?? (isCartProduct(cartItem) ? cartItem.seasonCode : null)
            ?? null;
    });
export const selectProductSeasonAvailable = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem):boolean|null => {
        return (isProduct(product) ? product?.season_available : null)
            ?? (isCartProduct(cartItem) ? cartItem.seasonAvailable : null)
            ?? null;
    }
)
export const selectProductSeasonDescription = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem):string|null => {
        return (isProduct(product) ? product?.season_description : null)
            ?? (isCartProduct(cartItem) ? cartItem.seasonDescription : null)
            ?? null;
    }
)
export const selectProductSeasonTeaser = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem):string|null => {
        return (isProduct(product) ? product.season_teaser : null)
            ?? (isCartProduct(cartItem) ? cartItem.seasonTeaser : null)
            ?? null;
    }
)
