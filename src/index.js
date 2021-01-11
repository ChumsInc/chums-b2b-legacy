import React from 'react';
import { hydrate } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import {BrowserRouter, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import App from "./components/App";
import {auth} from "./utils/IntranetAuthService";
import localStore from "./utils/LocalStore";
import {
    STORE_AUTHTYPE,
    STORE_CUSTOMER,
    STORE_RECENT_ACCOUNTS,
    STORE_USER_ACCOUNT,
    STORE_USER_PREFS
} from "./constants/stores";
import {getFirstCustomer, getFirstUserAccount, getUserAccount} from "./utils/customer";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const preloadedState = window.__PRELOADED_STATE__;
// delete window.__PRELOADED_STATE__;

const userPrefs = localStore.getItem(STORE_USER_PREFS) || {};
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

preloadedState.user = {
    token, profile, accounts, loggedIn, roles, userAccount, currentCustomer, recentAccounts, authType,
};

preloadedState.customer = {

}

const store = createStore(reducer, preloadedState, composeEnhancers(applyMiddleware(thunk)));

hydrate(
    <Provider store={store}>
        <BrowserRouter >
            <Route component={App} />
        </BrowserRouter>
    </Provider>,
    document.getElementById('app')
);
