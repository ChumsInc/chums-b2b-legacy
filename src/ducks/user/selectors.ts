import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {isUserProfile} from "./utils";

export const selectUserProfile = (state:RootState) => state.user.profile;
export const selectUserAccounts = (state:RootState) => state.user.accounts ?? [];
export const selectUserCustomerAccounts = (state:RootState) => state.user.accounts.filter(acct => !acct.isRepAccount);
export const selectUserRepAccounts = (state:RootState) => state.user.accounts.filter(acct => !!acct.isRepAccount);

export const selectUserAccountsCount = (state:RootState) => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state:RootState) => state.user.loggedIn ?? false;

export const selectAuthType = (state:RootState) => state.user.authType;

export const selectUserAccount = (state:RootState) => state.user.userAccount ?? {};
export const selectUserCustomers = (state:RootState) => state.user.customerList.list ?? [];
export const selectUserCustomersLoading = (state:RootState) => state.user.customerList.loading ?? false;

export const selectCurrentCustomer = (state:RootState) => state.user.currentCustomer ?? null;

export const selectRecentAccounts = (state:RootState) => state.user.recentAccounts ?? [];

export const selectUserLoading = (state:RootState) => state.user.loading ?? false;

export const selectIsEmployee = (state:RootState) => state.user.roles.filter(role => role === 'employee').length === 1;
export const selectIsRep = (state:RootState) => state.user.roles.filter(role => role === 'rep').length === 1;
export const selectCanEdit = createSelector(
    [selectIsEmployee, selectIsRep],
    (isEmployee, isRep) => {
        return (isEmployee || isRep);
    }
)

export const selectUserReps = (state:RootState) => state.user.repList.list ?? [];
export const selectUserRepsLoading = (state:RootState) => state.user.repList.loading;
export const selectUserRepsLoaded = (state:RootState) => state.user.repList.loaded;
export const selectLoginExpiry = (state:RootState) => state.user.tokenExpires ?? 0;
export const selectCustomerPermissionsLoading = (state:RootState) => state.user.customerPermissions.loading ?? false;
export const selectCustomerPermissionsLoaded = (state:RootState) => state.user.customerPermissions.loaded ?? false;
export const selectCustomerPermissions = (state:RootState) => state.user.customerPermissions.permissions ?? null;

export const selectCanViewAvailable = (state:RootState) => isUserProfile(state.user.profile) && state.user.profile?.accountType === 1;
