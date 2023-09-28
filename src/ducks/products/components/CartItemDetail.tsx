import React from 'react';
import numeral from "numeral";
import Alert from "@mui/material/Alert";
import classNames from 'classnames';
import CartItemPriceDescription from "../../../components/CartItemPriceDescription";
import {useSelector} from "react-redux";
import {selectCanViewAvailable} from "../../user/selectors";
import Decimal from "decimal.js";
import {CartProduct} from "b2b-types";

const CartItemDetail = ({cartItem, msrp}: {
    cartItem: CartProduct | null;
    msrp?: (string | number | null | undefined)[]
}) => {
    const canViewAvailable = useSelector(selectCanViewAvailable);

    if (!cartItem || !cartItem.itemCode) {
        return null;
    }

    const roi = new Decimal(cartItem.quantity ?? 1)
        .times(cartItem.salesUMFactor ?? 1)
        .times(new Decimal(cartItem.msrp ?? 0)
            .sub(new Decimal(cartItem.price ?? 0).div(cartItem.salesUMFactor ?? 1))
        );
    const availableToday = new Decimal(cartItem.quantityAvailable ?? 0).div(cartItem.salesUMFactor ?? 1);

    return (
        <>
            <table className="table table-sm user-pricing">
                <tbody>
                {((!msrp || msrp.length > 1) || (cartItem.salesUMFactor ?? 1) > 1)
                    && new Decimal(cartItem.msrp ?? 0).gt(0)
                    && (
                        <tr className="msrp">
                            <th>MSRP</th>
                            <td>$ {numeral(cartItem.msrp ?? 0).format('0,0.00')} ({cartItem.stdUM})</td>
                        </tr>
                    )}
                <tr>
                    <th>
                        Your Price
                        <CartItemPriceDescription priceCodeRecord={cartItem.priceCodeRecord ?? null}
                                                  priceLevel={cartItem.priceLevel}/>
                    </th>
                    <td>$ {numeral(cartItem.price).format('0,0.00')} ({cartItem.salesUM})</td>
                </tr>
                <tr>
                    <th>Ext Price</th>
                    <td>$ {numeral(new Decimal(cartItem.price ?? 0).times(cartItem.quantity)).format('0,0.00')}</td>
                </tr>
                <tr>
                    <th>ROI</th>
                    <td>$ {numeral(roi.toString()).format('0,0.00')}</td>
                </tr>
                <tr className="item-code">
                    <th>SKU</th>
                    <td>{cartItem.itemCode}</td>
                </tr>
                {canViewAvailable && (
                    <tr className={classNames({'table-danger': (cartItem.quantityAvailable ?? 0) <= 0})}>
                        <th>Available Today</th>
                        <td>{numeral(availableToday.toString()).format('0,0')} ({cartItem.salesUM})</td>
                    </tr>
                )}
                </tbody>
            </table>
            {new Decimal(cartItem.quantity ?? 1).gt(availableToday) && (
                <Alert severity="warning">Product is not available for immediate delivery.</Alert>
            )}
        </>
    )
}

export default CartItemDetail;
