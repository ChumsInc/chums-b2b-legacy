import {Customer} from "b2b-types";
import Stack from "@mui/material/Stack";
import React from "react";

const CustomerNameField = ({customer}: { customer: Customer }) => {
    if (!customer.ShipToCode) {
        return customer.CustomerName;
    }
    return (
        <Stack direction="column">
            <div>{customer.BillToName}</div>
            <div>{customer.CustomerName}</div>
        </Stack>
    )
}

export default CustomerNameField;
