import localStore from "../utils/LocalStore";
import {
    STORE_AUTHTYPE,
    STORE_CUSTOMER,
    STORE_RECENT_ACCOUNTS,
    STORE_USER_ACCOUNT,
    STORE_USER_PREFS
} from "../constants/stores";
import {auth} from "../utils/IntranetAuthService";
import {getFirstCustomer, getFirstUserAccount, getUserAccount} from "../utils/customer";
import {initialProductsState} from "../ducks/products";
import {initialCustomerState} from "../ducks/customer";
import {initialCartState} from "../ducks/cart";
import {initialMessagesState} from "../ducks/messages";

const preloadedState = window.__PRELOADED_STATE__ ?? {};
const userPrefs = localStore.getItem(STORE_USER_PREFS) ?? {};
preloadedState.app = {...(preloadedState.app || {}), ...userPrefs};


const loggedIn = auth.loggedIn();
const token = auth.getToken();
const authType = localStore.getItem(STORE_AUTHTYPE) || '';
const profile = auth.getProfile() || {};
const {chums} = profile;
const accounts = !!chums && !!chums.user ? chums.user.accounts : [];
const roles = !!chums && !!chums.user ? chums.user.roles : [];
let currentCustomer = localStore.getItem(STORE_CUSTOMER) || getFirstCustomer(accounts) || {};
if (currentCustomer.Company !== 'chums') {
    currentCustomer = {};
}
let userAccount = localStore.getItem(STORE_USER_ACCOUNT)
    || getUserAccount(accounts, currentCustomer.id || getFirstUserAccount(accounts).id || 0)
    || {};
if (userAccount.Company !== 'chums') {
    userAccount = {};
}
const recentAccounts = (localStore.getItem(STORE_RECENT_ACCOUNTS) || []).filter(acct => acct.Company === 'chums');

preloadedState.cart = {
    ...initialCartState,
}
preloadedState.messages = {
    ...initialMessagesState,
}
preloadedState.user = {
    token, profile, accounts, loggedIn, roles, userAccount, currentCustomer, recentAccounts, authType,
};

preloadedState.customer = {
    ...initialCustomerState,
}
preloadedState.products = {
    ...initialProductsState,
}
export default preloadedState;
