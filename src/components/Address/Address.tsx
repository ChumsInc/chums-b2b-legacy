import React from 'react';
import classNames from "classnames";
import {CustomerAddress} from "b2b-types";

const Address = ({address, className}: { address: CustomerAddress, className?: string }) => {
    return (
        <address className={classNames(className)}>
            <div>{address.CustomerName ?? ''}</div>
            {!!address.AddressLine1 && <div>{address.AddressLine1}</div>}
            {!!address.AddressLine2 && <div>{address.AddressLine2}</div>}
            {!!address.AddressLine3 && <div>{address.AddressLine3}</div>}
            <div>{address.City ?? ''},{' '}{address.State ?? ''}{' '}{address.ZipCode ?? ''}</div>
            {!['USA', 'US'].includes((address.CountryCode ?? '').toUpperCase()) &&
                <div>{address.CountryCode ?? ''}</div>
            }
        </address>
    );
};
export default Address;
