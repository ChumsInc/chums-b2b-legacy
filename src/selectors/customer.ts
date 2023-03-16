import {RootState} from "../ducks/index";
import {CustomerUser, ShipToAddress} from "b2b-types";
import {BillToCustomer, ShipToCustomer} from "b2b-types/src/customer";
import {createSelector} from "@reduxjs/toolkit";
import {isBillToCustomer} from "../utils/typeguards";

export const selectCustomerAccount = (state:RootState):BillToCustomer|{}|null => state.customer.account ?? null;
export const selectCustomerLoading = (state:RootState) => state.customer.loading ?? false;
export const selectCustomerUsers = (state:RootState):CustomerUser[] => state.customer.users ?? [];
export const selectCustomerShipToAddresses = (state:RootState):ShipToCustomer[] => state.customer.shipToAddresses ?? [];
export const selectPrimaryShipTo = createSelector(
    [selectCustomerAccount, selectCustomerShipToAddresses],
    (account, shipToAddresses):ShipToCustomer|null => {
        if (!isBillToCustomer(account) ) {
            return null;
        }
        const [defaultShipTo] = shipToAddresses.filter(row => row.ShipToCode === account.PrimaryShipToCode);
        return defaultShipTo ?? null;
    }
)
