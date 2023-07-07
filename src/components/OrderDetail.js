import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {orderDetailPropType} from "../constants/myPropTypes";
import AddToCartModal from "./AddToCartModal";
import OrderDetailLine from "./OrderDetailLine";
import OrderFooter from "./OrderFooter";
import {appendCommentLine, saveCartItem, updateCartItem} from "../ducks/cart/actions";
import {connect} from "react-redux";
import {CART_PROGRESS_STATES, NEW_CART, ORDER_TYPE} from "../constants/orders";
import OrderCommentInput from "./OrderCommentInput";
import CartAddItem from "./CartAddItem";

class OrderDetail extends Component {
    static propTypes = {
        SalesOrderNo: PropTypes.string,
        detail: PropTypes.arrayOf(orderDetailPropType),
        hasFreight: PropTypes.bool,
        SalesTaxAmt: PropTypes.number,
        TaxSchedule: PropTypes.string,
        DepositAmt: PropTypes.number,
        TaxableAmt: PropTypes.number,
        NonTaxableAmt: PropTypes.number,
        FreightAmt: PropTypes.number,
        DiscountAmt: PropTypes.number,
        DiscountRate: PropTypes.number,
        orderType: PropTypes.string,
        isCart: PropTypes.bool,
        readOnly: PropTypes.bool,
        canAddToCart: PropTypes.bool,
        cartProgress: PropTypes.number,

        updateCartItem: PropTypes.func,
        saveCartItem: PropTypes.func,
        appendCommentLine: PropTypes.func,
    };

    static defaultProps = {
        SalesOrderNo: '',
        detail: [],
        SalesTaxAmt: 0,
        TaxSchedule: '',
        DepositAmt: 0,
        TaxableAmt: 0,
        NonTaxableAmt: 0,
        FreightAmt: 0,
        DiscountAmt: 0,
        DiscountRate: 0,
        isCart: false,
        readOnly: true,
        cartProgress: CART_PROGRESS_STATES.cart,
    };

    state = {
        showAddToCart: false,
        ItemCode: '',
        QuantityOrdered: 0,
        CommentText: '',
        LineCommentText: '',
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onAddToCart = this.onAddToCart.bind(this);
        this.onAddCommentLine = this.onAddCommentLine.bind(this);

        this.onChangeNewItem = this.onChangeNewItem.bind(this);
        this.onAddToOrder = this.onAddToOrder.bind(this);
    }

    onChange({LineKey, prop}) {
        if (!this.props.readOnly) {
            this.props.updateCartItem({LineKey, prop});
            // check to see if this line is a kit and the quantity is 0, if so, remove the components of the kit.
            const [item] = this.props.detail.filter(item => item.LineKey === LineKey);
            if (item && item.ProductType === 'K' && item.ExplodedKitItem === 'Y' && prop.QuantityOrdered === 0) {
                this.props.detail.filter(i => i.SalesKitLineKey === LineKey)
                    .forEach(i => {
                        this.props.updateCartItem({LineKey: i.LineKey, prop: {QuantityOrdered: 0}});
                    });
            }
        }
    }

    onAddToOrder(ev) {
        ev.preventDefault();
        const {readOnly, SalesOrderNo} = this.props;
        const {ItemCode, QuantityOrdered} = this.state;
        if (!readOnly) {
            if (SalesOrderNo === NEW_CART) {

            } else {
                this.props.saveCartItem({SalesOrderNo, ItemCode, QuantityOrdered});
            }
        }
    }

    onChangeNewItem({ItemCode, QuantityOrdered}) {
        this.setState({ItemCode, QuantityOrdered});
    }

    onAddToCart({ItemCode, QuantityOrdered, CommentText}) {
        this.setState({showAddToCart: true, ItemCode, QuantityOrdered, CommentText});
    }

    onAddCommentLine() {
        this.props.appendCommentLine(this.state.LineCommentText);
        this.setState({LineCommentText: ''});
    }


    render() {
        const {detail, isCart, readOnly, cartProgress, orderType, DepositAmt, DiscountAmt, FreightAmt, DiscountRate,
            NonTaxableAmt, TaxableAmt, SalesTaxAmt, TaxSchedule,
        } = this.props;
        const {showAddToCart, ItemCode, QuantityOrdered, CommentText, LineCommentText} = this.state;
        return (
            <Fragment>
                {!!isCart && !readOnly && (
                    <div className="my-3">
                        <div className="row">
                            <div className="col-sm-6">
                                <h3>Add Item</h3>
                                <CartAddItem />
                            </div>
                            <div className="col-sm-6">
                                <h3>Add Comment</h3>
                                <OrderCommentInput value={LineCommentText}
                                                   onChange={value => this.setState({LineCommentText: value})}
                                                   onSubmit={this.onAddCommentLine}/>
                            </div>
                        </div>

                    </div>
                )}

                <div className="table-responsive-sm">
                    <table className="table table-hover table-sm table-sticky">
                        <thead>
                        <tr className="order-detail">
                            <th>Item</th>
                            <th>Description</th>
                            <th>U/M</th>
                            <th className="right">Ordered</th>
                            <th className="right">Unit Price</th>
                            <th className="right hidden-xs">MSRP</th>
                            <th className="right hidden-xs">Item Price</th>
                            <th className="right">Ext Price</th>
                            <th className="center">Action</th>
                        </tr>
                        </thead>

                        {(isCart === false || cartProgress === CART_PROGRESS_STATES.cart) &&
                        <tfoot>
                        <OrderFooter renderForDetail={true} orderType={orderType}
                                     DepositAmt={DepositAmt} DiscountAmt={DiscountAmt}
                                     FreightAmt={FreightAmt}
                                     TaxableAmt={TaxableAmt} NonTaxableAmt={NonTaxableAmt}
                                     SalesTaxAmt={SalesTaxAmt} TaxSchedule={TaxSchedule}/>
                        </tfoot>
                        }

                        <tbody>
                        {[...detail]
                            .sort((a, b) => Number(a.LineSeqNo) - Number(b.LineSeqNo))
                            .map(line => (
                                <OrderDetailLine key={line.LineSeqNo} line={line}
                                                 readOnly={readOnly}
                                                 isKitComponent={!!line.SalesKitLineKey && line.SalesKitLineKey !== line.LineKey}
                                                 onChange={this.onChange}
                                                 onAddToCart={this.onAddToCart}/>
                            ))
                        }
                        </tbody>
                    </table>
                </div>

                {showAddToCart && <AddToCartModal onClose={() => this.setState({showAddToCart: false})}
                                                  itemCode={ItemCode}
                                                  quantity={QuantityOrdered}
                                                  comment={CommentText}/>}
            </Fragment>
        );
    }
}


const mapStateToProps = ({cart, salesOrder}) => {
    const {cartProgress, cartName} = cart;
    const {header, detail, readOnly, salesOrderNo, orderType} = salesOrder;
    const {SalesTaxAmt, TaxSchedule, DepositAmt, TaxableAmt, NonTaxableAmt, DiscountAmt, DiscountRate} = header;
    const isCart = orderType === ORDER_TYPE.cart;
    return {
        SalesOrderNo: salesOrderNo,
        detail,
        SalesTaxAmt,
        TaxSchedule,
        DepositAmt,
        TaxableAmt,
        NonTaxableAmt,
        DiscountAmt,
        DiscountRate,
        isCart,
        readOnly,
        cartProgress,
        cartName,
        orderType,
    };
};

const mapDispatchToProps = {
    updateCartItem,
    saveCartItem,
    appendCommentLine,
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetail);
