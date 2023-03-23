export const selectUserAccounts = (state) => state.user.accounts ?? [];

export const selectUserAccountsCount = (state) => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state) => state.user.loggedIn ?? false;

export const selectUserAccount = (state) => state.user.userAccount ?? {};

export const selectCurrentCustomer = (state) => state.user.currentCustomer ?? {}

export const selectUserLoading = (state) => state.user.loading ?? false;

export const selectIsEmployee = (state) => state.user.roles.filter(role => role.role === 'employee').length === 1;
export const selectIssRep = (state) => state.user.roles.filter(role => role.role === 'rep').length === 1;

export const selectUserReps = (state) => state.user.repList.list ?? [];
export const selectUserRepsLoading = (state) => state.user.repList.loading;
export const selectUserRepsLoaded = (state) => state.user.repList.loaded;

