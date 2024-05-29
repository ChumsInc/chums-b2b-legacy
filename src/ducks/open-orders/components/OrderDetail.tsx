import React, {useEffect, useState} from 'react';
import OrderDetailLine from "./OrderDetailLine";
import SalesOrderTotal from "./SalesOrderTotal";
import {CartProduct, SalesOrderDetailLine} from "b2b-types";
import Dialog from "@mui/material/Dialog";
import {detailToCartItem} from "../../sales-order/utils";
import AddToCartForm from "../../cart/components/AddToCartForm";
import {selectSalesOrder, selectSalesOrderDetail, selectSalesOrderIsCart} from "../selectors";
import {useAppSelector} from "../../../app/configureStore";
import {sendGtagEvent} from "../../../api/gtag";
import Decimal from "decimal.js";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from '@mui/material/TableBody';
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function OrderDetail({salesOrderNo}: {
    salesOrderNo?: string;
}) {
    const detail = useAppSelector((state) => selectSalesOrderDetail(state, salesOrderNo ?? ''));
    const isCart = useAppSelector((state) => selectSalesOrderIsCart(state, salesOrderNo ?? ''));
    const salesOrderHeader = useAppSelector((state) => selectSalesOrder(state, salesOrderNo ?? ''));
    const [cartItem, setCartItem] = useState<CartProduct | null>(null)
    const [unitOfMeasure, setUnitOfMeasure] = useState<string>('EA');

    useEffect(() => {
        if (salesOrderHeader && isCart && detail.length) {
            sendGtagEvent('view_cart', {
                currency: 'USD',
                value: new Decimal(salesOrderHeader.TaxableAmt).add(salesOrderHeader.NonTaxableAmt).sub(salesOrderHeader.DiscountAmt).toNumber(),
                items: detail.map(item => ({
                    item_id: item.ItemCode,
                    item_name: item.ItemCodeDesc,
                    quantity: +item.QuantityOrdered,
                    price: new Decimal(item.ExtensionAmt).toNumber()
                }))
            })
        }
    }, [salesOrderHeader, isCart, detail]);

    const addToCartHandler = (line: SalesOrderDetailLine) => {
        setUnitOfMeasure(line.UnitOfMeasure);
        const item = detailToCartItem(line);
        if (!item) {
            setCartItem(null);
            return;
        }
        setCartItem({...item, name: line.ItemCodeDesc, productId: 0, image: ''});
    }

    const quantityChangeHandler = (quantity: number) => {
        if (!cartItem) {
            return;
        }
        setCartItem({...cartItem, quantity});
    }

    const open = !!cartItem;
    if (!salesOrderNo) {
        return null;
    }
    return (
        <TableContainer sx={{mt: 3}}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>U/M</TableCell>
                        <TableCell align="right">Ordered</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right">MSRP</TableCell>
                        <TableCell align="right">Item Price</TableCell>
                        <TableCell align="right">Ext Price</TableCell>
                        <TableCell align="center">Action</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {detail.map(line => (
                        <OrderDetailLine key={line.LineSeqNo} salesOrderNo={salesOrderNo} line={line}
                                         readOnly={!isCart}
                                         onAddToCart={addToCartHandler}/>
                    ))}
                </TableBody>
                <SalesOrderTotal salesOrderNo={salesOrderNo}/>
            </Table>
            <Dialog open={open} onClose={() => setCartItem(null)}>
                <DialogTitle>Add {cartItem?.itemCode} To Cart</DialogTitle>
                <DialogContent>
                    {!!cartItem && (
                        <AddToCartForm cartItem={cartItem}
                                       unitOfMeasure={unitOfMeasure}
                                       quantity={cartItem?.quantity ?? 1} onChangeQuantity={quantityChangeHandler}
                                       excludeSalesOrder={salesOrderNo}
                                       onDone={() => setCartItem(null)}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setCartItem(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    )
}
