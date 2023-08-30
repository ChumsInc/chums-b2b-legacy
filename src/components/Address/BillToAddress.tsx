import React from "react";
import Address from "./Address";
import {BillToAddress, CustomerAddress} from "b2b-types";
import classNames from "classnames";

const convertToAddress = (address: BillToAddress): CustomerAddress => {
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
        CustomerName: BillToName ?? '',
        AddressLine1: BillToAddress1,
        AddressLine2: BillToAddress2,
        AddressLine3: BillToAddress3,
        City: BillToCity,
        State: BillToState,
        ZipCode: BillToZipCode,
        CountryCode: BillToCountryCode,
    }
}


const BillToAddress = ({address, className}: {
    address: BillToAddress;
    className: classNames.Argument,
}) => {

    return <Address address={convertToAddress(address)} className={className}/>
};

export default BillToAddress;
