import React from 'react';
import {PATH_PROFILE, PATH_PROFILE_ACCOUNT} from "../constants/paths";
import Breadcrumb from "./Breadcrumb";
import {useSelector} from "react-redux";
import {selectUserAccount, selectUserAccountsCount} from "../selectors/user";
import {selectCustomerAccount} from "../selectors/customer";
import {useLocation} from "react-router";

const AccountBreadcrumbs = () => {
    const countUserAccounts = useSelector(selectUserAccountsCount);
    const userAccount = useSelector(selectUserAccount);
    const customerAccount = useSelector(selectCustomerAccount);
    const location = useLocation();

    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        userAccount.isRepAccount
            ? {
                title: 'Account List',
                pathname: PATH_PROFILE_ACCOUNT.replace(':id', userAccount.id)
            }
            : null,
        !!customerAccount
            ? {title: `${customerAccount.ARDivisionNo}-${customerAccount.CustomerNo}`, pathname: location.pathname}
            : null,
    ].filter(p => p !== null);

    if (countUserAccounts < 2) {
        return null;
    }

    return (
        <Breadcrumb paths={paths}/>
    )
}

export default AccountBreadcrumbs;
