/**
 * Created by steve on 9/9/2016.
 */


import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {loadInvoice} from '../actions';
import InvoiceHeader from "./InvoiceHeader";
import InvoiceDetail from "./InvoiceDetail";
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppDispatch} from "@/app/configureStore";
import {useMatch, useParams} from "react-router";
import {selectCurrentInvoice, selectCurrentInvoiceLoading} from "../selectors";
import {selectCurrentCustomer} from "../../user/selectors";
import {billToCustomerSlug} from "@/utils/customer";
import LinearProgress from "@mui/material/LinearProgress";
import {redirect} from "react-router-dom";
import {InvoiceType} from "b2b-types";

const invoiceTypeDescription = (invoiceType: InvoiceType): string => {
    switch (invoiceType) {
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
    return 'Invoice';
}

const InvoicePage = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/account/:customerSlug/invoices/:invoiceType/:invoiceNo');
    const invoice = useSelector(selectCurrentInvoice);
    const loading = useSelector(selectCurrentInvoiceLoading);
    const customer = useSelector(selectCurrentCustomer);

    useEffect(() => {
        if (billToCustomerSlug(customer) !== match?.params?.customerSlug) {
            redirect('/profile');
            return;
        }
        if (!loading && match.params.invoiceNo && match.params.invoiceType && (!invoice || match.params?.invoiceNo !== invoice.InvoiceNo)) {
            dispatch(loadInvoice({InvoiceNo: match.params.invoiceNo, InvoiceType: match.params.invoiceType}));
        }
    }, [match, invoice]);

    const documentTitle = `Invoice: ${match?.params?.invoiceNo ?? ''}-${match?.params?.invoiceType ?? ''}`;

    return (
        <div className="sales-order-page">
            <DocumentTitle documentTitle={documentTitle}/>
            <h2>{documentTitle}</h2>
            {!!invoice && invoice.InvoiceType !== 'IN' && (<h3>{invoiceTypeDescription(invoice.InvoiceType)}</h3>)}
            {!!invoice?.SalesOrderNo && (<h4>Sales Order: {invoice.SalesOrderNo}</h4>)}
            {!!invoice && !invoice.SalesOrderNo && (<h4><small>Direct Invoice</small></h4>)}
            {loading && <LinearProgress variant="indeterminate"/>}
            <InvoiceHeader/>
            <InvoiceDetail/>
        </div>

    )
}
export default InvoicePage;
