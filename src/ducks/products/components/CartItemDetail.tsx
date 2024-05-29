import React from 'react';
import numeral from "numeral";
import Alert from "@mui/material/Alert";
import CartItemPriceDescription from "../../../components/CartItemPriceDescription";
import {useSelector} from "react-redux";
import {selectCanViewAvailable} from "../../user/selectors";
import Decimal from "decimal.js";
import {CartProduct} from "b2b-types";
import {styled, useTheme} from '@mui/material/styles'
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import Collapse from "@mui/material/Collapse";
import Table from '@mui/material/Table';
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";


const CartItemDetailTableTHCell = styled(TableCell)`
    font-weight: 400;
    font-size: 16px;
    color: 'inherit';
`;

const CartItemDetailTableTDCell = styled(TableCell)`
    font-weight: 600;
    font-size: 16px;
    color: 'inherit';
`

const CartItemDetail = ({cartItem, msrp}: {
    cartItem: CartProduct | null;
    msrp?: (string | number | null | undefined)[]
}) => {
    const canViewAvailable = useSelector(selectCanViewAvailable);
    const theme = useTheme();

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
        <Box sx={{mt: 3}}>
            <Collapse in={!!cartItem.message}>
                <Alert severity="info">{cartItem.message}</Alert>
            </Collapse>
            <Table size="small">
                <TableBody>
                    {((!msrp || msrp.length > 1) || (cartItem.salesUMFactor ?? 1) > 1)
                        && new Decimal(cartItem.msrp ?? 0).gt(0)
                        && (
                            <TableRow>
                                <CartItemDetailTableTHCell component="th" scope="row"
                                                           align="left">MSRP</CartItemDetailTableTHCell>
                                <CartItemDetailTableTDCell
                                    align="right">$ {numeral(cartItem.msrp ?? 0).format('0,0.00')} ({cartItem.stdUM})</CartItemDetailTableTDCell>
                            </TableRow>
                        )}
                    <TableRow>
                        <CartItemDetailTableTHCell component="th" scope="row" align="left">
                            Your Price
                            <CartItemPriceDescription priceCodeRecord={cartItem.priceCodeRecord ?? null}
                                                      priceLevel={cartItem.priceLevel}/>
                        </CartItemDetailTableTHCell>
                        <CartItemDetailTableTDCell
                            align="right">$ {numeral(cartItem.price).format('0,0.00')} ({cartItem.salesUM})</CartItemDetailTableTDCell>
                    </TableRow>
                    <TableRow>
                        <CartItemDetailTableTHCell component="th" scope="row" align="left">Ext
                            Price</CartItemDetailTableTHCell>
                        <CartItemDetailTableTDCell
                            align="right">$ {numeral(new Decimal(cartItem.price ?? 0).times(cartItem.quantity)).format('0,0.00')}</CartItemDetailTableTDCell>
                    </TableRow>
                    <TableRow>
                        <CartItemDetailTableTHCell component="th" scope="row"
                                                   align="left">ROI</CartItemDetailTableTHCell>
                        <CartItemDetailTableTDCell
                            align="right">$ {numeral(roi.toString()).format('0,0.00')}</CartItemDetailTableTDCell>
                    </TableRow>
                    <TableRow className="item-code">
                        <CartItemDetailTableTHCell component="th" scope="row"
                                                   align="left">SKU</CartItemDetailTableTHCell>
                        <CartItemDetailTableTDCell align="right">{cartItem.itemCode}</CartItemDetailTableTDCell>
                    </TableRow>
                    {canViewAvailable && (
                        <TableRow
                            sx={{color: ((cartItem.quantityAvailable ?? 0) <= 0 ? theme.palette.error.main : undefined)}}>
                            <CartItemDetailTableTHCell component="th" scope="row" align="left" sx={{color: 'inherit'}}>Available
                                Today</CartItemDetailTableTHCell>
                            <CartItemDetailTableTDCell align="right"
                                                       sx={{color: 'inherit'}}>{numeral(availableToday.toString()).format('0,0')} ({cartItem.salesUM})</CartItemDetailTableTDCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            {new Decimal(cartItem.quantity ?? 1).gt(availableToday) && (
                <Alert severity="warning">Product is not available for immediate delivery.</Alert>
            )}
        </Box>
    )
}

export default CartItemDetail;
