export const selectUserAccounts = (state) => state.user.accounts ?? [];

export const selectUserAccountsCount = (state) => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state) => state.user.loggedIn ?? false;

export const selectUserAccount = (state) => state.user.userAccount ?? {};

export const selectCurrentCustomer = (state) => state.user.currentCustomer ?? {}

export const selectUserLoading = (state) => state.user.loading ?? false;
