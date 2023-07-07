import React from 'react';
import {useSelector} from "react-redux";
import {selectCustomerAccount} from "../ducks/customer/selectors";
import {longCustomerNo} from "../utils/customer";

const CustomerNameIndicator = () => {
    const customer = useSelector(selectCustomerAccount);
    if (!customer || !customer.CustomerNo) {
        return null;
    }
    const {ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = customer;
    return (<span>
            {longCustomerNo(customer)}
            <span className="d-none d-sm-inline">{' : '}{CustomerName}</span>
        </span>)
}
export default CustomerNameIndicator;
