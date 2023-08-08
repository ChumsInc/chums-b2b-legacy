import {
    CANCEL_CREATE_ACCOUNT_USER,
    CHANGE_ACCOUNT_FIELD,
    CHANGE_ACCOUNT_USER,
    CHANGE_SHIPTO,
    CREATE_SHIPTO,
    FETCH_ACCOUNT_USERS,
    FETCH_CUSTOMER,
    FETCH_CUSTOMER_FAILURE,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SELECT_ACCOUNT_USER,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT
} from "../../constants/actions";
import {companyCode} from "../../utils/customer";
import localStore from "../../utils/LocalStore";
import {STORE_CUSTOMER} from "../../constants/stores";
import {createReducer} from "@reduxjs/toolkit";
import {
    customerContactSorter,
    customerPaymentCardSorter,
    customerPriceRecordSorter,
    customerShipToSorter,
    customerUserSorter, emptyCustomer,
    isCustomer
} from "./utils";
import {CustomerState} from "./types";
import {EmptyObject} from "../../_types";
import {BillToCustomer} from "b2b-types";
import {
    removeUser,
    saveBillingAddress,
    saveShipToAddress,
    saveUser,
    setCustomerAccount,
    setDefaultShipTo
} from "./actions";
import {setLoggedIn} from "../user/actions";

export const initialCustomerState = (): CustomerState => ({
    company: 'chums',
    key: null,
    account: localStore.getItem<BillToCustomer | null>(STORE_CUSTOMER, null) ?? null,
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
        .addCase(saveUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(saveUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = [...action.payload].sort(customerUserSorter);
        })
        .addCase(saveUser.rejected, (state) => {
            state.loading = false;
        })
        .addCase(removeUser.pending, (state) => {
            state.loading = true;
        })
        .addCase(removeUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users = [...action.payload].sort(customerUserSorter);
        })
        .addCase(removeUser.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setCustomerAccount.fulfilled, (state, action) => {
            state.company = companyCode('chums');
            if (isCustomer(state.account) && (
                state.account.ARDivisionNo !== action.payload.customer.ARDivisionNo
                || state.account.CustomerNo !== action.payload.customer.CustomerNo
                || (state.account.ShipToCode ?? '') !== (action.payload.customer.ShipToCode ?? '')
            )) {
                state.contacts = [];
                state.pricing = [];
                state.shipToAddresses = [];
                state.paymentCards = [];
                state.users = [];
            }
            state.account = {...emptyCustomer, ...action.payload.customer};
        })
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload.loggedIn) {
                state.account = null;
                state.contacts = [];
                state.pricing = [];
                state.shipToAddresses = [];
                state.paymentCards = [];
                state.users = [];
            }
        })
        .addCase(saveBillingAddress.pending, (state) => {
            state.loading = true;
        })
        .addCase(saveBillingAddress.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(saveBillingAddress.rejected, (state) => {
            state.loading = false;
        })
        .addCase(saveShipToAddress.pending, (state) => {
            state.loading = true;
        })
        .addCase(saveShipToAddress.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(saveShipToAddress.rejected, (state) => {
            state.loading = false;
        })
        .addCase(setDefaultShipTo.pending, (state) => {
            state.loading = true;
        })
        .addCase(setDefaultShipTo.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(setDefaultShipTo.rejected, (state) => {
            state.loading = false;
        })
        .addDefaultCase((state, action) => {
            switch (action.type) {
                case SET_USER_ACCOUNT:
                    state.company = companyCode(action.userAccount?.Company ?? 'chums');
                    state.account = null;
                    return;
                case FETCH_CUSTOMER:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_INIT) {
                        state.company = companyCode(action.customer?.Company ?? 'chums');
                        state.account = {...state.account, ...action.customer};
                        state.users = [];
                    }
                    if (action.status === FETCH_SUCCESS) {
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
                case SET_LOGGED_IN:
                    if (action.loggedIn === false) {
                        state.account = null;
                        state.contacts = [];
                        state.pricing = [];
                        state.shipToAddresses = [];
                        state.paymentCards = [];
                        state.users = [];
                    }
                    return;
                case FETCH_CUSTOMER_FAILURE:
                    state.account = null;
                    return;
                case CHANGE_ACCOUNT_FIELD:
                    state.account = {...state.account, ...action.props, changed: true};
                    return;
                case CHANGE_SHIPTO:
                    state.shipToAddresses = [
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
                case FETCH_ACCOUNT_USERS:
                    state.loading = action.status === FETCH_INIT;
                    if (action.status === FETCH_SUCCESS) {
                        state.users = [...action.users].sort(customerUserSorter);
                    }
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
