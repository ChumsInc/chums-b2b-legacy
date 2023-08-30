import {BillToAddress, CustomerAddress, ShipToAddress} from "b2b-types";

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
