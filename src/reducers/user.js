import {combineReducers} from 'redux';
import {
    CHANGE_USER,
    CHANGE_USER_PASSWORD, CLEAR_USER_ACCOUNT,
    FETCH_CUSTOMER,
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
} from "../constants/actions";
import {auth} from '../utils/IntranetAuthService';
import localStore from "../utils/LocalStore";
import {STORE_AUTHTYPE, STORE_CUSTOMER, STORE_RECENT_ACCOUNTS, STORE_USER_ACCOUNT} from "../constants/stores";
import {buildRecentAccounts, getFirstCustomer, getFirstUserAccount, getUserAccount,} from "../utils/customer";
import {jwtDecode} from "jwt-decode";


const defaults = {
    isLoggedIn: false,
    profile: {},
    token: null,
    accounts: [],
    roles: [],
    recentAccounts: [],
    userAccount: {},
    customer: {},
    customerList: {list: []},
    repList: {
        list: []
    },
    authType: '',
};

const exisitingToken = auth.getToken();
let existingTokenExpires = 0;
if (exisitingToken) {
    const decoded = jwtDecode(exisitingToken);
    existingTokenExpires = decoded?.exp ?? 0;
}
const userDefaults = {
    ...defaults,
    isLoggedIn: auth.loggedIn(),
    token: exisitingToken,
    tokenExpires: existingTokenExpires,
    authType: localStore.getItem(STORE_AUTHTYPE) || defaults.authType,
};


if (userDefaults.isLoggedIn) {
    userDefaults.profile = auth.getProfile() || defaults.profile;
    userDefaults.token = auth.getToken();
    userDefaults.authType = localStore.getItem(STORE_AUTHTYPE) || defaults.authType;

    const decoded = jwtDecode(userDefaults.token);
    userDefaults.tokenExpires = decoded?.exp ?? 0;

    if (userDefaults.profile) {
        const {chums} = userDefaults.profile;
        if (!!chums && !!chums.user) {
            userDefaults.accounts = chums.user.accounts.filter(acct => acct.Company === 'chums');
            userDefaults.roles = chums.user.roles;
        }
    }

    userDefaults.customer = localStore.getItem(STORE_CUSTOMER)
        || getFirstCustomer(userDefaults.accounts)
        || defaults.customer;
    if (userDefaults.customer.Company !== 'chums') {
        userDefaults.customer = defaults.customer;
    }

    // if userDefaults.customer is from the userDefaults.accounts list, it will have an id, otherwise, get from the first user account
    userDefaults.userAccount = localStore.getItem(STORE_USER_ACCOUNT)
        || getUserAccount(userDefaults.accounts, userDefaults.customer.id || getFirstUserAccount(userDefaults.accounts).id || 0)
        || defaults.userAccount;
    if (userDefaults.userAccount.Company !== 'chums') {
        userDefaults.userAccount = defaults.userAccount;
    }


    userDefaults.recentAccounts = (localStore.getItem(STORE_RECENT_ACCOUNTS) || defaults.recentAccounts || [])
        .filter(acct => acct.Company === 'chums');
}

const token = (state = userDefaults.token, action) => {
    const {type, status, user, loggedIn, token} = action;
    switch (type) {
    case FETCH_USER_PROFILE:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        const {token} = user;
        return token || state;
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.token;
    default:
        return state;
    }
};

const tokenExpires = (state = userDefaults.tokenExpires, action) => {
    const {type, status, user, loggedIn, token} = action;
    switch (type) {
    case SET_LOGGED_IN:
        if (!loggedIn) {
            return 0;
        }
        if (token) {
            const decoded = jwtDecode(token);
            return decoded?.exp ?? 0;
        }
    default:
        return state;
    }
}

const profile = (state = userDefaults.profile, action) => {
    const {type, status, user, props, loggedIn} = action;
    switch (type) {
    case FETCH_USER_PROFILE:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        const {accounts, token, roles, ...rest} = user;
        return {...state, ...rest, changed: undefined};
    case CHANGE_USER:
        return {...state, ...props, changed: true};
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.profile;
    case LOGOUT_REQUEST:
        return {};
    case FETCH_USER_SIGNUP:
        return status === FETCH_SUCCESS ? {...props} : state;
    default:
        return state;
    }
};

const accounts = (state = userDefaults.accounts, action) => {
    const {type, status, user, loggedIn} = action;
    switch (type) {
    case FETCH_USER_PROFILE:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        return [...(user.accounts || []).filter(acct => acct.Company === 'chums')];
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.accounts;
    default:
        return state;
    }
};

const loggedIn = (state = userDefaults.isLoggedIn, action) => {
    const {type, status, loggedIn, user} = action;
    switch (type) {
    case SET_LOGGED_IN:
        return loggedIn === true;
    case FETCH_USER_PROFILE:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        return (user.id || 0) > 0;
    case FETCH_LOCAL_LOGIN:
        return status === FETCH_FAILURE ? false : state;
    default:
        return state;
    }
};

const roles = (state = userDefaults.roles, action) => {
    const {type, status, user, loggedIn} = action;
    switch (type) {
    case FETCH_USER_PROFILE:
        if (status !== FETCH_SUCCESS) {
            return state;
        }
        return [...(user.roles || [])];
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.roles;
    default:
        return state;
    }
};

const userAccount = (state = userDefaults.userAccount, action) => {
    const {type, userAccount, loggedIn} = action;
    switch (type) {
    case CLEAR_USER_ACCOUNT:
        localStore.removeItem(STORE_USER_ACCOUNT);
        return {};
    case SET_USER_ACCOUNT:
        localStore.setItem(STORE_USER_ACCOUNT, userAccount);
        return {...userAccount};
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.userAccount;
    default:
        return state;
    }
};

const currentCustomer = (state = userDefaults.customer, action) => {
    const {type, status, userAccount, customer, loggedIn} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
        if (!userAccount.isRepAccount) {
            const {Company, ARDivisionNo, CustomerNo, CustomerName} = userAccount;
            localStore.setItem(STORE_CUSTOMER, {Company, ARDivisionNo, CustomerNo, CustomerName});
            return {Company, ARDivisionNo, CustomerNo, CustomerName};
        }
        return {Company: userAccount.Company};
    case SET_CUSTOMER:
        return {...customer};
    case FETCH_CUSTOMER:
        if (status === FETCH_INIT) {
            return {...customer};
        } else if (status === FETCH_SUCCESS) {
            const {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = customer;
            localStore.setItem(STORE_CUSTOMER, {...state, Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode});
            return {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode};
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.customer;
    case LOGOUT_REQUEST:
        return {};
    default:
        return state;
    }
};

const customerList = (state = defaults.customerList, action) => {
    const {type, status, list, loggedIn} = action;
    switch (type) {
    case FETCH_USER_CUSTOMERS:
        if (status === FETCH_INIT) {
            return {...state, loading: true};
        } else if (status === FETCH_SUCCESS) {
            return {list: [...list]};
        } else {
            return {list: []};
        }
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.customerList;
    case SET_USER_ACCOUNT:
        return {list: []};
    default:
        return state;
    }
};

const repListValues = (state = defaults.repList.list ?? [], action) => {
    const {type, status, list, loggedIn} = action;
    switch (type) {
    case FETCH_REP_LIST:
        return status === FETCH_SUCCESS ? [...list] : state;
    case RECEIVE_REP_LIST:
        return [...list];
    case FETCH_REP_LIST_FAILURE:
        return []
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.repList.list;
    default:
        return state;

    }
}

const repListLoading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_REP_LIST:
        return status === FETCH_INIT;
    case RECEIVE_REP_LIST:
        return false
    case FETCH_REP_LIST_FAILURE:
        return false
    default:
        return state;
    }
}

const repListLoaded = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_REP_LIST:
        return status === FETCH_SUCCESS;
    case RECEIVE_REP_LIST:
        return true
    default:
        return state;
    }

}
const repList = combineReducers({
    list: repListValues,
    loading: repListLoading,
    loaded: repListLoaded,
});

const signUp = (state = {}, action) => {
    const {type, status, props = {}} = action;
    switch (type) {
    case UPDATE_SIGNUP:
        return {...state, ...props};
    case SET_LOGGED_IN:
        return {};
    case FETCH_USER_SIGNUP:
        return {...state, ...props, loading: status === FETCH_INIT};
    default:
        return state;
    }
};

const recentAccounts = (state = userDefaults.recentAccounts, action) => {
    const {type, status, customer, loggedIn} = action;

    switch (type) {
    case SET_CUSTOMER: {
        return buildRecentAccounts(state, customer);
    }
    case FETCH_CUSTOMER:
        if (status === FETCH_SUCCESS) {
            const {Company, ARDivisionNo, CustomerNo, CustomerName} = customer;
            return buildRecentAccounts(state, {Company, ARDivisionNo, CustomerNo, CustomerName});
        }
        return state;
    case SET_LOGGED_IN:
        return loggedIn === true ? state : defaults.recentAccounts;
    default:
        return state;
    }
};

const authType = (state = userDefaults.authType, action) => {
    const {type, authType, status} = action;
    switch (type) {
    case SET_LOGGED_IN:
        return authType || '';
    case FETCH_LOCAL_LOGIN:
        return status === FETCH_FAILURE ? defaults.authType : state;
    default:
        return state;
    }
};

const passwordChange = (state = {}, action) => {
    const {type, props} = action;
    switch (type) {
    case CHANGE_USER_PASSWORD:
        return {...state, ...props};
    case SET_LOGGED_IN:
        return {};
    default:
        return state;
    }
};

const login = (state = {}, action) => {
    const {type, props, status, loggedIn} = action;
    switch (type) {
    case UPDATE_LOGIN:
        return {...state, ...props};
    case SET_LOGGED_IN:
        return loggedIn ? {} : state;
    case FETCH_LOCAL_LOGIN:
        if (status === FETCH_SUCCESS) {
            return {};
        }
        return {...state, loading: status === FETCH_INIT};
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_USER_PROFILE:
    case FETCH_LOCAL_LOGIN:
        return status === FETCH_INIT;
    default:
        return state;
    }
};


export default combineReducers({
    token,
    tokenExpires,
    profile,
    accounts,
    roles,
    loggedIn,
    userAccount,
    currentCustomer,
    customerList,
    repList,
    signUp,
    recentAccounts,
    authType,
    passwordChange,
    login,
    loading,
});
