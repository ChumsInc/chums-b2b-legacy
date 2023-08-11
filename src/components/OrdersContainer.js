import React, {Component, Fragment, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Tabs from "../common-components/Tabs";
import {connect, useSelector} from 'react-redux';
import {cartsPropType, locationPathType} from "../constants/myPropTypes";
import {loadCustomerAccount} from '../ducks/customer/actions';
import {fetchOpenOrders} from '../actions/salesOrder';
import {newCart, setCurrentCart} from '../ducks/cart/actions';
import OrdersList from "./OrdersList";
import {NAV_ORDERS, PATH_SALES_ORDER} from "../constants/paths";
import {NEW_CART, ORDER_TYPE, ORDER_TYPE_NAMES} from "../constants/orders";
import {loadInvoices} from '../ducks/invoices/actions';
import ErrorBoundary from "../common-components/ErrorBoundary";
import DocumentTitle from "./DocumentTitle";
import {useAppDispatch} from "../app/configureStore";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import {selectCartNo} from "../ducks/cart/selectors";
import {selectCartsList} from "../ducks/carts/selectors";
import {selectOpenOrdersList, selectOpenOrdersLoading} from "../ducks/open-orders/selectors";
import CartsList from "@/ducks/carts/components/CartsList";
import OpenOrdersList from "./OpenOrdersList";
import InvoicesList from "@/ducks/invoices/components/InvoicesList";
import {useParams, useRouteMatch} from "react-router";
import {selectCustomerAccount, selectCustomerLoading} from "../ducks/customer/selectors";

const OrdersContainer = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const customerAccount = useSelector(selectCustomerAccount);
    const customerLoading = useSelector(selectCustomerLoading);

    const params = useParams();
    const [tab, setTab] = useState(ORDER_TYPE.cart);

    useEffect(() => {

    }, [])

    useEffect(() => {
        setTab(ORDER_TYPE[params?.orderType] ?? ORDER_TYPE.cart)
    }, [params.orderType])

    return (
        <Fragment>
            <DocumentTitle documentTitle={ORDER_TYPE_NAMES[tab]}/>
            <Tabs tabList={NAV_ORDERS} onSelect={(tab) => setTab(tab)} activeTab={tab}/>
            <ErrorBoundary>
                {tab === ORDER_TYPE.cart && (
                    <CartsList />
                )}
                {tab === ORDER_TYPE.open && (
                    <OpenOrdersList />
                )}
                {tab === ORDER_TYPE.invoices && (
                    <InvoicesList />
                )}
            </ErrorBoundary>
        </Fragment>
    )
}

export default OrdersContainer;

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
    fetchAccount: loadCustomerAccount,
    fetchOpenOrders,
    fetchInvoices: loadInvoices,
    selectCart: setCurrentCart,
    newCart,
};

class _OrdersContainer extends Component {
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

    render() {
        const {tab} = this.state;
        return (
            <Fragment>
                <DocumentTitle documentTitle={ORDER_TYPE_NAMES[tab]}/>
                <Tabs tabList={NAV_ORDERS} onSelect={(tab) => this.setState({tab})} activeTab={tab}/>
                <ErrorBoundary>
                    {tab === ORDER_TYPE.cart && (
                        <CartsList />
                    )}
                    {tab === ORDER_TYPE.open && (
                        <OpenOrdersList />
                    )}
                    {tab === ORDER_TYPE.invoices && (
                        <InvoicesList />
                    )}
                </ErrorBoundary>
            </Fragment>
        )
    }
}


// export default connect(mapStateToProps, mapDispatchToProps)(OrdersContainer);

