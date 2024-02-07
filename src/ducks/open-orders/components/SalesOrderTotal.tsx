import React from 'react';
import numeral from "numeral";
import {useSelector} from "react-redux";
import Decimal from "decimal.js";
import {getPaymentType, getShippingMethod} from "../../../constants/account";
import {selectShippingAccount} from "../../cart/selectors";
import {useAppSelector} from "../../../app/configureStore";
import {selectSalesOrder} from "../selectors";
import {calcOrderType} from "../../../utils/orders";
import TableFooter from "@mui/material/TableFooter";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

export default function SalesOrderTotal({salesOrderNo}: {
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
        <TableFooter>
            <TableRow>
                <TableCell component="th" scope="row" colSpan={5} align="right">Sub Total</TableCell>
                <TableCell colSpan={2}> </TableCell>
                <TableCell align="right">
                    {numeral(new Decimal(header.NonTaxableAmt).add(header.TaxableAmt)).format('$ 0,0.00')}
                </TableCell>
                <TableCell> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell component="th" scope="row" colSpan={5} align="right">
                    Sales Tax {!new Decimal(header.SalesTaxAmt).eq(0) ? header.TaxSchedule : ''}
                </TableCell>
                <TableCell colSpan={2}> </TableCell>
                <TableCell align="right">{numeral(header.SalesTaxAmt || 0).format('$ 0,0.00')}</TableCell>
                <TableCell> </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={5} align="right">Freight</TableCell>
                <TableCell colSpan={2}> </TableCell>
                <TableCell align="right">
                    {isFreightTBD() ? 'TBD' : numeral(header.FreightAmt ?? 0).format('$ 0,0.00')}
                </TableCell>
                <TableCell> </TableCell>
            </TableRow>
            {!new Decimal(header.DiscountAmt ?? 0).eq(0) && (
                <TableRow>
                    <TableCell colSpan={5} align="right">Discount</TableCell>
                    <TableCell colSpan={2}> </TableCell>
                    <TableCell align="right">{numeral(header.DiscountAmt).format('$ 0,0.00')}</TableCell>
                    <TableCell> </TableCell>
                </TableRow>)}
            {!new Decimal(header.DepositAmt ?? 0).eq(0) && (
                <TableRow>
                    <TableCell colSpan={5} align="right">Deposit</TableCell>
                    <TableCell colSpan={2}> </TableCell>
                    <TableCell align="right">{numeral(header.DepositAmt).format('$ 0,0.00')}</TableCell>
                    <TableCell> </TableCell>
                </TableRow>)}
            <TableRow>
                <TableCell colSpan={5} align="right">Total</TableCell>
                <TableCell colSpan={2}> </TableCell>
                <TableCell
                    align="right">{isFreightTBD() ? 'TBD' : numeral(total.toString()).format('$ 0,0.00')}</TableCell>
                <TableCell> </TableCell>
            </TableRow>
        </TableFooter>
    )
}
