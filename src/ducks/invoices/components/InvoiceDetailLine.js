import React, {Fragment} from 'react';
import classNames from "classnames";
import numeral from "numeral";
import OrderItemImage from "../../../components/OrderItemImage";
import PriceLevelNotice from "../../../components/PriceLevelNotice";
import UPCA from "../../../common/upc-a";


const InvoiceDetailLine = ({line, onAddToCart}) => {
    const {
        LineKey, ItemType, ItemCode, ItemCodeDesc, UnitOfMeasure, UnitOfMeasureConvFactor = 1,
        QuantityOrdered, QuantityAvailable, ProductType, InactiveItem, ExplodedKitItem, PriceLevel,
        UnitPrice, LineDiscountPercent, ExtensionAmt, SuggestedRetailPrice, UDF_UPC, CommentText, changed = false,
        newLine, image,
    } = line;
    const isKitComponent = line.KitItem === 'N' && line.ExplodedKitItem === 'C';

    const rowClassName = {
        'item-comment': ItemType !== '4' && !!CommentText,
        'line-comment': ItemType === '4',
        'kit-item': ProductType === 'K' && ExplodedKitItem === 'Y'
    };

    const unitPrice = (1 - (LineDiscountPercent / 100)) * (UnitPrice / (UnitOfMeasureConvFactor || 1));
    const itemPrice = (1 - (LineDiscountPercent / 100)) * UnitPrice;
    return (
        <Fragment>
            {!(ItemType === '4' && ItemCode === '/C') && !isKitComponent && (
                <tr className={classNames("order-detail", rowClassName)}>
                    <td>
                        {ItemType === '1' &&
                            <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc} image={image}/>}
                    </td>
                    <td>{ItemCode}</td>
                    <td>
                        <p>{ItemCodeDesc}</p>
                        {!!UDF_UPC && <p>{UPCA.format(UDF_UPC)}</p>}
                    </td>
                    <td>{UnitOfMeasure || null}</td>
                    <td className="text-end">
                        {numeral(line.QuantityOrdered).format('0,0')}
                    </td>
                    <td className="text-end">
                        <div>{numeral(unitPrice).format('0,0.00')}</div>
                        {!!LineDiscountPercent && (<div className="sale">{LineDiscountPercent}% Off</div>)}
                        {!!PriceLevel && (<PriceLevelNotice priceLevel={PriceLevel}/>)}
                    </td>
                    <td className="text-end hidden-xs">{numeral(SuggestedRetailPrice).format('0,0.00')}</td>
                    <td className="text-end hidden-xs">{numeral(itemPrice).format('0,0.00')}</td>
                    <td className="text-end">{numeral(QuantityOrdered * itemPrice).format('0,0.00')}</td>
                    <td className="text-end">
                        <div className="btn-group-vertical action-buttons">
                            {!(ProductType === 'D' || InactiveItem === 'Y') && (
                                <button type="button" className="btn btn-sm btn-outline-primary"
                                        title="Add to cart"
                                        onClick={onAddToCart}>
                                    <span className="bi-bag-fill"/>
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
            )}

            {!(ItemType === '4' && ItemCode === '/C') && isKitComponent && (
                <tr className={classNames("order-detail kit-component", rowClassName)}>
                    <td>
                        {ItemType === '1' && <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc}/>}
                    </td>
                    <td>{ItemCode}</td>
                    <td>
                        <p>{ItemCodeDesc}</p>
                        {!!UDF_UPC && <p>{UPCA.format(UDF_UPC)}</p>}
                    </td>
                    <td>{UnitOfMeasure || null}</td>
                    <td className="text-end">{numeral(QuantityOrdered).format('0,0')}</td>
                    <td className="text-end">&nbsp;</td>
                    <td className="text-end hidden-xs">{numeral(SuggestedRetailPrice).format('0,0.00')}</td>
                    <td className="text-end hidden-xs">&nbsp;</td>
                    <td className="text-end">&nbsp;</td>
                    <td className="text-end">
                        <div className="btn-group-vertical action-buttons">
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    title="Add to current cart"
                                    onClick={onAddToCart}>
                                <span className="bi-bag-fill"/>
                            </button>
                        </div>
                    </td>
                </tr>
            )}

            {ProductType === 'K' && ExplodedKitItem === 'Y' && (
                <tr>
                    <td colSpan={2}>&nbsp;</td>
                    <td colSpan={6}>Contains:</td>
                </tr>
            )}

            {(!!CommentText || ItemType === '4') &&
                <tr className={classNames('order-detail', rowClassName)}>
                    <td colSpan={2}>&nbsp;</td>
                    <td colSpan={4}>
                        {CommentText}
                    </td>
                    <td colSpan={2} className="hidden-xs">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="text-end">
                    </td>
                </tr>
            }
        </Fragment>
    );
}
export default InvoiceDetailLine;
