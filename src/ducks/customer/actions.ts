import {fetchPOST} from '../../utils/fetch';
import {
    CHANGE_SHIPTO,
    FETCH_CUSTOMER,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SAVE_CUSTOMER,
} from "../../constants/actions";
import {handleError} from "../app/actions";
import {
    buildRecentAccounts,
    isValidCustomer,
    sageCompanyCode,
    shipToAddressFromBillingAddress
} from "../../utils/customer";
import {fetchOpenOrders} from "../../actions/salesOrder";
import {API_PATH_SAVE_ADDRESS, API_PATH_SAVE_SHIPTO_ADDRESS, API_PATH_SET_PRIMARY_SHIPTO,} from "../../constants/paths";
import {defaultCartItem, getPrices} from "../../utils/products";
import localStore from "../../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "../../constants/stores";
import {loadInvoices} from "../invoices/actions";
import {selectLoggedIn, selectRecentAccounts} from "../user/selectors";
import {buildPath} from "../../utils/path-utils";
import {selectCustomerAccount, selectCustomerLoading} from "./selectors";
import {
    deleteCustomerUser,
    fetchCustomerAccount,
    postBillingAddress,
    postCustomerUser, postDefaultShipToCode,
    postShipToAddress
} from "../../api/customer";
import {selectProductCartItem, selectSelectedProduct} from "../products/selectors";
import {BasicCustomer, BillToCustomer, CustomerKey, CustomerUser, RecentCustomer, ShipToCustomer} from "b2b-types";
import {AppDispatch, RootState} from "../../app/configureStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {buildRecentCustomers, isCustomer, shortCustomerKey} from "./utils";
import {isCartProduct, isProduct} from "../products/utils";


export const changeShipTo = (shipToCode: string, props: Partial<ShipToCustomer>) => ({
    type: CHANGE_SHIPTO,
    shipToCode,
    props
});

export const saveUser = createAsyncThunk<CustomerUser[], CustomerUser>(
    'customer/saveUser',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state) as CustomerKey;
        return await postCustomerUser(arg, customer);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCustomerLoading(state) && isCustomer(selectCustomerAccount(state));
        }
    }
)

export const removeUser = createAsyncThunk<CustomerUser[], CustomerUser>(
    'customer/removeUser',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state) as CustomerKey;
        return await deleteCustomerUser(arg, customer);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return !selectCustomerLoading(state) && isCustomer(selectCustomerAccount(state));
        }
    }
)

export const setCustomerAccount = createAsyncThunk<{
    customer: BasicCustomer,
    recent: RecentCustomer[]
}, BasicCustomer>(
    'customer/setCurrentCustomer',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const recentAccounts = buildRecentCustomers(selectRecentAccounts(state), arg);
        localStore.setItem(STORE_RECENT_ACCOUNTS, recentAccounts);
        return {customer: arg, recent: recentAccounts};
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCustomerAccount(state);
            return !isCustomer(customer) || shortCustomerKey(customer) !== shortCustomerKey(arg);
        }
    })

export const loadCustomerAccount = ({fetchOrders = false, force = false}:{
    fetchOrders?: boolean;
    force?: boolean;
} = {}) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const customerAccount = selectCustomerAccount(state);
            if (!isCustomer(customerAccount) || !isValidCustomer(customerAccount)) {
                return;
            }
            if (!force && selectCustomerLoading(state)) {
                return;
            }
            let cartItem = selectProductCartItem(state);
            const selectedProduct = selectSelectedProduct(state);
            const recentAccounts = selectRecentAccounts(state);
            const {ARDivisionNo, CustomerNo} = customerAccount;
            dispatch({type: FETCH_CUSTOMER, status: FETCH_INIT, customer: customerAccount});
            const {
                contacts,
                customer,
                pricing,
                shipTo,
                users,
                paymentCards,
                promoCodes,
                permissions,
            } = await fetchCustomerAccount(customerAccount);
            const customerPrice = isProduct(selectedProduct)
                ? getPrices({product: selectedProduct, priceCodes: pricing ?? []})
                : [];
            if (isProduct(selectedProduct) && isCartProduct(cartItem)) {
                cartItem = defaultCartItem(selectedProduct, undefined, cartItem.itemCode);
            }
            localStore.setItem(STORE_RECENT_ACCOUNTS, buildRecentAccounts(recentAccounts, customer));
            shipTo.unshift(shipToAddressFromBillingAddress(customer));
            console.log(FETCH_CUSTOMER, FETCH_SUCCESS, {
                customer, contacts, pricing, shipTo, customerPrice, users, paymentCards,
                cartItem, promoCodes
            });
            dispatch({
                type: FETCH_CUSTOMER,
                status: FETCH_SUCCESS,
                customer, contacts, pricing, shipTo, customerPrice, users, paymentCards,
                cartItem, promoCodes, permissions,
            });
            if (fetchOrders) {
                dispatch(fetchOpenOrders({ARDivisionNo, CustomerNo}));
                dispatch(loadInvoices({ARDivisionNo, CustomerNo}));
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                console.debug("loadCustomerAccount()", err.message);
                dispatch(handleError(err, FETCH_CUSTOMER));
                dispatch({type: FETCH_CUSTOMER, status: FETCH_FAILURE});
                return
            }
            console.debug("loadCustomerAccount()", err);
            dispatch(handleError(new Error('Unknown error in loadCustomerAccount'), FETCH_CUSTOMER));
            dispatch({type: FETCH_CUSTOMER, status: FETCH_FAILURE});
        }
    };

export const saveBillingAddress = createAsyncThunk<void, BillToCustomer>(
    'customer/saveBillingAddress',
    async (arg, {dispatch}) => {
        await postBillingAddress(arg);
        (dispatch as AppDispatch)(loadCustomerAccount({force: true}));
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !selectCustomerLoading(state);
        }
    }
)

export const _saveBillingAddress = (account: BillToCustomer) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (!selectLoggedIn(state)) {
        return;
    }
    const {
        ARDivisionNo, CustomerNo, CustomerName, AddressLine1, AddressLine2, AddressLine3,
        City, State, ZipCode, CountryCode, EmailAddress, Reseller, TelephoneNo, TelephoneExt
    } = account;
    const url = buildPath(API_PATH_SAVE_ADDRESS, {Company: sageCompanyCode('CHI'), ARDivisionNo, CustomerNo});
    const data = {
        Name: CustomerName,
        AddressLine1,
        AddressLine2,
        AddressLine3,
        City,
        State,
        ZipCode,
        CountryCode,
        EmailAddress,
        Reseller,
        TelephoneNo,
        TelephoneExt
    };
    dispatch({type: SAVE_CUSTOMER, status: FETCH_INIT});
    fetchPOST(url, data)
        .then(() => {
            dispatch(loadCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};

export const saveShipToAddress = createAsyncThunk<void, ShipToCustomer>(
    'customer/saveShipToAddress',
    async (arg, {dispatch}) => {
        await postShipToAddress(arg);
        (dispatch as AppDispatch)(loadCustomerAccount({force: true}));
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !selectCustomerLoading(state) && !!arg.ShipToCode && arg.ShipToCode.length <= 4;
        }
    }
)

export const _saveShipToAddress = (shipToAddress: ShipToCustomer) => (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (!selectLoggedIn(state) || !shipToAddress.ShipToCode) {
        return;
    }
    const {
        ARDivisionNo, CustomerNo, ShipToCode, ShipToName, ShipToAddress1, ShipToAddress2 = '', ShipToAddress3 = '',
        ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode, TelephoneNo, TelephoneExt = '', EmailAddress,
        ContactCode = '', Reseller = 'N',
    } = shipToAddress;
    const url = buildPath(API_PATH_SAVE_SHIPTO_ADDRESS, {Company: 'CHI', ARDivisionNo, CustomerNo, ShipToCode});
    const data = {
        Name: ShipToName,
        AddressLine1: ShipToAddress1,
        AddressLine2: ShipToAddress2,
        AddressLine3: ShipToAddress3,
        City: ShipToCity,
        State: ShipToState,
        ZipCode: ShipToZipCode,
        CountryCode: ShipToCountryCode,
        EmailAddress,
        TelephoneNo,
        TelephoneExt,
        Reseller,
        ContactCode,
    };
    dispatch({type: SAVE_CUSTOMER, status: FETCH_INIT});
    fetchPOST(url, data)
        .then(() => {
            dispatch(loadCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};

export const setDefaultShipTo = createAsyncThunk<void, string>(
    'customer/setDefaultShipTo',
    async (arg, {dispatch, getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state) as CustomerKey;
        await postDefaultShipToCode(arg, customer);
        (dispatch as AppDispatch)(loadCustomerAccount({force: true}));
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !selectCustomerLoading(state);
        }
    }
)

export const _setDefaultShipTo = (ShipToCode: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const {customer} = getState();
    const state = getState();
    const customerAccount = selectCustomerAccount(state);
    if (!isCustomer(customerAccount)) {
        return;
    }
    const {ARDivisionNo, CustomerNo} = customerAccount;
    const url = buildPath(API_PATH_SET_PRIMARY_SHIPTO, {Company: 'chums'})
    dispatch({type: SAVE_CUSTOMER, status: FETCH_INIT});
    fetchPOST(url, {Company: 'chums', account: `${ARDivisionNo}-${CustomerNo}:${ShipToCode}`})
        .then(() => {
            dispatch(loadCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};
