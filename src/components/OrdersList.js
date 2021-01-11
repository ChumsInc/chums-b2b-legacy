import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ordersPropType} from "../constants/myPropTypes";
import {fetchOpenOrders} from '../actions/customer';
import SortableTable from "../common-components/SortableTable";
import ProgressBar from "./ProgressBar";
import {CartButton, InvoiceLink, OrderLink} from "./OrderLink";
import numeral from 'numeral';
import {DateString} from "./DateString";
import OrderFilter from "./OrderFilter";
import {ORDER_TYPE} from "../constants/orders";
import Alert from "../common-components/Alert";

const sortSO = (a, b) => a.SalesOrderNo > b.SalesOrderNo ? 1 : -1;
const sortInvoice = (a, b) => a.InvoiceNo > b.InvoiceNo ? 1 : -1;

const cartFields = [
    {field: 'selected', title: 'Cart', render: (so) => <CartButton {...so}/>},
    {field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink {...so}/>},
    {field: 'CustomerPONo', title: 'PO #'},
    {field: 'OrderDate', title: 'Ordered Created', render: (so) => <DateString date={so.OrderDate}/>},
    // {field: 'ShipExpireDate', title: 'Ship Date', render: (so) => <DateString date={so.ShipExpireDate}/>},
    {field: 'ShipToName', title: 'Ship To'},
    {field: 'ShipToCity', title: 'Location', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`},
    {
        field: 'NonTaxableAmt',
        title: 'Total',
        render: (so) => numeral(so.NonTaxableAmt + so.TaxableAmt).format('0,0.00'),
        className: 'right',
        sort: (a, b) => (a.NonTaxableAmt + a.TaxableAmt) - (b.NonTaxableAmt + b.TaxableAmt) || sortSO(a, b),
    }
];

const openOrderFields = [
    {field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink {...so}/>},
    {field: 'CustomerPONo', title: 'PO #'},
    {field: 'OrderDate', title: 'Ordered', render: (so) => <DateString date={so.OrderDate}/>},
    {field: 'ShipExpireDate', title: 'Ship Date', render: (so) => <DateString date={so.ShipExpireDate}/>},
    {field: 'ShipToName', title: 'Ship To'},
    {field: 'ShipToCity', title: 'Location', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`},
    {
        field: 'NonTaxableAmt',
        title: 'Total',
        render: (so) => numeral(so.NonTaxableAmt + so.TaxableAmt).format('0,0.00'),
        className: 'right',
        sort: (a, b) => (a.NonTaxableAmt + a.TaxableAmt) - (b.NonTaxableAmt + b.TaxableAmt) || sortSO(a, b),
    }
];

const invoiceFields = [
    {field: 'InvoiceNo', title: 'Invoice #', render: (so) => <InvoiceLink {...so}/>},
    {field: 'InvoiceDate', title: 'Invoice Date', render: (so) => <DateString date={so.InvoiceDate}/>},
    {field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink {...so}/>},
    {field: 'CustomerPONo', title: 'PO #'},
    {field: 'OrderDate', title: 'Order Date', render: (so) => <DateString date={so.OrderDate}/>},
    {field: 'ShipToName', title: 'Ship To', className: 'hidden-xs'},
    {field: 'ShipToCity', title: 'Location', className: 'hidden-xs', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`},
    {
        field: 'NonTaxableSalesAmt',
        title: 'Total',
        render: (so) => numeral(so.NonTaxableSalesAmt + so.TaxableSalesAmt).format('($0,0.00)'),
        className: 'right',
        sorter: (a, b) => (a.NonTaxableSalesAmt + a.TaxableSalesAmt) - (b.NonTaxableSalesAmt + b.TaxableSalesAmt) || sortInvoice(a, b),
    },
    {field: 'Balance', title: 'Due', className: 'right',
        render: row => numeral(row.Balance).format('($0,0.00)'),
        sorter: (a, b) => (a.Balance - b.Balance) || sortInvoice(a,b)
    },
    {field: 'InvoiceDueDate', title: 'Due Date', render: (so) => <DateString date={so.InvoiceDueDate}/>},
];

const orderFields = {
    [ORDER_TYPE.cart]: cartFields,
    [ORDER_TYPE.open]: openOrderFields,
    [ORDER_TYPE.invoices]: invoiceFields,
};

const keyField = {
    [ORDER_TYPE.cart]: 'SalesOrderNo',
    [ORDER_TYPE.open]: 'SalesOrderNo',
    [ORDER_TYPE.invoices]: 'InvoiceNo',
};

const defaultSort = {
    [ORDER_TYPE.cart]: 'SalesOrderNo',
    [ORDER_TYPE.open]: 'SalesOrderNo',
    [ORDER_TYPE.invoices]: 'InvoiceNo',
}


export default class OrdersList extends Component {
    static propTypes = {
        orders: ordersPropType,
        orderType: PropTypes.string,
        currentCart: PropTypes.string,
        onReload: PropTypes.func.isRequired,
        onSelect: PropTypes.func,
        onNewCart: PropTypes.func,
    };

    static defaultProps = {
        orders: {
            loading: false,
            list: []
        },
        orderType: ORDER_TYPE.cart,
        currentCart: '',
    };

    state = {
        page: 1,
        rowsPerPage: 10,
        filter: '',
    };

    constructor(props) {
        super(props);
        this.onReload = this.onReload.bind(this);
        this.onSelectCart = this.onSelectCart.bind(this);
    }

    onReload() {
        this.props.onReload();
    }

    onSelectCart(cartNo) {
        this.props.onSelect(cartNo);
    }

    render() {
        const {orders, orderType, currentCart, onNewCart} = this.props;
        const {list, loading} = orders;
        const {page, rowsPerPage, filter} = this.state;
        const fields = orderFields[orderType];
        if (orderType === ORDER_TYPE.cart) {
            fields[0].render = (so) => {
                return (
                    <CartButton {...so} selected={so.SalesOrderNo === currentCart}
                                onClick={(cartNo) => this.onSelectCart(cartNo)}/>
                );
            }
        }
        let filteredList = [...list];
        if (filter) {
            try {
                const re = new RegExp(filter, 'i');
                filteredList = list.filter(so => re.test(so.SalesOrderNo) || re.test(so.CustomerPONo));
            } catch(err) {
                filteredList = [...list];
            }
        }
        return (
            <div>
                {!!loading && <ProgressBar striped={true} className="mb-1"/>}
                <OrderFilter filter={filter}
                             onChange={(filter) => this.setState({filter})}
                             allowNew={orderType === ORDER_TYPE.cart} onNew={onNewCart}
                             onReload={this.onReload}/>
                <SortableTable data={filteredList} fields={fields}
                               responsive
                               keyField={keyField[orderType]}
                               defaultSort={{field: defaultSort[orderType], asc: false}}
                               rowsPerPage={rowsPerPage}
                               onChangeRowsPerPage={(rowsPerPage) => this.setState({rowsPerPage, page: 1})}
                               page={page} onChangePage={(page) => this.setState({page})}
                               onChangeSort={() => this.setState({page: 1})}
                />
                {orderType === ORDER_TYPE.cart && (
                    <Alert type="alert-light" title="Hint:">Select a cart icon to make that your current cart.</Alert>
                )}
            </div>
        );
    }
}

