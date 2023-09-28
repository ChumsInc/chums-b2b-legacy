import React from "react";
import {generatePath, Link} from "react-router-dom";
import {InvoiceHeader} from "b2b-types";
import {billToCustomerSlug} from "../../../utils/customer";

export const PATH_INVOICE = '/account/:customerSlug/invoices/:InvoiceType/:InvoiceNo';

export const InvoiceLink = ({invoice}: { invoice: InvoiceHeader | null }) => {
    if (!invoice || !invoice.InvoiceNo) {
        return null;
    }
    const {InvoiceNo, InvoiceType} = invoice;
    const customerSlug = billToCustomerSlug(invoice)!;
    const path = generatePath(PATH_INVOICE, {customerSlug, InvoiceType, InvoiceNo});
    return (<Link to={path}>{InvoiceNo}-{InvoiceType}</Link>)
}
