import React from 'react';
import {useSelector} from "react-redux";
import {selectPrimaryShipTo} from "../selectors";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Tooltip from "@mui/material/Tooltip";

const PrimaryShipToIcon = ({shipToCode}:{shipToCode:string|null}) => {
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    if (shipToCode !== primaryShipTo?.ShipToCode) {
        return null;
    }

    return (
        <Tooltip title="Default Ship-To Location">
            <LocalShippingIcon />
        </Tooltip>
    )
}

export default PrimaryShipToIcon;
