// import {RootState} from "../ducks";

export const selectCartNo = (state) => state.cart.cartNo;
export const selectShipDate = (state) => state.cart.shipDate;
export const selectCartProgress = (state) => state.cart.cartProgress;
export const selectShippingAccount = (state) => state.cart.shippingAccount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartLoaded = (state) => state.cart.loaded;
