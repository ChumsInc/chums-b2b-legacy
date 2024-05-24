import {Customer, RecentCustomer} from "b2b-types";
import {PreloadedState} from "../../types/preload";
import {createReducer} from "@reduxjs/toolkit";
import {setLoggedIn, setUserAccess} from "../user/actions";

import {customerListSorter} from "../../utils/customer";
import {SortProps} from "../../types/generic";
import {loadCustomerList, setCustomersFilter, setCustomersRepFilter, setCustomersSort} from "./actions";
import {auth} from "../../api/IntranetAuthService";
import localStore from "../../utils/LocalStore";
import {STORE_RECENT_ACCOUNTS} from "../../constants/stores";
import {loadCustomer, setCustomerAccount} from "../customer/actions";

export interface CustomersState {
    key: number | null;
    list: Customer[];
    loading: boolean;
    loaded: boolean;
    filter: string;
    repFilter: string;
    sort: SortProps<Customer>;
    recent: RecentCustomer[];
}

export const initialUserState = (): CustomersState => {
    const isLoggedIn = auth.loggedIn();
    const recentCustomers = isLoggedIn
        ? localStore.getItem<RecentCustomer[]>(STORE_RECENT_ACCOUNTS, [])
        : [];

    return {
        key: null,
        list: [],
        loading: false,
        loaded: false,
        filter: '',
        repFilter: '',
        sort: {field: 'CustomerName', ascending: true},
        recent: recentCustomers,
    }
}

export const customersReducer = createReducer(initialUserState, builder => {
    builder
        .addCase(setLoggedIn, (state, action) => {
            if (!action.payload?.loggedIn) {
                state.list = [];
                state.recent = [];
            }
        })
        .addCase(loadCustomerList.pending, (state) => {
            state.loading = true;
        })
        .addCase(loadCustomerList.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.list = action.payload.sort(customerListSorter({field: 'CustomerNo', ascending: true}))
        })
        .addCase(loadCustomerList.rejected, (state) => {
            state.list = [];
            state.loading = false;
        })
        .addCase(setUserAccess.pending, (state, action) => {
            if (state.key !== action.meta.arg?.id) {
                state.list = [];
                state.loaded = false;
                state.repFilter = '';
                state.filter = '';
            }
            state.key = action.meta.arg?.id ?? null;
        })
        .addCase(setCustomerAccount.fulfilled, (state, action) => {
            state.recent = action.payload.recent;
        })
        .addCase(loadCustomer.fulfilled, (state, action) => {
            if (action.payload?.customer) {
                state.recent = action.payload.recent ?? [];
            }
        })
        .addCase(setCustomersFilter, (state, action) => {
            state.filter = action.payload;
        })
        .addCase(setCustomersRepFilter, (state, action) => {
            state.repFilter = action.payload ?? '';
        })
        .addCase(setCustomersSort, (state, action) => {
            state.sort = action.payload;
        })


});

export default customersReducer;
