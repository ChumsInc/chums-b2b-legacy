import React, {useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentInvoice} from "../selectors";
import InvoiceDetailLine from "./InvoiceDetailLine";
import TableFooter from "@mui/material/TableFooter";
import {CartProduct, InvoiceHistoryDetail} from "b2b-types";
import InvoiceFooter from "./InvoiceFooter";
import AddToCartForm from "../../cart/components/AddToCartForm";
import Dialog from "@mui/material/Dialog";
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableCell from "@mui/material/TableCell";
import TableBody from '@mui/material/TableBody';
import TableRow from "@mui/material/TableRow";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

const InvoicePageDetail = () => {
    const invoice = useSelector(selectCurrentInvoice);
    const [cartItem, setCartItem] = useState<CartProduct | null>(null);
    const [unitOfMeasure, setUnitOfMeasure] = useState<string>('EA');

    const addToCartHandler = (line: InvoiceHistoryDetail) => {
        setUnitOfMeasure(line.UnitOfMeasure);
        const item: CartProduct = {
            itemCode: line.ItemCode,
            quantity: +line.QuantityOrdered,
            comment: line.CommentText,
            name: line.ItemCodeDesc,
            productId: 0,
            image: ''
        }
        setCartItem(item);
    }

    const quantityChangeHandler = (quantity: number) => {
        if (!cartItem) {
            return;
        }
        setCartItem({...cartItem, quantity});
    }


    if (!invoice) {
        return null
    }

    const open = !!cartItem;

    return (
        <TableContainer sx={{mt: 3}}>
            <Table size="small">
                <TableHead>
                    <TableRow className="order-detail">
                        <TableCell>Item</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>U/M</TableCell>
                        <TableCell align="right">Ordered</TableCell>
                        <TableCell align="right">Unit Price</TableCell>
                        <TableCell align="right" sx={{display: {xs: 'none', md: 'table-cell'}}}>MSRP</TableCell>
                        <TableCell align="right" sx={{display: {xs: 'none', md: 'table-cell'}}}>Item
                            Price</TableCell>
                        <TableCell align="right">Ext Price</TableCell>
                        <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[...invoice.Detail]
                        .sort((a, b) => Number(a.DetailSeqNo) - Number(b.DetailSeqNo))
                        .map(line => (
                            <InvoiceDetailLine key={line.DetailSeqNo} line={line}
                                               onAddToCart={addToCartHandler}/>
                        ))
                    }
                </TableBody>
                <TableFooter>
                    <InvoiceFooter/>
                </TableFooter>
            </Table>
            <Dialog open={open} onClose={() => setCartItem(null)}>
                <DialogTitle>Add &apos;{cartItem?.itemCode}&apos; To Cart</DialogTitle>
                <DialogContent>
                    {!!cartItem && (
                        <AddToCartForm cartItem={cartItem}
                                       unitOfMeasure={unitOfMeasure}
                                       quantity={cartItem?.quantity ?? 1} onChangeQuantity={quantityChangeHandler}
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

export default InvoicePageDetail;
