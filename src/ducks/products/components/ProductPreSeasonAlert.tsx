import React from 'react';
import {useSelector} from "react-redux";
import {selectProductCartItem} from "../selectors";
import {isCartProduct} from "../utils";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

const ProductPreSeasonAlert = () => {
    const cartItem = useSelector(selectProductCartItem);
    if (!isCartProduct(cartItem) || !cartItem.season || !cartItem.season.active || cartItem.season.product_available) {
        return null;
    }
    return (
        <Alert severity="info" sx={{mb: 2}}>
            <Box component="strong" sx={{mr: 3}}>Pre-Season Order:</Box> {cartItem.season.preSeasonMessage}
        </Alert>
    )
}

export default ProductPreSeasonAlert;
