import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";
import {isUserProfile} from "./utils";
import {UserCustomerAccess} from "b2b-types";

export const selectUserProfile = (state:RootState) => state.user.profile;
export const selectProfilePicture = (state: RootState): string | null => state.user.picture;
export const selectUserAccounts = (state:RootState) => state.user.accounts ?? [];
export const selectUserCustomerAccounts = (state:RootState) => state.user.accounts.filter(acct => !acct.isRepAccount);
export const selectUserRepAccounts = (state:RootState) => state.user.accounts.filter(acct => !!acct.isRepAccount);

export const selectUserAccountsCount = (state:RootState) => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state:RootState) => state.user.loggedIn ?? false;

export const selectAuthType = (state:RootState) => state.user.authType;

export const selectUserAccount = (state:RootState) => state.user.access.current ?? null;

export const selectCurrentCustomer = (state:RootState) => state.user.currentCustomer ?? null;

export const selectUserLoading = (state:RootState) => state.user.loading ?? false;
export const selectResettingPassword = (state:RootState) => state.user.resettingPassword;

export const selectAccessList = (state: RootState) => state.user.access.list;
export const selectAccessListLoading = (state:RootState) => state.user.access.loading;
export const selectRepAccessList = createSelector([selectAccessList], (list) => list.filter(row => !!row.isRepAccount));
export const selectCustomerAccessList = createSelector([selectAccessList], (list) => list.filter(row => !row.isRepAccount));
export const selectCurrentAccess = (state: RootState): UserCustomerAccess | null => state.user.access.current;

export const selectIsEmployee = (state:RootState) => state.user.roles.filter(role => role === 'employee').length === 1;
export const selectIsRep = (state:RootState) => state.user.roles.filter(role => role === 'rep').length === 1;
export const selectCanEdit = createSelector(
    [selectIsEmployee, selectIsRep],
    (isEmployee, isRep) => {
        return (isEmployee || isRep);
    }
)


export const selectLoginExpiry = (state:RootState) => state.user.tokenExpires ?? 0;

export const selectCanViewAvailable = (state:RootState) => isUserProfile(state.user.profile) && state.user.profile?.accountType === 1;
