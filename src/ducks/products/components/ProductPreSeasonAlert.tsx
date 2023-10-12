import React from 'react';
import Alert from "../../../common-components/Alert";
import {useSelector} from "react-redux";
import {selectProductCartItem} from "../selectors";
import {isCartProduct} from "../utils";

const ProductPreSeasonAlert = () => {
    const cartItem = useSelector(selectProductCartItem);
    if (!isCartProduct(cartItem) || !cartItem.season || !cartItem.season.active || cartItem.season.product_available) {
        return null;
    }
    return (
        <Alert type="info" title="Pre-Season Order:">
            {cartItem.season.preSeasonMessage}
        </Alert>
    )
}

export default ProductPreSeasonAlert;
