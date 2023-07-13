import {createSelector} from "@reduxjs/toolkit";

export const selectUserProfile = (state) => state.user.profile;
export const selectUserAccounts = (state) => state.user.accounts ?? [];
export const selectUserCustomerAccounts = (state) => state.user.accounts.filter(acct => !acct.isRepAccount);
export const selectUserRepAccounts = (state) => state.user.accounts.filter(acct => !!acct.isRepAccount);

export const selectUserAccountsCount = (state) => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state) => state.user.loggedIn ?? false;

export const selectAuthType = (state) => state.user.authType;

export const selectUserAccount = (state) => state.user.userAccount ?? {};
export const selectUserCustomers = (state) => state.user.customerList.list ?? [];
export const selectUserCustomersLoading = (state) => state.user.customerList.loading ?? false;

export const selectCurrentCustomer = (state) => state.user.currentCustomer ?? {}

export const selectRecentAccounts = (state) => state.user.recentAccounts ?? [];

export const selectUserLoading = (state) => state.user.loading ?? false;

export const selectIsEmployee = (state) => state.user.roles.filter(role => role.role === 'employee').length === 1;
export const selectIsRep = (state) => state.user.roles.filter(role => role.role === 'rep').length === 1;
export const selectCanEdit = createSelector(
    [selectIsEmployee, selectIsRep],
    (isEmployee, isRep) => {
        return (isEmployee || isRep);
    }
)

export const selectUserReps = (state) => state.user.repList.list ?? [];
export const selectUserRepsLoading = (state) => state.user.repList.loading;
export const selectUserRepsLoaded = (state) => state.user.repList.loaded;
export const selectLoginExpiry = (state) => state.user.tokenExpires ?? 0;
export const selectCustomerPermissionsLoading = (state) => state.user.customerPermissions.loading ?? false;
export const selectCustomerPermissionsLoaded = (state) => state.user.customerPermissions.loaded ?? false;
export const selectCustomerPermissions = (state) => state.user.customerPermissions.permissions ?? null;

export const selectCanViewAvailable = (state) => state.user.profile?.accountType === 1;
