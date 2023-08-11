import React from 'react';
import {useSelector} from "react-redux";
import {selectProductCartItem, selectProductMSRP, selectProductSalesUM, selectSelectedProduct} from "../selectors";
import numeral from "numeral";

const ProductPageInfo = () => {
    const msrp = useSelector(selectProductMSRP);
    const salesUM = useSelector(selectProductSalesUM);
    const cartItem = useSelector(selectProductCartItem);
    const selectedProduct = useSelector(selectSelectedProduct);
    const itemCode = cartItem?.itemCode ?? selectedProduct?.itemCode ?? null;

    return (
        <div className="details">
            <div><label>SKU</label><span className="info">{itemCode}</span></div>
            <div>
                <label>MSRP</label>
                <span className="info">
                    $ {msrp.map(price => numeral(price).format('0.00')).join(' - ')}
                    {' '}
                    ({salesUM})
                </span>
            </div>
        </div>
    )
}

export default ProductPageInfo;
