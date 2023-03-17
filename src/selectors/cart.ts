import {RootState} from "../ducks/index";
import {CustomerShippingAccount} from "../generic-types";

export const selectCartNo = (state:RootState):string => state.cart.cartNo;
export const selectShipDate = (state:RootState):string => state.cart.shipDate;
export const selectCartProgress = (state:RootState):number => state.cart.cartProgress;
export const selectShippingAccount = (state:RootState):CustomerShippingAccount => state.cart.shippingAccount;
export const selectCartLoading = (state:RootState):boolean => state.cart.loading;
export const selectCartLoaded = (state:RootState):boolean => state.cart.loaded;
