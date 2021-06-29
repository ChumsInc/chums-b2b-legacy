import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {orderDetailPropType} from "../constants/myPropTypes";
import UPCA from "../common/upc-a";
import classNames from "classnames";
import numeral from "numeral";
import AvailabilityAlert from "./AvailabilityAlert";
import OrderItemImage from "./OrderItemImage";
import TextArea from "../common-components/TextArea";
import CartQuantityInput from "./CartQuantityInput";
import PriceLevelNotice from "./PriceLevelNotice";


export default class OrderDetailLine extends Component {
    static propTypes = {
        line: orderDetailPropType,
        readOnly: PropTypes.bool,
        isKitComponent: PropTypes.bool,
        customerPriceLevel: PropTypes.string,

        onChange: PropTypes.func,
        onAddToCart: PropTypes.func,
    };

    static defaultProps = {
        line: {},
        readOnly: false,
        isKitComponent: false,
        customerPriceLevel: '',
    };

    state = {
        addComment: false,
        changed: false,
    };


    constructor(props) {
        super(props);
        this.onAddToCart = this.onAddToCart.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onDeleteComment = this.onDeleteComment.bind(this);
    }

    onDelete() {
        const {readOnly, onChange, line} = this.props;
        const {LineKey, ItemType} = line;
        if (!readOnly && onChange) {
            onChange({LineKey, prop: {QuantityOrdered: 0}});
        }
    }

    onDeleteComment() {
        const {readOnly, onChange, line} = this.props;
        const {LineKey, ItemType} = line;
        if (!readOnly && ItemType === '4') {
            onChange({LineKey, prop: {CommentText: ''}});
            return;
        }
        if (!readOnly && onChange) {
            onChange({LineKey, prop: {CommentText: ''}});
            this.setState({addComment: false});
        }
    }

    onChange({field, value}) {
        const {readOnly, onChange, line} = this.props;
        const {LineKey} = line;
        if (!readOnly && onChange) {
            onChange({LineKey, prop: {[field]: value}});
        }
    }

    onAddToCart() {
        const {onAddToCart, line} = this.props;
        const {ItemCode, QuantityOrdered, CommentText} = line;
        if (onAddToCart) {
            onAddToCart({ItemCode, QuantityOrdered, CommentText});
        }
    }


    render() {
        const {line, readOnly, isKitComponent, customerPriceLevel} = this.props;
        const {
            LineKey, ItemType, ItemCode, ItemCodeDesc, UnitOfMeasure, UnitOfMeasureConvFactor = 1,
            QuantityOrdered, QuantityAvailable, ProductType, InactiveItem, ExplodedKitItem, PriceLevel,
            UnitPrice, LineDiscountPercent, ExtensionAmt, SuggestedRetailPrice, UDF_UPC, CommentText, changed = false,
            newLine, image,
        } = line;
        const {addComment} = this.state;

        const rowClassName = {
            'table-warning': changed,
            'table-info': newLine,
            'table-danger': (ItemType !== '4' && QuantityOrdered === 0) || (ItemType === '4' && CommentText === ''),
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
                        <div>{ItemCode}</div>
                        {ItemType === '1' && <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc} image={image}/>}
                    </td>
                    <td>
                        <p>{ItemCodeDesc}</p>
                        {!!UDF_UPC && <p>{UPCA.format(UDF_UPC)}</p>}
                        {!readOnly && ProductType !== 'K' && (
                            <AvailabilityAlert QuantityOrdered={QuantityOrdered} QuantityAvailable={QuantityAvailable}/>
                        )}
                    </td>
                    <td>{UnitOfMeasure || null}</td>
                    <td className={classNames({right: readOnly})}>
                        {!!readOnly
                            ? numeral(QuantityOrdered).format('0,0')
                            : (
                                <CartQuantityInput quantity={QuantityOrdered} min={0}
                                                   onChange={(qty) => this.onChange({
                                                       field: 'QuantityOrdered',
                                                       value: qty
                                                   })}/>
                            )}
                    </td>
                    <td className="right">
                        <div>{numeral(unitPrice).format('0,0.00')}</div>
                        {!!LineDiscountPercent && (<div className="sale">{LineDiscountPercent}% Off</div>)}
                        {!!PriceLevel && PriceLevel !== customerPriceLevel && (<PriceLevelNotice PriceLevel={PriceLevel} />)}
                    </td>
                    <td className="right hidden-xs">{numeral(SuggestedRetailPrice).format('0,0.00')}</td>
                    <td className="right hidden-xs">{numeral(itemPrice).format('0,0.00')}</td>
                    <td className="right">{numeral(QuantityOrdered * itemPrice).format('0,0.00')}</td>
                    <td className="right">
                        <div className="btn-group-vertical action-buttons">
                            {!readOnly && (
                                <button type="button" className="btn btn-sm btn-outline-danger mb-1"
                                        title="Remove from cart"
                                        onClick={this.onDelete}>
                                    <span className="bi-x-circle-fill" />
                                </button>
                            )}
                            {!readOnly && (
                                <button type="button" className="btn btn-sm btn-outline-secondary mb-1"
                                        title="Add Comment"
                                        onClick={() => this.setState({addComment: true})}>
                                    <span className="bi-pencil-fill" />
                                </button>
                            )}
                            {!(ProductType === 'D' || InactiveItem === 'Y') && (
                                <button type="button" className="btn btn-sm btn-outline-primary"
                                        title="Add to cart"
                                        onClick={this.onAddToCart}>
                                    <span className="bi-bag-fill" />
                                </button>
                            )}
                        </div>
                    </td>
                </tr>
                )}

                {!(ItemType === '4' && ItemCode === '/C') && isKitComponent && (
                    <tr className={classNames("order-detail kit-component", rowClassName)}>
                        <td>
                            <div>{ItemCode}</div>
                            {ItemType === '1' && <OrderItemImage ItemCode={ItemCode} ItemCodeDesc={ItemCodeDesc}/>}
                        </td>
                        <td>
                            <p>{ItemCodeDesc}</p>
                            {!!UDF_UPC && <p>{UPCA.format(UDF_UPC)}</p>}
                            {!readOnly &&
                            <AvailabilityAlert QuantityOrdered={QuantityOrdered}
                                               QuantityAvailable={QuantityAvailable}/>}
                        </td>
                        <td>{UnitOfMeasure || null}</td>
                        <td className={classNames({right: readOnly})}>{numeral(QuantityOrdered).format('0,0')}</td>
                        <td className="right">&nbsp;</td>
                        <td className="right hidden-xs">{numeral(SuggestedRetailPrice).format('0,0.00')}</td>
                        <td className="right hidden-xs">&nbsp;</td>
                        <td className="right">&nbsp;</td>
                        <td className="right">
                            <div className="btn-group-vertical action-buttons">
                                {!readOnly && !(InactiveItem === 'Y' || ProductType === 'D') && (
                                    <button type="button" className="btn btn-sm btn-outline-secondary"
                                            title="Add Comment"
                                            onClick={() => this.setState({addComment: true})}>
                                        <span className="material-icons">create</span>
                                    </button>
                                )}
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        title="Add to current cart"
                                        onClick={this.onAddToCart}>
                                    <span className="material-icons">shopping_cart</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                )}

                {ProductType === 'K' && ExplodedKitItem === 'Y' && (
                    <tr>
                        <td>&nbsp;</td>
                        <td colSpan={4}>Contains:</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                )}

                {(!!CommentText || addComment || ItemType === '4') &&
                <tr className={classNames('order-detail', rowClassName)}>
                    <td>&nbsp;</td>
                    <td colSpan={4}>
                        {readOnly && <div>{CommentText}</div>}
                        {!readOnly &&
                        <TextArea value={CommentText} field="CommentText"
                                  onChange={this.onChange}

                                  className="form-control form-control-sm"/>}
                    </td>
                    <td colSpan={2} className="hidden-xs">&nbsp;</td>
                    <td>&nbsp;</td>
                    <td className="right">
                        <div className="btn-group-vertical action-buttons">
                            {!readOnly && (
                                <button type="button" className="btn btn-sm btn-outline-secondary"
                                        title="Remove comment"
                                        onClick={this.onDeleteComment}>
                                    <span className="material-icons">clear</span>
                                </button>
                            )}
                            <button type="button" className="btn btn-sm btn-outline-secondary"
                                    title="Add to current cart"
                                    onClick={this.onAddToCart}>
                                <span className="material-icons">shopping_cart</span>
                            </button>
                        </div>
                    </td>
                </tr>
                }
            </Fragment>
        );
    }
}
