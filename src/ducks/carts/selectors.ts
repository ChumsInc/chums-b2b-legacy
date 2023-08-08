import {RootState} from "../../app/configureStore";

export const selectCartsList = (state:RootState) => state.carts.list;
export const selectCartsLoading = (state:RootState) => state.carts.loading ?? false;
