/**
 * Created by steve on 8/10/2016.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {longCustomerNo} from '../utils/customer';
import {PATH_CUSTOMER_ACCOUNT, PATH_LOGIN} from "../constants/paths";
import {Link} from "react-router-dom";
import {buildPath} from "../utils/fetch";
import ProgressBar from "./ProgressBar";

const CustomerNameIndicator = ({ARDivisionNo = '', CustomerNo = '', CustomerName = ''}) => (
    <span>{longCustomerNo({ARDivisionNo, CustomerNo})}
        <span className="d-none d-sm-inline">{' : '}{CustomerName}</span>
    </span>
);

class CustomerNavbarLink extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        Company: PropTypes.string,
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        CustomerName: PropTypes.string,
        loading: PropTypes.bool,
    };

    static defaultProps = {
        loggedIn: false,
        Company: '',
        ARDivisionNo: '',
        CustomerNo: '',
        CustomerName: '',
        loading: false,
    };

    render() {
        const {loggedIn, loading, Company, ARDivisionNo, CustomerNo, CustomerName} = this.props;
        if (!loggedIn) {
            return (<Link to={PATH_LOGIN} className="nav-link mr-3">Please Log In</Link>);
        }

        // we've not selected a customer yet, so return null
        if (!Company || !ARDivisionNo || !CustomerNo) {
            return null;
        }

        const path = buildPath(PATH_CUSTOMER_ACCOUNT, {Company, ARDivisionNo, CustomerNo});

        return (
            <Link to={path} className="nav-link">
                <div className="customer-indicator">
                    {!!CustomerName && <CustomerNameIndicator ARDivisionNo={ARDivisionNo} CustomerNo={CustomerNo}
                                                              CustomerName={CustomerName}/>}
                </div>
                {loading && <ProgressBar striped={true} style={{height: '1px', fontSize: 0}} />}
            </Link>
        );
    }
}

const mapStateToProps = ({user, customer}) => {
    const {loggedIn} = user;
    const {loading} = customer;
    const {Company, ARDivisionNo, CustomerNo, CustomerName} = user.currentCustomer;
    return {loggedIn, Company, ARDivisionNo, CustomerNo, CustomerName, loading};
};

export default connect(mapStateToProps)(CustomerNavbarLink);
