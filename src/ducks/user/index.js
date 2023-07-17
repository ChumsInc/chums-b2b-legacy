import {combineReducers} from 'redux';
import {
    CHANGE_USER,
    CHANGE_USER_PASSWORD, CLEAR_USER_ACCOUNT,
    FETCH_CUSTOMER, FETCH_CUSTOMER_PERMISSIONS,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_LOCAL_LOGIN,
    FETCH_REP_LIST,
    FETCH_REP_LIST_FAILURE,
    FETCH_SUCCESS,
    FETCH_USER_CUSTOMERS,
    FETCH_USER_PROFILE,
    FETCH_USER_SIGNUP,
    LOGOUT_REQUEST,
    RECEIVE_REP_LIST,
    SET_CUSTOMER,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT,
    UPDATE_LOGIN,
    UPDATE_SIGNUP
} from "../../constants/actions";
import {auth} from '../../utils/IntranetAuthService';
import localStore from "../../utils/LocalStore";
import {STORE_AUTHTYPE, STORE_CUSTOMER, STORE_RECENT_ACCOUNTS, STORE_USER_ACCOUNT} from "../../constants/stores";
import {buildRecentAccounts, getFirstCustomer, getFirstUserAccount, getUserAccount,} from "../../utils/customer";
import jwtDecode from "jwt-decode";
import {createReducer} from "@reduxjs/toolkit";
import {loadProfile, loadRepList, setLoggedIn} from "./actions";
import {getPrimaryAccount, userAccountSort, userRepListSort} from "./utils";


/**
 *
 * @return {UserState}
 */
export const initialUserState = () => {
    const _existingToken = auth.getToken();
    let _existingTokenExpires = 0;
    if (_existingToken) {
        const decoded = jwtDecode(_existingToken);
        _existingTokenExpires = decoded?.exp ?? 0;
    }
    const _isLoggedIn = auth.loggedIn();
    const _profile = _isLoggedIn ? (auth.getProfile() ?? {}) : {}
    const _accounts = _profile?.chums?.user?.accounts ?? [];
    const _roles = _profile?.chums?.user?.roles ?? [];
    const _customer = _isLoggedIn
        ? localStore.getItem(STORE_CUSTOMER, getFirstCustomer(_accounts) ?? {})
        : {};
    const _userAccount = _isLoggedIn
        ? localStore.getItem(STORE_USER_ACCOUNT, _customer?.id ?? {})
        : {};
    const _recentAccounts = _isLoggedIn
        ? localStore.getItem(STORE_RECENT_ACCOUNTS, [])
        : [];
    const _authType = localStore.getItem(STORE_AUTHTYPE, '');

    return {
        token: _existingToken ?? null,
        tokenExpires: _existingTokenExpires,
        profile: _profile,
        accounts: _profile?.chums?.user?.accounts ?? [],
        roles: _profile?.chums?.user?.roles ?? [],
        loggedIn: _isLoggedIn,
        userAccount: _userAccount,
        currentCustomer: _customer,
        customerList: {
            list: [],
            loading: false,
            loaded: false,
            filter: '',
            repFilter: '',
        },
        repList: {
            list: [],
            loading: false,
            loaded: false,
        },
        signUp: {
            email: '',
            authKey: '',
            error: null,
            loading: false,
        },
        recentAccounts: _recentAccounts,
        authType: _authType,
        passwordChange: {
            oldPassword: '',
            newPassword: '',
            newPassword2: '',
            visible: false,
        },
        login: {
            email: '',
            password: '',
            forgotPassword: '',
            loading: false,
        },
        loading: false,
        customerPermissions: {
            loading: false,
            loaded: false,
            permissions: {
                billTo: false,
                shipTo: [],
            }
        }
    }
}

const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase(setLoggedIn, (state, action) => {
            state.loggedIn = action.payload.loggedIn;
            state.token = action.payload.token ?? null;
            if (!action.payload.loggedIn) {
                state.token = null;
                state.tokenExpires = 0;
                state.profile = {};
                state.accounts = [];
                state.roles = [];
                state.userAccount = {};
                state.currentCustomer = {}
                state.customerList = {
                    list: [],
                    loading: false,
                    loaded: false,
                    filter: '',
                    repFilter: '',
                }
                state.repList = {
                    list: [],
                    loading: false,
                    loaded: false,
                }
                state.signUp = {...initialUserState.signUp};
                state.recentAccounts = [];
                state.authType = '';
                state.passwordChange = {...initialUserState.passwordChange};
                state.login = {...initialUserState.login};
            }
        })
        .addCase(loadProfile.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loadProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.profile = action.payload.profile ?? {};
            state.roles = action.payload.roles ?? [];
            state.accounts = (action.payload.accounts ?? []).sort(userAccountSort);
            if (state.userAccount?.id) {
                const [acct] = state.accounts.filter(acct => acct.id === state.userAccount.id);
                state.userAccount = acct ?? {};
            }
            if (!state.userAccount?.id && state.accounts.length > 0) {
                state.userAccount = getPrimaryAccount(state.accounts) ?? {};
            }
            state.repList.list = [...(action.payload?.reps ?? [])].sort(userRepListSort);
            state.repList.loaded = true;
        })
        .addCase(loadProfile.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(loadRepList.pending, (state) => {
            state.repList.loading = true;
        })
        .addCase(loadRepList.fulfilled, (state, action) => {
            state.repList.loading = false;
            state.repList.list = [...(action.payload ?? [])].sort(userRepListSort);
            state.repList.loaded = true;
        })
        .addCase(loadRepList.rejected, (state) => {
            state.repList.loading = false;
            state.repList.list = [];
            state.repList.loaded = false;
        })
        .addDefaultCase((state, action) => {
            // console.log(action.type, JSON.parse(JSON.stringify(state)), action);
            switch (action.type) {
                case FETCH_USER_PROFILE:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        const {accounts, token, roles, ...rest} = action.user;
                        state.token = token ?? state.token ?? null;
                        state.profile = {...state.profile, ...rest, changed: false }
                        state.accounts = (accounts ?? []).filter(acct => acct.Company === 'chums');
                        state.loggedIn = (action.user?.id ?? 0) > 0;
                        state.roles = roles ?? [];
                    }
                    return;
                case SET_LOGGED_IN:
                    state.loggedIn = action.loggedIn === true;
                    if (!action.loggedIn) {
                        state.token = null;
                        state.tokenExpires = 0;
                        state.profile = {};
                        state.accounts = [];
                        state.roles = [];
                        state.userAccount = {};
                        state.currentCustomer = {}
                        state.customerList = {
                            list: [],
                            loading: false,
                            loaded: false,
                            filter: '',
                            repFilter: '',
                        }
                        state.repList = {
                            list: [],
                            loading: false,
                            loaded: false,
                        }
                        state.signUp = {...initialUserState.signUp};
                        state.recentAccounts = [];
                        state.authType = '';
                        state.passwordChange = {...initialUserState.passwordChange};
                        state.login = {...initialUserState.login};
                    }
                    if (action.token) {
                        state.token = action.token;
                        state.tokenExpires = jwtDecode(action.token)?.exp ?? 0;
                    }
                    return;
                case CHANGE_USER:
                    state.profile = {...state.profile, ...action.props, changed: true};
                    return;
                case FETCH_USER_SIGNUP:
                    state.signUp = {...state.signUp, ...(action.props ?? {}), loading: action.status === FETCH_INIT};
                    if (action.status === FETCH_SUCCESS) {
                        state.profile = action.props;
                    }
                    return;
                case FETCH_LOCAL_LOGIN:
                    state.login.loading = action.status === FETCH_INIT;
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_FAILURE) {
                        state.loggedIn = false;
                        state.authType = '';
                    } else if (action.status === FETCH_SUCCESS) {
                        state.login = {...initialUserState.login};
                    }
                    return;
                case CLEAR_USER_ACCOUNT:
                    localStore.removeItem(STORE_USER_ACCOUNT);
                    state.userAccount = {};
                    return;
                case SET_USER_ACCOUNT:
                    state.userAccount = action.userAccount;
                    localStore.setItem(STORE_USER_ACCOUNT, action.userAccount);
                    state.customerList = {...initialUserState.customerList};
                    if (!action.userAccount?.isRepAccount) {
                        const {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = action.userAccount;
                        localStore.setItem(STORE_CUSTOMER, {Company, ARDivisionNo, CustomerNo, CustomerName});
                        state.currentCustomer = {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode};
                    }
                    return;
                case SET_CUSTOMER:
                    state.currentCustomer = action.customer;
                    state.recentAccounts = buildRecentAccounts(state.recentAccounts, action.customer);
                    return;
                case FETCH_CUSTOMER:
                    if (action.status === FETCH_INIT) {
                        state.currentCustomer = {...action.customer};
                    } else if (action.status === FETCH_SUCCESS) {
                        const {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = action.customer;
                        localStore.setItem(STORE_CUSTOMER, {...state.currentCustomer, Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode});
                        state.currentCustomer = {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode};
                        state.recentAccounts = buildRecentAccounts(state.recentAccounts, {Company, ARDivisionNo, CustomerNo, CustomerName});
                        state.customerPermissions = action.permissions ?? {...initialUserState.customerPermissions};
                    }
                    return;
                case FETCH_USER_CUSTOMERS:
                    state.customerList.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.customerList.list = action.list;
                        state.customerList.loaded = true;
                    } else if (action.status === FETCH_FAILURE) {
                        state.customerList = {...initialUserState.customerList}
                    }
                    return;
                case FETCH_REP_LIST:
                    state.repList.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.repList.list = action.list;
                        state.repList.loaded = true;
                    } else if (action.status === FETCH_FAILURE) {
                        state.repList.list = [];
                        state.repList.loaded = false;
                    }
                    return;
                case RECEIVE_REP_LIST:
                    state.repList.list = action.list;
                    state.repList.loading = false;
                    state.repList.loaded = true;
                    return;
                case FETCH_REP_LIST_FAILURE:
                    state.repList.list = [];
                    state.repList.loading = false;
                    state.repList.loaded = false;
                    return;
                case UPDATE_SIGNUP:
                    state.signUp = {...state.signUp, ...(action.props ?? {})};
                    return;
                case UPDATE_LOGIN:
                    state.login = {...state.login, ...(action.props ?? {})};
                    return;
                case CHANGE_USER_PASSWORD:
                    state.passwordChange = {...state.passwordChange, ...(action.props ?? {})};
                    return;
                case FETCH_CUSTOMER_PERMISSIONS:
                    if (action.status === FETCH_INIT) {
                        state.customerPermissions = {...initialUserState.customerPermissions, loading: true};
                    }
                    state.customerPermissions.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.customerPermissions.loaded = true;
                        state.customerPermissions.permissions = action.payload;
                    }
                    return;
            }
        })
})
export default userReducer;

