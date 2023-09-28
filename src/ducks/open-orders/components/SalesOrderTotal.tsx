import React from 'react';
import numeral from "numeral";
import {useSelector} from "react-redux";
import {selectOrderType, selectSalesOrderHeader} from "../../salesOrder/selectors";
import Decimal from "decimal.js";
import {ORDER_TYPE} from "../../../constants/orders";
import {getPaymentType, getShippingMethod} from "../../../constants/account";
import {selectShippingAccount} from "../../cart/selectors";
import {useAppSelector} from "../../../app/configureStore";
import {selectSalesOrder} from "../selectors";
import {calcOrderType} from "../../../utils/orders";

export default function SalesOrderTotal({salesOrderNo}:{
    salesOrderNo?: string;
}) {
    const header = useAppSelector((state) => selectSalesOrder(state, salesOrderNo ?? ''));
    const shippingAccount = useSelector(selectShippingAccount);
    if (!header) {
        return null;
    }

    const subTotal = new Decimal(header.NonTaxableAmt).add(header.TaxableAmt);
    const total = subTotal.add(header.FreightAmt ?? 0).add(header.SalesTaxAmt ?? 0).sub(header.DepositAmt ?? 0).sub(header.DiscountAmt ?? 0);

    const isFreightTBD = () => {
        const orderType = calcOrderType(header);
        switch (orderType) {
            case 'cart':
                return !(getShippingMethod(header.ShipVia)?.allowCustomerAccount && shippingAccount.enabled)
            case 'invoice':
                return false;
            default:
                return !(getShippingMethod(header.ShipVia)?.allowCustomerAccount && shippingAccount.enabled)
                    || !getPaymentType(header.PaymentType).prepaid
        }
    }

    return (
        <tfoot>
        <tr>
            <th colSpan={5} className="text-end">Sub Total</th>
            <th colSpan={2}> </th>
            <th className="text-end">
                {numeral(new Decimal(header.NonTaxableAmt).add(header.TaxableAmt)).format('0,0.00')}
            </th>
            <th> </th>
        </tr>
        <tr>
            <th colSpan={5} className="text-end">Sales
                Tax {!new Decimal(header.SalesTaxAmt).eq(0) ? header.TaxSchedule : ''}</th>
            <th colSpan={2}> </th>
            <th className="right">{numeral(header.SalesTaxAmt || 0).format('0,0.00')}</th>
            <th> </th>
        </tr>
        <tr>
            <th colSpan={5} className="text-end">Freight</th>
            <th colSpan={2}> </th>
            <th className="right">{isFreightTBD() ? 'TBD' : numeral(header.FreightAmt ?? 0).format('0,0.00')}</th>
            <th> </th>
        </tr>
        {!new Decimal(header.DiscountAmt ?? 0).eq(0) && <tr>
            <th colSpan={5} className="text-end">Discount</th>
            <th colSpan={2}> </th>
            <th className="right">{numeral(header.DiscountAmt).format('0,0.00')}</th>
            <th> </th>
        </tr>}
        {!new Decimal(header.DepositAmt ?? 0).eq(0) && <tr>
            <th colSpan={5} className="text-end">Deposit</th>
            <th colSpan={2}> </th>
            <th className="right">{numeral(header.DepositAmt).format('0,0.00')}</th>
            <th> </th>
        </tr>}
        <tr className="order-detail total">
            <th colSpan={5} className="text-end">Total</th>
            <th colSpan={2}> </th>
            <th className="right">{isFreightTBD() ? 'TBD' : numeral(total.toString()).format('0,0.00')}</th>
            <th> </th>
        </tr>
        </tfoot>
    )
}
