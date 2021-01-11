import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {orderDetailPropType} from "../constants/myPropTypes";
import AddToCartModal from "./AddToCartModal";
import OrderDetailLine from "./OrderDetailLine";
import OrderFooter from "./OrderFooter";
import {appendCommentLine, saveCartItem, updateCartItem} from "../actions/cart";
import {connect} from "react-redux";
import {noop} from "../utils/general";
import {ORDER_TYPE} from "../constants/orders";

const mapStateToProps = ({cart, salesOrder, invoices}) => {
    const {cartProgress, cartName} = cart;
    const {SalesTaxAmt, TaxSchedule, TaxableSalesAmt, NonTaxableSalesAmt, DiscountAmt, Detail, ShipVia} = invoices.invoice;
    return {
        Detail,
        SalesTaxAmt,
        TaxSchedule,
        TaxableSalesAmt,
        NonTaxableSalesAmt,
        DiscountAmt,
        ShipVia,
        cartName,
    };
};

const mapDispatchToProps = {
    updateCartItem,
    saveCartItem,
    appendCommentLine,
};

class InvoiceDetail extends Component {
    static propTypes = {
        Detail: PropTypes.arrayOf(orderDetailPropType),
        SalesTaxAmt: PropTypes.number,
        TaxSchedule: PropTypes.string,
        DepositAmt: PropTypes.number,
        TaxableSalesAmt: PropTypes.number,
        NonTaxableSalesAmt: PropTypes.number,
        FreightAmt: PropTypes.number,
        DiscountAmt: PropTypes.number,
    };

    static defaultProps = {
        Detail: [],
        SalesTaxAmt: 0,
        TaxSchedule: '',
        TaxableSalesAmt: 0,
        NonTaxableSalesAmt: 0,
        FreightAmt: 0,
        DiscountAmt: 0,
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
        this.onAddToCart = this.onAddToCart.bind(this);
    }

    onAddToCart({ItemCode, QuantityOrdered, CommentText}) {
        this.setState({showAddToCart: true, ItemCode, QuantityOrdered, CommentText});
    }


    render() {
        const {Detail, DepositAmt, DiscountAmt, FreightAmt, ShipVia, NonTaxableSalesAmt, TaxableSalesAmt, SalesTaxAmt, TaxSchedule} = this.props;
        const {showAddToCart, ItemCode, QuantityOrdered, CommentText, LineCommentText} = this.state;
        return (
            <Fragment>
                <div className="table-responsive">
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
                        <tfoot>
                        <OrderFooter renderForDetail={true}
                                     DiscountAmt={DiscountAmt} DepositAmt={DepositAmt}
                                     FreightAmt={FreightAmt} ShipVia={ShipVia}
                                     NonTaxableAmt={NonTaxableSalesAmt} TaxableAmt={TaxableSalesAmt}
                                     SalesTaxAmt={SalesTaxAmt} TaxSchedule={TaxSchedule} orderType={ORDER_TYPE.invoices}
                        />
                        </tfoot>
                        <tbody>
                        {Detail
                            .sort((a, b) => Number(a.DetailSeqNo) - Number(b.DetailSeqNo))
                            .map(line => (
                                <OrderDetailLine key={line.DetailSeqNo} line={line}
                                                 readOnly={true}
                                                 isKitComponent={line.ExplodedKitItem === 'C'}
                                                 onChange={noop}
                                                 onAddToCart={this.onAddToCart}/>
                            ))
                        }
                        </tbody>
                    </table>
                </div>

                {showAddToCart && (
                    <AddToCartModal onClose={() => this.setState({showAddToCart: false})}
                                    itemCode={ItemCode}
                                    quantity={QuantityOrdered}
                                    comment={CommentText}/>
                )}
            </Fragment>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InvoiceDetail);
