import React, {PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import numeral from "numeral";
import Alert from "../common-components/Alert";
import classNames from 'classnames';
import CartItemPriceDescription from "./CartItemPriceDescription";

export default class CartItemDetail extends PureComponent {
    static propTypes = {
        price: PropTypes.number,
        salesUM: PropTypes.string,
        quantity: PropTypes.number,
        msrp: PropTypes.number,
        stdUM: PropTypes.string,
        salesUMFactor: PropTypes.number,
        itemCode: PropTypes.string,
        QuantityAvailable: PropTypes.number,
        showMSRP: PropTypes.bool,
        canViewAvailable: PropTypes.bool,
        priceCodeRecord: PropTypes.shape({
            DiscountMarkup: PropTypes.number,
            ItemCode: PropTypes.string,
            PriceCode: PropTypes.string,
            PricingMethod: PropTypes.string,
        }),
        priceLevel: PropTypes.string,
    };

    static defaultProps = {
        price: 0,
        salesUM: 'EA',
        quantity: 1,
        msrp: 0,
        stdUM: 'EA',
        salesUMFactor: 1,
        itemCode: '',
        QuantityAvailable: 0,
        showMSRP: false,
        canViewAvailable: false
    };

    render() {
        const {price, salesUM, quantity, msrp, stdUM, salesUMFactor, itemCode, QuantityAvailable, showMSRP, canViewAvailable,
            priceCodeRecord, priceLevel
        } = this.props;
        return (
            <Fragment>
                <table className="table table-sm user-pricing">
                    <tbody>
                    {!!showMSRP && (
                        <tr className="msrp">
                            <th>MSRP</th>
                            <td>$ {numeral(msrp).format('0,0.00')} ({stdUM})</td>
                        </tr>
                    )}
                    <tr>
                        <th>
                            Your Price
                            <CartItemPriceDescription priceCodeRecord={priceCodeRecord} priceLevel={priceLevel} />
                        </th>
                        <td>$ {numeral(price).format('0,0.00')} ({salesUM})</td>
                    </tr>
                    <tr>
                        <th>Ext Price</th>
                        <td>$ {numeral(price * quantity).format('0,0.00')}</td>
                    </tr>
                    <tr>
                        <th>ROI</th>
                        <td>$ {numeral(quantity * salesUMFactor * (msrp - (price / salesUMFactor))).format('0,0.00')}</td>
                    </tr>
                    <tr className="item-code">
                        <th>SKU</th>
                        <td>{itemCode}</td>
                    </tr>
                    {canViewAvailable && (
                        <tr className={classNames({'table-danger': QuantityAvailable <= 0})}>
                            <th>Available Today</th>
                            <td>{numeral(QuantityAvailable).format('0,0')}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {QuantityAvailable < 0 && (
                    <Alert type="alert-warning" title="Note:">Product is not available for immediate delivery.</Alert>
                )}
            </Fragment>
        );
    }
}
