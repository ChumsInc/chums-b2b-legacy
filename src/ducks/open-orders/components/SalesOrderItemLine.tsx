import React, {useState} from 'react';
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "../../../types/generic";
import classNames from "classnames";
import OrderItemImage from "../../../components/OrderItemImage";
import UPCA from "../../../common/upc-a";
import AvailabilityAlert from "../../../components/AvailabilityAlert";
import numeral from "numeral";
import CartQuantityInput from "../../../components/CartQuantityInput";
import PriceLevelNotice from "../../../components/PriceLevelNotice";
import Decimal from "decimal.js";
import SalesOrderLineButtons from "./SalesOrderLineButtons";
import SalesOrderCommentLine from "./SalesOrderCommentLine";
import {TableCell, TableRow} from "@mui/material";
import FormattedUPC from "../../../components/FormattedUPC";
import Typography from "@mui/material/Typography";

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
    const commentRef = React.createRef<HTMLInputElement>();
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

    const addCommentClickHandler = () => {
        setShowCommentInput(true);
        commentRef.current?.focus();
    }

    return (
        <>
            <TableRow sx={{
                '& > *:not([rowspan="2"])': {borderBottom: showCommentInput ? 'unset' : undefined},
                verticalAlign: 'top'
            }}
                      className={classNames(rowClassName)}>
                <TableCell rowSpan={showCommentInput ? 2 : 1}>
                    <Typography variant="body1" sx={{fontWeight: 700}}>{line.ItemCode}</Typography>
                    {line.ItemType === '1' &&
                        <OrderItemImage ItemCode={line.ItemCode} ItemCodeDesc={line.ItemCodeDesc} image={line.image}/>}
                </TableCell>
                <TableCell>
                    <Typography variant="body1">{line.ItemCodeDesc}</Typography>
                    {!!line.UDF_UPC && <FormattedUPC value={line.UDF_UPC} />}
                    {!readOnly && (
                        <AvailabilityAlert QuantityOrdered={line.QuantityOrdered}
                                           QuantityAvailable={line.QuantityAvailable}/>
                    )}
                </TableCell>
                <TableCell>{line.UnitOfMeasure}</TableCell>
                <TableCell align="right">
                    {readOnly && (<span>{line.QuantityOrdered}</span>)}
                    {!readOnly && (
                        <CartQuantityInput quantity={+line.QuantityOrdered} min={0}
                                           unitOfMeasure={line.UnitOfMeasure}
                                           disabled={readOnly}
                                           onChange={onChangeQuantity}/>
                    )}
                </TableCell>
                <TableCell align="right">
                    <div>{numeral(unitPrice).format('0,0.00')}</div>
                    {!!line.LineDiscountPercent && (<div className="sale">{line.LineDiscountPercent}% Off</div>)}
                    {!!line.PriceLevel && line.PriceLevel !== customerPriceLevel && (
                        <PriceLevelNotice priceLevel={line.PriceLevel}/>)}
                </TableCell>
                <TableCell align="right">{numeral(line.SuggestedRetailPrice).format('0,0.00')}</TableCell>
                <TableCell align="right">{numeral(itemPrice).format('0,0.00')}</TableCell>
                <TableCell
                    align="right">{numeral(new Decimal(line.QuantityOrdered).times(itemPrice)).format('0,0.00')}</TableCell>
                <TableCell rowSpan={showCommentInput ? 2 : 1}>
                    <SalesOrderLineButtons onDelete={onDelete} deleteDisabled={readOnly}
                                           onAddComment={addCommentClickHandler}
                                           addCommentDisabled={readOnly || showCommentInput || !!line.CommentText}
                                           onCopyToCart={onAddToCart}
                                           copyToCartDisabled={(!line.ProductType || line.ProductType === 'D' || line.InactiveItem === 'Y' || line.ItemType !== '1')}
                    />
                </TableCell>
            </TableRow>
            {showCommentInput && (
                <SalesOrderCommentLine line={line} ref={commentRef}
                                       onChange={onChangeComment}
                                       readOnly={readOnly} onDelete={deleteCommentHandler}/>
            )}
        </>
    )
}


