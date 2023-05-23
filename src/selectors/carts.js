export const selectCartsList = (state) => state.carts.list ?? [];
export const selectCartsLoading = (state) => state.carts.loading ?? false;
