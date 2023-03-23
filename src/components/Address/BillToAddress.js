import React from "react";
import Address from "./Address";

const convertToAddress = (address) => {
    const {
        BillToName,
        BillToAddress1,
        BillToAddress2,
        BillToAddress3,
        BillToCity,
        BillToState,
        BillToCountryCode,
        BillToZipCode
    } = address
    return {
        CustomerName: BillToName,
        AddressLine1: BillToAddress1,
        AddressLine2: BillToAddress2,
        AddressLine3: BillToAddress3,
        City: BillToCity,
        State: BillToState,
        ZipCode: BillToZipCode,
        CountryCode: BillToCountryCode,
    }
}


const BillToAddress = ({address, className}) => {

    return <Address address={convertToAddress(address)} className={className}/>
};

export default BillToAddress;
