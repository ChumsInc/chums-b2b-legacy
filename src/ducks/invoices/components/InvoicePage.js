/**
 * Created by steve on 9/9/2016.
 */


import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {fetchCustomerAccount, setCustomerAccount} from '../../../actions/customer';
import {loadInvoice, setCurrentInvoice} from '../actions';
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetail from "./InvoiceDetail";
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppDispatch} from "../../../app/configureStore";
import {useParams} from "react-router";
import {selectCurrentInvoice, selectCurrentInvoiceLoading} from "../selectors";
import {selectCurrentCustomer} from "../../../selectors/user";
import {isValidCustomer} from "../../../utils/customer";
import LinearProgress from "@mui/material/LinearProgress";

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
    fetchInvoice: loadInvoice,
    selectInvoice: setCurrentInvoice,
    setCustomerAccount,
};

const InvoicePage = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const invoice = useSelector(selectCurrentInvoice);
    const loading = useSelector(selectCurrentInvoiceLoading);
    const customer = useSelector(selectCurrentCustomer);

    useEffect(() => {
        if (!loading && isValidCustomer(customer)) {
            console.log('useEffect()', [params, invoice, loading, customer]);
            if (!invoice || params.InvoiceNo !== invoice.InvoiceNo || params.InvoiceType !== invoice.InvoiceType) {
                const {InvoiceNo, InvoiceType} = params;
                dispatch(loadInvoice({InvoiceNo, InvoiceType}));
            }
        }
    }, [params, invoice, loading, customer]);

    const documentTitle = `Invoice #${invoice?.InvoiceNo ?? ''}-${invoice?.InvoiceType ?? ''}`;

    return (
        <div className="sales-order-page">
            <DocumentTitle documentTitle={documentTitle}/>
            <h2>{documentTitle}</h2>
            {!!invoice && invoice.InvoiceType !== 'IN' && (<h4>{invoiceTypeDescription(invoice)}</h4>)}
            {!!invoice?.SalesOrderNo && (<h3>Sales Order #{invoice.SalesOrderNo}</h3>)}
            {!!invoice && !invoice.SalesOrderNo && (<h3><small>Direct Invoice</small></h3>)}
            {loading && <LinearProgress variant="indeterminate"/>}
            <InvoiceHeader/>
            <InvoiceDetail/>
        </div>

    )
}
export default InvoicePage;
