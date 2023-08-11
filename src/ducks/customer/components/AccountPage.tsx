import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {loadCustomer} from '../actions';
import AccountBreadcrumbs from "@/components/AccountBreadcrumbs";
import {selectCustomerAccount} from "../selectors";
import {useParams} from "react-router";
import DocumentTitle from "@/components/DocumentTitle";
import AccountTabs from "@/components/AccountTabs";
import {useAppDispatch} from "@/app/configureStore";
import {Outlet, redirect} from "react-router-dom";
import {customerSlug, parseCustomerSlug} from "@/utils/customer";
import {PATH_PROFILE} from "@/constants/paths";

const AccountPage = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const params = useParams<{ customerSlug: string }>();

    useEffect(() => {
        console.log(params);
        const nextCustomer = parseCustomerSlug(params.customerSlug ?? '');
        if (!nextCustomer) {
            redirect(PATH_PROFILE);
            return;
        }
        if (!customer || customerSlug(customer) !== params.customerSlug) {
            // dispatch(setCustomerAccount(nextCustomer));
            dispatch(loadCustomer(nextCustomer));
            // dispatch(loadCustomerPermissions(nextCustomer));
        }
    }, [params, customer])

    return (
        <div>
            <DocumentTitle documentTitle={customer?.CustomerName ?? ''}/>
            <AccountBreadcrumbs/>
            <h2>{customer?.CustomerName}</h2>
            <AccountTabs/>
            <Outlet/>
        </div>
    );
};

export default AccountPage;
