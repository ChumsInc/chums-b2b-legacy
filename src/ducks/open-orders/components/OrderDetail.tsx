import React, {useState} from 'react';
import OrderDetailLine from "./OrderDetailLine";
import SalesOrderTotal from "./SalesOrderTotal";
import {CartItem, SalesOrderDetailLine} from "b2b-types";
import Dialog from "@mui/material/Dialog";
import {detailToCartItem} from "../../salesOrder/utils";
import {
    Button,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import AddToCartForm from "../../cart/components/AddToCartForm";
import {selectSalesOrderDetail, selectSalesOrderIsCart} from "../selectors";
import {useAppSelector} from "../../../app/configureStore";
import ItemAutocomplete from "../../item-lookup/ItemAutocomplete";

export default function OrderDetail({salesOrderNo}: {
    salesOrderNo?: string;
}) {
    const detail = useAppSelector((state) => selectSalesOrderDetail(state, salesOrderNo ?? ''));
    const isCart = useAppSelector((state) => selectSalesOrderIsCart(state, salesOrderNo ?? ''));
    const [cartItem, setCartItem] = useState<CartItem | null>(null)

    const addToCartHandler = (line: SalesOrderDetailLine) => {
        setCartItem(detailToCartItem(line));
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
                    <AddToCartForm itemCode={cartItem?.itemCode ?? ''}
                                   quantity={cartItem?.quantity ?? 1} onChangeQuantity={quantityChangeHandler}
                                   unitOfMeasure={'EA'}
                                   excludeSalesOrder={salesOrderNo}
                                   onDone={() => setCartItem(null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => setCartItem(null)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    )
}
