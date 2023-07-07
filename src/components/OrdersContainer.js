import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import Tabs from "../common-components/Tabs";
import {connect} from 'react-redux';
import {cartsPropType, locationPathType} from "../constants/myPropTypes";
import {fetchCustomerAccount} from '../actions/customer';
import {fetchOpenOrders} from '../actions/salesOrder';
import {newCart, setCurrentCart} from '../ducks/cart/actions';
import OrdersList from "./OrdersList";
import {NAV_ORDERS, PATH_SALES_ORDER} from "../constants/paths";
import {NEW_CART, ORDER_TYPE, ORDER_TYPE_NAMES} from "../constants/orders";
import {loadInvoices} from '../ducks/invoices/actions';
import ErrorBoundary from "../common-components/ErrorBoundary";
import DocumentTitle from "./DocumentTitle";

const mapStateToProps = ({user, customer, carts, openOrders, cart, app, invoices}) => {
    const {currentCustomer} = user;
    const {company, account, currentCart} = customer;
    const {cartNo} = cart;
    const {documentTitle} = app;
    const {ARDivisionNo, CustomerNo, loading} = account;
    return {
        currentCustomer,
        company,
        ARDivisionNo,
        CustomerNo,
        loading,
        carts,
        openOrders,
        cartNo,
        documentTitle,
        invoices,
    }
};

const mapDispatchToProps = {
    fetchAccount: fetchCustomerAccount,
    fetchOpenOrders,
    fetchInvoices: loadInvoices,
    selectCart: setCurrentCart,
    newCart,
};

class OrdersContainer extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                Company: PropTypes.string,
                SalesOrderNo: PropTypes.string,
                orderType: PropTypes.string,
            })
        }),
        location: locationPathType,
        currentCustomer: PropTypes.shape({
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
            CustomerName: PropTypes.string,
        }),
        company: PropTypes.string,
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        loading: PropTypes.bool,
        cartNo: PropTypes.string,
        carts: cartsPropType,
        openOrders: cartsPropType,
        invoices: PropTypes.object,
        documentTitle: PropTypes.string,

        fetchAccount: PropTypes.func.isRequired,
        fetchOpenOrders: PropTypes.func.isRequired,
        fetchInvoices: PropTypes.func.isRequired,
        selectCart: PropTypes.func.isRequired,
        newCart: PropTypes.func.isRequired,
    };

    static defaultProps = {
        match: {params: {orderType: 'carts'}},
        cartNo: '',
    };

    state = {
        tab: ORDER_TYPE.cart,
        rowsPerPage: 10,

    };

    constructor(props) {
        super(props);
        this.reloadOpenOrders = this.reloadOpenOrders.bind(this);
        this.reloadInvoices = this.reloadInvoices.bind(this);
        this.onSelectCart = this.onSelectCart.bind(this);
        this.onNewCart = this.onNewCart.bind(this);
    }

    componentDidMount() {
        const {currentCustomer, company, ARDivisionNo, CustomerNo, loading, documentTitle} = this.props;
        const {tab} = this.state;
        if (!loading) {
            if (company !== currentCustomer.Company || ARDivisionNo !== currentCustomer.ARDivisionNo || CustomerNo !== currentCustomer.CustomerNo) {
                this.props.fetchAccount({...currentCustomer, fetchOrders: true}, true);
            }
        }
        const {orderType} = this.props.match.params;
        if (tab !== orderType && ORDER_TYPE[orderType] !== undefined) {
            this.setState({tab: orderType});
            return;
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {loading, documentTitle} = this.props;
        const {orderType} = this.props.match.params;
        const {tab} = this.state;
        if (tab !== orderType && ORDER_TYPE[orderType] !== undefined) {
            this.setState({tab: orderType});
        }
    }

    reloadOpenOrders() {
        this.props.fetchOpenOrders(this.props.currentCustomer);
    }

    reloadInvoices() {
        this.props.fetchInvoices(this.props.currentCustomer);
    }

    onSelectCart(salesOrderNo) {
        const {Company} = this.props;
        this.props.selectCart({Company, SalesOrderNo: salesOrderNo});
    }

    onNewCart() {
        this.props.newCart();
        const path = PATH_SALES_ORDER
            .replace(':orderType', ORDER_TYPE.cart)
            .replace(':Company', this.props.company)
            .replace(':SalesOrderNo', NEW_CART);
        this.props.history.push(path);
    }


    render() {
        const {tab} = this.state;
        const {carts, cartNo, openOrders, invoices} = this.props;
        return (
            <Fragment>
                <DocumentTitle documentTitle={ORDER_TYPE_NAMES[tab]}/>
                <Tabs tabList={NAV_ORDERS} onSelect={(tab) => this.setState({tab})} activeTab={tab}/>
                <ErrorBoundary>
                    {tab === ORDER_TYPE.cart && (
                        <OrdersList orders={carts} currentCart={cartNo} orderType={ORDER_TYPE.cart}
                                    onNewCart={this.onNewCart}
                                    onReload={this.reloadOpenOrders} onSelect={this.onSelectCart}/>
                    )}
                    {tab === ORDER_TYPE.open && (
                        <OrdersList onReload={this.reloadOpenOrders} orders={openOrders} orderType={ORDER_TYPE.open}/>
                    )}
                    {tab === ORDER_TYPE.invoices && (
                        <OrdersList onReload={this.reloadInvoices} orders={invoices} orderType={ORDER_TYPE.invoices}/>
                    )}
                </ErrorBoundary>
            </Fragment>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);
