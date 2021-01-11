import React from 'react';
import {PRICE_LEVELS} from "../constants/orders";

const PriceLevelNotice = ({PriceLevel = ''}) => {
    if (!PriceLevel || !PRICE_LEVELS[PriceLevel]) {
        return null;
    }
    return (
        <div className="sale">{PRICE_LEVELS[PriceLevel]} Price</div>
    )
};

export default PriceLevelNotice;
