import React, {Component, Fragment} from 'react';
import numeral from "numeral";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {getPaymentType, getShippingMethod} from "../constants/account";
import {ORDER_TYPE} from "../constants/orders";

class OrderFooter extends Component {
    static propTypes = {
        orderType: PropTypes.string,
        SalesTaxAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        DepositAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        TaxableAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        NonTaxableAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        FreightAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        DiscountAmt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        TaxSchedule: PropTypes.string,
        PaymentType: PropTypes.string,
        ShipVia: PropTypes.string,
        shippingAccount: PropTypes.shape({
            enabled: PropTypes.bool,
            value: PropTypes.string,
        }),
        renderForDetail: PropTypes.bool,
    };

    static defaultProps = {
        orderType: ORDER_TYPE.past,
        SalesTaxAmt: 0,
        DepositAmt: 0,
        TaxableAmt: 0,
        NonTaxableAmt: 0,
        FreightAmt: 0,
        DiscountAmt: 0,
        TaxSchedule: '',
        PaymentType: '',
        ShipVia: '',
        renderForDetail: true,
    };

    render() {
        const {orderType, NonTaxableAmt, TaxableAmt, SalesTaxAmt, TaxSchedule, FreightAmt, DiscountAmt, DepositAmt,
            shippingAccount, PaymentType, ShipVia, renderForDetail} = this.props;
        const subTotal = NonTaxableAmt + TaxableAmt;
        const total = subTotal + FreightAmt + SalesTaxAmt - DepositAmt - DiscountAmt;
        const freightTBD = !(orderType === ORDER_TYPE.invoices || (getShippingMethod(ShipVia).allowCustomerAccount && shippingAccount.enabled) || getPaymentType(PaymentType).prepaid);
        const colSpan = renderForDetail ? 3 : 1;
        return (
            <Fragment>
                <tr>
                    <th colSpan={colSpan} className="right">Sub Total</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{numeral(NonTaxableAmt + TaxableAmt).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>
                <tr>
                    <th colSpan={colSpan} className="right">Sales Tax {!!SalesTaxAmt ? TaxSchedule : ''}</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{numeral(SalesTaxAmt || 0).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>
                <tr>
                    <th colSpan={colSpan} className="right">Freight</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{freightTBD ? 'TBD' : numeral(FreightAmt || 0).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>
                {!!DiscountAmt && <tr>
                    <th colSpan={colSpan} className="right">Discount</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{numeral(DiscountAmt).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>}
                {!!DepositAmt && <tr>
                    <th colSpan={colSpan} className="right">Deposit</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{numeral(DepositAmt).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>}
                <tr className="order-detail total">
                    <th colSpan={colSpan} className="right">Total</th>
                    {renderForDetail && <th colSpan={2} className="d-none d-sm-table-cell">&nbsp;</th>}
                    <th className="right">{freightTBD ? 'TBD' : numeral(total).format('0,0.00')}</th>
                    {renderForDetail && <th>&nbsp;</th>}
                </tr>
            </Fragment>
        );
    }
}

const mapStateToProps = ({salesOrder, cart}) => {
    const {shippingAccount} = cart;
    return {
        shippingAccount,
    }
};
export default connect(mapStateToProps)(OrderFooter);
