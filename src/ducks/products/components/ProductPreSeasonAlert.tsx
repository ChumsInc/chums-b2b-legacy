import React from 'react';
import {useSelector} from "react-redux";
import {selectProductCartItem} from "../selectors";
import {isCartProduct} from "../utils";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";

const ProductPreSeasonAlert = () => {
    const cartItem = useSelector(selectProductCartItem);
    const show = isCartProduct(cartItem)
        && cartItem.season?.active
        && !(cartItem.season?.product_available || cartItem.seasonAvailable);
    return (
        <Collapse in={show}>
            <Alert severity="info" sx={{mb: 2}}>
                <Box component="strong" sx={{mr: 2}}>Pre-Season Order:</Box> {cartItem?.season?.preSeasonMessage}
            </Alert>
        </Collapse>
    )
}

export default ProductPreSeasonAlert;
