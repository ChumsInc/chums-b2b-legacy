import {useSelector} from "react-redux";
import {selectCustomerAccount} from "@/ducks/customer/selectors";
import React from "react";
import {Tooltip} from "@mui/material";
import Box from "@mui/material/Box";
import {customerNo} from "@/utils/customer";

export default function CustomerIndicator() {
    const currentCustomer = useSelector(selectCustomerAccount);

    if (!currentCustomer) {
        return null;
    }

    return (
        <Tooltip title={currentCustomer.CustomerName} arrow>
            <Box sx={{mx: 1, whiteSpace: 'pre'}}>
                {customerNo(currentCustomer)}
            </Box>
        </Tooltip>
    )
}
