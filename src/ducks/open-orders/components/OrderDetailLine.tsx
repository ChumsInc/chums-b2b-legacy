import React, {Fragment, useState} from 'react';
import SalesOrderCommentLine from "./SalesOrderCommentLine";
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "../../../types/generic";
import {useAppDispatch} from "../../../app/configureStore";
import {updateDetailLine} from "../actions";
import SalesOrderItemLine from "./SalesOrderItemLine";
import SalesOrderKitComponentLine from "./SalesOrderKitComponentLine";


export default function OrderDetailLine({
                                            salesOrderNo,
                                            line,
                                            readOnly,
                                            customerPriceLevel,
                                            onAddToCart,
                                        }: {
    salesOrderNo: string;
    line: SalesOrderDetailLine & Editable & Appendable;
    readOnly?: boolean;
    customerPriceLevel?: string;
    onAddToCart?: (line: SalesOrderDetailLine) => void;
}) {
    const dispatch = useAppDispatch();
    const [addComment, setAddComment] = useState(false);
    const {LineKey} = line;

    const deleteHandler = () => {
        if (readOnly) {
            return;
        }
        dispatch(updateDetailLine({SalesOrderNo: salesOrderNo, LineKey: line.LineKey, QuantityOrdered: 0}));
    }

    const deleteCommentHandler = () => {
        if (readOnly) {
            return;
        }
        dispatch(updateDetailLine({SalesOrderNo: salesOrderNo, LineKey: line.LineKey, CommentText: ''}));
        setAddComment(false);
    }

    const quantityChangeHandler = (value: string | number) => {
        if (readOnly) {
            return;
        }
        dispatch(updateDetailLine({SalesOrderNo: salesOrderNo, LineKey, QuantityOrdered: value}));
    }

    const commentChangeHandler = (value: string) => {
        if (readOnly) {
            return;
        }
        dispatch(updateDetailLine({SalesOrderNo: salesOrderNo, LineKey, CommentText: value}));
    }

    const addToCartHandler = () => {
        if (!!onAddToCart) {
            onAddToCart(line);
        }
    }

    const isKitComponent = !!line.SalesKitLineKey && line.SalesKitLineKey !== line.LineKey;
    return (
        <>
            {line.ItemType !== '4' && !isKitComponent && (
                <SalesOrderItemLine line={line} customerPriceLevel={customerPriceLevel} readOnly={readOnly}
                                    onDelete={deleteHandler} onAddToCart={addToCartHandler}
                                    onChangeQuantity={quantityChangeHandler} onChangeComment={commentChangeHandler}/>
            )}
            {line.ProductType === 'K' && line.ExplodedKitItem === 'Y' && (
                <tr>
                    <td>&nbsp;</td>
                    <td colSpan={4}>Contains:</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                </tr>
            )}
            {line.ItemType !== '4' && isKitComponent && (
                <SalesOrderKitComponentLine line={line} readOnly={readOnly}
                                            onAddToCart={addToCartHandler}/>
            )}


            {(line.ItemType === '4' && line.ItemCode === '/C') && (
                <SalesOrderCommentLine line={line} onChange={commentChangeHandler} onDelete={deleteCommentHandler}/>
            )}
        </>
    )
}
