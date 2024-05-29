import Button from "@mui/material/Button";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Stack from "@mui/material/Stack";
import PrimaryShipToIcon from "./PrimaryShipToIcon";
import Typography from "@mui/material/Typography";
import React from "react";
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCustomerPermissions, selectPrimaryShipTo} from "../selectors";
import {Editable, ShipToCustomer} from "b2b-types";
import {loadCustomer, setDefaultShipTo} from "../actions";


export interface PrimaryShipToButtonProps {
    shipTo: (ShipToCustomer & Editable)|null;
    disabled?: boolean;
}
const PrimaryShipToButton = ({shipTo, disabled}:PrimaryShipToButtonProps) => {
    const dispatch = useAppDispatch();
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    const permissions = useSelector(selectCustomerPermissions);

    const onSetDefaultShipTo = async () => {
        if (shipTo && shipTo.ShipToCode !== primaryShipTo?.ShipToCode) {
            await dispatch(setDefaultShipTo(shipTo.ShipToCode))
            dispatch(loadCustomer(shipTo));
        }
    }

    if (!shipTo) {
        return null;
    }

    return (
        <>
            {primaryShipTo?.ShipToCode !== shipTo.ShipToCode && (
                <Button type="button" variant="outlined"
                        startIcon={<LocalShippingIcon/>}
                        disabled={shipTo.changed || disabled || shipTo.ShipToCode === primaryShipTo?.ShipToCode || !permissions?.billTo}
                        onClick={onSetDefaultShipTo}>
                    Set as default delivery location
                </Button>
            )}
            {primaryShipTo?.ShipToCode === shipTo.ShipToCode && (
                <Stack direction="row" spacing={2} alignItems="center">
                    <PrimaryShipToIcon shipToCode={shipTo.ShipToCode}/>
                    <Typography variant="body1">Default delivery location</Typography>
                </Stack>
            )}
        </>
    )
}

export default PrimaryShipToButton;
