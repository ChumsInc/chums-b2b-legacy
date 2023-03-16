import React from 'react';
import AddressFormFields from "./AddressFormFields";
import {CustomerAddress, ShipToAddress} from "b2b-types";
import {TextInputChangeHandler} from "../generic-types";

export type ShipToFieldMapper = {
    [key in keyof ShipToAddress]: keyof CustomerAddress;
};
export type CustomerFieldMapper = {
    [key in keyof CustomerAddress]: keyof ShipToAddress;
};
const fieldMapper: ShipToFieldMapper = {
    ShipToName: 'CustomerName',
    ShipToAddress1: 'AddressLine1',
    ShipToAddress2: 'AddressLine2',
    ShipToAddress3: 'AddressLine3',
    ShipToCity: 'City',
    ShipToState: 'State',
    ShipToCountryCode: 'CountryCode',
    ShipToZipCode: 'ZipCode',
};
const fieldReMapper: CustomerFieldMapper = {
    CustomerName: 'ShipToName',
    AddressLine1: 'ShipToAddress1',
    AddressLine2: 'ShipToAddress2',
    AddressLine3: 'ShipToAddress3',
    City: 'ShipToCity',
    State: 'ShipToState',
    CountryCode: 'ShipToCountryCode',
    ZipCode: 'ShipToZipCode',
};

const toCustomerAddress = (shipTo: ShipToAddress): CustomerAddress => {
    return {
        CustomerName: shipTo.ShipToName,
        AddressLine1: shipTo.ShipToAddress1,
        AddressLine2: shipTo.ShipToAddress2,
        AddressLine3: shipTo.ShipToAddress3,
        City: shipTo.ShipToCity,
        State: shipTo.ShipToState,
        CountryCode: shipTo.ShipToCountryCode,
        ZipCode: shipTo.ShipToZipCode,
    }
}

const getShipToField = (field: keyof CustomerAddress): keyof ShipToAddress | undefined => {
    return fieldReMapper[field]
}

export interface ShipToAddressFormFields {
    address: ShipToAddress;
    onChange: (arg: TextInputChangeHandler<ShipToAddress>) => void;
    colWidth?: number;
    readOnly?: boolean;
}

const ShipToAddressFormFields = ({address, onChange, colWidth, readOnly}: ShipToAddressFormFields) => {
    const changeHandler = ({field, value}: TextInputChangeHandler<CustomerAddress>) => {
        if (!field) {
            return onChange({field, value});
        }
        const shipToField = getShipToField(field);
        onChange( {field: shipToField, value});
    }
    return (
        <AddressFormFields address={toCustomerAddress(address)}
                           onChange={changeHandler}
                           colWidth={colWidth}
                           readOnly={readOnly}/>
    );
}

export default ShipToAddressFormFields;
