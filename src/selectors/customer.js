import {createSelector} from "@reduxjs/toolkit";
import {isBillToCustomer} from "../utils/typeguards";

export const selectCustomerAccount = (state) => state.customer.account ?? null;
export const selectCustomerLoading = (state) => state.customer.loading ?? false;
export const selectCustomerUsers = (state) => state.customer.users ?? [];
export const selectCustomerShipToAddresses = (state) => state.customer.shipToAddresses ?? [];
export const selectPrimaryShipTo = createSelector(
    [selectCustomerAccount, selectCustomerShipToAddresses],
    (account, shipToAddresses) => {
        if (!isBillToCustomer(account)) {
            return null;
        }
        const [defaultShipTo] = shipToAddresses.filter(row => row.ShipToCode === account.PrimaryShipToCode);
        return defaultShipTo ?? null;
    }
)
