import {fetchDELETE, fetchGET, fetchPOST, fetchPUT} from '../../utils/fetch';
import {
    CANCEL_CREATE_ACCOUNT_USER,
    CHANGE_ACCOUNT_FIELD,
    CHANGE_ACCOUNT_USER,
    CHANGE_SHIPTO,
    CREATE_ACCOUNT_USER,
    CREATE_SHIPTO,
    FETCH_ACCOUNT_USERS,
    FETCH_CUSTOMER,
    FETCH_FAILURE,
    FETCH_INIT,
    FETCH_SUCCESS,
    SAVE_CUSTOMER,
    SELECT_ACCOUNT_USER,
    SET_CUSTOMER,
} from "../../constants/actions";
import {handleError} from "../app/actions";
import {
    buildRecentAccounts,
    isValidCustomer,
    sageCompanyCode,
    shipToAddressFromBillingAddress
} from "../../utils/customer";
import {fetchOpenOrders} from "../../actions/salesOrder";
import {
    API_PATH_ACCOUNT_USER,
    API_PATH_ACCOUNT_USERS,
    API_PATH_CUSTOMER,
    API_PATH_SAVE_ADDRESS,
    API_PATH_SAVE_SHIPTO_ADDRESS,
    API_PATH_SET_PRIMARY_SHIPTO,
} from "../../constants/paths";
import {defaultCartItem, getPrices} from "../../utils/products";
import localStore from "../../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "../../constants/stores";
import {setUserAccount} from "../user/actions";
import {loadInvoices} from "../invoices/actions";
import {selectLoggedIn, selectRecentAccounts} from "../user/selectors";
import {buildPath} from "../../utils/path-utils";
import {selectCustomerAccount, selectCustomerLoading} from "./selectors";
import {fetchCustomerAccount} from "../../api/customer";
import {selectCurrentProduct, selectProductCartItem, selectSelectedProduct} from "../products/selectors";


export const changeAccount = (props) => ({type: CHANGE_ACCOUNT_FIELD, props});
export const changeShipTo = (shipToCode, props) => ({type: CHANGE_SHIPTO, shipToCode, props});
export const createShipTo = (props) => ({type: CREATE_SHIPTO, props});

export const selectAccountUser = (id) => ({type: SELECT_ACCOUNT_USER, id});
export const changeUser = (id, props) => ({type: CHANGE_ACCOUNT_USER, id, props});
export const createUser = () => ({type: CREATE_ACCOUNT_USER});
export const cancelCreateUser = () => ({type: CANCEL_CREATE_ACCOUNT_USER});

export const saveUser = (user) => (dispatch, getState) => {
    const {customer} = getState();
    const {Company, ARDivisionNo, CustomerNo} = customer.account;
    const url = buildPath(API_PATH_ACCOUNT_USERS, {Company, ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_INIT});
    fetchPOST(url, user)
        .then(({users}) => {
            dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_SUCCESS, users});
        })
        .catch(err => {
            dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_FAILURE});
            dispatch(handleError(err, FETCH_ACCOUNT_USERS));
        })
};

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        const {customer} = getState();
        const {Company, ARDivisionNo, CustomerNo} = customer.account;
        const url = buildPath(API_PATH_ACCOUNT_USER, {Company, ARDivisionNo, CustomerNo, id: user.id});
        const {users} = await fetchPUT(url, user);
        dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_SUCCESS, users});
    } catch (err) {
        dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_FAILURE});
        dispatch(handleError(err, FETCH_ACCOUNT_USERS));
    }
}
export const deleteUser = (user) => async (dispatch, getState) => {
    try {
        const {customer} = getState();
        const {Company, ARDivisionNo, CustomerNo} = customer.account;
        const url = buildPath(API_PATH_ACCOUNT_USER, {Company, ARDivisionNo, CustomerNo, id: user.email});
        const {users} = await fetchDELETE(url);
        dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_SUCCESS, users});
    } catch (err) {
        dispatch({type: FETCH_ACCOUNT_USERS, status: FETCH_FAILURE});
        dispatch(handleError(err, FETCH_ACCOUNT_USERS));
    }
}


export const setCustomerAccount = (customer) => (dispatch, getState) => {
    const {recentAccounts} = getState().user;
    localStore.setItem(STORE_RECENT_ACCOUNTS, buildRecentAccounts(recentAccounts, customer));
    dispatch({type: SET_CUSTOMER, customer});
};

export const loadCustomerAccount = ({fetchOrders = false, force = false} = {}) =>
    async (dispatch, getState) => {
    try {
        const state = getState();
        const customerAccount = selectCustomerAccount(state);
        if (!isValidCustomer(customerAccount)) {
            return;
        }
        if (!force && selectCustomerLoading(state)) {
            return;
        }
        let cartItem = selectProductCartItem(state);
        const selectedProduct = selectSelectedProduct(state);
        const recentAccounts = selectRecentAccounts(state);
        const {Company, ARDivisionNo, CustomerNo} = customerAccount;
        dispatch({type: FETCH_CUSTOMER, status: FETCH_INIT, customer: customerAccount});
        const {contacts,
            customer,
            pricing,
            shipTo,
            users,
            paymentCards,
            promoCodes,
            permissions,
        } = await fetchCustomerAccount(customerAccount);
        const customerPrice = getPrices({product: selectedProduct, priceCodes: pricing ?? []});
        if (!!selectedProduct?.id) {
            cartItem = defaultCartItem({...selectedProduct, cartItemCode: cartItem.itemCode});
        }
        localStore.setItem(STORE_RECENT_ACCOUNTS, buildRecentAccounts(recentAccounts, customer));
        shipTo.unshift(shipToAddressFromBillingAddress(customer));
        console.log(FETCH_CUSTOMER, FETCH_SUCCESS, {Company, customer, contacts, pricing, shipTo, customerPrice, users, paymentCards,
            cartItem, promoCodes});
        dispatch({
            type: FETCH_CUSTOMER,
            status: FETCH_SUCCESS,
            Company, customer, contacts, pricing, shipTo, customerPrice, users, paymentCards,
            cartItem, promoCodes, permissions,
        });
        if (fetchOrders) {
            dispatch(fetchOpenOrders({Company, ARDivisionNo, CustomerNo}));
            dispatch(loadInvoices({Company, ARDivisionNo, CustomerNo}));
        }
    } catch(err) {
        if (err instanceof Error) {
            console.debug("loadCustomerAccount()", err.message);
            dispatch(handleError(err, FETCH_CUSTOMER));
            dispatch({type: FETCH_CUSTOMER, status: FETCH_FAILURE});
            return
        }
        console.debug("loadCustomerAccount()", err);
        dispatch(handleError(err, FETCH_CUSTOMER));
        dispatch({type: FETCH_CUSTOMER, status: FETCH_FAILURE});
    }
};


export const saveBillingAddress = (account) => (dispatch, getState) => {
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

export const saveShipToAddress = (shipToAddress) => (dispatch, getState) => {
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

export const setDefaultShipTo = (ShipToCode) => (dispatch, getState) => {
    const {customer} = getState();
    const {Company, ARDivisionNo, CustomerNo} = customer.account;
    const url = buildPath(API_PATH_SET_PRIMARY_SHIPTO, {Company})
    dispatch({type: SAVE_CUSTOMER, status: FETCH_INIT});
    fetchPOST(url, {Company, account: `${ARDivisionNo}-${CustomerNo}:${ShipToCode}`})
        .then(() => {
            dispatch(loadCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};
