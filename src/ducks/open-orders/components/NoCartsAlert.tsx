import React from 'react';
import {useSelector} from "react-redux";
import {selectCartsLength, selectOpenOrdersLength} from "../selectors";
import Alert from "@mui/material/Alert";

export default function NoCartsAlert() {
    const length = useSelector(selectCartsLength);
    if (length > 0) {
        return (
            <Alert severity="info">
                <strong className="me-1">Hint:</strong>
                Select a cart icon to make it your current cart.
            </Alert>
        );
    }
    return (
        <Alert severity="info">You current have no open carts.</Alert>
    )
}
