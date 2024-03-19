import React, {Fragment} from 'react';
import classNames from "classnames";
import numeral from "numeral";
import OrderItemImage from "../../../components/OrderItemImage";
import PriceLevelNotice from "../../../components/PriceLevelNotice";
import UPCA from "../../../common/upc-a";
import {InvoiceDetail} from "b2b-types";
import {TableCell, TableRow} from "@mui/material";
import Decimal from "decimal.js";
import SalesOrderLineButtons from "../../open-orders/components/SalesOrderLineButtons";
import FormattedUPC from "../../../components/FormattedUPC";
import Typography from "@mui/material/Typography";


const InvoiceDetailLine = ({line, onAddToCart}:{line:InvoiceDetail, onAddToCart: (line:InvoiceDetail) => void}) => {
    const {
        ItemType, ItemCode, ItemCodeDesc, UnitOfMeasure, UnitOfMeasureConvFactor = 1,
        QuantityOrdered, ProductType, InactiveItem, ExplodedKitItem, PriceLevel,
        UnitPrice, LineDiscountPercent, ExtensionAmt, SuggestedRetailPrice, UDF_UPC, CommentText
    } = line;
    const isKitComponent = line.KitItem === 'N' && line.ExplodedKitItem === 'C';

    const rowClassName = {
        'item-comment': ItemType !== '4' && !!CommentText,
        'line-comment': ItemType === '4',
        'kit-item': ProductType === 'K' && ExplodedKitItem === 'Y'
    };

    const unitPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent ?? 0).div(100)).times(new Decimal(line.UnitPrice ?? 0).div(line.UnitOfMeasureConvFactor ?? 1)).toString();
    const itemPrice = new Decimal(1).sub(new Decimal(line.LineDiscountPercent ?? 0).div(100)).times(line.UnitPrice ?? 0).toString();

    const showComment = ItemType !== '4' && !!CommentText;

    return (
        <Fragment>
            {!(ItemType === '4' && ItemCode === '/C') && !isKitComponent && (
                <TableRow sx={{
                    '& > *:not([rowspan="2"])': {borderBottom: showComment ? 'unset' : undefined},
                    verticalAlign: 'top'
                }}>
                    <TableCell rowSpan={showComment ? 2 : 1}>
                        <Typography variant="body1" sx={{fontWeight: 700}}>{line.ItemCode}</Typography>
                        {ItemType === '1' &&
                            <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc} image={null}/>}
                    </TableCell>
                    <TableCell>
                        <p>{ItemCodeDesc}</p>
                        {!!UDF_UPC && <FormattedUPC value={line.UDF_UPC} />}
                    </TableCell>
                    <TableCell>{UnitOfMeasure || null}</TableCell>
                    <TableCell align="right">
                        {numeral(line.QuantityOrdered).format('0,0')}
                    </TableCell>
                    <TableCell align="right">
                        <div>{numeral(unitPrice).format('0,0.00')}</div>
                        {!!LineDiscountPercent && (<div className="sale">{LineDiscountPercent}% Off</div>)}
                        {!!PriceLevel && (<PriceLevelNotice priceLevel={PriceLevel}/>)}
                    </TableCell>
                    <TableCell  align="right" sx={{display: {xs: 'none', md: 'table-cell'}}}>{numeral(SuggestedRetailPrice).format('0,0.00')}</TableCell>
                    <TableCell  align="right" sx={{display: {xs: 'none', md: 'table-cell'}}}>{numeral(itemPrice).format('0,0.00')}</TableCell>
                    <TableCell align="right">{numeral(new Decimal(line.QuantityOrdered ?? 0).times(itemPrice).toString()).format('0,0.00')}</TableCell>
                    <TableCell rowSpan={showComment ? 2 : 1}>
                        <SalesOrderLineButtons onCopyToCart={() => onAddToCart(line)}
                                               copyToCartDisabled={(!line.ProductType || line.ProductType === 'D' || line.InactiveItem === 'Y' || line.ItemType !== '1')}
                        />
                    </TableCell>
                </TableRow>
            )}

            {!(ItemType === '4' && ItemCode === '/C') && isKitComponent && (
                <TableRow sx={{
                    verticalAlign: 'top'
                }}>
                    <TableCell>
                        {/*{ItemType === '1' && false && <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc}/>}*/}
                    </TableCell>
                    <TableCell>
                        <p>{ItemCodeDesc}</p>
                        {!!UDF_UPC && <p>{UPCA.format(UDF_UPC)}</p>}
                    </TableCell>
                    <TableCell>{UnitOfMeasure || null}</TableCell>
                    <TableCell align="right">{numeral(QuantityOrdered).format('0,0')}</TableCell>
                    <TableCell align="right">&nbsp;</TableCell>
                    <TableCell  sx={{display: {xs: 'none', md: 'table-cell'}}} align="right">{numeral(SuggestedRetailPrice).format('0,0.00')}</TableCell>
                    <TableCell  sx={{display: {xs: 'none', md: 'table-cell'}}} align="right">&nbsp;</TableCell>
                    <TableCell align="right">&nbsp;</TableCell>
                    <TableCell align="right">
                        <SalesOrderLineButtons onCopyToCart={() => onAddToCart(line)}
                                               copyToCartDisabled={(!line.ProductType || line.ProductType === 'D' || line.InactiveItem === 'Y' || line.ItemType !== '1')}
                        />
                    </TableCell>
                </TableRow>
            )}

            {ProductType === 'K' && ExplodedKitItem === 'Y' && (
                <TableRow>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell colSpan={6}>Contains:</TableCell>
                </TableRow>
            )}

            {(!!CommentText || ItemType === '4') &&
                <TableRow className={classNames('order-detail', rowClassName)}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell colSpan={4}>
                        {CommentText}
                    </TableCell>
                    <TableCell colSpan={2}  sx={{display: {xs: 'none', md: 'table-cell'}}}>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell align="right"> </TableCell>
                </TableRow>
            }
        </Fragment>
    );
}
export default InvoiceDetailLine;
