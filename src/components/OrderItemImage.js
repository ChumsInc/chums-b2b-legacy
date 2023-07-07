import React from 'react';
import {API_PATH_CART_IMAGE} from "../constants/paths";

const OrderItemImage = ({ItemCode, ItemCodeDesc, image}) => {
    if (!ItemCode) {
        return null;
    }
    const src = !!image
        ? `/images/products/80/${encodeURIComponent(image)}`
        : API_PATH_CART_IMAGE.replace(':ItemCode', encodeURIComponent(ItemCode));
    return (<img src={src} alt={ItemCodeDesc} className="img-thumbnail"/>)
};

export default OrderItemImage;
