import React from 'react';
import numeral from 'numeral';

const ProductInfo = ({itemCode, msrp = [], salesUM}) => {
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
};

export default ProductInfo;
