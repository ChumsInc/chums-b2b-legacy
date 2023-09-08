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
    SET_LOGGED_IN
} from "@/constants/actions";
import {
    companyCode,
    customerContactSorter,
    customerPaymentCardSorter,
    customerPriceRecordSorter,
    customerShipToSorter,
    customerSlug,
    customerUserSorter, defaultShipToSort,
    emptyCustomer
} from "@/utils/customer";
import localStore from "../../utils/LocalStore";
import {STORE_CUSTOMER} from "@/constants/stores";
import {createReducer} from "@reduxjs/toolkit";
import {
    BillToCustomer,
    CustomerContact,
    CustomerPaymentCard,
    CustomerPriceRecord,
    CustomerUser,
    Editable,
    ShipToCustomer
} from "b2b-types";
import {
    loadCustomer,
    loadCustomerPermissions,
    removeUser,
    saveBillingAddress,
    saveShipToAddress,
    saveUser,
    setCustomerAccount,
    setDefaultShipTo
} from "./actions";
import {setLoggedIn, setUserAccess} from "../user/actions";
import {LoadStatus, Selectable} from "@/types/generic";
import {CustomerPermissions} from "@/types/customer";
import {dismissAlert, dismissContextAlert} from "@/ducks/alerts";

export interface CustomerPermissionsState {
    values: CustomerPermissions | null;
    loading: boolean;
    loaded: boolean;
}


export interface CustomerState {
    company: string;
    key: string | null;
    account: (BillToCustomer & Editable) | null;
    shipToCode: string|null;
    shipTo: ShipToCustomer|null;
    contacts: CustomerContact[];
    pricing: CustomerPriceRecord[];
    shipToAddresses: (ShipToCustomer & Editable)[];
    paymentCards: CustomerPaymentCard[];
    permissions: CustomerPermissionsState;
    loadStatus: LoadStatus;
    loading: boolean;
    saving: boolean;
    loaded: boolean;
    users: (CustomerUser & Selectable & Editable)[];
}

export const initialCustomerState = (): CustomerState => ({
    company: 'chums',
    key: null,
    account: localStore.getItem<BillToCustomer | null>(STORE_CUSTOMER, null) ?? null,
    shipToCode: null,
    shipTo: null,
    contacts: [],
    pricing: [],
    shipToAddresses: [],
    paymentCards: [],
    permissions: {
        values: null,
        loading: false,
        loaded: false,
    },
    loadStatus: 'idle',
    loading: false,
    loaded: false,
    saving: false,
    users: [],
});

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
            if (!!state.account && (
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
                state.loaded = false;
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
        .addCase(loadCustomer.pending, (state, action) => {
            state.loadStatus = 'pending';
            if (state.key !== customerSlug(action.meta.arg)) {
                state.account = null;
                state.shipToCode = null;
                state.contacts = [];
                state.pricing = [];
                state.shipToAddresses = [];
                state.paymentCards = [];
                state.users = [];
                state.permissions.values = null;
                state.loaded = false;
            }
            state.key = customerSlug(action.meta.arg);
            state.loading = true;
        })
        .addCase(loadCustomer.fulfilled, (state, action) => {
            state.loadStatus = 'idle';
            state.loading = false;
            state.account = action.payload?.customer ?? null;
            state.shipToCode = action.payload?.customer?.PrimaryShipToCode ?? null;
            state.permissions.values = action.payload?.permissions ?? null;
            state.contacts = [...(action.payload?.contacts ?? [])].sort(customerContactSorter);
            state.pricing = [...(action.payload?.pricing ?? [])].sort(customerPriceRecordSorter);
            state.shipToAddresses = [...(action.payload?.shipTo ?? [])].sort(customerShipToSorter(defaultShipToSort));
            if (!!state.shipToCode && !state.shipToAddresses.filter(st => st.ShipToCode === state.shipToCode).length) {
                state.shipToCode = null;
            }
            if (state.shipToCode && !state.permissions.values?.billTo && !state.permissions.values?.shipTo.includes(state.shipToCode)) {
                state.shipToCode = null;
            }
            if (!state.shipToCode) {
                if (state.permissions.values?.billTo) {
                    state.shipToCode = '';
                    state.shipTo = null;
                } else if (state.permissions.values?.shipTo.length) {
                    const [shipTo] = state.shipToAddresses.filter(st => st.ShipToCode === state.permissions.values?.shipTo[0])
                    state.shipToCode = shipTo?.ShipToCode ?? null;
                    state.shipTo = shipTo ?? null;
                }
            } else  {
                const [shipTo] = state.shipToAddresses.filter(st => st.ShipToCode === state.shipToCode)
                state.shipToCode = shipTo?.ShipToCode ?? null;
                state.shipTo = shipTo ?? null;
            }
            state.paymentCards = [...(action.payload?.paymentCards ?? [])].sort(customerPaymentCardSorter);
            state.users = [...(action.payload?.users ?? [])].sort(customerUserSorter);
            state.loaded = true;
        })
        .addCase(loadCustomer.rejected, (state) => {
            state.loadStatus = 'rejected';
            state.loading = false;
        })
        .addCase(dismissContextAlert, (state, action) => {
            if (action.payload === loadCustomer.typePrefix) {
                state.loadStatus = 'idle';
            }
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (!action.meta.arg?.isRepAccount && customerSlug(state.account) !== customerSlug(action.meta.arg)) {
                state.account = null;
                state.contacts = [];
                state.pricing = [];
                state.shipToAddresses = [];
                state.paymentCards = [];
                state.users = [];
                state.permissions.values = null;
                state.loaded = true;
            }
        })
        .addCase(loadCustomerPermissions.pending, (state, action) => {
            state.permissions.loading = true;
            const key = customerSlug(action.meta.arg)
            if (key !== state.key) {
                state.permissions.loaded = false;
                state.permissions.values = null;

            }
        })
        .addCase(loadCustomerPermissions.fulfilled, (state, action) => {
            state.permissions.loading = false;
            state.permissions.loaded = true;
            state.permissions.values = action.payload ?? null;
        })
        .addCase(loadCustomerPermissions.rejected, (state) => {
            state.permissions.loading = false;
        })

        .addDefaultCase((state, action) => {
            switch (action.type) {
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
                        state.shipToAddresses = [...action.shipTo].sort(customerShipToSorter(defaultShipToSort));
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
                    ].sort(customerShipToSorter(defaultShipToSort));
                    return;
                case CREATE_SHIPTO:
                    state.shipToAddresses = [
                        ...state.shipToAddresses,
                        {...action.props, changed: true}
                    ].sort(customerShipToSorter(defaultShipToSort));
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
