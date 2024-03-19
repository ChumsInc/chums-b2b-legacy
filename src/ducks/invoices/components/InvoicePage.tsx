/**
 * Created by steve on 9/9/2016.
 */


import React, {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {deprecated_loadInvoice, loadInvoice} from '../actions';
import InvoiceHeader from "./InvoiceHeader";
import InvoicePageDetail from "./InvoicePageDetail";
import DocumentTitle from "../../../components/DocumentTitle";
import {useAppDispatch} from "../../../app/configureStore";
import {useMatch, useParams} from "react-router";
import {selectCurrentInvoice, selectCurrentInvoiceLoading} from "../selectors";
import {selectCurrentCustomer} from "../../user/selectors";
import {billToCustomerSlug} from "../../../utils/customer";
import LinearProgress from "@mui/material/LinearProgress";
import {redirect} from "react-router-dom";
import {InvoiceType} from "b2b-types";
import {FetchInvoiceArg} from "../types";
import Typography from "@mui/material/Typography";

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
        console.log(match, invoice, loading);
        if (!!customer && billToCustomerSlug(customer) !== match?.params?.customerSlug) {
            redirect('/profile');
            return;
        }
        if (!loading
            && !!match?.params.invoiceNo && !!match.params.invoiceType
            && (!invoice || match.params?.invoiceNo !== invoice.InvoiceNo)) {
            const arg:FetchInvoiceArg = {InvoiceNo: match.params.invoiceNo, InvoiceType: match.params.invoiceType as InvoiceType};
            dispatch(loadInvoice(arg));
        }
    }, [match, invoice]);

    const documentTitle = `Invoice: ${match?.params?.invoiceNo ?? ''}-${match?.params?.invoiceType ?? ''}`;

    return (
        <div className="sales-order-page">
            <DocumentTitle documentTitle={documentTitle}/>
            <Typography component="h2" variant="h2">{documentTitle}</Typography>
            {!!invoice && invoice.InvoiceType !== 'IN' && (<Typography component="h3" variant="h3">{invoiceTypeDescription(invoice.InvoiceType)}</Typography>)}
            {loading && <LinearProgress variant="indeterminate"/>}
            <InvoiceHeader/>
            <InvoicePageDetail/>
        </div>

    )
}
export default InvoicePage;
