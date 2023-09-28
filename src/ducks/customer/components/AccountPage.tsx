import React, {useEffect} from 'react';
import {useSelector} from "react-redux";
import {loadCustomer} from '../actions';
import AccountBreadcrumbs from "./AccountBreadcrumbs";
import {
    selectCustomerAccount,
    selectCustomerLoading,
    selectCustomerLoaded,
    selectCustomerLoadStatus
} from "../selectors";
import {useParams} from "react-router";
import DocumentTitle from "../../../components/DocumentTitle";
import AccountTabs from "./AccountTabs";
import {useAppDispatch} from "../../../app/configureStore";
import {Outlet, redirect} from "react-router-dom";
import {billToCustomerSlug, customerSlug, parseCustomerSlug} from "../../../utils/customer";
import {PATH_PROFILE} from "../../../constants/paths";

const AccountPage = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCustomerAccount);
    const params = useParams<{ customerSlug: string }>();
    const loadStatus = useSelector(selectCustomerLoadStatus);
    const loaded = useSelector(selectCustomerLoaded);
    const loading = useSelector(selectCustomerLoading);

    useEffect(() => {
        const nextCustomer = billToCustomerSlug(params.customerSlug ?? '');
        if (!nextCustomer) {
            redirect(PATH_PROFILE);
            return;
        }
        if (!customer || customerSlug(customer) !== nextCustomer) {
            if (loadStatus !== 'idle') {
                return;
            }
            dispatch(loadCustomer(parseCustomerSlug(nextCustomer)));
            return;
        }
        if (loadStatus === 'idle' && !loaded) {
            dispatch(loadCustomer(customer));
        }
    }, [params, customer, loadStatus, loaded])

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
