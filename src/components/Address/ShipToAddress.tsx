import React from "react";
import Address from "./Address";
import {CustomerAddress, InvoiceHeader, SalesOrderHeader} from "b2b-types";

const convertToAddress = (address: SalesOrderHeader|InvoiceHeader): CustomerAddress => {
    const {
        ShipToName,
        ShipToAddress1,
        ShipToAddress2,
        ShipToAddress3,
        ShipToCity,
        ShipToState,
        ShipToCountryCode,
        ShipToZipCode
    } = address
    return {
        CustomerName: ShipToName ?? '',
        AddressLine1: ShipToAddress1,
        AddressLine2: ShipToAddress2,
        AddressLine3: ShipToAddress3,
        City: ShipToCity,
        State: ShipToState,
        ZipCode: ShipToZipCode,
        CountryCode: ShipToCountryCode,
    }
}


const ShipToAddress = ({address, className}: { address: SalesOrderHeader|InvoiceHeader, className?: string }) => {
    return <Address address={convertToAddress(address)} className={className}/>
};

export default ShipToAddress;
