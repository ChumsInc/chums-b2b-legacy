import React from 'react';
export const API_PATH_CART_IMAGE = '/api/images/products/find/80/:ItemCode';


const OrderItemImage = ({itemCode, itemCodeDesc, image}:{
    itemCode: string|null;
    itemCodeDesc: string|null;
    image?: string|null;
}) => {
    if (!itemCode) {
        return null;
    }
    const src = image
        ? `/images/products/80/${encodeURIComponent(image)}`
        : API_PATH_CART_IMAGE.replace(':ItemCode', encodeURIComponent(itemCode));
    return (<img src={src} alt={itemCodeDesc ?? itemCode} className="img-thumbnail"/>)
};

export default OrderItemImage;
