import React, {useState} from 'react';
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "@/types/generic";
import classNames from "classnames";
import OrderItemImage from "@/components/OrderItemImage";
import UPCA from "../../../common/upc-a";
import AvailabilityAlert from "@/components/AvailabilityAlert";
import numeral from "numeral";
import CartQuantityInput from "@/components/CartQuantityInput";
import PriceLevelNotice from "@/components/PriceLevelNotice";
import Decimal from "decimal.js";
import SalesOrderLineButtons from "@/ducks/salesOrder/components/SalesOrderLineButtons";
import SalesOrderCommentLine from "@/ducks/salesOrder/components/SalesOrderCommentLine";

export default function SalesOrderItemLine({
                                               line,
                                               readOnly,
                                               customerPriceLevel,
                                               onChangeQuantity,
                                               onChangeComment,
                                               onDelete,
                                               onAddToCart,
                                           }: {
    line: SalesOrderDetailLine & Editable & Appendable;
    readOnly?: boolean;
    customerPriceLevel?: string;
    onChangeQuantity: (value: string | number) => void;
    onChangeComment: (value: string) => void;
    onDelete?: () => void;
    onAddToCart?: () => void;
}) {
    const [showCommentInput, setShowCommentInput] = useState(!!line.CommentText);
    const unitPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent).div(100)).times(new Decimal(line.UnitPrice).div(line.UnitOfMeasureConvFactor ?? 1));
    const itemPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent).div(100)).times(line.UnitPrice);

    const deleteCommentHandler = () => {
        setShowCommentInput(false);
        onChangeComment('');
    }

    const rowClassName = {
        'table-warning': line.changed,
    };
    return (
        <>
            <tr className={classNames("order-detail", rowClassName)}>
                <td rowSpan={showCommentInput ? 2 : 1}>
                    <div>{line.ItemCode}</div>
                    {line.ItemType === '1' &&
                        <OrderItemImage ItemCode={line.ItemCode} ItemCodeDesc={line.ItemCodeDesc} image={line.image}/>}
                </td>
                <td>
                    <p>{line.ItemCodeDesc}</p>
                    {!!line.UDF_UPC && <p>{UPCA.format(line.UDF_UPC)}</p>}
                    {!readOnly && (
                        <AvailabilityAlert QuantityOrdered={line.QuantityOrdered}
                                           QuantityAvailable={line.QuantityAvailable}/>
                    )}
                </td>
                <td>{line.UnitOfMeasure}</td>
                <td>
                    <CartQuantityInput quantity={+line.QuantityOrdered} min={0}
                                       disabled={readOnly}
                                       onChange={onChangeQuantity}/>
                </td>
                <td className="text-end">
                    <div>{numeral(unitPrice).format('0,0.00')}</div>
                    {!!line.LineDiscountPercent && (<div className="sale">{line.LineDiscountPercent}% Off</div>)}
                    {!!line.PriceLevel && line.PriceLevel !== customerPriceLevel && (
                        <PriceLevelNotice PriceLevel={line.PriceLevel}/>)}
                </td>
                <td className="text-end">{numeral(line.SuggestedRetailPrice).format('0,0.00')}</td>
                <td className="text-end">{numeral(itemPrice).format('0,0.00')}</td>
                <td className="text-end">{numeral(new Decimal(line.QuantityOrdered).times(itemPrice)).format('0,0.00')}</td>
                <td rowSpan={showCommentInput ? 2 : 1}>
                    <SalesOrderLineButtons onDelete={onDelete} deleteDisabled={readOnly}
                                           onAddComment={() => setShowCommentInput(true)}
                                           addCommentDisabled={readOnly || showCommentInput || !!line.CommentText}
                                           onCopyToCart={onAddToCart}
                                           copyToCartDisabled={readOnly || (!line.ProductType || line.ProductType === 'D' || line.InactiveItem === 'Y' || line.ItemType !== '1')}
                    />
                </td>
            </tr>
            {showCommentInput && (
                <SalesOrderCommentLine line={line} onChange={onChangeComment}
                                       readOnly={readOnly} onDelete={deleteCommentHandler}/>
            )}
        </>
    )
}


