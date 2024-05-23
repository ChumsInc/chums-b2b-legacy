import React from 'react';
import {SHIPPING_METHODS} from "../constants/account";
import Chip from "@mui/material/Chip";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from "@mui/material/Link";

const trackingURL = ({trackingId, shipVia}:{trackingId: string; shipVia: string;}) => {
    let carrier: string = SHIPPING_METHODS[shipVia]?.carrier;
    if (!carrier) {
        if (/fedex/i.test(shipVia)) {
            carrier = 'fedex';
        } else if (/usps/i.test(shipVia)) {
            carrier = 'usps';
        } else if (/ups/i.test(shipVia)) {
            carrier = 'ups';
        }
    }
    switch (carrier) {
    case 'ups':
        return `https://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${trackingId}`;
    case 'fedex':
        return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingId}`;
    case 'usps':
        return `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${trackingId}`
    default:
        return null;
    }
}

const TrackingLinkBadge = ({trackingId, shipVia, weight}:{
    trackingId: string;
    shipVia: string;
    weight: number;
}) => {
    const url = trackingURL({trackingId, shipVia});
    if (!url) {
        return null;
    }
    const label = `${trackingId}; ${weight} lb${weight === 1 ? '' : 's'}`
    return (
        <Chip component={Link} target="_blank" href={url} icon={<LocalShippingIcon/>} label={label} clickable/>
    )
}

export default TrackingLinkBadge;
