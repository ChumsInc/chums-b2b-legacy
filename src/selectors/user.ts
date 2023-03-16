import {RootState} from "../ducks/index";
import {Salesperson} from "b2b-types";

export const selectUserAccounts = (state:RootState) => state.user.accounts ?? [];

export const selectUserAccountsCount = (state:RootState):number => (state.user.accounts ?? []).length;

export const selectLoggedIn = (state:RootState):boolean => state.user.loggedIn ?? false;

export const selectUserAccount = (state:RootState):any => state.user.userAccount ?? {};

export const selectCurrentCustomer = (state:RootState) => state.user.currentCustomer ?? {}

export const selectUserLoading = (state:RootState):boolean => state.user.loading ?? false;

export const selectIsEmployee = (state:RootState):boolean => state.user.roles.filter(role => role.role === 'employee').length === 1;
export const selectIssRep = (state:RootState):boolean => state.user.roles.filter(role => role.role === 'rep').length === 1;

export const selectUserReps = (state:RootState):Salesperson[] => state.user.repList.list ?? [];
export const selectUserRepsLoading = (state:RootState):boolean => state.user.repList.loading;
export const selectUserRepsLoaded = (state:RootState):boolean => state.user.repList.loaded;

