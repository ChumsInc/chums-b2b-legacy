import React from 'react';
import Alert from "../common-components/Alert";

const AvailabilityAlert = ({QuantityOrdered, QuantityAvailable}) => {
    if (QuantityAvailable <= 0) {
        return (<Alert title={"Note:"}>Not available for immediate delivery.</Alert>)
    }
    const message = `Only ${QuantityAvailable} ${QuantityAvailable === 1 ? 'is' : 'are'} available for immediate delivery`;
    return QuantityAvailable < QuantityOrdered ? (<Alert message={message} title="Note:"/>) : null;
};


export default AvailabilityAlert;
