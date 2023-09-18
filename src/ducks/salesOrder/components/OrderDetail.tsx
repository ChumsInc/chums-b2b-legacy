import React, {useState} from 'react';
import OrderDetailLine from "@/ducks/salesOrder/components/OrderDetailLine";
import {useSelector} from "react-redux";
import SalesOrderTotal from "@/ducks/salesOrder/components/SalesOrderTotal";
import {useAppDispatch} from "@/app/configureStore";
import {selectIsCart, selectSortedDetail} from "@/ducks/salesOrder/selectors";
import {CartItem, SalesOrderDetailLine} from "b2b-types";
import Dialog from "@mui/material/Dialog";
import {detailToCartItem} from "@/ducks/salesOrder/utils";
import {DialogContent, DialogTitle} from "@mui/material";
import AddToCartForm from "@/ducks/cart/components/AddToCartForm";

export default function OrderDetail() {
    const detail = useSelector(selectSortedDetail);
    const isCart = useSelector(selectIsCart);
    const [cartItem, setCartItem] = useState<CartItem|null>(null)

    const addToCartHandler = (line: SalesOrderDetailLine) => {
        setCartItem(detailToCartItem(line));
    }

    const quantityChangeHandler = (quantity:number) => {
        if (!cartItem) {
            return;
        }
        setCartItem({...cartItem, quantity});
    }

    const open = !!cartItem;
    return (
        <div className="table-responsive-sm mt-3">
            <table className="table table-sm table-sticky">
                <thead>
                <tr className="order-detail">
                    <th>Item</th>
                    <th>Description</th>
                    <th>U/M</th>
                    <th>Ordered</th>
                    <th className="text-end">Unit Price</th>
                    <th className="text-end">MSRP</th>
                    <th className="text-end">Item Price</th>
                    <th className="text-end">Ext Price</th>
                    <th className="text-center">Action</th>
                </tr>
                </thead>

                <tbody>
                {detail.map(line => (
                    <OrderDetailLine key={line.LineSeqNo} line={line}
                                     readOnly={!isCart}
                                     onAddToCart={addToCartHandler}/>
                ))}
                </tbody>
                <SalesOrderTotal/>
            </table>
            <Dialog open={open}>
                <DialogTitle>Add {cartItem?.itemCode} To Cart</DialogTitle>
                <DialogContent>
                    <AddToCartForm itemCode={cartItem?.itemCode ?? ''}
                                   quantity={cartItem?.quantity ?? 1} onChangeQuantity={quantityChangeHandler}
                                   onDone={() => setCartItem(null)}
                                   />
                </DialogContent>
            </Dialog>
        </div>
    )
}
