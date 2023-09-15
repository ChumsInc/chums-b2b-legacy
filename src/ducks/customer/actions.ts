import {buildRecentCustomers, customerSlug} from "@/utils/customer";
import localStore from "../../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "@/constants/stores";
import {selectLoggedIn} from "../user/selectors";
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
import {BasicCustomer, BillToCustomer, CustomerKey, CustomerUser, RecentCustomer, ShipToCustomer} from "b2b-types";
import {AppDispatch, RootState} from "@/app/configureStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {FetchCustomerResponse} from "@/ducks/customer/types";
import {loadOrders} from "@/ducks/open-orders/actions";
import {CustomerPermissions} from "@/types/customer";
import {selectRecentCustomers} from "@/ducks/customers/selectors";

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
    'customer/setCurrent',
    async (arg, {getState}) => {
        const state = getState() as RootState;
        const recentAccounts = buildRecentCustomers(selectRecentCustomers(state), arg);
        localStore.setItem(STORE_RECENT_ACCOUNTS, recentAccounts);
        return {customer: arg, recent: recentAccounts};
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            const customer = selectCustomerAccount(state);
            return selectLoggedIn(state) && (!customer || customerSlug(customer) !== customerSlug(arg));
        }
    })

export const loadCustomer = createAsyncThunk<FetchCustomerResponse | null, CustomerKey | null>(
    'customer/load',
    async (arg, {dispatch, getState}) => {
        try {
            const response = await fetchCustomerAccount(arg!);
            dispatch(loadOrders(response.customer));
            const state = getState() as RootState;
            response.recent = buildRecentCustomers(selectRecentCustomers(state), response.customer);
            localStore.setItem(STORE_RECENT_ACCOUNTS, response.recent);
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


export const saveBillingAddress = createAsyncThunk<FetchCustomerResponse | null, BillToCustomer>(
    'customer/saveBillingAddress',
    async (arg) => {
        return await postBillingAddress(arg);
    }, {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !selectCustomerLoading(state);
        }
    }
)


export const saveShipToAddress = createAsyncThunk<FetchCustomerResponse | null, ShipToCustomer>(
    'customer/saveShipToAddress',
    async (arg, {dispatch}) => {
        return await postShipToAddress(arg);
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && !!arg.ShipToCode && arg.ShipToCode.length <= 4
                && !selectCustomerLoading(state)
                ;
        }
    }
)

export const setDefaultShipTo = createAsyncThunk<void, string>(
    'customer/setDefaultShipTo',
    async (arg, {dispatch, getState}) => {
        const state = getState() as RootState;
        const customer = selectCustomerAccount(state) as CustomerKey;
        await postDefaultShipToCode(arg, customer);
        (dispatch as AppDispatch)(loadCustomer(customer));
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state) && !selectCustomerLoading(state);
        }
    }
)

export const loadCustomerPermissions = createAsyncThunk<CustomerPermissions | null, CustomerKey | null>(
    'customer/values/load',
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
// 87854183, 33888484, 55278385, 34156973, 81845234, 91405994, 57420316, 88428715, 02540498, 02837252

// bS*RYjRHq&=54mT&

// q2^yoFcViKc!@epg8*
