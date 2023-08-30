import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {orderHeaderPropType, paymentCardShape, shipToAddressPropType} from "../constants/myPropTypes";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import FormGroup from "../common-components/FormGroup";
import DatePicker from "../common-components/DatePicker";
import {CART_PROGRESS_STATES, NEW_CART, ORDER_TYPE} from "../constants/orders";
import PaymentSelect from "./PaymentSelect";
import parseDate from 'date-fns/parseJSON';
import classNames from 'classnames';
import {duplicateOrder, loadSalesOrder, sendOrderEmail} from "../actions/salesOrder";
import {
    appendCommentLine,
    promoteCart,
    removeCart,
    saveCart,
    setCartProgress,
    setCurrentCart,
    setShipDate,
    setShippingAccount,
    updateCart,
} from "../ducks/cart/actions";
import {applyPromoCode} from '@/ducks/cart/actions';
import {connect} from "react-redux";
import ShippingMethodSelect from "./ShippingMethodSelect";
import {DEFAULT_SHIPPING_ACCOUNT, filteredTermsCode, getPaymentType, PAYMENT_TYPES} from "../constants/account";
import OrderFooter from "./OrderFooter";
import Alert from "../common-components/Alert";
import {PATH_PRODUCT_HOME, PATH_PRODUCT_HOME_BC, PATH_SALES_ORDER, PATH_SALES_ORDERS} from "../constants/paths";
import {companyCode} from "../utils/customer";
import OrderPromoCode from "./OrderPromoCode";
import {minShipDate, nextShipDate} from "../utils/orders";
import DuplicateCartAlert from "./DuplicateCartAlert";
import Button, {
    BTN_OUTLINE_DANGER,
    BTN_OUTLINE_SECONDARY,
    BTN_PRIMARY,
    BTN_SUCCESS,
    BTN_WARNING
} from "../common-components/Button";
import ConfirmDeleteCart from "./ConfirmDeleteCart";
import MaterialIcon from "../common-components/MaterialIcon";
import OrderHeaderShipTo from "./OrderHeaderShipTo";
import CustomerPONoField from "./Cart/CustomerPONoField";

const SaveChangedButton = ({changed, onClick, disabled}) => {
    return (
        <Button onClick={onClick} color={changed ? BTN_WARNING : BTN_OUTLINE_SECONDARY} disabled={disabled}>
            Save Changes
        </Button>
    )
};

const mapStateToProps = ({customer, user, cart, carts, openOrders, salesOrder}) => {
    const {shipDate, cartProgress, shippingAccount, loading} = cart;
    const {header, readOnly, orderType, detail, processing} = salesOrder;
    const {shipToAddresses, account, paymentCards} = customer;
    const {DefaultPaymentType = '', TermsCode = ''} = account ?? {};
    const isCart = orderType === ORDER_TYPE.cart;
    const isCurrentCart = cart.cartNo === header?.SalesOrderNo;
    const changed = header?.changed || detail.filter(line => line.changed || line.newLine).length > 0;
    return {
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
        cartLoading: loading || processing,
        paymentCards,
    };
};

const mapDispatchToProps = {
    duplicateOrder,
    loadSalesOrder,
    promoteCart,
    removeCart,
    saveCart,
    setCurrentCart,
    sendOrderEmail,
    setCartProgress,
    setShipDate,
    setShippingAccount,
    updateCart,
    appendCommentLine,
    applyDiscount: applyPromoCode,
};

class OrderHeader extends Component {
    static propTypes = {
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
        loadSalesOrder: PropTypes.func.isRequired,
        promoteCart: PropTypes.func.isRequired,
        removeCart: PropTypes.func.isRequired,
        saveCart: PropTypes.func.isRequired,
        setCartProgress: PropTypes.func.isRequired,
        setShipDate: PropTypes.func.isRequired,
        setShippingAccount: PropTypes.func.isRequired,
        setCurrentCart: PropTypes.func.isRequired,
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
        this.onChangeField = this.onChangeField.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSaveCart = this.onSaveCart.bind(this);
        this.onReload = this.onReload.bind(this);
        this.onSendEmail = this.onSendEmail.bind(this);
        this.onSetShipDate = this.onSetShipDate.bind(this);
        this.onChangeShippingAccount = this.onChangeShippingAccount.bind(this);
        this.promoteCart = this.promoteCart.bind(this);
        this.onChangeShipTo = this.onChangeShipTo.bind(this);
        this.onDeleteCart = this.onDeleteCart.bind(this);
        this.onDuplicateOrder = this.onDuplicateOrder.bind(this);
        this.onStartShopping = this.onStartShopping.bind(this);
        this.onClickDuplicate = this.onClickDuplicate.bind(this);
        this.onCancelDuplicate = this.onCancelDuplicate.bind(this);
        this.onClickDelete = this.onClickDelete.bind(this);
        this.onCancelDelete = this.onCancelDelete.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            changed,
            cartProgress,
            setCartProgress,
            cartLoading,
            header,
            defaultPaymentType,
            updateCart
        } = this.props;
        if (cartProgress !== CART_PROGRESS_STATES.cart && changed) {
            setCartProgress(CART_PROGRESS_STATES.cart);
        }

        // set the cart payment type to the default so that it's value is correct if it is not changed by the user.
        if (!cartLoading && header?.PaymentType === null && defaultPaymentType !== '') {
            updateCart({PaymentType: defaultPaymentType}, true);
        }
    }

    onChangeField({field, value}) {
        this.onChange({[field]: value});
    }

    onChange(props) {
        const {readOnly, cartProgress, header, updateCart} = this.props;
        props.SalesOrderNo = header.SalesOrderNo;
        if (!readOnly) {
            updateCart(props, cartProgress !== CART_PROGRESS_STATES.cart);
        }
    }

    onSaveCart() {
        const {readOnly, isCart} = this.props;
        if (!readOnly && isCart) {
            this.props.saveCart();
        }
    }

    onSendEmail() {
        if (!this.props.header) {
            return;
        }
        const {Company, SalesOrderNo} = this.props.header;
        this.props.sendOrderEmail({Company, SalesOrderNo});
    }

    onReload() {
        this.props.loadSalesOrder(this.props.header?.SalesOrderNo);
    }

    onSetShipDate({value}) {
        this.props.setShipDate(nextShipDate(value));
    }

    onSetCartProgress(ev, value) {
        ev.preventDefault();
        const {cartProgress} = this.props;
        this.props.setCartProgress(cartProgress + 1);
    }

    onDeleteCart() {
        this.props.removeCart(this.props.header)
            .then(() => {
                this.props.history.push(PATH_SALES_ORDERS.replace(':orderType?', ORDER_TYPE.cart));
            })
    }

    onDuplicateOrder() {
        const {Company, SalesOrderNo} = this.props.header;
        const {newCartName} = this.state;
        this.props.duplicateOrder({SalesOrderNo, newCartName})
            .then(SalesOrderNo => {
                if (!SalesOrderNo) {
                    return;
                }
                // console.log(`redirect to ${SalesOrderNo}`, SalesOrderNo);
                this.setState({confirmDuplicate: false, newCartName: ''}, () => {
                    const path = PATH_SALES_ORDER
                        .replace(':orderType', ORDER_TYPE.cart)
                        .replace(':Company', encodeURIComponent(Company))
                        .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo))
                });
            })
    }

    onChangeShippingAccount(props) {
        this.props.setShippingAccount(props);
    }

    onChangeShipTo(shipToCode) {
        // we can ignore the extra props since this.props.saveCart only sends changes to Cart Name, ShipToCode,
        // and ConfirmTo. After saving the cart, the reloaded sales order replaces the existing data.
        const [props] = this.props.shipToAddresses.filter(st => st.ShipToCode === shipToCode);
        this.onChange(props);
    }

    onStartShopping() {
        const {Company} = this.props.header;
        const shoppingPath = companyCode(Company) === 'bc' ? PATH_PRODUCT_HOME_BC : PATH_PRODUCT_HOME;
        this.props.history.push(shoppingPath);
    }

    promoteCart(ev) {
        ev.preventDefault();
        const {cartProgress} = this.props;
        const {Company, SalesOrderNo, PaymentType} = this.props.header;
        if (cartProgress < CART_PROGRESS_STATES.confirm) {
            this.props.setCartProgress(cartProgress + 1);
            return;
        }
        const [paymentType, last4] = PaymentType.split(':');
        if (!!last4) {
            this.props.appendCommentLine(`USE CARD ON FILE #${last4}`);
            this.props.updateCart({PaymentType: paymentType});
        }
        this.props.saveCart()
            .then(() => this.props.promoteCart())
            .then(success => {
                if (success) {
                    const path = PATH_SALES_ORDER
                        .replace(':orderType', ORDER_TYPE.open)
                        .replace(':Company', encodeURIComponent(companyCode(Company)))
                        .replace(':SalesOrderNo', encodeURIComponent(SalesOrderNo));
                    this.props.history.push(path);
                }
            });
    }

    validate() {
        const {cartProgress, header, shippingAccount} = this.props;
        const {changed, PaymentType, CustomerPONo, ShipVia} = header;
        switch (cartProgress) {
            case CART_PROGRESS_STATES.cart:
                return !changed;
            case CART_PROGRESS_STATES.delivery:
                return true; // (!shippingAccount.enabled || !!shippingAccount.value);
            case CART_PROGRESS_STATES.payment:
                return true; //!(PAYMENT_TYPES[PaymentType].requirePO && !!CustomerPONo);
            case CART_PROGRESS_STATES.confirm:
                return true;
        }
    }

    onClickDuplicate() {
        this.setState({confirmDuplicate: true});
    }

    onCancelDuplicate() {
        this.setState({confirmDuplicate: false});
    }

    onClickDelete() {
        this.setState({confirmDelete: true})
    }

    onCancelDelete() {
        this.setState({confirmDelete: false})
    }

    render() {
        const {confirmDelete, confirmDuplicate, newCartName} = this.state;
        const {
            orderType, isCart, isCurrentCart, shipDate, cartProgress, shippingAccount, defaultPaymentType, header,
            changed, setCurrentCart, cartLoading, paymentCards,
        } = this.props;
        const {
            Company,
            SalesOrderNo,
            OrderDate,
            ShipToCode,
            ShipVia,
            CustomerPONo,
            PaymentType,
            TermsCode,
            LastInvoiceDate,
            LastInvoiceNo,
            Comment,
            ShipExpireDate,
            UDF_CANCEL_DATE,
            payment,
            FreightAmt,
            DepositAmt,
            DiscountAmt,
            TaxableAmt,
            NonTaxableAmt,
            SalesTaxAmt,
            TaxSchedule,
        } = header ?? {};
        const isOpen = orderType === ORDER_TYPE.open;
        const isPast = orderType === ORDER_TYPE.past;
        const isNewCart = isCart && SalesOrderNo === NEW_CART;

        const cancelHidden = (isCart && cartProgress < CART_PROGRESS_STATES.delivery)
            || UDF_CANCEL_DATE === null
            || parseDate(UDF_CANCEL_DATE).valueOf() === 0;

        return (
            <form className="mb-1" onSubmit={this.promoteCart} method="post">
                <DuplicateCartAlert open={confirmDuplicate} SalesOrderNo={SalesOrderNo} newCartName={newCartName}
                                    loading={cartLoading}
                                    onSetCartName={(value) => this.setState({newCartName: value})}
                                    onCancel={this.onCancelDuplicate}
                                    onConfirm={this.onDuplicateOrder}/>
                <ConfirmDeleteCart salesOrderNo={SalesOrderNo} onConfirm={this.onDeleteCart}
                                   open={confirmDelete}
                                   onCancel={this.onCancelDelete}/>
                <div className="row">
                    <div className="col-md-6">
                        <FormGroup colWidth={8} label={isCart ? 'Cart Created' : 'Order Date'}>
                            <DatePicker value={OrderDate || null} onChange={this.onChangeField} readOnly={true}/>
                        </FormGroup>
                        {isCart && !isNewCart && (
                            <FormGroup colWidth={8} label="Cart Expires">
                                <DatePicker value={ShipExpireDate || null} onChange={this.onChangeField}
                                            readOnly={true}/>
                            </FormGroup>
                        )}
                        {(!isCart || cartProgress === CART_PROGRESS_STATES.cart) && (
                            <CustomerPONoField/>
                        )}
                        {isOpen && (
                            <FormGroup colWidth={8} label="Ship Date">
                                <DatePicker value={ShipExpireDate || null} onChange={this.onChangeField}
                                            readOnly={cartProgress !== CART_PROGRESS_STATES.delivery}/>
                            </FormGroup>
                        )}
                        {!isCart && (
                            <FormGroup colWidth={8} label="Shipping Method">
                                <ShippingMethodSelect value={ShipVia || ''} onChange={this.onChangeField}
                                                      readOnly={true}
                                                      onChangeShippingAccount={this.onChangeShippingAccount}
                                                      shippingAccount={shippingAccount}/>
                            </FormGroup>
                        )}
                        {!cancelHidden && (
                            <FormGroup colWidth={8} label="Cancel Date">
                                <DatePicker value={UDF_CANCEL_DATE || null} onChange={this.onChangeField}
                                            readOnly={true}/>
                            </FormGroup>
                        )}
                    </div>
                    <div className="col-md-6">
                        <OrderHeaderShipTo/>

                        {isPast && (
                            <FormGroup colWidth={8} label="Invoice Date / No">
                                <div className="input-group">
                                    <DatePicker value={LastInvoiceDate || null} onChange={this.onChangeField}
                                                readOnly={true}
                                                disabled={true}/>
                                    <div className="input-group-append">
                                        <input type="text" className="form-control form-control-sm"
                                               value={LastInvoiceNo || ''}
                                               readOnly={true} disabled={true}/>
                                    </div>
                                </div>
                            </FormGroup>
                        )}

                        {isCart && (
                            <FormGroup colWidth={8} label="Promo Code">
                                <OrderPromoCode/>
                            </FormGroup>
                        )}
                        {!isCart && (
                            <FormGroup colWidth={8} label="Promo Code">
                                <OrderPromoCode code={header?.UDF_PROMO_DEAL} disabled={true}/>
                            </FormGroup>
                        )}
                    </div>
                </div>


                {isCart && cartProgress >= CART_PROGRESS_STATES.delivery && (
                    <div className={classNames({'highlight-section': cartProgress === CART_PROGRESS_STATES.delivery})}>
                        <h3>Shipping</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup colWidth={8} label="Shipping Method">
                                    <ShippingMethodSelect value={ShipVia || ''} onChange={this.onChangeField}
                                                          required={true}
                                                          onChangeShippingAccount={this.onChangeShippingAccount}
                                                          shippingAccount={shippingAccount}/>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroup colWidth={8} label="Ship Date">
                                    <DatePicker value={shipDate || null} onChange={this.onSetShipDate}
                                                minDate={minShipDate()}/>
                                </FormGroup>
                            </div>
                        </div>
                    </div>
                )}

                {isCart && cartProgress >= CART_PROGRESS_STATES.payment && (
                    <div className={classNames({'highlight-section': cartProgress === CART_PROGRESS_STATES.payment})}>
                        <h3>Payment</h3>
                        <div className="row">
                            <div className="col-md-6">
                                <FormGroup colWidth={8} label="Payment Method">
                                    <PaymentSelect onChange={this.onChange}
                                                   value={PaymentType || defaultPaymentType || ''}
                                                   field="PaymentType"
                                                   customerTermsCode={TermsCode} required={true}
                                                   payment={payment}
                                                   customerPaymentCards={paymentCards}
                                                   readOnly={!isCart || cartProgress < CART_PROGRESS_STATES.payment}/>
                                </FormGroup>
                            </div>
                            <div className="col-md-6">
                                <FormGroupTextInput colWidth={8} label="Purchase Order #" onChange={this.onChangeField}

                                                    required={PaymentType ? getPaymentType(PaymentType).requirePO : false}
                                                    maxLength={30}
                                                    value={CustomerPONo || ''} field="CustomerPONo" readOnly={!isCart}/>
                            </div>
                        </div>
                    </div>
                )}

                {isCart && cartProgress >= CART_PROGRESS_STATES.delivery && (
                    <div className="row">
                        <div className="col-md-6"/>
                        <div className="col-md-6">
                            <table className="table table-sm">
                                <tbody>
                                <OrderFooter renderForDetail={false} FreightAmt={FreightAmt}
                                             NonTaxableAmt={NonTaxableAmt} TaxableAmt={TaxableAmt}
                                             DiscountAmt={DiscountAmt} orderType={orderType} DepositAmt={DepositAmt}
                                             SalesTaxAmt={SalesTaxAmt} TaxSchedule={TaxSchedule}
                                             ShipVia={ShipVia} PaymentType={PaymentType}
                                />
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="checkout-buttons">
                    {isNewCart && (
                        <Button color={BTN_PRIMARY} disabled={CustomerPONo === '' || cartLoading}
                                onClick={this.onStartShopping}>
                            Start Shopping
                        </Button>
                    )}
                    {isCart && !isNewCart && !isCurrentCart && !changed && cartProgress === CART_PROGRESS_STATES.cart
                        && (
                            <Button color={BTN_OUTLINE_SECONDARY}
                                    onClick={() => setCurrentCart({Company, SalesOrderNo})}
                                    disabled={cartLoading}>
                                Make Current Cart
                                <MaterialIcon icon="shopping_cart"/>
                            </Button>
                        )}

                    {isCart && !isNewCart && changed && cartProgress === CART_PROGRESS_STATES.cart && (
                        <SaveChangedButton changed={changed} onClick={this.onSaveCart} disabled={cartLoading}/>
                    )}

                    {!isCart && (
                        <Button color={BTN_OUTLINE_SECONDARY} onClick={this.onClickDuplicate} disabled={cartLoading}>
                            Duplicate Order
                        </Button>
                    )}

                    {(!isCart || (!isNewCart && cartProgress < CART_PROGRESS_STATES.delivery)) && (
                        <Button color={BTN_OUTLINE_SECONDARY} onClick={this.onReload} disabled={cartLoading}>
                            {changed ? 'Cancel Changes' : 'Reload Order'}
                        </Button>
                    )}

                    {isCart && !isNewCart && cartProgress === CART_PROGRESS_STATES.cart && (
                        <Button color={BTN_OUTLINE_SECONDARY} disabled={changed || cartLoading}
                                onClick={this.onSendEmail}>
                            Send Email
                        </Button>
                    )}

                    {isCart && !isNewCart && cartProgress === CART_PROGRESS_STATES.cart && (
                        <Button color={BTN_OUTLINE_DANGER} onClick={this.onClickDelete} disabled={cartLoading}>
                            Delete Cart
                        </Button>
                    )}

                    {isCart && !isNewCart && cartProgress === CART_PROGRESS_STATES.cart && (
                        <Button type="submit" color={BTN_PRIMARY} disabled={changed || cartLoading}>
                            Begin Checkout
                        </Button>
                    )}

                    {isCart && cartProgress === CART_PROGRESS_STATES.delivery && (
                        <Button type="submit" color={BTN_PRIMARY} disabled={!this.validate() || cartLoading}>
                            Confirm Shipping &amp; Delivery
                        </Button>
                    )}

                    {isCart && cartProgress === CART_PROGRESS_STATES.payment && (
                        <Button type="submit" color={BTN_PRIMARY} disabled={!this.validate() || cartLoading}>
                            Confirm Payment
                        </Button>
                    )}

                    {isCart && cartProgress === CART_PROGRESS_STATES.confirm && (
                        <Button type="submit" color={BTN_SUCCESS} disabled={!this.validate() || changed || cartLoading}>
                            Place Order
                        </Button>
                    )}

                    {isCart && cartProgress !== CART_PROGRESS_STATES.cart && (
                        <Button color={BTN_OUTLINE_SECONDARY} onClick={this.onReload} disabled={cartLoading}>
                            Cancel
                        </Button>
                    )}
                </div>
                {isOpen && (
                    <Alert type="alert-info">
                        This order is getting ready to ship. If you need to make any changes please contact {' '}
                        <a href="mailto: cs@chums.com" target="_blank">Chums Customer Service</a>.
                    </Alert>
                )}
            </form>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrderHeader);
