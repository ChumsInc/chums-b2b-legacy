import {fetchGET, fetchPOST} from '../../utils/fetch';
import {
    ALERT_TYPES,
    CHANGE_USER,
    CHANGE_USER_PASSWORD,
    CLEAR_USER_ACCOUNT,
    FETCH_CUSTOMER_PERMISSIONS,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_LOCAL_LOGIN,
    FETCH_REP_LIST,
    FETCH_REP_LIST_FAILURE,
    FETCH_SUCCESS,
    FETCH_USER_CUSTOMERS,
    FETCH_USER_PROFILE,
    FETCH_USER_SIGNUP,
    RECEIVE_REP_LIST,
    SET_CUSTOMER,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT,
    UPDATE_LOGIN,
    UPDATE_SIGNUP,
} from "../../constants/actions";

import {handleError} from '../app/actions';
import {setAlert} from '../alerts';

import localStore from '../../utils/LocalStore';
import {
    STORE_AUTHTYPE,
    STORE_CURRENT_CART,
    STORE_CUSTOMER,
    STORE_CUSTOMER_SHIPPING_ACCOUNT,
    STORE_RECENT_ACCOUNTS,
    STORE_TOKEN,
    STORE_USER_ACCOUNT
} from '../../constants/stores';

import {auth} from '../../api/IntranetAuthService';
import {getProfile, getSignInProfile, getTokenExpirationDate} from "../../utils/jwtHelper";
import {getFirstCustomer, getFirstUserAccount, getUserAccount, isValidCustomer} from "../../utils/customer";
import {loadCustomerAccount, setCustomerAccount} from "../customer/actions";
import {
    API_PATH_CHANGE_PASSWORD,
    API_PATH_CUSTOMER_LIST,
    API_PATH_LOGIN_GOOGLE,
    API_PATH_LOGIN_LOCAL_REAUTH,
    API_PATH_LOGOUT,
    API_PATH_PASSWORD_RESET,
    API_PATH_PROFILE,
    API_PATH_REP_LIST,
    API_PATH_USER_SET_PASSWORD,
    API_PATH_USER_SIGN_UP
} from "../../constants/paths";
import {AUTH_GOOGLE, AUTH_LOCAL, USER_EXISTS} from "../../constants/app";
import {
    selectCurrentCustomer,
    selectCustomerPermissionsLoading,
    selectUserLoading, selectUserRepAccounts,
    selectUserRepsLoading
} from "./selectors";
import {selectCustomerAccount} from "../customer/selectors";
import {fetchCustomerValidation, fetchRepList, fetchUserProfile, postLocalLogin} from "../../api/user";
import {createAction, createAsyncThunk, Dispatch} from "@reduxjs/toolkit";
import {SetLoggedInProps, UserLoginState, UserPasswordState, UserProfileResponse} from "./types";
import {AppDispatch, RootState} from "../../app/configureStore";
import {CustomerKey, UserCustomerAccess, UserProfile} from "b2b-types";
import {isCustomerAccess} from "./utils";

let reauthTimer:number = 0;

export const setLoggedIn = createAction<SetLoggedInProps>('user/setLoggedIn');

// export const setLoggedIn = ({loggedIn, authType, token}) => ({type: SET_LOGGED_IN, loggedIn, authType, token});

export const updateLogin = (props:Partial<UserLoginState>) => ({type: UPDATE_LOGIN, props});

export const loginUser = ({email, password}:{email:string; password: string}) => async (dispatch:AppDispatch) => {
    try {
        dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_INIT});
        const token = await postLocalLogin({email, password});
        localStore.setItem(STORE_AUTHTYPE, AUTH_LOCAL);
        auth.setToken(token);
        auth.setProfile(getProfile(token));
        dispatch(setLoggedIn({loggedIn: true, authType: AUTH_LOCAL, token}));
        dispatch(loadProfile());
    } catch (err:unknown) {
        if (err instanceof Error) {
            console.debug("loginUser()", err.message);
            dispatch(setAlert({message: err.message, context: FETCH_LOCAL_LOGIN}));
            dispatch(handleError(err ?? new Error(err), FETCH_LOCAL_LOGIN));
            dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_FAILURE});
            localStore.removeItem(STORE_TOKEN);
        }
    }
};

export const updateLocalAuth = (forceReAuth = false) => (dispatch:AppDispatch, getState: () => RootState) => {
    clearTimeout(reauthTimer);
    const {user} = getState();
    const {loggedIn, authType} = user;
    const token = auth.getToken();
    if (!loggedIn || authType !== AUTH_LOCAL || !token) {
        return;
    }


    const expirationDate = getTokenExpirationDate(token)?.valueOf() ?? 0;
    const now = new Date().valueOf();
    if (expirationDate <= now) {
        return;
    }
    const expiresIn = expirationDate - now;

    const retry = 60 * 1000; // 60 seconds

    if (!forceReAuth) {
        // sleep until 5 minutes out.
        if (expiresIn > 5 * 60 * 1000) {
            reauthTimer = window.setTimeout(() => {
                dispatch(updateLocalAuth())
            }, retry);
            return;
        }
    }

    dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_INIT});
    fetchPOST(API_PATH_LOGIN_LOCAL_REAUTH)
        .then(({token, error}) => {
            dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_SUCCESS});
            if (error) {
                dispatch(setAlert({message: error, context: FETCH_LOCAL_LOGIN}));
                return;
            }
            auth.setToken(token);
            dispatch(setLoggedIn({loggedIn: true, authType: AUTH_LOCAL, token}));
            dispatch(loadProfile());

            // trigger an updateLocalAuth so that we start a new reauthTimer
            dispatch(updateLocalAuth());
        })
        .catch(err => {
            dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_FAILURE});
            dispatch(setLoggedIn({loggedIn: false}));
            dispatch(handleError(err, FETCH_LOCAL_LOGIN));
            localStore.removeItem(STORE_TOKEN);
        });
};

export const selectUserAccountIfNeeded = (user:UserProfileResponse) => (dispatch:AppDispatch, getState: () => RootState) => {
    const currentState = getState();
    const currentUserAccountID = isCustomerAccess(currentState.user.userAccount) ? currentState.user.userAccount.id : null;
    if (user.accounts?.filter(acct => acct.id === currentUserAccountID).length === 0) {
        const firstCustomer = getFirstCustomer(user.accounts);
        const firstUserAccount = getFirstUserAccount(user.accounts);
        dispatch(setUserAccount({...getUserAccount(user.accounts, firstCustomer.id || firstUserAccount.id || 0)}));
    }
};

export const _signInWithGoogle = createAsyncThunk(
    'user/signInWithGoogle',
    async (arg, {dispatch}) => {

    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return false;
        }
    }
)


export const signInWithGoogle = (token:string) => async (dispatch:AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        dispatch({type: FETCH_USER_PROFILE, status: FETCH_INIT});
        const res = await fetchPOST(API_PATH_LOGIN_GOOGLE, {token});
        const {user = {}, roles = [], accounts = []} = res;
        user.roles = roles;
        user.accounts = accounts;
        auth.setToken(token);

        const profile = getSignInProfile(token);
        auth.setProfile({...profile, chums: {user}});
        localStore.setItem(STORE_AUTHTYPE, AUTH_GOOGLE);
        clearTimeout(reauthTimer);


        dispatch(setLoggedIn({loggedIn: user.id > 0, authType: AUTH_GOOGLE, token}));
        dispatch({type: FETCH_USER_PROFILE, status: FETCH_SUCCESS, user});
        dispatch(loadRepList());
        dispatch(selectUserAccountIfNeeded(user));
        const currentCustomer = selectCurrentCustomer(state);
        if (!currentCustomer) {
            return;
        }
        if (!!currentCustomer.CustomerNo && !selectCustomerAccount(state)?.CustomerNo) {
            dispatch(setCustomerAccount(currentCustomer));
            dispatch(loadCustomerAccount({fetchOrders: true}));
        }
    } catch (err:unknown) {
        if (err instanceof Error) {
            console.trace(err);
            auth.logout();
            dispatch(setLoggedIn({loggedIn: false}));
            dispatch({type: FETCH_USER_PROFILE, status: FETCH_FAILURE, message: err.message});
            dispatch(handleError(err, FETCH_USER_PROFILE));
        }
    }
}


export const logout = () => async (dispatch:AppDispatch, getState: () => RootState) => {
    try {
        await fetchPOST(API_PATH_LOGOUT);
    } catch(err) {
        if (err instanceof Error) {
            console.debug("logout()", err.message);
        }
    }
    auth.logout();
    clearTimeout(reauthTimer);
    localStore.removeItem(STORE_CUSTOMER);
    localStore.removeItem(STORE_USER_ACCOUNT);
    localStore.removeItem(STORE_RECENT_ACCOUNTS);
    localStore.removeItem(STORE_AUTHTYPE);
    localStore.removeItem(STORE_CURRENT_CART);
    localStore.removeItem(STORE_CUSTOMER_SHIPPING_ACCOUNT);
    dispatch(setLoggedIn({loggedIn: false}));
    dispatch({type: SET_CUSTOMER, customer: {Company: 'chums'}});
};

export const clearUserAccount = () => ({type: CLEAR_USER_ACCOUNT});

/**
 *
 * @param {CustomerKey} userAccount
 * @return {(function(*, *): void)|*}
 */
export const setUserAccount = (userAccount:UserCustomerAccess) => (dispatch:AppDispatch, getState: () => RootState) => {
    const {user} = getState();
    if (isCustomerAccess(user.userAccount) && userAccount.id === user.userAccount?.id) {
        return;
    }

    dispatch({type: SET_USER_ACCOUNT, userAccount});
    const {isRepAccount, Company, ARDivisionNo, CustomerNo} = userAccount;
    if (!isRepAccount && isValidCustomer({Company, ARDivisionNo, CustomerNo})) {
        dispatch(setCustomerAccount({Company, ARDivisionNo, CustomerNo}));
        dispatch(loadCustomerAccount({fetchOrders: true}));
    } else if (isRepAccount) {
        dispatch(fetchCustomerList(userAccount));
        dispatch(loadRepList());
    }
};

export const fetchCustomerList = ({Company, SalespersonDivisionNo, SalespersonNo}:Partial<UserCustomerAccess> = {}) =>
    (dispatch:AppDispatch, getState: () => RootState) => {
    const {user} = getState();
    if (!isCustomerAccess(user.userAccount)) {
        return;
    }
    Company = Company ?? user.userAccount?.Company  ?? 'chums';
    SalespersonDivisionNo = SalespersonDivisionNo ?? user.userAccount.SalespersonDivisionNo;
    SalespersonNo = SalespersonNo || user.userAccount.SalespersonNo;

    const {isRepAccount} = user.userAccount;
    if (!isRepAccount || !SalespersonDivisionNo || !SalespersonNo) {
        return;
    }

    dispatch({type: FETCH_USER_CUSTOMERS, status: FETCH_INIT});
    const url = API_PATH_CUSTOMER_LIST
        .replace(':Company', encodeURIComponent(Company))
        .replace(':SalespersonDivisionNo', encodeURIComponent(SalespersonDivisionNo))
        .replace(':SalespersonNo', encodeURIComponent(SalespersonNo))
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const list = res.result || [];
            dispatch({type: FETCH_USER_CUSTOMERS, status: FETCH_SUCCESS, list});
        })
        .catch(err => {
            dispatch({type: FETCH_USER_CUSTOMERS, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_USER_CUSTOMERS));
        })
};

export const loadProfile = createAsyncThunk<UserProfileResponse>(
    'user/loadProfile',
    async () => {
        return await fetchUserProfile();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectUserLoading(state);
        }
    }
)

// export const fetchProfile = () => (dispatch:AppDispatch, getState: () => RootState) => {
//     dispatch({type: FETCH_USER_PROFILE, status: FETCH_INIT});
//     fetchGET(API_PATH_PROFILE)
//         .then(res => {
//             const {user = {}, roles = [], accounts = []} = res;
//             user.roles = roles;
//             user.accounts = accounts;
//             const currentAccount = localStore.getItem(STORE_USER_ACCOUNT);
//             if (!!currentAccount && user.accounts.filter(acct => acct.id === currentAccount.id).length === 0) {
//                 dispatch(clearUserAccount())
//             }
//             dispatch({type: FETCH_USER_PROFILE, status: FETCH_SUCCESS, user});
//             dispatch(selectUserAccountIfNeeded(user));
//         })
//         .catch(err => {
//             console.trace(err);
//             auth.logout();
//             dispatch({type: FETCH_USER_PROFILE, status: FETCH_FAILURE, message: err.message});
//             dispatch(handleError(err, FETCH_USER_PROFILE));
//         });
//     dispatch(loadRepList());
// };

export const loadRepList = createAsyncThunk(
    'user/loadReps',
    async () => {
        return await fetchRepList();
    },
    {
        condition: (arg, {getState}) => {
            const state = getState();
            return !selectUserRepsLoading(state) && !!selectUserRepAccounts(state).length;
        }
    }
)

export const changeUser = (props:Pick<UserProfile, 'name'|'email'>) => ({type: CHANGE_USER, props});
export const changeUserPassword = (props:Partial<UserPasswordState>) => ({type: CHANGE_USER_PASSWORD, props});

export const submitPasswordChange = () => (dispatch:AppDispatch, getState: () => RootState) => {
    const {user} = getState();
    const {oldPassword, newPassword} = user.passwordChange;
    if (!oldPassword || !newPassword) {
        return;
    }
    const body = {oldPassword, newPassword};
    fetchPOST(API_PATH_CHANGE_PASSWORD, body)
        .then(({token}) => {
            auth.setToken(token);
            dispatch(setAlert({type: 'success', title: 'Done!', message: 'Your password has been changed'}));
            dispatch({type: SET_LOGGED_IN, authType: AUTH_LOCAL, token});
            dispatch(loadProfile());
            dispatch(updateLocalAuth());
        })
        .catch(err => {
            dispatch(handleError(err, 'HANDLE_PASSWORD_CHANGE'));
            console.log(err.message);
        })
};

export const submitNewPassword = () => (dispatch:AppDispatch, getState: () => RootState) => {
    const {user} = getState();
    const {authKey, authHash} = user.signUp;
    const {newPassword} = user.passwordChange;
    const url = API_PATH_USER_SET_PASSWORD
        .replace(':authHash', encodeURIComponent(authHash))
        .replace(':authKey', encodeURIComponent(authKey));
    return fetchPOST(url, {newPassword})
        .then(({token}) => {
            auth.setToken(token);
            auth.setProfile(getProfile(token));
            dispatch(setLoggedIn({loggedIn: true, authType: AUTH_LOCAL, token}));
            dispatch(loadProfile());
            return {success: true};
        })
        .catch(err => {
            dispatch(handleError(err, 'SET_PASSWORD'));
            console.log(err.message);
        })
};

export const fetchSignUpUser = ({authKey, authHash}:{authKey: string, authHash:string}) => (dispatch:AppDispatch, getState: () => RootState) => {
    dispatch({type: FETCH_USER_SIGNUP, status: FETCH_INIT, props: {authKey, authHash}});
    const url = API_PATH_USER_SET_PASSWORD
        .replace(':authKey', encodeURIComponent(authKey))
        .replace(':authHash', encodeURIComponent(authHash))
    fetchGET(url, {cache: 'no-cache'})
        .then(({user}) => {
            dispatch({type: FETCH_USER_SIGNUP, status: FETCH_SUCCESS, props: user});
        })
        .catch(err => {
            dispatch({type: FETCH_USER_SIGNUP, status: FETCH_FAILURE, props: {authKey: null, authHash: null}});
            dispatch(handleError(err, FETCH_USER_SIGNUP));
            console.log(err.message);
        });
};

export const submitNewUser = ({email, name, account, accountName, telephone, address}:{
    email: string;
    name: string;
    account: string;
    accountName?: string;
    telephone?: string;
    address?:string;
}) => (dispatch:AppDispatch) => {
    dispatch({type: FETCH_USER_SIGNUP, status: FETCH_INIT});
    const url = API_PATH_USER_SIGN_UP.replace(':email', encodeURIComponent(email));
    const body = {email, name, account, accountName, telephone, address};
    fetchPOST(url, body)
        .then(({error, message, success, result}) => {
            // console.log({error, message, success, result});
            dispatch({type: FETCH_USER_SIGNUP, status: FETCH_SUCCESS});
            if (success) {
                return dispatch(setAlert({
                    type: 'success',
                    title: 'Welcome!',
                    message: "We've sent you an email so you can validate your account and set your new password."
                }));
            }
            dispatch(setAlert({title: 'Thanks!', message, type: 'success'}));
        })
        .catch(err => {
            dispatch({
                type: FETCH_USER_SIGNUP,
                status: FETCH_FAILURE,
                props: {error: err.name === USER_EXISTS ? err.name : null}
            });
            dispatch(handleError(err, FETCH_USER_SIGNUP));
            console.log(err.name, err.message);
        });
};

export const resetPassword = ({email}:{email:string}) => (dispatch:AppDispatch) => {
    dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_INIT});
    fetchPOST(API_PATH_PASSWORD_RESET, {email})
        .then(({success, result}) => {
            // console.log({success, result});
            dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_SUCCESS});
            dispatch(setAlert({
                type: 'success',
                message: "We've sent you an email so you can validate your account and reset your password.",
                context: 'login',
                title: 'Thanks!'
            }));
        })
        .catch(err => {
            dispatch({type: FETCH_LOCAL_LOGIN, status: FETCH_FAILURE});
            dispatch(handleError(err, 'RESET_PASSWORD'));
            console.log(err.name, err.message);
        })
};

export const loadCustomerPermissions = () => async (dispatch:AppDispatch, getState: () => RootState) => {
    try {
        const state = getState();
        const customer = selectCustomerAccount(state);
        const loading = selectCustomerPermissionsLoading(state);
        if (loading || !customer) {
            return;
        }
        dispatch({type: FETCH_CUSTOMER_PERMISSIONS, status: FETCH_INIT});
        const permissions = await fetchCustomerValidation(customer);
        dispatch({type: FETCH_CUSTOMER_PERMISSIONS, status: FETCH_SUCCESS, payload: permissions});
    } catch (err) {
        dispatch({type: FETCH_CUSTOMER_PERMISSIONS, status: FETCH_FAILURE});
    }
}
