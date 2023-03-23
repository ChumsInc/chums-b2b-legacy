import React from 'react';
import AddressFormFields from "./AddressFormFields";

// export type ShipToFieldMapper = {
//     [key in keyof ShipToAddress]: keyof CustomerAddress;
// };
// export type CustomerFieldMapper = {
//     [key in keyof CustomerAddress]: keyof ShipToAddress;
// };
const fieldMapper = {
    ShipToName: 'CustomerName',
    ShipToAddress1: 'AddressLine1',
    ShipToAddress2: 'AddressLine2',
    ShipToAddress3: 'AddressLine3',
    ShipToCity: 'City',
    ShipToState: 'State',
    ShipToCountryCode: 'CountryCode',
    ShipToZipCode: 'ZipCode',
};
const fieldReMapper = {
    CustomerName: 'ShipToName',
    AddressLine1: 'ShipToAddress1',
    AddressLine2: 'ShipToAddress2',
    AddressLine3: 'ShipToAddress3',
    City: 'ShipToCity',
    State: 'ShipToState',
    CountryCode: 'ShipToCountryCode',
    ZipCode: 'ShipToZipCode',
};

const toCustomerAddress = (shipTo) => {
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

const getShipToField = (field) => {
    return fieldReMapper[field]
}

// export interface ShipToAddressFormFields {
//     address: ShipToAddress;
//     onChange: (arg: TextInputChangeHandler<ShipToAddress>) => void;
//     colWidth?: number;
//     readOnly?: boolean;
// }

const ShipToAddressFormFields = ({address, onChange, colWidth, readOnly}) => {
    const changeHandler = ({field, value}) => {
        if (!field) {
            return onChange({field, value});
        }
        const shipToField = getShipToField(field);
        onChange({field: shipToField, value});
    }
    return (
        <AddressFormFields address={toCustomerAddress(address)}
                           onChange={changeHandler}
                           colWidth={colWidth}
                           readOnly={readOnly}/>
    );
}

export default ShipToAddressFormFields;
