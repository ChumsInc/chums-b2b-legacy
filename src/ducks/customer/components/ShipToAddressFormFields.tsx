import React from 'react';
import AddressFormFields from "../../../components/AddressFormFields";
import {CustomerAddress, ShipToAddress, ShipToCustomer} from "b2b-types";

type ShipToFieldMapper = {
    [key in keyof ShipToAddress]: keyof CustomerAddress;
};
type CustomerFieldMapper = {
    [key in keyof CustomerAddress]: keyof ShipToAddress;
};

const fieldMapper:ShipToFieldMapper = {
    ShipToName: 'CustomerName',
    ShipToAddress1: 'AddressLine1',
    ShipToAddress2: 'AddressLine2',
    ShipToAddress3: 'AddressLine3',
    ShipToCity: 'City',
    ShipToState: 'State',
    ShipToCountryCode: 'CountryCode',
    ShipToZipCode: 'ZipCode',
};

const fieldReMapper:CustomerFieldMapper = {
    CustomerName: 'ShipToName',
    AddressLine1: 'ShipToAddress1',
    AddressLine2: 'ShipToAddress2',
    AddressLine3: 'ShipToAddress3',
    City: 'ShipToCity',
    State: 'ShipToState',
    CountryCode: 'ShipToCountryCode',
    ZipCode: 'ShipToZipCode',
};

const toCustomerAddress = (shipTo:ShipToAddress):CustomerAddress => {
    return {
        CustomerName: shipTo.ShipToName ?? '',
        AddressLine1: shipTo.ShipToAddress1,
        AddressLine2: shipTo.ShipToAddress2,
        AddressLine3: shipTo.ShipToAddress3,
        City: shipTo.ShipToCity,
        State: shipTo.ShipToState,
        CountryCode: shipTo.ShipToCountryCode,
        ZipCode: shipTo.ShipToZipCode,
    }
}

const getShipToField = (field: keyof CustomerAddress):keyof ShipToAddress => {
    return fieldReMapper[field]
}

export interface ShipToAddressFormFields {
    address: ShipToAddress;
    onChange: (arg: Partial<ShipToCustomer>) => void;
    readOnly?: boolean;
}

const ShipToAddressFormFields = ({address, onChange, readOnly}:ShipToAddressFormFields) => {
    const changeHandler = (arg:Partial<CustomerAddress>) => {
        const change:Partial<ShipToCustomer> = {};
        Object.keys(arg).forEach(key => {
            change[getShipToField(key as keyof CustomerAddress)] = arg[key as keyof CustomerAddress] ?? '';
        })
        onChange(change);
    }
    return (
        <AddressFormFields address={toCustomerAddress(address)}
                           onChange={changeHandler}
                           readOnly={readOnly}/>
    );
}

export default ShipToAddressFormFields;
