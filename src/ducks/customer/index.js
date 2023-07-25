import {combineReducers} from 'redux';
import {
    CANCEL_CREATE_ACCOUNT_USER,
    CHANGE_ACCOUNT_FIELD,
    CHANGE_ACCOUNT_USER,
    CHANGE_SHIPTO,
    CREATE_ACCOUNT_USER,
    CREATE_SHIPTO,
    FETCH_ACCOUNT_USERS,
    FETCH_CUSTOMER,
    FETCH_CUSTOMER_FAILURE,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SAVE_CUSTOMER,
    SELECT_ACCOUNT_USER,
    SET_CUSTOMER,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT
} from "../../constants/actions";
import {DEFAULT_COMPANY} from "../../constants/defaults";
import {companyCode} from "../../utils/customer";
import localStore from "../../utils/LocalStore";
import {STORE_CURRENT_CART, STORE_CUSTOMER} from "../../constants/stores";
import {auth} from "../../api/IntranetAuthService";
import {createReducer} from "@reduxjs/toolkit";
import {
    customerContactSorter,
    customerPaymentCardSorter,
    customerPriceRecordSorter,
    customerShipToSorter, customerUserSorter
} from "./utils";

const isLoggedIn = auth.loggedIn();

const defaults = {
    currentCart: '',
    customer: {}
};


if (isLoggedIn) {
    defaults.currentCart = localStore.getItem(STORE_CURRENT_CART) || '';
    defaults.customer = localStore.getItem(STORE_CUSTOMER) || defaults.customer;
}

/**
 *
 * @return {CustomerState}
 */
export const initialCustomerState = () => ({
    company: 'chums',
    key: null,
    account: localStore.getItem(STORE_CUSTOMER, {}),
    contacts: [],
    pricing: [],
    shipToAddresses: [],
    paymentCards: [],
    loading: false,
    loaded: false,
    users: [],
})

const customerReducer = createReducer(initialCustomerState, builder => {
    builder
        .addDefaultCase((state, action) => {
            switch(action.type) {
                case SET_USER_ACCOUNT:
                    state.company = companyCode(action.userAccount?.Company ?? 'chums');
                    state.account = {};
                    return;
                case FETCH_CUSTOMER:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_INIT) {
                        state.company = companyCode(action.customer?.Company ?? 'chums');
                        state.account = {...state.account, ...action.customer};
                        state.users = [];
                    }
                    if (action.status ===  FETCH_SUCCESS) {
                        state.account = action.customer;
                        state.contacts = [...action.contacts].sort(customerContactSorter);
                        state.pricing = [...action.pricing].sort(customerPriceRecordSorter);
                        state.shipToAddresses = [...action.shipTo].sort(customerShipToSorter);
                        state.paymentCards = [...action.paymentCards].sort(customerPaymentCardSorter);
                        state.users = [...action.users].sort(customerUserSorter);
                    }
                    if (action.status === FETCH_FAILURE) {
                        state.contacts = [];
                        state.pricing = [];
                        state.shipToAddresses = [];
                        state.paymentCards = [];
                        state.users = [];
                    }
                    return;
                case SET_CUSTOMER:
                    state.company = companyCode(action.customer?.Company ?? 'chums');
                    state.account = action.customer;
                    if (state.account.ARDivisionNo !== action.customer.ARDivisionNo
                        || state.account.CustomerNo !== action.customer.CustomerNo
                        || (state.account.ShipToCode ?? '') !== (action.customer.ShipToCode ?? '')
                    ) {
                        state.contacts = [];
                        state.pricing = [];
                        state.shipToAddresses = [];
                        state.paymentCards = [];
                        state.users = [];
                    }
                    return;
                case SET_LOGGED_IN:
                    if (action.loggedIn === false) {
                        state.account = {};
                        state.contacts = [];
                        state.pricing = [];
                        state.shipToAddresses = [];
                        state.paymentCards = [];
                        state.users = [];
                    }
                    return;
                case FETCH_CUSTOMER_FAILURE:
                    state.account = {};
                    return;
                case CHANGE_ACCOUNT_FIELD:
                    state.account = {...state.account, ...action.props, changed: true};
                    return;
                case CHANGE_SHIPTO:
                    state.shipToAddress = [
                        ...state.shipToAddresses.filter(st => st.ShipToCode !== action.shipToCode),
                        ...state.shipToAddresses.filter(st => st.ShipToCode === action.shipToCode)
                            .map(st => ({...st, ...action.props, changed: true})),
                    ].sort(customerShipToSorter);
                    return;
                case CREATE_SHIPTO:
                    state.shipToAddresses = [
                        ...state.shipToAddresses,
                        {...action.props, changed: true}
                    ].sort(customerShipToSorter);
                    return;
                case SAVE_CUSTOMER:
                    state.loading = action.status === FETCH_INIT;
                    return;
                case FETCH_ACCOUNT_USERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.users = [...action.users].sort(customerUserSorter);
                    }
                    return;
                case CREATE_ACCOUNT_USER:
                    state.users = [
                        ...state.users.filter(u => u.id !== 0).map(({selected, ...user}) => user),
                        {id: 0, name: '', email: '', accountType: 4, selected: true}
                    ].sort(customerUserSorter);
                    return;
                case CANCEL_CREATE_ACCOUNT_USER:
                    state.users = state.users.filter(u => u.id !== 0)
                        .map(({selected, ...user}) => user)
                        .sort(customerUserSorter);
                    return;
                case CHANGE_ACCOUNT_USER:
                    state.users = [
                        ...state.users.filter(user => user.id !== action.id),
                        ...state.users.filter(user => user.id === action.id)
                            .map(u => ({...u, ...action.props, changed: true}))
                    ].sort(customerUserSorter);
                    return;
                case SELECT_ACCOUNT_USER:
                    state.users = [
                        ...state.users.filter(u => u.id !== action.id).map(({selected, ...user}) => user),
                        ...state.users.filter(u => u.id === action.id).map(user => ({...user, selected: true})),
                    ].sort(customerUserSorter);

            }
        })
})

export default customerReducer;
