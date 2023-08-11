import {PATH_INVOICE} from "@/constants/paths";
import {generatePath, Link} from "react-router-dom";
import React from "react";
import {InvoiceHeader} from "b2b-types";

export const InvoiceLink = ({invoice}: { invoice: InvoiceHeader | null }) => {
    if (!invoice || !invoice.InvoiceNo) {
        return null;
    }
    const {InvoiceNo, InvoiceType} = invoice;
    const path = generatePath(PATH_INVOICE, {InvoiceNo, InvoiceType});
    return (<Link to={path}>{InvoiceNo}-{InvoiceType}</Link>)
}
