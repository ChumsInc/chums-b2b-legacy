import React from 'react';
import {generatePath, Link as RoutedLink} from 'react-router-dom';
import classNames from "classnames";
import {PATH_CUSTOMER_ACCOUNT} from "../constants/paths";
import {customerSlug, longCustomerNo} from "../utils/customer";
import {BasicCustomer} from "b2b-types";
import Link from "@mui/material/Link";

const CustomerLink = ({customer, selected = false}: {
    customer: BasicCustomer;
    selected?: boolean;
}) => {
    const path = generatePath(PATH_CUSTOMER_ACCOUNT, {customerSlug: customerSlug(customer)})

    return (
        <Link component={RoutedLink} to={path} sx={{whiteSpace: 'nowrap'}}>
            {longCustomerNo(customer)}
        </Link>
    )
};

export default CustomerLink;
