/**
 * Created by steve on 8/10/2016.
 */

import React from 'react';
import {PATH_CUSTOMER_ACCOUNT, PATH_LOGIN} from "../constants/paths";
import {Link} from "react-router-dom";
import ProgressBar from "./ProgressBar";
import CustomerNameIndicator from "./CustomerNameIndicator";
import {useAppSelector} from "../app/configureStore";
import {selectCurrentCustomer, selectLoggedIn} from "../ducks/user/selectors";
import {selectCustomerLoading} from "../ducks/customer/selectors";

const CustomerNavbarLink = () => {
    const customer = useAppSelector(selectCurrentCustomer);
    const loggedIn = useAppSelector(selectLoggedIn);
    const loading = useAppSelector(selectCustomerLoading);

    const {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = customer;
    if (!loggedIn) {
        return (<Link to={PATH_LOGIN} className="nav-link me-3">Please Log In</Link>);
    }

    // we've not selected a customer yet, so return null
    if (!customer || !customer.CustomerNo) {
        return null;
    }

    const path = PATH_CUSTOMER_ACCOUNT
        .replace(':Company', encodeURIComponent(customer.Company))
        .replace(':ARDivisionNo', encodeURIComponent(customer.ARDivisionNo))
        .replace(':CustomerNo', encodeURIComponent(customer.CustomerNo))
        .replace(':ShipToCode', encodeURIComponent(customer.ShipToCode ?? ''));

    return (
        <Link to={path} className="nav-link">
            <div className="customer-indicator">
                {!!CustomerName && <CustomerNameIndicator/>}
            </div>
            {loading && <ProgressBar striped={true} style={{height: '1px', fontSize: 0}}/>}
        </Link>
    );
}
export default CustomerNavbarLink;
