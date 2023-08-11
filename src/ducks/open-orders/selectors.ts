import {RootState} from "@/app/configureStore";

export const selectOpenOrdersList = (state:RootState) => state.openOrders.list;
export const selectOpenOrdersLoading = (state:RootState) => state.openOrders.loading ?? false;
