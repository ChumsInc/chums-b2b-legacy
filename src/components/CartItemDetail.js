import React from 'react';
import numeral from "numeral";
import Alert from "../common-components/Alert";
import classNames from 'classnames';
import CartItemPriceDescription from "./CartItemPriceDescription";
import {useSelector} from "react-redux";
import {selectCanViewAvailable} from "../ducks/user/selectors";

/**
 *
 * @param {CartItemDetailProps} cartItem
 * @param {number[]} [msrp]
 * @return {JSX.Element|null}
 * @constructor
 */
const CartItemDetail = ({cartItem, msrp}) => {
    const canViewAvailable = useSelector(selectCanViewAvailable);

    if (!cartItem || !cartItem.itemCode) {
        return null;
    }

    const roi = cartItem.quantity * cartItem.salesUMFactor * (cartItem.msrp - (cartItem.price / cartItem.salesUMFactor));
    const availableToday = cartItem.QuantityAvailable / cartItem.salesUMFactor;

    return (
        <>
            <table className="table table-sm user-pricing">
                <tbody>
                {((!msrp || msrp.length > 1) || cartItem.salesUMFactor > 1)
                    && cartItem.msrp > 0
                    && (
                        <tr className="msrp">
                            <th>MSRP</th>
                            <td>$ {numeral(cartItem.msrp).format('0,0.00')} ({cartItem.stdUM})</td>
                        </tr>
                    )}
                <tr>
                    <th>
                        Your Price
                        <CartItemPriceDescription priceCodeRecord={cartItem.priceCodeRecord}
                                                  priceLevel={cartItem.priceLevel}/>
                    </th>
                    <td>$ {numeral(cartItem.price).format('0,0.00')} ({cartItem.salesUM})</td>
                </tr>
                <tr>
                    <th>Ext Price</th>
                    <td>$ {numeral(cartItem.price * cartItem.quantity).format('0,0.00')}</td>
                </tr>
                <tr>
                    <th>ROI</th>
                    <td>$ {numeral(roi).format('0,0.00')}</td>
                </tr>
                <tr className="item-code">
                    <th>SKU</th>
                    <td>{cartItem.itemCode}</td>
                </tr>
                {canViewAvailable && (
                    <tr className={classNames({'table-danger': cartItem.QuantityAvailable <= 0})}>
                        <th>Available Today</th>
                        <td>{numeral(availableToday).format('0,0')} ({cartItem.salesUM})</td>
                    </tr>
                )}
                </tbody>
            </table>
            {cartItem.QuantityAvailable < (cartItem.quantity * cartItem.salesUMFactor) && (
                <Alert type="alert-warning" title="Note: ">Product is not available for immediate delivery.</Alert>
            )}
        </>
    )
}

export default CartItemDetail;
