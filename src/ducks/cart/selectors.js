// import {RootState} from "../ducks";

export const selectCartNo = (state) => state.cart.cartNo;
export const selectCartName = (state) => state.cart.cartName;
export const selectShipDate = (state) => state.cart.shipDate;
export const selectCartProgress = (state) => state.cart.cartProgress;

/**
 *
 * @param state
 * @return {ShippingAccountState}
 */
export const selectShippingAccount = (state) => state.cart.shippingAccount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartLoaded = (state) => state.cart.loaded;

/**
 *
 * @param state
 * @return string;
 */
export const selectCartMessage = (state) => state.cart.message;

/**
 *
 * @param state
 * @return {ItemAvailability|null}
 */
export const selectItemAvailability = (state) => state.cart.itemAvailability

export const selectItemAvailabilityLoading = (state) => state.cart.itemAvailabilityLoading ?? false;

export const selectCartTotal = (state) => state.cart.cartTotal;
export const selectCartQuantity = (state) => state.cart.cartQuantity;
