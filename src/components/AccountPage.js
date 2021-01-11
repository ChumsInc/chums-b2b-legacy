import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import BillToForm from "./BillToForm";
import {fetchCustomerAccount, setCustomerAccount} from '../actions/customer';
import {setCustomerTab, setDocumentTitle} from '../actions/app';
import Tabs from "../common-components/Tabs";
import Breadcrumb from "./Breadcrumb";
import {PATH_PROFILE, PATH_PROFILE_ACCOUNT} from "../constants/paths";
import {compareCustomerAccountNumber} from "../utils/customer";
import ShipToForm from "./ShipToForm";
import {CUSTOMER_TABS} from "../constants/app";
import AccountUsers from "./AccountUsers";


const mapStateToProps = ({user, customer, app}) => {
    const {loggedIn, userAccount, accounts} = user;
    const {loading} = customer;
    const {Company, ARDivisionNo, CustomerNo, CustomerName, ShipToCode} = customer.account;
    const {customerTab, documentTitle} = app;
    return {
        loggedIn,
        Company,
        ARDivisionNo,
        CustomerNo,
        CustomerName,
        ShipToCode,
        loading,
        userAccount,
        countUserAccounts: accounts.length,
        customerTab,
        documentTitle,
    };
};

const mapDispatchToProps = {
    fetchCustomerAccount,
    setCustomerAccount,
    setCustomerTab,
    setDocumentTitle,
};

class AccountPage extends Component {

    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                Company: PropTypes.string,
                ARDivisionNo: PropTypes.string,
                CustomerNo: PropTypes.string,
                ShipToCode: PropTypes.string,
            })
        }),
        Company: PropTypes.string,
        ARDivisionNo: PropTypes.string,
        CustomerNo: PropTypes.string,
        ShipToCode: PropTypes.string,
        CustomerName: PropTypes.string,
        userAccount: PropTypes.object,
        countUserAccounts: PropTypes.number,
        customerTab: PropTypes.number,
        documentTitle: PropTypes.string,

        fetchCustomerAccount: PropTypes.func.isRequired,
        setCustomerAccount: PropTypes.func.isRequired,
        setCustomerTab: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
    };

    static defaultProps = {
        match: {
            params: {
                Company: '',
                ARDivisionNo: '',
                CustomerNo: '',
                ShipToCode: '',
            }
        },
        Company: '',
        ARDivisionNo: '',
        CustomerNo: '',
        ShipToCode: '',
        countUserAccounts: 0,
        customerTab: CUSTOMER_TABS[0].id,
        documentTitle: '',
    };


    constructor(props) {
        super(props);
    }


    componentDidMount() {
        const {Company, ARDivisionNo, CustomerNo, ShipToCode, setCustomerAccount, fetchCustomerAccount, CustomerName, documentTitle} = this.props;
        const {params} = this.props.match;

        if (!!CustomerName && documentTitle !== CustomerName) {
            this.props.setDocumentTitle(CustomerName);
        }

        /* get the customer from the path, since the user may have
        reloaded the app on this page, let's fetch the customer on
        initial load
         */
        if (compareCustomerAccountNumber(params, {Company, ARDivisionNo, CustomerNo, ShipToCode}) !== 0) {
            // console.log('cdm', {params, Company, ARDivisionNo, CustomerNo, ShipToCode});
            setCustomerAccount({...params});
            fetchCustomerAccount({fetchOrders: true});
        }

    }

    componentDidUpdate(prevProps, prevState, snapShot) {
        const {Company, ARDivisionNo, CustomerNo, ShipToCode, setCustomerAccount, fetchCustomerAccount, CustomerName, documentTitle} = this.props;
        const {params} = this.props.match;

        // get the customer from the path - fetch the account if the customer has changed;
        if (compareCustomerAccountNumber(params, {Company, ARDivisionNo, CustomerNo, ShipToCode}) !== 0) {
            setCustomerAccount({...params});
            fetchCustomerAccount({fetchOrders: true});
            return;
        }

        if (!this.props.loading && documentTitle !== CustomerName) {
            this.props.setDocumentTitle(CustomerName);
        }
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }


    render() {
        const {ARDivisionNo, CustomerNo, CustomerName, userAccount, countUserAccounts, location = {},
            customerTab, setCustomerTab} = this.props;

        // @TODO refactor BreadCrumb to CustomerBreadCrumb and move the extra props out of AccountPage
        const paths = [
            {title: 'Profile', pathname: PATH_PROFILE},
            userAccount.isRepAccount ? {
                title: 'Account List',
                pathname: PATH_PROFILE_ACCOUNT.replace(':id', userAccount.id)
            } : null,
            {title: `${ARDivisionNo}-${CustomerNo}`, pathname: location.pathname},
        ].filter(p => p !== null);

        return (
            <div>
                {countUserAccounts > 1 && <Breadcrumb paths={paths}/>}
                <h2>{CustomerName}</h2>
                <Tabs tabList={CUSTOMER_TABS} activeTab={customerTab} onSelect={setCustomerTab}/>

                {customerTab === CUSTOMER_TABS[0].id && <BillToForm/>}
                {customerTab === CUSTOMER_TABS[1].id && <ShipToForm/>}
                {customerTab === CUSTOMER_TABS[2].id && <AccountUsers />}
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AccountPage);
