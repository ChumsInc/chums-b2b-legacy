/**
 * Created by steve on 3/1/2017.
 */

import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {setUserAccount} from '../../ducks/user/actions';
import CustomerLink from "../CustomerLink";
import Breadcrumb from "../Breadcrumb";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../../constants/paths";
import ErrorBoundary from "../../common-components/ErrorBoundary";
import DocumentTitle from "../DocumentTitle";
import {
    selectCurrentCustomer,
    selectUserAccount,
    selectUserAccounts,
    selectUserCustomers,
    selectUserCustomersLoading,
    selectUserReps
} from "../../ducks/user/selectors";
import {useAppDispatch} from "../../app/configureStore";
import {useLocation, useParams} from "react-router";
import localStore from "../../utils/LocalStore";
import {STORE_ACCOUNT_LIST_RPP} from "../../constants/stores";
import AccountList from "./AccountList";

const ACCOUNT_LIST_FIELDS = [
    {field: 'CustomerNo', title: 'Account', render: (row => <CustomerLink {...row} />)},
    {field: 'CustomerName', title: "Name"},
    {field: 'AddressLine1', title: 'Address'},
    {field: 'City'},
    {field: 'State'},
    {field: 'ZipCode', title: 'ZIP'},
    {field: 'TelephoneNo', title: 'Phone'},
];

const AccountListContainer = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const location = useLocation();
    const userAccount = useSelector(selectUserAccount);
    const accounts = useSelector(selectUserAccounts);
    const customers = useSelector(selectUserCustomers);
    const loading = useSelector(selectUserCustomersLoading);
    const repList = useSelector(selectUserReps);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [filter, setFilter] = useState('');
    const [repFilter, setRepFilter] = useState(null);
    const [list, setList] = useState(customers ?? []);


    useEffect(() => {
        const rpp = localStore.getItem(STORE_ACCOUNT_LIST_RPP, rowsPerPage);
        setRowsPerPage(rpp);
    }, []);

    useEffect(() => {
        // const list =
    }, [filter, repFilter]);

    useEffect(() => {
        if (!userAccount.id || userAccount.id !== +params.id) {
            const [acct] = accounts.filter(acct => acct.id === +params.id);
            if (acct) {
                dispatch(setUserAccount(acct));
            }
        }
    }, [params, userAccount, accounts])

    const rppChangeHandler = (rpp) => {
        localStore.setItem(STORE_ACCOUNT_LIST_RPP, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    const filterChangeHandler = ({value}) => {
        setFilter(value ?? '');
        setPage(0);
    }
    const repChangeHandler = ({value}) => {
        setRepFilter(value ?? null)
        setPage(0);
    }

    const documentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');
    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        {title: 'Account List', pathname: location.pathname}
    ];

    return (
        <div>
            <ErrorBoundary>
                <DocumentTitle documentTitle={documentTitle}/>
                <Breadcrumb paths={paths}/>
                <AccountList/>
            </ErrorBoundary>
        </div>
    );
}

export default AccountListContainer;
