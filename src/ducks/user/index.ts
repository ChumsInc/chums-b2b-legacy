import {
    CHANGE_USER_PASSWORD,
    CLEAR_USER_ACCOUNT,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_LOCAL_LOGIN,
    FETCH_SUCCESS,
    FETCH_USER_SIGNUP,
    SET_LOGGED_IN,
    UPDATE_LOGIN,
    UPDATE_SIGNUP
} from "../../constants/actions";
import {auth} from '../../api/IntranetAuthService';
import localStore from "../../utils/LocalStore";
import {STORE_AUTHTYPE, STORE_CUSTOMER, STORE_USER_ACCESS} from "../../constants/stores";
import {getFirstCustomer,} from "../../utils/customer";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {createReducer, isRejected, UnknownAction} from "@reduxjs/toolkit";
import {loadProfile, resetPassword, setLoggedIn, setUserAccess, signInWithGoogle} from "./actions";
import {getPrimaryAccount, isCustomerAccess, isUserProfileAction, userAccountSort} from "./utils";
import {
    DeprecatedUserAction,
    DeprecatedUserProfileAction,
    UserLoginState,
    UserPasswordState,
    UserSignupState
} from "./types";
import {BasicCustomer, Editable, UserCustomerAccess, UserProfile} from "b2b-types";
import {loadCustomer, setCustomerAccount} from "../customer/actions";
import {ExtendedUserProfile} from "../../types/user";


export interface UserState {
    token: string | null;
    tokenExpires: number;
    user: (UserProfile & Editable) | null;
    profile: (ExtendedUserProfile & Editable) | null;
    picture: string | null;
    access: {
        list: UserCustomerAccess[],
        current: UserCustomerAccess | null,
        loading: boolean,
        loaded: boolean,
    };
    accounts: UserCustomerAccess[];
    roles: string[];
    loggedIn: boolean;
    currentCustomer: BasicCustomer | null;
    signUp: UserSignupState;
    authType: string;
    passwordChange: UserPasswordState;
    login: UserLoginState;
    loading: boolean;
    resettingPassword: boolean;
}

export const initialUserState = (): UserState => {
    const existingToken = auth.getToken();
    let existingTokenExpires = 0;
    if (existingToken) {
        const decoded = jwtDecode<JwtPayload>(existingToken);
        existingTokenExpires = decoded?.exp ?? 0;
    }
    const isLoggedIn = auth.loggedIn();
    const profile = isLoggedIn ? (auth.getProfile() ?? null) : null
    const accounts = profile?.chums?.user?.accounts ?? [];
    const customer = isLoggedIn
        ? getFirstCustomer(accounts) ?? null
        : null;
    const currentAccess: UserCustomerAccess | null = isLoggedIn
        ? localStore.getItem<UserCustomerAccess | null>(STORE_USER_ACCESS, null)
        : null;
    const authType = localStore.getItem<string>(STORE_AUTHTYPE, '');

    return {
        token: existingToken ?? null,
        tokenExpires: existingTokenExpires,
        user: profile?.chums?.user ?? null,
        profile: profile?.chums?.user ?? null,
        picture: profile?.imageUrl ?? null,
        accounts: profile?.chums?.user?.accounts ?? [],
        roles: profile?.chums?.user?.roles ?? [],
        loggedIn: isLoggedIn,
        currentCustomer: customer ?? null,
        access: {
            list: profile?.chums?.user?.accounts ?? [],
            current: currentAccess,
            loading: false,
            loaded: !!profile?.chums?.user?.accounts,
        },
        signUp: {
            email: '',
            authKey: '',
            authHash: '',
            error: null,
            loading: false,
        },
        authType: authType ?? '',
        passwordChange: {
            oldPassword: '',
            newPassword: '',
            newPassword2: '',
            visible: false,
        },
        login: {
            email: '',
            password: '',
            forgotPassword: false,
            loading: false,
        },
        loading: false,
        resettingPassword: false,
    }
}

const userReducer = createReducer(initialUserState, (builder) => {
    builder
        .addCase(setLoggedIn, (state, action) => {
            if (!state.loggedIn && action.payload.loggedIn) {
                const _initialUserState = initialUserState();
                state.tokenExpires = _initialUserState.tokenExpires;
                state.user = _initialUserState.user;
                state.profile = _initialUserState.profile;
                state.picture = _initialUserState.picture;
                state.accounts = _initialUserState.accounts;
                state.roles = _initialUserState.roles;
                state.access = _initialUserState.access;
                state.currentCustomer = _initialUserState.currentCustomer;
            }
            state.loggedIn = action.payload.loggedIn;
            state.token = action.payload.token ?? null;
            if (!action.payload.loggedIn) {
                const _initialUserState = initialUserState();
                state.token = null;
                state.tokenExpires = 0;
                state.user = null;
                state.profile = null;
                state.accounts = [];
                state.roles = [];
                state.access.list = [];
                state.access.current = null;
                state.currentCustomer = null;
                state.signUp = {..._initialUserState.signUp};
                state.authType = '';
                state.passwordChange = {..._initialUserState.passwordChange};
                state.login = {..._initialUserState.login};
            }
        })
        .addCase(loadProfile.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(loadProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user ?? null;
            if (action.payload.user) {
                state.profile = {
                    ...action.payload.user,
                    accounts: action.payload.accounts ?? [],
                    roles: (action.payload.roles ?? []).sort(),
                }
            } else {
                state.profile = null;
            }
            state.roles = (action.payload.roles ?? []).sort();
            state.accounts = (action.payload.accounts ?? []).sort(userAccountSort);
            state.access.list = (action.payload.accounts ?? []).sort(userAccountSort);
            state.access.loaded = true;
            if (isCustomerAccess(state.access.current) && !!state.access.current.id) {
                const [acct] = state.accounts.filter(acct => isCustomerAccess(state.access.current) && acct.id === state.access.current.id);
                state.access.current = acct ?? null;
            }
            if (!isCustomerAccess(state.access.current) || !state.access.current?.id && state.accounts.length > 0) {
                state.access.current = getPrimaryAccount(state.accounts) ?? null;
            }
        })
        .addCase(loadProfile.rejected, (state, action) => {
            state.loading = false;
        })
        .addCase(setCustomerAccount.fulfilled, (state, action) => {
            state.currentCustomer = action.payload.customer;
        })
        .addCase(loadCustomer.fulfilled, (state, action) => {
            if (action.payload?.customer) {
                const {ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = action.payload.customer;
                localStore.setItem<BasicCustomer>(STORE_CUSTOMER, {
                    ...state.currentCustomer,
                    ARDivisionNo,
                    CustomerNo,
                    CustomerName,
                    ShipToCode
                });
                state.currentCustomer = {ARDivisionNo, CustomerNo, CustomerName, ShipToCode};
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            state.access.current = action.meta.arg;
            if (action.meta.arg && !action.meta.arg?.isRepAccount) {
                const {ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = action.meta.arg;
                state.currentCustomer = {ARDivisionNo, CustomerNo, CustomerName: CustomerName ?? undefined, ShipToCode};
            }

        })
        .addCase(signInWithGoogle.pending, (state, action) => {
            state.loading = true;
        })
        .addCase(signInWithGoogle.fulfilled, (state, action) => {
            state.loading = false;
            state.token = action.meta.arg;
            state.profile = action.payload.user ?? null;
            state.accounts = (action.payload.accounts ?? []).sort(userAccountSort);
            state.roles = (action.payload.roles ?? []).sort();
            state.loggedIn = !!(action.payload.user?.id ?? 0);
            state.picture = action.payload.picture ?? null;
        })
        .addCase(signInWithGoogle.rejected, (state) => {
            state.loading = false;
        })
        .addCase(resetPassword.pending, (state) => {
            state.resettingPassword = true;
        })
        .addCase(resetPassword.fulfilled, (state) => {
            state.resettingPassword = false;
        })
        .addCase(resetPassword.rejected, (state) => {
            state.resettingPassword = false;
        })
        .addMatcher((action) => isRejected(action) && !!action.error, (state, action) => {
            if (isRejected(action)) {
                console.log(action?.error);
            }
        })
        .addDefaultCase((state, action: UnknownAction | DeprecatedUserProfileAction) => {
            const _initialUserState = initialUserState();
            // console.log(action.type, JSON.parse(JSON.stringify(state)), action);
            switch (action.type) {
                case SET_LOGGED_IN:
                    if (isUserProfileAction(action)) {
                        state.loggedIn = action.loggedIn === true;
                        if (!action.loggedIn) {
                            state.token = null;
                            state.tokenExpires = 0;
                            state.profile = null;
                            state.accounts = [];
                            state.roles = [];
                            state.access.list = [];
                            state.access.current = null;
                            state.currentCustomer = null;
                            state.signUp = {..._initialUserState.signUp};
                            state.authType = '';
                            state.passwordChange = {..._initialUserState.passwordChange};
                            state.login = {..._initialUserState.login};
                        }
                        if (action.token) {
                            state.token = action.token;
                            state.tokenExpires = jwtDecode<JwtPayload>(action.token)?.exp ?? 0;
                        }
                    }
                    return;
                case FETCH_USER_SIGNUP:
                    if (isUserProfileAction(action)) {
                        state.signUp = {
                            ...state.signUp, ...(action.props ?? {}),
                            loading: action.status === FETCH_INIT
                        };
                        if (action.status === FETCH_SUCCESS) {
                            state.profile = action.props;
                        }
                    }
                    return;
                case FETCH_LOCAL_LOGIN:
                    state.login.loading = action.status === FETCH_INIT;
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_FAILURE) {
                        state.loggedIn = false;
                        state.authType = '';
                    } else if (action.status === FETCH_SUCCESS) {
                        state.login = {...initialUserState().login};
                    }
                    return;
                case CLEAR_USER_ACCOUNT:
                    localStore.removeItem(STORE_USER_ACCESS);
                    state.access.current = null;
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
            }
        })
})
export default userReducer;

