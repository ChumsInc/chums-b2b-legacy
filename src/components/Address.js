import React from 'react';
import classNames from "classnames";

const Address = ({Name, AddressLine1, AddressLine2, AddressLine3, City, State, ZipCode, CountryCode = 'USA', className}) => {
    return (
        <address className={classNames(className)}>
            <div>{Name || ''}</div>
            {!!AddressLine1 && <div>{AddressLine1}</div>}
            {!!AddressLine2 && <div>{AddressLine2}</div>}
            {!!AddressLine3 && <div>{AddressLine3}</div>}
            <div>{City || ''},{' '}{State || ''}{' '}{ZipCode || ''}</div>
            {!['USA', 'US'].includes((CountryCode || '').toUpperCase()) && <div>{CountryCode || ''}</div>}
        </address>
    );
};

export default Address;

export const BillToAddress = ({BillToName, BillToAddress1, BillToAddress2, BillToAddress3, BillToCity, BillToState, BillToZipCode, BillToCountryCode, ...rest}) => {
    return <Address Name={BillToName} AddressLine1={BillToAddress1} AddressLine2={BillToAddress2}
                    AddressLine3={BillToAddress3} City={BillToCity} State={BillToState} ZipCode={BillToZipCode}
                    CountryCode={BillToCountryCode} {...rest}/>
};

export const ShipToAddress = ({ShipToName, ShipToAddress1, ShipToAddress2, ShipToAddress3, ShipToCity, ShipToState, ShipToZipCode, ShipToCountryCode, ...rest}) => {
    return <Address Name={ShipToName} AddressLine1={ShipToAddress1} AddressLine2={ShipToAddress2}
                    AddressLine3={ShipToAddress3} City={ShipToCity} State={ShipToState} ZipCode={ShipToZipCode}
                    CountryCode={ShipToCountryCode} {...rest}/>
};
