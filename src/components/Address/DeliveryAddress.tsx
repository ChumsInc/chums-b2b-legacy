import React from "react";
import Address from "./Address";
import {CustomerAddress, ShipToAddress} from "b2b-types";
import classNames from "classnames";

const convertToAddress = (address:ShipToAddress):CustomerAddress => {
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


const DeliveryAddress = ({address, className}:{
    address:ShipToAddress,
    className?: classNames.Argument,
}) => {
    return <Address address={convertToAddress(address)} className={className}/>
};

export default DeliveryAddress;
