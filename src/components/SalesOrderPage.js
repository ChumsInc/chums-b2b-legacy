/**
 * Created by steve on 9/9/2016.
 */


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {fetchCustomerAccount, setCustomerAccount} from '../actions/customer';
import {fetchSalesOrder} from '../actions/salesOrder';
import {newCart, selectCart} from '../actions/cart';
import {matchPropTypes} from "../constants/myPropTypes";
import ProgressBar from "./ProgressBar";
import {NEW_CART, ORDER_TYPE} from "../constants/orders";
import OrderHeader from "./OrderHeader";
import OrderDetail from "./OrderDetail";
import SendEmailModal from "./SendEmailModal";
import CheckoutProgress from "./CheckoutProgress";
import Alert from "../common-components/Alert";
import DocumentTitle from "./DocumentTitle";


const mapStateToProps = ({customer, user, salesOrder, cart, app}) => {
    const {currentCustomer} = user;
    const {account} = customer;
    const {ARDivisionNo, CustomerNo, loading} = account;
    const {processing, salesOrderNo, orderType, sendEmailStatus, header, attempts} = salesOrder;
    const {OrderStatus, OrderType} = header;
    const isCart = orderType === ORDER_TYPE.cart;
    const isCurrentCart = cart.cartNo === salesOrderNo;
    const {documentTitle} = app;
    return {
        ARDivisionNo,
        CustomerNo,
        currentCustomer,
        processing: processing || loading,
        attempts,
        salesOrderNo,
        sendEmailStatus,
        isCart,
        orderType,
        OrderStatus,
        OrderType,
        isCurrentCart,
        documentTitle,
    };
};

const mapDispatchToProps = {
    fetchAccount: fetchCustomerAccount,
    fetchSalesOrder,
    newCart,
    selectCart,
    setCustomerAccount,
};

class SalesOrderPage extends Component {

    static propTypes = {
        match: PropTypes.shape(matchPropTypes),
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        processing: PropTypes.bool,
        attempts: PropTypes.number,
        salesOrderNo: PropTypes.string,
        currentCustomer: PropTypes.object,
        sendEmailStatus: PropTypes.shape({
            sending: PropTypes.bool,
            envelope: PropTypes.shape({
                from: PropTypes.string,
                to: PropTypes.arrayOf(PropTypes.string)
            }),
            accepted: PropTypes.arrayOf(PropTypes.string),
            rejected: PropTypes.arrayOf(PropTypes.string),
        }),
        isCart: PropTypes.bool,
        orderType: PropTypes.string,
        OrderType: PropTypes.string,
        OrderStatus: PropTypes.string,
        isCurrentCart: PropTypes.bool,
        documentTitle: PropTypes.string,

        fetchAccount: PropTypes.func.isRequired,
        fetchSalesOrder: PropTypes.func.isRequired,
        newCart: PropTypes.func.isRequired,
        selectCart: PropTypes.func.isRequired,
        setCustomerAccount: PropTypes.func.isRequired,
    };

    static defaultProps = {
        currentCustomer: {},
        processing: false,
        attempts: 0,
        isCart: false,
        orderType: '',
        OrderType: '',
        OrderStatus: '',
        isCurrentCart: false,
        documentTitle: '',
    };

    state = {
        redirect: null,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {match, currentCustomer, ARDivisionNo, CustomerNo, salesOrderNo, attempts} = this.props;
        const {Company, SalesOrderNo} = match.params;
        if (Company !== currentCustomer.Company || ARDivisionNo !== currentCustomer.ARDivisionNo || CustomerNo !== currentCustomer.CustomerNo) {
            this.props.setCustomerAccount(currentCustomer);
            this.props.fetchAccount({...currentCustomer, fetchOrders: true}, true);
        }
        if (SalesOrderNo === NEW_CART && salesOrderNo !== NEW_CART) {
            this.props.newCart();
        } else if (SalesOrderNo !== salesOrderNo && attempts < 4) {
            this.props.fetchSalesOrder({Company, SalesOrderNo});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {
            salesOrderNo,
            match,
            processing,
            isCurrentCart,
            documentTitle,
            isCart,
            ARDivisionNo,
            CustomerNo,
            currentCustomer,
            attempts
        } = this.props;
        const {params} = match;
        const {Company, SalesOrderNo} = params;
        const newDocumentTitle = `${isCart ? 'Cart' : 'Order'} Info #${salesOrderNo}`;

        if (SalesOrderNo === NEW_CART && !isCurrentCart) {
            return this.props.selectCart({Company, SalesOrderNo});
        }
        if (SalesOrderNo !== NEW_CART && SalesOrderNo !== salesOrderNo && !processing && attempts < 4) {
            return this.props.fetchSalesOrder(params);
        }


        // if (isCart && !processing) {
        //     if (currentCustomer.ARDivisionNo !== ARDivisionNo && currentCustomer.CustomerName !== CustomerNo) {
        //         this.props.fetchAccount
        //     }
        // }
    }


    render() {
        const {redirect} = this.state;
        const {processing, sendEmailStatus, isCart, salesOrderNo, match, history, OrderStatus, OrderType} = this.props;

        if (!!redirect && redirect !== match.url) {
            return <Redirect to={redirect}/>
        }

        const documentTitle = `${isCart ? 'Cart' : 'Order'} Info #${salesOrderNo}`;
        return (
            <div className="sales-order-page">
                <DocumentTitle documentTitle={documentTitle}/>
                <h2>{isCart ? 'Cart' : 'Sales Order'} #{salesOrderNo}</h2>
                {OrderStatus === 'X' && (
                    <Alert type="alert-danger" title="Note:">
                        This order has been cancelled. Please contact Customer Service if you have any questions.
                    </Alert>
                )}
                {processing && <ProgressBar striped={true} label="Loading" className="mb-3"/>}
                <OrderHeader history={history}/>
                {isCart && <CheckoutProgress/>}
                {match.params.SalesOrderNo === salesOrderNo && <OrderDetail/>}
                {(sendEmailStatus.sending || sendEmailStatus.messageId) && <SendEmailModal/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SalesOrderPage);
