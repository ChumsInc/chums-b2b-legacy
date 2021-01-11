import React from 'react';
import {Link} from 'react-router-dom';
import classNames from "classnames";
import {PATH_CUSTOMER_ACCOUNT} from "../constants/paths";
import {longCustomerNo} from "../utils/customer";
import {buildPath} from "../utils/fetch";

const CustomerLink = ({Company, ARDivisionNo, CustomerNo, ShipToCode, selected = false}) => {
    const path = buildPath(PATH_CUSTOMER_ACCOUNT, {Company, ARDivisionNo, CustomerNo, ShipToCode});
    const btnClassName = {
        'btn-outline-secondary': !selected,
        'btn-secondary': selected
    };

    return (
        <Link to={path} className={classNames("btn btn-sm", btnClassName)}>
            {longCustomerNo({ARDivisionNo, CustomerNo, ShipToCode})}
        </Link>
    )
};

export default CustomerLink;
