import React from 'react';
import {buildPath} from "../utils/fetch";
import {API_PATH_CART_IMAGE} from "../constants/paths";

const OrderItemImage = ({ItemCode, ItemCodeDesc, image}) => {
    if (!ItemCode) {
        return null;
    }
    const src = !!image
        ? buildPath('/images/products/80/:image', {image})
        : buildPath(API_PATH_CART_IMAGE, {ItemCode});
    return (<img src={src} alt={ItemCodeDesc} className="img-thumbnail"/>)
};

export default OrderItemImage;
