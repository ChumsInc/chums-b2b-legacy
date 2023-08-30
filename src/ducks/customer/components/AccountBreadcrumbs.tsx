import React from 'react';
import {PATH_PROFILE, PATH_PROFILE_ACCOUNT} from "@/constants/paths";
import Breadcrumb from "@/components/Breadcrumb";
import {useSelector} from "react-redux";
import {selectUserAccount, selectUserAccountsCount} from "@/ducks/user/selectors";
import {selectCustomerAccount} from "@/ducks/customer/selectors";
import {useLocation} from "react-router";
import {BreadcrumbPath} from "@/types/breadcrumbs";
import {generatePath} from "react-router-dom";

const AccountBreadcrumbs = () => {
    const countUserAccounts = useSelector(selectUserAccountsCount);
    const userAccount = useSelector(selectUserAccount);
    const customerAccount = useSelector(selectCustomerAccount);
    const location = useLocation();

    if (countUserAccounts < 2) {
        return null;
    }

    const paths:BreadcrumbPath[] = [
        {title: 'Profile', pathname: PATH_PROFILE},
    ];
    if (userAccount?.isRepAccount) {
        paths.push({
            title: 'Account List',
            pathname: generatePath(PATH_PROFILE_ACCOUNT, {id: `${userAccount?.id ?? 0}`})
        });
    } else if (customerAccount) {
        paths.push({title: `${customerAccount.ARDivisionNo}-${customerAccount.CustomerNo}`, pathname: location.pathname})
    }


    return (
        <Breadcrumb paths={paths}/>
    )
}

export default AccountBreadcrumbs;
