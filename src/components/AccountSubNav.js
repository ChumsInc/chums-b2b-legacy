import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import SubNavColumn from "./SubNavColumn";
import {
    PATH_CUSTOMER_ACCOUNT,
    PATH_PROFILE_ACCOUNT,
    SUB_NAV_LOGIN, SUB_NAV_LOGOUT,
    SUB_NAV_PROFILE,
    SUB_NAV_RECENT_ACCOUNTS, SUB_NAV_SIGNUP
} from "../constants/paths";

import {buildPath} from "../utils/fetch";
import {
    companyCode,
    compareCustomerAccountNumber,
    longCustomerNo,
    longRepNo,
    sortUserAccounts
} from "../utils/customer";

const sortPriority = (a, b) => a.priority === b.priority
    ? (a.title === b.title ? 0 : (a.title > b.title ? 1 : -1))
    : a.priority > b.priority ? 1 : -1;

const CustomerNavTitle = ({Company, ARDivisionNo, CustomerNo, CustomerName}) => {
    return (
        <Fragment>
            <span className="mr-3 account-number">{ARDivisionNo}-{CustomerNo}</span>
            <span>{CustomerName}</span>
        </Fragment>
    )
};

const RepNavTitle = ({Company, SalespersonDivisionNo, SalespersonNo, SalespersonName}) => {
    return (
        <Fragment>
            <span className="mr-3 account-number">{longRepNo({SalespersonDivisionNo, SalespersonNo})}</span>
            <span>{SalespersonName}</span>
        </Fragment>
    )
};

class AccountSubNav extends Component {
    static propTypes = {
        loggedIn: PropTypes.bool,
        customerAccounts: PropTypes.array,
        repAccounts: PropTypes.array,
        recentAccounts: PropTypes.array,
        currentCustomer: PropTypes.object,
    };

    static defaultProps = {
        loggedIn: false,
        customerAccounts: [],
        repAccounts: [],
        recentAccounts: [],
        currentCustomer: {},
    };

    render() {
        const {customerAccounts, repAccounts, loggedIn, recentAccounts, currentCustomer} = this.props;
        const items = [];

        if (!loggedIn) {
            items.push(SUB_NAV_LOGIN, SUB_NAV_SIGNUP);
        }

        if (loggedIn) {
            const profileNav = {...SUB_NAV_PROFILE};
            profileNav.menu.items = [];
            profileNav.menu.items.push(
                ...customerAccounts
                    .sort(sortUserAccounts)
                    .map((acct, index) => {
                        return {
                            id: `cust-${acct.Company}-${acct.ARDivisionNo}-${acct.CustomerNo}`,
                            title: (<CustomerNavTitle {...acct}/>),
                            url: buildPath(PATH_CUSTOMER_ACCOUNT, acct),
                            priority: index,
                        }
                    }));
            profileNav.menu.items.push(
                ...repAccounts
                    .sort(sortUserAccounts)
                    .map((acct, index) => {
                        return {
                            id: `rep-${acct.Company}-${acct.SalespersonDivisionNo}-${acct.SalespersonNo}`,
                            title: (<RepNavTitle {...acct}/>),
                            url: buildPath(PATH_PROFILE_ACCOUNT, acct),
                            priority: index + customerAccounts.length,
                        }
                    }));
            items.push(profileNav);

            const recentNav = {...SUB_NAV_RECENT_ACCOUNTS};
            recentNav.menu.items = [];
            recentNav.menu.items.push(
                ...recentAccounts
                    // .filter(acct => compareCustomerAccountNumber(acct, currentCustomer) !== 0)
                    .map((acct, index) => {
                        return {
                            id: `cust-${acct.Company}-${acct.ARDivisionNo}-${acct.CustomerNo}`,
                            title: (<CustomerNavTitle {...acct}/>),
                            url: buildPath(PATH_CUSTOMER_ACCOUNT, acct),
                            priority: index,
                        }
                    }));

            items.push(recentNav);
            items.push({...SUB_NAV_LOGOUT});
        }

        return (
            <div className="chums-subnavbar-collapse collapse show">
                <ul className="navbar-nav navbar-accounts">
                    {items
                        .sort(sortPriority)
                        .map(item => (
                            <SubNavColumn key={item.id} url={item.url} title={item.title} subMenu={item.menu}
                                          itemSorter={sortPriority}/>
                        ))
                    }
                </ul>
            </div>
        );
    }
}

const mapStateToProps = ({user}) => {
    const {
        loggedIn,
        accounts,
        currentCustomer,
        recentAccounts,
    } = user;
    const customerAccounts = accounts.filter(acct => !acct.isRepAccount);
    const repAccounts = accounts.filter(acct => !!acct.isRepAccount);
    return {
        loggedIn,
        customerAccounts,
        repAccounts,
        currentCustomer,
        recentAccounts,
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AccountSubNav) 
