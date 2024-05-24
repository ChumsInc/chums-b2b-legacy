import React from 'react';
import AppAlert from "../common-components/AppAlert";
import Decimal from "decimal.js";

const AvailabilityAlert = ({QuantityOrdered, QuantityAvailable}: {
    QuantityOrdered: string | number;
    QuantityAvailable: string | number;
}) => {
    const available = new Decimal(QuantityAvailable);
    const ordered = new Decimal(QuantityOrdered);

    if (available.lt(0)) {
        return (<AppAlert severity="warning" alertTitle={"Note:"}>Not available for immediate delivery.</AppAlert>)
    }
    const message = `Only ${available} ${available.eq(1) ? 'is' : 'are'} available for immediate delivery`;
    return available.lt(ordered)
        ? (<AppAlert severity="info" message={message} alertTitle="Note:"/>)
        : null;
};


export default AvailabilityAlert;
