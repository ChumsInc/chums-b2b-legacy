import {RootState} from "@/app/configureStore";

export const selectPromoCodesLoading = (state:RootState) => state.promo_code.loading;
export const selectCurrentPromoCode = (state:RootState) => state.promo_code.current;
