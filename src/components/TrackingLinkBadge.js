import React from 'react';
import Badge from "../common-components/Badge";
import {SHIPPING_METHODS} from "../constants/account";
import Chip from "@mui/material/Chip";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Link from "@mui/material/Link";

const trackingURL = ({TrackingID, StarshipShipVia}) => {
    let {carrier} = SHIPPING_METHODS[StarshipShipVia] || {};
    if (!carrier) {
        if (/fedex/i.test(StarshipShipVia)) {
            carrier = 'fedex';
        } else if (/usps/i.test(StarshipShipVia)) {
            carrier = 'usps';
        } else if (/ups/i.test(StarshipShipVia)) {
            carrier = 'ups';
        }
    }
    // console.log('trackingURL', {StarshipShipVia, carrier});
    switch (carrier) {
    case 'ups':
        return `https://wwwapps.ups.com/WebTracking/processInputRequest?TypeOfInquiryNumber=T&InquiryNumber1=${TrackingID}`;
    case 'fedex':
        return `https://www.fedex.com/fedextrack/?tracknumbers=${TrackingID}`;
    case 'usps':
        return `https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${TrackingID}`
    default:
        return null;
    }
}
const TrackingLinkBadge = ({TrackingID, StarshipShipVia, Weight}) => {
    const url = trackingURL({TrackingID, StarshipShipVia});
    const label = `${TrackingID}; ${Weight} lb${Weight === 1 ? '' : 's'}`
    return (
        <Chip component={Link} target="_blank" href={url} icon={<LocalShippingIcon />} label={label} clickable />
    )
}

export default TrackingLinkBadge;
