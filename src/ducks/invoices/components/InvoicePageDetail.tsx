import React, {useState} from 'react';
import AddToCartModal from "../../../components/AddToCartModal";
import {useSelector} from "react-redux";
import {selectCurrentInvoice} from "../selectors";
import InvoiceDetailLine from "./InvoiceDetailLine";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import TableFooter from "@mui/material/TableFooter";
import {InvoiceDetail} from "b2b-types";
import InvoiceFooter from "./InvoiceFooter";

const InvoicePageDetail = () => {
    const invoice = useSelector(selectCurrentInvoice);
    const [addToCart, setAddToCart] = useState<InvoiceDetail | null>(null);

    if (!invoice) {
        return null
    }

    return (
        <>
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
                                                   onAddToCart={() => setAddToCart(line)}/>
                            ))
                        }
                    </TableBody>
                    <TableFooter>
                        <InvoiceFooter/>
                    </TableFooter>
                </Table>
            </TableContainer>

            {!!addToCart && (
                <AddToCartModal onClose={() => setAddToCart(null)}
                                itemCode={addToCart.ItemCode}
                                quantity={addToCart.QuantityOrdered}
                                comment={addToCart.CommentText}/>
            )}
        </>
    )
}

export default InvoicePageDetail;
