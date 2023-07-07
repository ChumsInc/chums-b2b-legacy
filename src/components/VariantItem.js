import classNames from "classnames";
import {getMSRP, getPrices, getSalesUM} from "../utils/products";
import numeral from "numeral";
import React from "react";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../selectors/user";

const VariantItem = ({variant, selected = false, onClick, priceCodes = []}) => {
    const loggedIn = useSelector(selectLoggedIn);
    const className = classNames({
        variant: true,
        'variant-button': true,
        'btn': true,
        'btn-outline-secondary': !selected,
        'btn-primary': selected
    });

    const prices = loggedIn
        ? getPrices({product: variant.product, priceCodes})
        : getMSRP(variant.product);
    const salesUM = getSalesUM(variant.product);

    return (
        <div className={className} onClick={() => onClick(variant)}>
            <div className="title" dangerouslySetInnerHTML={{__html: variant.title}}/>
            <div className="price">
                $ {prices.map(price => numeral(price).format('0.00')).join(' - ')}
                {' '}
                ({salesUM || 'EA'})
            </div>
        </div>
    )
};

export default VariantItem;
