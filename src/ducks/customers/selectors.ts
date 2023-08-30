import {RootState} from "@/app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {customerListSorter, shortCustomerKey} from "@/utils/customer";

export const selectCustomerList = (state:RootState) => state.customers.list;
export const selectCustomersLoading = (state:RootState) => state.customers.loading;
export const selectCustomersLoaded = (state:RootState) => state.customers.loaded;
export const selectCustomersRepFilter = (state:RootState) => state.customers.repFilter;
export const selectCustomersFilter = (state:RootState) => state.customers.filter;
export const selectCustomerSort = (state:RootState) => state.customers.sort;
export const selectRecentCustomers = (state:RootState) => state.customers.recent;

export const selectFilteredCustomerList = createSelector(
    [selectCustomerList, selectCustomersFilter, selectCustomersRepFilter, selectCustomerSort],
    (list, filter, repFilter, sort) => {
        const filterRegex = new RegExp(`\\b${filter ?? ''}`, 'i');
        return list
            .filter(customer => !repFilter || customer.SalespersonNo === repFilter)
            .filter(customer => {
                return !filter
                    || filterRegex.test(shortCustomerKey(customer))
                    || filterRegex.test(`${customer.ARDivisionNo}-${customer.CustomerNo}`)
                    || filterRegex.test(customer.CustomerNo)
                    || filterRegex.test(customer.CustomerName)
                    || filterRegex.test(customer.AddressLine1 ?? '')
                    || filterRegex.test(customer.City ?? '')
                    || filterRegex.test(customer.State ?? '')
                    || filterRegex.test(customer.ZipCode ?? '')
                    || filterRegex.test(customer.TelephoneNo ?? '')
            })
            .sort(customerListSorter(sort));
    }
)
