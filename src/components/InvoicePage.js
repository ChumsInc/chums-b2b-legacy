/**
 * Created by steve on 9/9/2016.
 */


import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {fetchCustomerAccount, setCustomerAccount} from '../actions/customer';
import {fetchInvoice, selectInvoice} from '../actions/invoices';
import {matchPropTypes} from "../constants/myPropTypes";
import ProgressBar from "./ProgressBar";
import OrderHeader from "./OrderHeader";
import OrderDetail from "./OrderDetail";
import SendEmailModal from "./SendEmailModal";
import CheckoutProgress from "./CheckoutProgress";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetail from "./InvoiceDetail";
import DocumentTitle from "./DocumentTitle";

const invoiceTypeDescription = ({InvoiceType}) => {
    switch (InvoiceType) {
    case 'CM':
        return 'Credit Memo';
    case 'DM':
        return 'Debit Memo';
    case 'AD':
        return 'Adjustment';
    case 'FC':
        return 'Finance Charge';
    case 'CA':
        return 'Cash Invoice';
    case 'XD':
        return 'Deleted Invoice';
    }
}
const mapStateToProps = ({customer, user, invoices, app}) => {
    const {currentCustomer} = user;
    const {account} = customer;
    const {ARDivisionNo, CustomerNo, loading: accountLoading} = account;
    const {invoice, loading: invoiceLoading} = invoices;
    const {documentTitle} = app;
    return {
        ARDivisionNo,
        CustomerNo,
        currentCustomer,
        loading: accountLoading || invoiceLoading,
        invoice,
        documentTitle,
    };
};

const mapDispatchToProps = {
    fetchAccount: fetchCustomerAccount,
    fetchInvoice,
    selectInvoice,
    setCustomerAccount,
};

class InvoicePage extends Component {

    static propTypes = {
        match: PropTypes.shape(matchPropTypes),
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        loading: PropTypes.bool,
        invoice: PropTypes.object,
        currentCustomer: PropTypes.object,
        documentTitle: PropTypes.string,

        fetchAccount: PropTypes.func.isRequired,
        fetchInvoice: PropTypes.func.isRequired,
        setCustomerAccount: PropTypes.func.isRequired,
    };

    static defaultProps = {
        currentCustomer: {},
        processing: false,
        isCart: false,
        orderType: '',
        isCurrentCart: false,
        documentTitle: '',
    };

    state = {
        redirect: null,
    };

    constructor(props) {
        super(props);
        this.documentTitle = this.documentTitle.bind(this);
    }

    documentTitle() {
        const {InvoiceNo = '', InvoiceType = ''} = this.props.invoice;
        return `Invoice #${InvoiceNo}-${InvoiceType}`;
    }

    componentDidMount() {
        const {match, currentCustomer, ARDivisionNo, CustomerNo, invoice, loading} = this.props;
        const {Company, InvoiceNo, InvoiceType} = match.params;
        if (Company !== currentCustomer.Company || ARDivisionNo !== currentCustomer.ARDivisionNo || CustomerNo !== currentCustomer.CustomerNo) {
            this.props.setCustomerAccount(currentCustomer);
            this.props.fetchAccount({...currentCustomer, fetchOrders: true}, true);
        }
        if (!loading && (invoice.InvoiceNo !== InvoiceNo || invoice.InvoiceType !== InvoiceType)) {
            this.props.selectInvoice({Company, InvoiceNo, InvoiceType});
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {match, loading, documentTitle, invoice} = this.props;
        const {Company, InvoiceNo, InvoiceType} = match.params;
        const newDocumentTitle = this.documentTitle();
        if (!loading && (invoice.InvoiceNo !== InvoiceNo || invoice.InvoiceType !== InvoiceType)) {
            this.props.selectInvoice({Company, InvoiceNo, InvoiceType});
        }
    }


    render() {
        const {redirect} = this.state;
        const {loading, invoice, match, history} = this.props;

        if (!!redirect && redirect !== match.url) {
            return <Redirect to={redirect}/>
        }

        return (
            <div className="sales-order-page">
                <DocumentTitle documentTitle={this.documentTitle()} />
                <h2>{this.documentTitle()}</h2>
                {invoice.InvoiceType !== 'IN' && (<h4>{invoiceTypeDescription(invoice)}</h4>)}
                {!!invoice.SalesOrderNo && (<h3>Sales Order #{invoice.SalesOrderNo}</h3>)}
                {!invoice.SalesOrderNo && (<h3><small>Direct Invoice</small></h3>)}
                {loading && <ProgressBar striped={true} label="Loading" className="mb-3"/>}
                <InvoiceHeader history={history}/>
                {match.params.InvoiceNo === invoice.InvoiceNo && <InvoiceDetail />}
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(InvoicePage);
