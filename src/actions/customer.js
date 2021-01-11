import {buildPath, fetchGET, fetchPOST} from '../utils/fetch';
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
} from "../constants/actions";
import {handleError} from "./app";
import {
    buildRecentAccounts,
    isValidCustomer,
    sageCompanyCode,
    shipToAddressFromBillingAddress
} from "../utils/customer";
import {fetchOpenOrders} from "./salesOrder";
import {
    API_PATH_ACCOUNT_USERS,
    API_PATH_CUSTOMER,
    API_PATH_SAVE_ADDRESS,
    API_PATH_SAVE_SHIPTO_ADDRESS,
    API_PATH_SET_PRIMARY_SHIPTO,
} from "../constants/paths";
import {defaultCartItem, getPrices} from "../utils/products";
import localStore from "../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "../constants/stores";
import {setUserAccount} from "./user";
import {fetchValidPromoCodes} from "./promo_codes";
import {fetchInvoices} from "./invoices";

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


export const setCustomerAccount = (customer) => (dispatch, getState) => {
    const {recentAccounts, accounts} = getState().user;
    const [userAccount] = accounts.filter(acct => {
        return acct.Company === customer.Company
            && acct.ARDivisionNo === customer.ARDivisionNo
            && acct.CustomerNo === customer.CustomerNo
    });
    if (userAccount) {
        dispatch(setUserAccount(userAccount));
    }
    localStore.setItem(STORE_RECENT_ACCOUNTS, buildRecentAccounts(recentAccounts, customer));
    dispatch({type: SET_CUSTOMER, customer});
};

export const fetchCustomerAccount = ({fetchOrders = false, force = false} = {}) => (dispatch, getState) => {
    const {customer} = getState();

    if (!isValidCustomer(customer.account)) {
        return;
    }

    const {Company, ARDivisionNo, CustomerNo} = customer.account;
    if (customer.loading === true && !force) {
        return;
    }

    const url = buildPath(API_PATH_CUSTOMER, {Company, ARDivisionNo, CustomerNo});
    dispatch({type: FETCH_CUSTOMER, status: FETCH_INIT, customer: {Company, ARDivisionNo, CustomerNo}});
    fetchGET(url, {cache: 'no-cache'})
        .then(res => {
            const {contacts, customer, pricing, shipTo, users, paymentCards} = res.result;
            const {products} = getState();
            let cartItem = products.cartItem;
            const customerPrice = getPrices({product: products.selectedProduct, priceCodes: pricing});
            if (!!products.selectedProduct.id) {
                cartItem = defaultCartItem({...products.selectedProduct, cartItemCode: products.cartItem.itemCode});
            }
            const {recentAccounts} = getState().user;
            localStore.setItem(STORE_RECENT_ACCOUNTS, buildRecentAccounts(recentAccounts, customer));
            shipTo.unshift(shipToAddressFromBillingAddress(customer));
            dispatch({
                type: FETCH_CUSTOMER,
                status: FETCH_SUCCESS,
                Company, customer, contacts, pricing, shipTo, customerPrice, users, paymentCards,
                cartItem,
            });
            if (fetchOrders) {
                dispatch(fetchOpenOrders({Company, ARDivisionNo, CustomerNo}));
                dispatch(fetchInvoices({Company, ARDivisionNo, CustomerNo}));
            }
            dispatch(fetchValidPromoCodes());
        })
        .catch(err => {
            dispatch(handleError(err, FETCH_CUSTOMER));
            dispatch({type: FETCH_CUSTOMER, status: FETCH_FAILURE});
        });
};


export const saveBillingAddress = () => (dispatch, getState) => {
    const {customer} = getState();
    const {account, company: Company} = customer;
    const {
        ARDivisionNo, CustomerNo, CustomerName, AddressLine1, AddressLine2, AddressLine3,
        City, State, ZipCode, CountryCode, EmailAddress, Reseller, TelephoneNo, TelephoneExt
    } = account;
    const url = buildPath(API_PATH_SAVE_ADDRESS, {Company: sageCompanyCode(Company), ARDivisionNo, CustomerNo});
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
            dispatch(fetchCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};

export const saveShipToAddress = (shipToCode) => (dispatch, getState) => {
    const {customer} = getState();
    const {Company} = customer.account;
    const [{
        ARDivisionNo, CustomerNo, ShipToCode, ShipToName, ShipToAddress1, ShipToAddress2 = '', ShipToAddress3 = '',
        ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode, TelephoneNo, TelephoneExt = '', EmailAddress,
        ContactCode = '', Reseller = 'N',
    }] = customer.shipToAddresses.filter(st => st.ShipToCode === shipToCode);
    if (!ShipToCode) {
        return;
    }
    const url = buildPath(API_PATH_SAVE_SHIPTO_ADDRESS, {Company, ARDivisionNo, CustomerNo, ShipToCode});
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
            dispatch(fetchCustomerAccount({force: true}));
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
            dispatch(fetchCustomerAccount({force: true}));
        })
        .catch(err => {
            dispatch(handleError(err, SAVE_CUSTOMER));
        });
};
