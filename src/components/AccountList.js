/**
 * Created by steve on 3/1/2017.
 */

import React, {Component, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {connect, useSelector} from 'react-redux';
import {customerListPropType, repListPropType, userAccountPropType} from "../constants/myPropTypes";
import {fetchCustomerList, loadRepList, setUserAccount} from '../ducks/user/actions';
import {setRowsPerPage} from '../ducks/app/actions';
import SortableTable from "../common-components/SortableTable";
import {compareCustomerAccountNumber, longAccountNumber, longRepNo} from "../utils/customer";
import RepSelect from "./RepSelect";
import ProgressBar from "./ProgressBar";
import CustomerLink from "./CustomerLink";
import Breadcrumb from "./Breadcrumb";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../constants/paths";
import ErrorBoundary from "../common-components/ErrorBoundary";
import TextInput from "../common-components/TextInput";
import DocumentTitle from "./DocumentTitle";
import {
    selectCurrentCustomer,
    selectUserAccount,
    selectUserCustomers,
    selectUserCustomersLoading,
    selectUserReps
} from "../ducks/user/selectors";
import {useAppDispatch} from "../app/configureStore";
import {useLocation, useParams} from "react-router";
import localStore from "../utils/LocalStore";
import {STORE_ACCOUNT_LIST_RPP, STORE_USER_PREFS} from "../constants/stores";

const ACCOUNT_LIST_FIELDS = [
    {field: 'CustomerNo', title: 'Account', render: (row => <CustomerLink {...row} />)},
    {field: 'CustomerName', title: "Name"},
    {field: 'AddressLine1', title: 'Address'},
    {field: 'City'},
    {field: 'State'},
    {field: 'ZipCode', title: 'ZIP'},
    {field: 'TelephoneNo', title: 'Phone'},
];

const _AccountList = () => {
    const dispatch = useAppDispatch();
    const params = useParams();
    const location = useLocation();
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
    }, [filter, repFilter])

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
                <h2>Account List: {userAccount.SalespersonName}
                    <small>({longAccountNumber(userAccount)})</small>
                </h2>
                <div className="row g-3 mb-1 align-items-baseline">
                    <div className="col-auto">
                        Filter Accounts
                    </div>
                    <div className="col">
                        <TextInput type="search" placeholder="Search" onChange={this.setFilter} value={filter}/>
                    </div>
                    <div className="col-auto">
                        <RepSelect value={repFilter} onChange={this.onSelectRep}/>
                    </div>
                    <div className="col-auto">
                        <button className="btn btn-sm btn-outline-primary" onClick={this.onLoadAccountList}>
                            Refresh List
                        </button>
                    </div>
                </div>
                {loading && <ProgressBar striped={true}/>}
                <SortableTable data={filteredAccounts} fields={ACCOUNT_LIST_FIELDS} defaultSort={'CustomerName'}
                               rowsPerPage={rowsPerPage}
                               onChangeRowsPerPage={(rowsPerPage) => this.props.setRowsPerPage(rowsPerPage)}
                               page={page} onChangePage={(page) => this.setState({page})}
                               keyField={longAccountNumber}
                               rowClassName={row => ({'table-active': compareCustomerAccountNumber(row, currentCustomer) === 0})}
                               filtered={filteredAccounts.length < customerList.length}/>
            </ErrorBoundary>
        </div>
    );

}

class AccountList extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                id: PropTypes.string,
            })
        }),
        accounts: PropTypes.arrayOf(userAccountPropType),
        userAccount: userAccountPropType,
        customerList: PropTypes.array,
        repList: repListPropType,
        currentCustomer: PropTypes.shape({
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
        }),
        rowsPerPage: PropTypes.number,
        documentTitle: PropTypes.string,
        loading: PropTypes.bool,

        fetchCustomerList: PropTypes.func.isRequired,
        loadRepList: PropTypes.func.isRequired,
        setUserAccount: PropTypes.func.isRequired,
        setRowsPerPage: PropTypes.func.isRequired,
    };

    static defaultProps = {
        match: {
            params: {
                Company: '',
                SalespersonDivisionNo: '',
                SalespersonNo: '',
            }
        },
        accounts: [],
        userAccount: {},
        customerList: [],
        repList: [],
        allowSelectReps: false,
        rowsPerPage: 10,
        documentTitle: '',
        loading: false,
    };

    state = {
        filter: '',
        page: 0,
        rowsPerPage: 10,
        filterRep: '',
    };

    constructor(props) {
        super(props);
        this.onLoadAccountList = this.onLoadAccountList.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.onSelectRep = this.onSelectRep.bind(this);
    }

    componentDidMount() {
        const {match, accounts, userAccount, setUserAccount, fetchCustomerList, customerList} = this.props;
        const id = Number(match.params.id || 0);
        if (!!id && userAccount.id !== id) {
            const [acct = userAccount] = accounts
                .filter(acct => acct.id === id);
            setUserAccount(acct);
        }
        if (customerList.length === 0) {
            fetchCustomerList();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {match, accounts, userAccount, setUserAccount} = this.props;
        const id = Number(match.params.id || 0);
        if (!!id && userAccount.id !== id) {
            const [acct = userAccount] = accounts
                .filter(acct => acct.id === id);
            setUserAccount(acct);
        }
    }


    onLoadAccountList() {
        const {userAccount, repList, fetchCustomerList, loadRepList, allowSelectReps} = this.props;
        const {filterRep} = this.state;
        if (filterRep) {
            return fetchCustomerList(filterRep);
        }
        if (allowSelectReps) {
            const [rep = userAccount] = repList.list.filter(rep => longRepNo(rep) === filterRep);
            fetchCustomerList(rep);
            loadRepList();
        } else {
            fetchCustomerList();
        }
    }


    onSelectRep({value}) {
        this.setState({filterRep: value});
    }

    setFilter({value}) {
        this.setState({filter: value, page: 0});
    }

    filterAccounts() {
        const {customerList} = this.props;
        const {filter, filterRep} = this.state;
        try {
            const filterRegex = new RegExp('\\b' + filter, 'i');
            return customerList
                .filter(acct => !filterRep || acct.SalespersonNo === filterRep)
                .filter(acct => {
                    return this.filter === ''
                        || filterRegex.test(acct.key)
                        || filterRegex.test(`${acct.ARDivisionNo}-${acct.CustomerNo}`)
                        || filterRegex.test(acct.CustomerNo)
                        || filterRegex.test(acct.CustomerName)
                        || filterRegex.test(acct.AddressLine1)
                        || filterRegex.test(acct.City)
                        || filterRegex.test(acct.State)
                        || filterRegex.test(acct.ZipCode)
                        || filterRegex.test(acct.TelephoneNo)
                });
        } catch (e) {
            console.log('filterAccounts()', {message: e.message});
            return customerList;
        }
    }

    render() {
        const {
            customerList,
            userAccount,
            location,
            currentCustomer,
            rowsPerPage,
            loading,
        } = this.props;
        const filteredAccounts = this.filterAccounts();
        const {filter, page, filterRep} = this.state;
        const paths = [
            {title: 'Profile', pathname: PATH_PROFILE},
            {title: 'Account List', pathname: location.pathname}
        ];

        const documentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');

        return (
            <div>
                <ErrorBoundary>
                    <DocumentTitle documentTitle={documentTitle}/>
                    <Breadcrumb paths={paths}/>
                    <h2>Account List: {userAccount.SalespersonName}
                        <small>({longAccountNumber(userAccount)})</small>
                    </h2>
                    <div className="row g-3 mb-1 align-items-baseline">
                        <div className="col-auto">
                            Filter Accounts
                        </div>
                        <div className="col">
                            <TextInput type="search" placeholder="Search" onChange={this.setFilter} value={filter}/>
                        </div>
                        <div className="col-auto">
                            <RepSelect value={filterRep} onChange={this.onSelectRep}/>
                        </div>
                        <div className="col-auto">
                            <button className="btn btn-sm btn-outline-primary" onClick={this.onLoadAccountList}>
                                Refresh List
                            </button>
                        </div>
                    </div>
                    {loading && <ProgressBar striped={true}/>}
                    <SortableTable data={filteredAccounts} fields={ACCOUNT_LIST_FIELDS} defaultSort={'CustomerName'}
                                   rowsPerPage={rowsPerPage}
                                   onChangeRowsPerPage={(rowsPerPage) => this.props.setRowsPerPage(rowsPerPage)}
                                   page={page} onChangePage={(page) => this.setState({page})}
                                   keyField={longAccountNumber}
                                   rowClassName={row => ({'table-active': compareCustomerAccountNumber(row, currentCustomer) === 0})}
                                   filtered={filteredAccounts.length < customerList.length}/>
                </ErrorBoundary>
            </div>
        );

    }
}


const mapStateToProps = (state) => {
    const {user, app} = state;
    const userAccount = selectUserAccount(state);
    const customerList = selectUserCustomers(state);
    const loading = selectUserCustomersLoading(state);
    const {repList, accounts, currentCustomer} = user;
    const {rowsPerPage, documentTitle} = app;
    return {userAccount, customerList, repList, accounts, currentCustomer, rowsPerPage, documentTitle, loading};
};

const mapDispatchToProps = {
    fetchCustomerList,
    setUserAccount,
    loadRepList,
    setRowsPerPage,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
