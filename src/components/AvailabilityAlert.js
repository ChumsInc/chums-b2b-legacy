import React from 'react';
import AppAlert from "../common-components/AppAlert";

const AvailabilityAlert = ({QuantityOrdered, QuantityAvailable}) => {
    if (QuantityAvailable <= 0) {
        return (<AppAlert title={"Note:"}>Not available for immediate delivery.</AppAlert>)
    }
    const message = `Only ${QuantityAvailable} ${QuantityAvailable === 1 ? 'is' : 'are'} available for immediate delivery`;
    return QuantityAvailable < QuantityOrdered ? (<AppAlert message={message} title="Note:"/>) : null;
};


export default AvailabilityAlert;
