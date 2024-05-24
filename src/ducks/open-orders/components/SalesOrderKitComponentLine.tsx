import React from 'react';
import {Editable, SalesOrderDetailLine} from "b2b-types";
import {Appendable} from "../../../types/generic";
import classNames from "classnames";
import OrderItemImage from "../../../components/OrderItemImage";
import UPCA from "../../../common/upc-a";
import AvailabilityAlert from "../../../components/AvailabilityAlert";
import numeral from "numeral";
import Decimal from "decimal.js";
import SalesOrderLineButtons from "./SalesOrderLineButtons";
import {TableCell, TableRow} from "@mui/material";

export default function SalesOrderKitComponentLine({
                                                       line,
                                                       readOnly,
                                                       onAddToCart,
                                                   }: {
    line: SalesOrderDetailLine & Editable & Appendable;
    readOnly?: boolean;
    onAddToCart?: () => void;
}) {
    const unitPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent).div(100)).times(new Decimal(line.UnitPrice).div(line.UnitOfMeasureConvFactor ?? 1));
    const itemPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent).div(100)).times(line.UnitPrice);

    const rowClassName = {};
    return (
        <TableRow sx={{verticalAlign: 'top'}} className={classNames(rowClassName)}>
            <TableCell>
                <div>{line.ItemCode}</div>
                {line.ItemType === '1' &&
                    <OrderItemImage itemCode={line.ItemCode} itemCodeDesc={line.ItemCodeDesc} image={line.image}/>}
            </TableCell>
            <TableCell>
                <p>{line.ItemCodeDesc}</p>
                {!!line.UDF_UPC && <p>{UPCA.format(line.UDF_UPC)}</p>}
                {!readOnly && (
                    <AvailabilityAlert QuantityOrdered={line.QuantityOrdered}
                                       QuantityAvailable={line.QuantityAvailable}/>
                )}
            </TableCell>
            <TableCell>{line.UnitOfMeasure}</TableCell>
            <TableCell className="text-end">
                {numeral(line.QuantityOrdered).format('0,0')}
            </TableCell>
            <TableCell className="right">
                {numeral(unitPrice).format('0,0.00')}
            </TableCell>
            <TableCell className="right hidden-xs">{numeral(line.SuggestedRetailPrice).format('0,0.00')}</TableCell>
            <TableCell className="right hidden-xs">{numeral(itemPrice).format('0,0.00')}</TableCell>
            <TableCell className="right">{numeral(new Decimal(line.QuantityOrdered).times(itemPrice)).format('0,0.00')}</TableCell>
            <TableCell className="right">
                <SalesOrderLineButtons onCopyToCart={onAddToCart}
                                       copyToCartDisabled={readOnly || (!line.ProductType || line.ProductType === 'D' || line.InactiveItem === 'Y' || line.ItemType !== '1')}
                />
            </TableCell>
        </TableRow>
    )
}


