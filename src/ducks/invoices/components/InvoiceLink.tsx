import React from "react";
import {generatePath, Link as RoutedLink} from "react-router-dom";
import {InvoiceHeader, InvoiceHistoryHeader} from "b2b-types";
import {billToCustomerSlug} from "../../../utils/customer";
import Link from "@mui/material/Link";

export const PATH_INVOICE = '/account/:customerSlug/invoices/:InvoiceType/:InvoiceNo';

export const InvoiceLink = ({invoice}: { invoice: InvoiceHeader|InvoiceHistoryHeader | null }) => {
    if (!invoice || !invoice.InvoiceNo) {
        return null;
    }
    const {InvoiceNo, InvoiceType} = invoice;
    const customerSlug = billToCustomerSlug(invoice)!;
    const path = generatePath(PATH_INVOICE, {customerSlug, InvoiceType, InvoiceNo});
    return (<Link component={RoutedLink} to={path}>{InvoiceNo}-{InvoiceType}</Link>)
}
