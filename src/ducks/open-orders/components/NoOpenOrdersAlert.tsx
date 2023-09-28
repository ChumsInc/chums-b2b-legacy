import React from 'react';
import {useSelector} from "react-redux";
import {selectOpenOrdersLength} from "../selectors";
import Alert from "@mui/material/Alert";

export default function NoOpenOrdersAlert() {
    const length = useSelector(selectOpenOrdersLength);
    if (length > 0) {
        return null;
    }
    return (
        <Alert severity="info">There are currently no open orders.</Alert>
    )
}
