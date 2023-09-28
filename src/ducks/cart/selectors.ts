import {RootState} from "../../app/configureStore";


export const selectCartNo = (state:RootState) => state.cart.cartNo;
export const selectCartName = (state:RootState) => state.cart.cartName;
export const selectShipDate = (state:RootState) => state.cart.shipDate;
export const selectCartProgress = (state:RootState) => state.cart.cartProgress;
export const selectCartPromoCode = (state:RootState) => state.cart.promoCode;

export const selectShippingAccount = (state:RootState) => state.cart.shippingAccount;
export const selectCartLoading = (state:RootState) => state.cart.loading;
export const selectCartLoaded = (state:RootState) => state.cart.loaded;

export const selectCartMessage = (state:RootState) => state.cart.cartMessage;

export const selectItemAvailability = (state:RootState) => state.cart.itemAvailability ?? null;

export const selectItemAvailabilityLoading = (state:RootState) => state.cart.itemAvailabilityLoading ?? false;

export const selectCartTotal = (state:RootState) => state.cart.cartTotal;
export const selectCartQuantity = (state:RootState) => state.cart.cartQuantity;
