import React from 'react';
import OrderDetailLine from "@/ducks/salesOrder/components/OrderDetailLine";
import {useSelector} from "react-redux";
import SalesOrderTotal from "@/ducks/salesOrder/components/SalesOrderTotal";
import {useAppDispatch} from "@/app/configureStore";
import {selectIsCart, selectSortedDetail} from "@/ducks/salesOrder/selectors";
import {SalesOrderDetailLine} from "b2b-types";

export default function OrderDetail() {
    const dispatch = useAppDispatch();
    const detail = useSelector(selectSortedDetail);
    const isCart = useSelector(selectIsCart)

    const addToCartHandler = (line: SalesOrderDetailLine) => {

    }

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
        </div>
    )
}
