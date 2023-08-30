import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {SortProps} from "@/types/generic";
import {Customer, UserCustomerAccess} from "b2b-types";
import {fetchCustomerList} from "@/api/customer-list";
import {RootState} from "@/app/configureStore";
import {selectLoggedIn} from "@/ducks/user/selectors";
import {selectCustomersLoading} from "@/ducks/customers/selectors";

export const setCustomersFilter = createAction<string>('customers/setFilter');
export const setCustomersRepFilter = createAction<string | null>('customers/setRepFilter');
export const setCustomersSort = createAction<SortProps<Customer>>('customers/setSort');

export const loadCustomerList = createAsyncThunk<Customer[], UserCustomerAccess | null>(
    'customers/list/load',
    async (arg) => {
        return await fetchCustomerList(arg!)
    },
    {
        condition: (arg, {getState}) => {
            const state = getState() as RootState;
            return selectLoggedIn(state)
                && !!arg?.isRepAccount
                && !selectCustomersLoading(state);
        }
    }
)
