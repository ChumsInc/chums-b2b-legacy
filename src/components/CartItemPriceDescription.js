import React from 'react';
import numeral from 'numeral';
import {PRICE_LEVELS} from '../constants/account';


const CartItemPriceDescription = ({priceCodeRecord = {}, priceLevel = ''}) => {
    if (!priceCodeRecord.ItemCode && !priceLevel) {
        return null;
    }
    if (!!priceCodeRecord.ItemCode) {
        switch (priceCodeRecord.PricingMethod) {
        case 'P':
            return (
                <small className="ms-1 customer-pricing">
                    (Negotiated Discount: {numeral(priceCodeRecord.DiscountMarkup1).format('$0.00')})
                </small>
            )
        case 'D':
            return (
                <small className="ms-1 customer-pricing">
                    (Negotiated Discount: {numeral(priceCodeRecord.DiscountMarkup1 / 100).format('0%')})
                </small>
            )
        case 'O':
            return (
                <small className="ms-1 customer-pricing">
                    (Negotiated Price: {numeral(priceCodeRecord.DiscountMarkup1).format('$0.00')})
                </small>
            )
        default:
            return null;
        }
    }

    if (!!PRICE_LEVELS[priceLevel]) {
        return (<small className="ms-1 customer-pricing">({PRICE_LEVELS[priceLevel]} pricing)</small>);
    }
    return null;
}

export default CartItemPriceDescription;
