import {useSelector} from "react-redux";
import {selectCustomerAccount, selectCustomerShipTo, selectCustomerShipToCode} from "@/ducks/customer/selectors";
import React from "react";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {customerNo} from "@/utils/customer";
import Typography from "@mui/material/Typography";

export default function CustomerIndicator() {
    const currentCustomer = useSelector(selectCustomerAccount);
    const currentShipTo = useSelector(selectCustomerShipTo);

    if (!currentCustomer) {
        return null;
    }

    const ttTitle = [currentCustomer.CustomerName, currentShipTo?.ShipToName]
        .filter(val => !!val)
        .join(' / ');
    return (
        <Tooltip title={<>
            <Typography color="inherit" component="div">{currentCustomer.CustomerName}</Typography>
            {currentShipTo && <Typography color="inherit" sx={{fontSize: 'small'}}>{currentShipTo.ShipToName}</Typography>}
        </>} arrow>
            <Box sx={{mx: 1, whiteSpace: 'pre'}}>
                {customerNo(currentCustomer)}
                {!!currentShipTo && <span>/{currentShipTo.ShipToCode}</span>}
            </Box>
        </Tooltip>
    )
}
