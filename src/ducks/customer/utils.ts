import {BillToAddress, CustomerAddress, ShipToAddress, ShipToCustomer, UserCustomerAccess} from "b2b-types";
import {FetchCustomerResponse} from "./types";
import {CustomerState} from "./index";
import {
    customerContactSorter, customerPaymentCardSorter,
    customerPriceRecordSorter,
    customerShipToSorter, customerUserSorter, defaultShipToSort,
} from "../../utils/customer";

export const addressFromShipToAddress = (address:ShipToAddress|null):CustomerAddress => {
    return {
        CustomerName: address?.ShipToName ?? '',
        AddressLine1: address?.ShipToAddress1 ?? null,
        AddressLine2: address?.ShipToAddress2 ?? null,
        AddressLine3: address?.ShipToAddress3 ?? null,
        City: address?.ShipToCity ?? null,
        State: address?.ShipToState ?? null,
        CountryCode: address?.ShipToCountryCode ?? null,
        ZipCode: address?.ShipToZipCode ?? null
    }
}

export const addressFromBillToAddress = (address:BillToAddress|null):CustomerAddress => {
    return {
        CustomerName: address?.BillToName ?? '',
        AddressLine1: address?.BillToAddress1 ?? null,
        AddressLine2: address?.BillToAddress2 ?? null,
        AddressLine3: address?.BillToAddress3 ?? null,
        City: address?.BillToCity ?? null,
        State: address?.BillToState ?? null,
        CountryCode: address?.BillToCountryCode ?? null,
        ZipCode: address?.BillToZipCode ?? null
    }
}

export const multiLineAddress = (address:CustomerAddress, includeName?: boolean):string[] => {
    const finalLine = [address.City, address.State, address.CountryCode, address.ZipCode]
        .filter(val => !!val).join(' ');
    return [
        includeName ? address.CustomerName : '',
        address.AddressLine1 ?? '',
        address.AddressLine2 ?? '',
        address.AddressLine3 ?? '',
        finalLine
    ].filter(line => !!line);
}

export const customerResponseToState = (payload:FetchCustomerResponse|null, state:CustomerState):Partial<CustomerState> => {
    const nextState:Partial<CustomerState> = {};
    nextState.account = payload?.customer ?? null;
    nextState.shipToCode = payload?.customer?.PrimaryShipToCode ?? null;
    nextState.permissions = {
        values: payload?.permissions ?? null,
        loading: false,
        loaded: true,
    };
    nextState.contacts = [...(payload?.contacts ?? [])].sort(customerContactSorter);
    nextState.pricing = [...(payload?.pricing ?? [])].sort(customerPriceRecordSorter);
    nextState.shipToAddresses = [...(payload?.shipTo ?? [])].sort(customerShipToSorter(defaultShipToSort));
    if (!!state.shipToCode && !nextState.shipToAddresses.filter(st => st.ShipToCode === state.shipToCode).length) {
        nextState.shipToCode = null;
    }
    if (nextState.shipToCode && !nextState.permissions.values?.billTo && !nextState.permissions.values?.shipTo.includes(nextState.shipToCode)) {
        nextState.shipToCode = null;
    }
    if (!nextState.shipToCode) {
        if (nextState.permissions.values?.billTo) {
            nextState.shipToCode = '';
            nextState.shipTo = null;
        } else if (nextState.permissions.values?.shipTo.length) {
            const [shipTo] = nextState.shipToAddresses.filter(st => st.ShipToCode === nextState.permissions!.values?.shipTo[0])
            nextState.shipToCode = shipTo?.ShipToCode ?? null;
            nextState.shipTo = shipTo ?? null;
        }
    } else  {
        const [shipTo] = nextState.shipToAddresses.filter(st => st.ShipToCode === nextState.shipToCode)
        nextState.shipToCode = shipTo?.ShipToCode ?? null;
        nextState.shipTo = shipTo ?? null;
    }
    nextState.paymentCards = [...(payload?.paymentCards ?? [])].sort(customerPaymentCardSorter);
    nextState.users = [...(payload?.users ?? [])].sort(customerUserSorter);
    return nextState;
}

export const filterShipToByUserAccount = (access:UserCustomerAccess|null) => (address:ShipToCustomer): boolean => {
    if (!access) {
        return false;
    }
    if(!access.isRepAccount) {
        return true;
    }
    return [address.SalespersonDivisionNo, '%'].includes(access.SalespersonDivisionNo)
        && [address.SalespersonNo, '%'].includes(access.SalespersonNo)
}
