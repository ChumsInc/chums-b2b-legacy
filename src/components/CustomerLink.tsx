import React from 'react';
import {generatePath, Link} from 'react-router-dom';
import classNames from "classnames";
import {PATH_CUSTOMER_ACCOUNT} from "@/constants/paths";
import {customerSlug, longCustomerNo} from "@/utils/customer";
import {BasicCustomer} from "b2b-types";

const CustomerLink = ({customer, selected = false}: {
    customer: BasicCustomer;
    selected?: boolean;
}) => {
    const path = generatePath(PATH_CUSTOMER_ACCOUNT, {customerSlug: customerSlug(customer)})
    const btnClassName = {
        'btn-outline-secondary': !selected,
        'btn-secondary': selected
    };

    return (
        <Link to={path} className={classNames("btn btn-sm", btnClassName)}>
            {longCustomerNo(customer)}
        </Link>
    )
};

export default CustomerLink;
