import React from 'react';
import numeral from 'numeral';
import {PRICE_LEVELS} from '../constants/account';
import {CustomerPriceRecord} from "b2b-types";
import {styled} from "@mui/material/styles";

const CustomerPricingNotice = styled('span')`
    margin-left: 5px;
    font-size: 12px;
    font-weight: 600;
`

const CartItemPriceDescription = ({priceCodeRecord = null, priceLevel = ''}:{
    priceCodeRecord: CustomerPriceRecord|null;
    priceLevel?: string;
}) => {
    if (!priceCodeRecord?.ItemCode && !priceLevel) {
        return null;
    }
    if (!!priceCodeRecord?.ItemCode) {
        switch (priceCodeRecord?.PricingMethod) {
        case 'P':
            return (
                <CustomerPricingNotice>
                    (Negotiated Discount: {numeral(priceCodeRecord.DiscountMarkup1).format('$0.00')})
                </CustomerPricingNotice>
            )
        case 'D':
            return (
                <CustomerPricingNotice>
                    (Negotiated Discount: {numeral(priceCodeRecord.DiscountMarkup1 / 100).format('0%')})
                </CustomerPricingNotice>
            )
        case 'O':
            return (
                <CustomerPricingNotice>
                    (Negotiated Price: {numeral(priceCodeRecord.DiscountMarkup1).format('$0.00')})
                </CustomerPricingNotice>
            )
        default:
            return null;
        }
    }

    if (PRICE_LEVELS[priceLevel]) {
        return (<CustomerPricingNotice>({PRICE_LEVELS[priceLevel]} pricing)</CustomerPricingNotice>);
    }
    return null;
}

export default CartItemPriceDescription;
