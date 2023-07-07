export const selectPromoCode = (state) => state.promo_code.code ?? '';
export const selectPromoDescription = (state) => state.promo_code.description ?? '';
export const selectPromoRequiredItems = (state) => state.promo_code.requiredItems ?? [];
export const selectPromoValidCodes = (state) => state.promo_code.validCodes ?? [];
export const selectPromoLoading = (state) => state.promo_code.loading ?? false;
