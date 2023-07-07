import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Breadcrumb from "./Breadcrumb";
import {connect} from 'react-redux';
import {
    PATH_CUSTOMER_ACCOUNT,
    PATH_SALES_ORDERS,
    PATH_PROFILE,
    PATH_PROFILE_ACCOUNT, PATH_INVOICE
} from "../constants/paths";
import {matchPropTypes} from "../constants/myPropTypes";
import {ORDER_TYPE_NAMES} from "../constants/orders";
import {buildPath} from "../utils/path-utils";

class OrdersBreadcrumb extends Component {
    static propTypes = {
        profileId: PropTypes.number,
        isRepAccount: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
        Company: PropTypes.string,
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        ShipToCode: PropTypes.string,
        match: PropTypes.shape(matchPropTypes),
    };

    static defaultProps = {
        profileId: 0,
        isRepAccount: 0,
        Company: '',
        ARDivisionNo: '',
        CustomerNo: '',
        match: {params: {orderType: '', SalesOrderNo: undefined}}
    };

    render() {
        const {profileId, isRepAccount, Company, ARDivisionNo, CustomerNo, ShipToCode, location, match} = this.props;

        const {orderType, SalesOrderNo = null, InvoiceType = null, InvoiceNo = null} = match.params;

        const profilePath = PATH_PROFILE_ACCOUNT.replace(':id', profileId);
        const accountPath = PATH_CUSTOMER_ACCOUNT
            .replace(':Company', encodeURIComponent(Company))
            .replace(':ARDivisionNo', encodeURIComponent(ARDivisionNo))
            .replace(':CustomerNo', encodeURIComponent(CustomerNo))
            .replace(':ShipToCode?', encodeURIComponent(ShipToCode ?? ''));
        const orderPath = buildPath(PATH_SALES_ORDERS, {orderType});
        const invoicePath = buildPath(PATH_SALES_ORDERS, {orderType: 'invoices'});

        const paths = [
            {title: 'Profile', pathname: PATH_PROFILE},
            !!isRepAccount ? {title: 'Account List', pathname: profilePath} : null,
            {title: `${ARDivisionNo}-${CustomerNo}`, pathname: accountPath},
            // !!orderType && !SalesOrderNo && !InvoiceNo ? {title:ORDER_TYPE_NAMES[orderType] || 'Orders', pathname: InvoiceNo ? invoicePath : location.pathname} : null,
            !!SalesOrderNo ? {title: ORDER_TYPE_NAMES[orderType] || 'Orders', pathname: SalesOrderNo ? orderPath : location.pathname} : null,
            !!InvoiceNo ? {title: ORDER_TYPE_NAMES.invoices, pathname: InvoiceNo ? invoicePath : location.pathname} : null,
        ].filter(p => p !== null);
        if (SalesOrderNo) {
            paths.push({title: `SO# ${SalesOrderNo}`, pathname: location.pathname})
        }

        return (
            <Breadcrumb paths={paths} location={location}/>
        )
    }
}

const mapStateToProps = ({user, customer}) => {
    const {id = 0, isRepAccount = 0} = user.userAccount;
    const {company: Company} = customer;
    const {ARDivisionNo, CustomerNo, ShipToCode} = user.currentCustomer;
    return {profileId: id, isRepAccount, Company, ARDivisionNo, CustomerNo, ShipToCode};
};

export default connect(mapStateToProps)(OrdersBreadcrumb);
