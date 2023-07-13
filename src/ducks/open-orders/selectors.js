export const selectOpenOrdersList = (state) => state.openOrders.list ?? [];
export const selectOpenOrdersLoading = (state) => state.openOrders.loading ?? false;
