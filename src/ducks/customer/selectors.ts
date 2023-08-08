import {createSelector} from "@reduxjs/toolkit";
import {isBillToCustomer} from "../../utils/typeguards";
import {selectCustomerPermissions} from "../user/selectors";
import {RootState} from "../../app/configureStore";

export const selectCustomerAccount = (state:RootState) => state.customer.account ?? null;
export const selectTaxSchedule = (state:RootState) => isBillToCustomer(state.customer.account) ? (state.customer.account?.TaxSchedule ?? '') : '';
export const selectCustomerPricing = (state:RootState) => state.customer.pricing ?? [];
export const selectCustomerLoading = (state:RootState) => state.customer.loading ?? false;
export const selectCustomerUsers = (state:RootState) => state.customer.users ?? [];
export const selectCustomerShipToAddresses = (state:RootState) => state.customer.shipToAddresses ?? [];
export const selectPermittedShipToAddresses = createSelector(
    [selectCustomerShipToAddresses, selectCustomerPermissions],
    (addresses, permissions) => {
        if (permissions?.billTo) {
            return addresses;
        }
        return addresses.filter(addr => !!addr.ShipToCode);
    }
)
export const selectPrimaryShipToCode = createSelector(
    [selectCustomerAccount, selectPermittedShipToAddresses, selectCustomerPermissions],
    (account, shipToAddresses, permissions) => {
        console.debug('selectPrimaryShipToCode', {account, shipToAddresses, permissions})
        if (!isBillToCustomer(account)) {
            return null;
        }
        let primaryShipToCode = account.PrimaryShipToCode ?? null;
        if (permissions?.billTo && !primaryShipToCode) {
            return '';
        }
        if (!!permissions && !permissions.billTo) {
            [primaryShipToCode] = (permissions.shipTo ?? []);
        }
        return primaryShipToCode ?? null
    }
)
