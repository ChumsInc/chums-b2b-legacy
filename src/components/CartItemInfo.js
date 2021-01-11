import React from 'react';
import OrderItemImage from "./OrderItemImage";
import ProductImage from "./ProductImage";

const CartItemInfo = ({ItemCode, ItemCodeDesc, image, colorCode, colorName}) => {
    return (
        <div className="row">
            <div className="col-6">
                {!image && <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc}/>}
                {!!image && <ProductImage image={image} size={125} colorCode={colorCode} altText={`${colorCode}: ${colorName}`} className="img-thumbnail"/>}
            </div>
            <div className="col-6">
                <div><strong>{ItemCode}</strong></div>
                {!!ItemCodeDesc && <div><small>{ItemCodeDesc}</small></div>}
                {!!colorCode && <div><small>{colorName || ''} {colorCode}</small></div>}
            </div>

        </div>
    )
};

export default CartItemInfo;
