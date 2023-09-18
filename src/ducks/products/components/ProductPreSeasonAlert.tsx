import React from 'react';
import Alert from "../../../common-components/Alert";
import {useSelector} from "react-redux";
import {selectProductCartItem} from "../selectors";
import {isCartProduct} from "../utils";

const ProductPreSeasonAlert = () => {
    const cartItem = useSelector(selectProductCartItem);
    if (!isCartProduct(cartItem) || !cartItem.seasonCode || cartItem.seasonAvailable) {
        return null
    }
    return (
        <Alert type="info" title="Pre-Season Order:">
            {cartItem.seasonDescription}
        </Alert>
    )
}

export default ProductPreSeasonAlert;
