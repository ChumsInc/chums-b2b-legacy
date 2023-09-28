import React, {ChangeEvent, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadCustomerList} from '../actions';
import SortableTable from "../../../common-components/SortableTable";
import {compareCustomerAccountNumber, longAccountNumber, stateCountry} from "../../../utils/customer";
import RepSelect from "../../../ducks/reps/components/RepSelect";
import CustomerLink from "../../../components/CustomerLink";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectUserAccount,} from "../../user/selectors";
import {useAppDispatch} from "../../../app/configureStore";
import localStore from "../../../utils/LocalStore";
import {STORE_ACCOUNT_LIST_RPP} from "../../../constants/stores";
import {SortableTableField} from "../../../common-components/DataTable";
import {Customer} from "b2b-types";
import {SortProps} from "../../../types/generic";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../../../constants/paths";
import DocumentTitle from "../../../components/DocumentTitle";
import Breadcrumb from "../../../components/Breadcrumb";
import {useLocation, useMatch} from "react-router";
import {
    selectCustomersFilter,
    selectCustomersLoaded,
    selectCustomersLoading,
    selectCustomerSort,
    selectCustomersRepFilter,
    selectFilteredCustomerList
} from "../selectors";
import {setCustomersFilter, setCustomersRepFilter, setCustomersSort} from "../actions";
import TelephoneLink from "../../../components/TelephoneLink";

const ACCOUNT_LIST_FIELDS: SortableTableField<Customer>[] = [
    {field: 'CustomerNo', title: 'Account', render: (row) => <CustomerLink customer={row}/>, sortable: true},
    {field: 'CustomerName', title: "Name", sortable: true},
    {field: 'AddressLine1', title: 'Address', sortable: true},
    {field: 'City', title: 'City', sortable: true},
    {field: 'State', title: 'State', sortable: true, render: (row) => stateCountry(row)},
    {field: 'ZipCode', title: 'ZIP', sortable: true},
    {field: 'TelephoneNo', title: 'Phone', sortable: true, render: (row) => <TelephoneLink telephoneNo={row.TelephoneNo}  />},
];

const AccountList = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/profile/:id');
    const location = useLocation();
    const userAccount = useSelector(selectUserAccount);
    const customers = useSelector(selectFilteredCustomerList);
    const loading = useSelector(selectCustomersLoading);
    const loaded = useSelector(selectCustomersLoaded);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const sort = useSelector(selectCustomerSort);
    const repFilter = useSelector(selectCustomersRepFilter);
    const filter = useSelector(selectCustomersFilter);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);


    useEffect(() => {
        const rpp = localStore.getItem(STORE_ACCOUNT_LIST_RPP, rowsPerPage);
        setRowsPerPage(rpp);
    }, []);

    useEffect(() => {
        const profileId = +(match?.params.id ?? 0);
        if (!loading && !loaded && profileId === userAccount?.id) {
            dispatch(loadCustomerList(userAccount));
        }
    }, [loading, loaded, match, userAccount]);


    const rppChangeHandler = (rpp: number) => {
        localStore.setItem<number>(STORE_ACCOUNT_LIST_RPP, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    const filterChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCustomersFilter(ev.target.value));
        setPage(0);
    }
    const repChangeHandler = (value: string | null) => {
        dispatch(setCustomersRepFilter(value));
        setPage(0);
    }
    const reloadHandler = () => {
        dispatch(loadCustomerList(userAccount));
    }

    const sortChangeHandler = (sort: SortProps<Customer>) => {
        dispatch(setCustomersSort(sort));
        setPage(0);
    }

    if (!userAccount) {
        return (
            <div>
                <Alert severity="info">Please select a valid profile.</Alert>
            </div>
        )
    }

    const documentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');
    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        {title: 'Account List', pathname: location.pathname}
    ];

    return (
        <ErrorBoundary>
            <DocumentTitle documentTitle={documentTitle}/>
            <Breadcrumb paths={paths}/>
            <h2>Account List</h2>
            <h3>{userAccount?.SalespersonName ?? ''} <small className="ms-3">({longAccountNumber(userAccount)})</small>
            </h3>

            <div className="row g-3 mb-1 align-items-baseline">
                <div className="col-auto">
                    Filter Accounts
                </div>
                <div className="col">
                    <div className="input-group input-group-sm">
                        <div className="input-group-text">
                            <span className="bi-search"/>
                        </div>
                        <input type="search" className="form-control form-control-sm" value={filter}
                               onChange={filterChangeHandler}/>
                    </div>
                </div>
                <div className="col-auto">
                    <RepSelect value={repFilter} onChange={repChangeHandler}/>
                </div>
                <div className="col-auto">
                    <button className="btn btn-sm btn-outline-primary" onClick={reloadHandler}>
                        Refresh List
                    </button>
                </div>
            </div>
            {loading && <LinearProgress variant="indeterminate" sx={{my: 1}}/>}
            <SortableTable data={customers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={ACCOUNT_LIST_FIELDS}
                           currentSort={sort} onChangeSort={sortChangeHandler}
                           keyField={longAccountNumber}
                           rowClassName={row => ({'table-active': !!currentCustomer && compareCustomerAccountNumber(row, currentCustomer) === 0})}/>
            <TablePagination component="div" count={customers.length} page={page} rowsPerPage={rowsPerPage}
                             onPageChange={(ev, page) => setPage(page)} showFirstButton showLastButton
                             onRowsPerPageChange={(ev) => setRowsPerPage(+ev.target.value)}/>
        </ErrorBoundary>
    );
}

export default AccountList;
