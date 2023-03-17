import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {orderHeaderPropType, paymentCardShape, shipToAddressPropType} from "../constants/myPropTypes";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import DatePicker from "../common-components/DatePicker";
import ShipToAddress from "./Address/ShipToAddress";
import {CART_PROGRESS_STATES, ORDER_TYPE} from "../constants/orders";
import parseDate from 'date-fns/parseJSON';
import {duplicateOrder, sendOrderEmail} from "../actions/salesOrder";
import {fetchInvoice} from '../actions/invoices';

import {
    appendCommentLine,
    promoteCart,
    removeCart,
    saveCart,
    selectCart,
    setCartProgress,
    setShipDate,
    setShippingAccount,
    updateCart,
} from "../actions/cart";
import {applyPromoCode} from '../actions/promo_codes';
import {connect} from "react-redux";
import ShippingMethodSelect from "./ShippingMethodSelect";
import {DEFAULT_SHIPPING_ACCOUNT, filteredTermsCode, PAYMENT_TYPES} from "../constants/account";
import {PATH_SALES_ORDER} from "../constants/paths";
import {buildPath} from "../utils/fetch";
import OrderPromoCode from "./OrderPromoCode";
import DuplicateCartAlert from "./DuplicateCartAlert";
import Button, {BTN_OUTLINE_SECONDARY, BTN_WARNING} from "../common-components/Button";
import {noop} from "../utils/general";
import TrackingLinkBadge from "./TrackingLinkBadge";

const SaveChangedButton = ({changed, onClick}) => {
    return (
        <Button onClick={onClick} color={changed ? BTN_WARNING : BTN_OUTLINE_SECONDARY}>
            Save Changes
        </Button>
    )
};

const mapStateToProps = ({customer, invoices, cart, salesOrder}) => {
    const {invoice} = invoices;
    const {shipDate, cartProgress, shippingAccount, loading} = cart;
    const {header, readOnly, orderType, detail} = salesOrder;
    const {shipToAddresses, account, paymentCards} = customer;
    const {DefaultPaymentType, TermsCode} = account;
    const isCart = orderType === ORDER_TYPE.cart;
    const isCurrentCart = cart.cartNo === header.SalesOrderNo;
    const changed = header.changed || detail.filter(line => line.changed || line.newLine).length > 0;
    return {
        invoice,
        header,
        orderType,
        isCart,
        isCurrentCart,
        readOnly,
        shipDate,
        cartProgress,
        shippingAccount,
        defaultPaymentType: DefaultPaymentType || (!!TermsCode && filteredTermsCode(TermsCode).due > 0 ? PAYMENT_TYPES.TERMS.code : ''),
        shipToAddresses,
        changed,
        cartLoading: loading,
        paymentCards,
    };
};

const mapDispatchToProps = {
    duplicateOrder,
    fetchInvoice,
    promoteCart,
    removeCart,
    saveCart,
    selectCart,
    sendOrderEmail,
    setCartProgress,
    setShipDate,
    setShippingAccount,
    updateCart,
    appendCommentLine,
    applyDiscount: applyPromoCode,
};

class InvoiceHeader extends Component {
    static propTypes = {
        invoice: PropTypes.shape({
            Company: PropTypes.string.isRequired,
            InvoiceNo: PropTypes.string,
            SalesOrderNo: PropTypes.string,
        }),
        header: orderHeaderPropType,
        orderType: PropTypes.string,
        cartProgress: PropTypes.number,
        readOnly: PropTypes.bool,
        isCart: PropTypes.bool,
        isCurrentCart: PropTypes.bool,
        shippingAccount: PropTypes.shape({
            enabled: PropTypes.bool,
            value: PropTypes.string,
        }),
        defaultPaymentType: PropTypes.string,
        shipToAddresses: PropTypes.arrayOf(shipToAddressPropType),
        changed: PropTypes.bool,
        history: PropTypes.any,
        cartLoading: PropTypes.bool,
        paymentCards: PropTypes.arrayOf(PropTypes.shape(paymentCardShape)),

        duplicateOrder: PropTypes.func.isRequired,
        fetchInvoice: PropTypes.func.isRequired,
        promoteCart: PropTypes.func.isRequired,
        removeCart: PropTypes.func.isRequired,
        saveCart: PropTypes.func.isRequired,
        setCartProgress: PropTypes.func.isRequired,
        setShipDate: PropTypes.func.isRequired,
        setShippingAccount: PropTypes.func.isRequired,
        selectCart: PropTypes.func.isRequired,
        sendOrderEmail: PropTypes.func.isRequired,
        updateCart: PropTypes.func.isRequired,
        appendCommentLine: PropTypes.func.isRequired,
        applyDiscount: PropTypes.func.isRequired,
    };

    static defaultProps = {
        header: {},
        shippingAccount: DEFAULT_SHIPPING_ACCOUNT,
        orderType: ORDER_TYPE.past,
        readOnly: true,
        isCart: false,
        isCurrentCart: false,
        defaultPaymentType: '',
        changed: false,
        cartLoading: false,
        cartProgress: CART_PROGRESS_STATES.cart,
        paymentCards: [],
    };

    state = {
        confirmDelete: false,
        confirmDuplicate: false,
        newCartName: '',
    };

    constructor(props) {
        super(props);
        this.onReload = this.onReload.bind(this);
        this.onDuplicateOrder = this.onDuplicateOrder.bind(this);
        this.onClickDuplicate = this.onClickDuplicate.bind(this);
        this.onCancelDuplicate = this.onCancelDuplicate.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {changed, cartProgress, setCartProgress, cartLoading, header, defaultPaymentType, updateCart} = this.props;
        if (cartProgress !== CART_PROGRESS_STATES.cart && changed) {
            setCartProgress(CART_PROGRESS_STATES.cart);
        }

        // set the cart payment type to the default so that it's value is correct if it is not changed by the user.
        if (!cartLoading && header.PaymentType === null && defaultPaymentType !== '') {
            updateCart({PaymentType: defaultPaymentType}, true);
        }
    }

    onReload() {
        const {Company, InvoiceNo} = this.props.invoice;
        this.props.fetchInvoice({Company, InvoiceNo});
    }

    onDuplicateOrder() {
        const {Company = 'chums', SalesOrderNo} = this.props.invoice;
        console.log('onDuplicateOrder()', {Company, SalesOrderNo});
        const {newCartName} = this.state;
        this.props.duplicateOrder({SalesOrderNo, newCartName})
            .then(SalesOrderNo => {
                if (!SalesOrderNo) {
                    return;
                }
                console.log(`redirect to ${SalesOrderNo}`, {Company, SalesOrderNo});
                this.setState({confirmDuplicate: false, newCartName: ''}, () => {
                    this.props.history.push(buildPath(PATH_SALES_ORDER, {
                        orderType: ORDER_TYPE.cart,
                        Company,
                        SalesOrderNo
                    }))
                });
            })
    }

    onClickDuplicate() {
        this.setState({confirmDuplicate: true});
    }

    onCancelDuplicate() {
        this.setState({confirmDuplicate: false});
    }

    render() {
        const {confirmDuplicate, newCartName} = this.state;
        const {
            shippingAccount,
            cartLoading,
            invoice,
        } = this.props;
        const {
            SalesOrderNo, OrderDate, ShipDate, ShipVia, Tracking, UDF_CANCEL_DATE,
            InvoiceDate, InvoiceDueDate, CustomerPONo, UDF_PROMO_DEAL
        } = this.props.invoice;

        const cancelHidden = UDF_CANCEL_DATE === null
            || parseDate(UDF_CANCEL_DATE).valueOf() === 0;

        return (
            <div className="mb-1">
                {confirmDuplicate && (
                    <DuplicateCartAlert SalesOrderNo={SalesOrderNo} newCartName={newCartName}
                                        loading={cartLoading}
                                        onSetCartName={(value) => this.setState({newCartName: value})}
                                        onCancel={this.onCancelDuplicate}
                                        onConfirm={this.onDuplicateOrder}/>
                )}
                <div className="row">
                    <div className="col-md-6">
                        {!!OrderDate && !!SalesOrderNo && (
                            <FormGroup colWidth={8} label="Order Date">
                                <DatePicker value={OrderDate || null} readOnly={true}/>
                            </FormGroup>
                        )}
                        {!cancelHidden && (
                            <FormGroup colWidth={8} label="Cancel Date">
                                <DatePicker value={UDF_CANCEL_DATE || null} onChange={this.onChangeField}
                                            readOnly={true}/>
                            </FormGroup>
                        )}
                        <FormGroup colWidth={8} label="Invoiced / Due Date">
                            <div className="input-group">
                                <DatePicker value={InvoiceDate || null} onChange={this.onChangeField}
                                            readOnly={true}
                                            disabled={true}/>
                                <DatePicker value={InvoiceDueDate || null} onChange={this.onChangeField}
                                            readOnly={true}
                                            disabled={true}/>
                            </div>
                        </FormGroup>
                        <FormGroup colWidth={8} label="Ship Date">
                            <div className="input-group">
                                <DatePicker value={ShipDate || null} readOnly={true}/>
                                <ShippingMethodSelect value={ShipVia || ''} onChange={noop}
                                                      readOnly={true}
                                                      onChangeShippingAccount={noop}
                                                      allowCustomerAccount={false}
                                                      shippingAccount={shippingAccount}/>
                            </div>
                            {(Tracking || []).map(track => (
                                <TrackingLinkBadge key={track.PackageNo} {...track}/>)
                            )}
                        </FormGroup>
                    </div>
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label="Ship To Address">
                            <ShipToAddress address={invoice} className="form-control form-control-sm"/>
                        </FormGroup>
                        {!!UDF_PROMO_DEAL && (
                            <FormGroup colWidth={8} label="Promo Code">
                                <OrderPromoCode code={UDF_PROMO_DEAL} disabled={true} closed={true}/>
                            </FormGroup>
                        )}
                        <FormGroupTextInput colWidth={8} label="Purchase Order #" onChange={noop}
                                            value={CustomerPONo || ''} field="CustomerPONo" readOnly={true}/>
                    </div>
                </div>
                <div className="checkout-buttons">
                    {!!SalesOrderNo && (
                        <Button color={BTN_OUTLINE_SECONDARY} onClick={this.onClickDuplicate}>
                            Duplicate Order
                        </Button>
                    )}
                    <Button color={BTN_OUTLINE_SECONDARY} onClick={this.onReload}>
                        Reload Invoice
                    </Button>
                </div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InvoiceHeader);
