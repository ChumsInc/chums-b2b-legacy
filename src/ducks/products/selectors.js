import {createSelector} from "@reduxjs/toolkit";

export const selectProductKeywords = (state) => state.products.keywords ?? [];
export const selectProductKeywordsLoading = (state) => state.products.loadingKeywords ?? false;
export const selectCurrentProduct = (state) => state.products.product;
export const selectProductLoading = (state) => state.products.loading;
/**
 *
 * @param state
 * @return {Product|EmptyObject}
 */
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductColorCode = (state) => state.products.colorCode;
export const selectProductMSRP = (state) => state.products.msrp;
export const selectProductSalesUM = (state) => state.products.salesUM;
export const selectProductCustomerPrice = (state) => state.products.customerPrice;
export const selectProductVariantId = (state) => state.products.variantId;
export const selectProductCartItem = (state) => state.products.cartItem;

export const selectProductSeasonActive = createSelector(
    [selectSelectedProduct],
    (product) => product?.season_active ?? true);
export const selectProductSeasonCode = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem) => {
        return product?.season_active ?? cartItem?.additionalData?.season?.code ?? null;
    });
export const selectProductSeasonAvailable = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem) => {
        return product?.season_available ?? cartItem?.additionalData?.season?.product_available ?? null;
    }
)
export const selectProductSeasonDescription = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem) => {
        return product?.season_description ?? cartItem?.additionalData?.season?.description ?? null;
    }
)
export const selectProductSeasonTeaser = createSelector(
    [selectSelectedProduct, selectProductCartItem],
    (product, cartItem) => {
        return product?.season_teaser ?? cartItem?.additionalData?.season?.product_teaser ?? null;
    }
)
