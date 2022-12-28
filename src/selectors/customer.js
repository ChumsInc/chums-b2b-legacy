export const selectCustomerAccount = (state) => state.customer.account ?? {};

export const selectCustomerLoading = (state) => state.customer.loading ?? false;
