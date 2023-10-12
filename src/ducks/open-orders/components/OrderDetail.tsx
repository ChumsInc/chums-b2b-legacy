import React, {useState} from 'react';
import OrderDetailLine from "./OrderDetailLine";
import SalesOrderTotal from "./SalesOrderTotal";
import {CartItem, SalesOrderDetailLine} from "b2b-types";
import Dialog from "@mui/material/Dialog";
import {detailToCartItem} from "../../salesOrder/utils";
import {Button, DialogActions, DialogContent, DialogTitle} from "@mui/material";
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
        <div className="table-responsive-sm mt-3">
            <table className="table table-sm table-sticky">
                <thead>
                <tr className="order-detail">
                    <th>Item</th>
                    <th>Description</th>
                    <th>U/M</th>
                    <th className="text-end">Ordered</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">MSRP</th>
                    <th className="text-end">Item Price</th>
                    <th className="text-end">Ext Price</th>
                    <th className="text-center">Action</th>
                </tr>
                </thead>

                <tbody>
                {detail.map(line => (
                    <OrderDetailLine key={line.LineSeqNo} salesOrderNo={salesOrderNo} line={line}
                                     readOnly={!isCart}
                                     onAddToCart={addToCartHandler}/>
                ))}
                </tbody>
                <SalesOrderTotal salesOrderNo={salesOrderNo}/>
            </table>
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
        </div>
    )
}
