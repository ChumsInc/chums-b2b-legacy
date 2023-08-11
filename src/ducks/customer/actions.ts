import {CHANGE_SHIPTO, FETCH_CUSTOMER, FETCH_FAILURE, FETCH_INIT, FETCH_SUCCESS,} from "@/constants/actions";
import {handleError} from "../app/actions";
import {buildRecentAccounts, isValidCustomer, shipToAddressFromBillingAddress} from "@/utils/customer";
import {fetchOpenOrders} from "../../actions/salesOrder";
import {defaultCartItem, getPrices} from "@/utils/products";
import localStore from "../../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "@/constants/stores";
import {loadInvoices} from "../invoices/actions";
import {selectLoggedIn, selectRecentAccounts} from "../user/selectors";
import {
    selectCustomerAccount,
    selectCustomerLoading,
    selectCustomerPermissionsLoading,
    selectCustomerSaving
} from "./selectors";
import {
    deleteCustomerUser,
    fetchCustomerAccount,
    fetchCustomerValidation,
    postBillingAddress,
    postCustomerUser,
    postDefaultShipToCode,
    postShipToAddress
} from "@/api/customer";
import {selectProductCartItem, selectSelectedProduct} from "../products/selectors";
import {BasicCustomer, BillToCustomer, CustomerKey, CustomerUser, RecentCustomer, ShipToCustomer} from "b2b-types";
import {AppDispatch, RootState} from "@/app/configureStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {buildRecentCustomers, customerSlug} from "@/utils/customer";
import {isCartProduct, isProduct} from "../products/utils";
import {FetchCustomerResponse} from "@/ducks/customer/types";
import {loadOrders} from "@/ducks/open-orders/actions";
import {CustomerPermissions} from "@/types/customer";


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
            return selectLoggedIn(state) && !selectCustomerLoading(state) && !!selectCustomerAccount(state);
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
            return selectLoggedIn(state) && !selectCustomerLoading(state) && !!selectCustomerAccount(state);
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
            return selectLoggedIn(state) && (!customer || customerSlug(customer) !== customerSlug(arg));
        }
    })

export const loadCustomer = createAsyncThunk<FetchCustomerResponse | null, CustomerKey|null>(
    'customers/selected/load',
    async (arg, {dispatch, getState}) => {
        try {
            const response = await fetchCustomerAccount(arg!);
            if (response?.customer) {
                dispatch(loadOrders(response.customer));
            }
            return response;
        } catch (err: unknown) {
            if (err instanceof Error) {
                return Promise.reject(err);
            }
            return Promise.reject(new Error('Error in loadCustomer()'));
        }
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !!arg && !(selectCustomerLoading(state) || selectCustomerSaving(state));
        }
    }
)

export const loadCustomerAccount = ({fetchOrders = false, force = false}: {
    fetchOrders?: boolean;
    force?: boolean;
} = {}) =>
    async (dispatch: AppDispatch, getState: () => RootState) => {
        try {
            const state = getState();
            const customerAccount = selectCustomerAccount(state);
            if (!customerAccount || !isValidCustomer(customerAccount)) {
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
                ? getPrices(selectedProduct, pricing ?? [])
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

export const loadCustomerPermissions = createAsyncThunk<CustomerPermissions | null, CustomerKey | null>(
    'customer/permissions/load',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        return await fetchCustomerValidation(arg!);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !!arg && !selectCustomerPermissionsLoading(state) && !!selectCustomerAccount(state);
        }
    }
)
