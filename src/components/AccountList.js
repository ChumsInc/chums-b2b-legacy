/**
 * Created by steve on 3/1/2017.
 */

import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {customerListPropType, repListPropType, userAccountPropType} from "../constants/myPropTypes";
import {fetchCustomerList, fetchRepList, setUserAccount} from '../actions/user';
import {setRowsPerPage, setDocumentTitle} from '../actions/app';
import SortableTable from "../common-components/SortableTable";
import {compareCustomerAccountNumber, longAccountNumber, longRepNo} from "../utils/customer";
import FormGroupTextInput from "../common-components/FormGroupTextInput";
import RepSelect from "./RepSelect";
import ProgressBar from "./ProgressBar";
import CustomerLink from "./CustomerLink";
import Breadcrumb from "./Breadcrumb";
import {PATH_PROFILE, DOCUMENT_TITLES} from "../constants/paths";
import ErrorBoundary from "../common-components/ErrorBoundary";


const ACCOUNT_LIST_FIELDS = [
    {field: 'CustomerNo', title: 'Account', render: (row => <CustomerLink {...row} />)},
    {field: 'CustomerName', title: "Name"},
    {field: 'AddressLine1', title: 'Address'},
    {field: 'City'},
    {field: 'State'},
    {field: 'ZipCode', title: 'ZIP'},
    {field: 'TelephoneNo', title: 'Phone'},
];

class AccountList extends Component {
    static propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                id: PropTypes.string,
            })
        }),
        accounts: PropTypes.arrayOf(userAccountPropType),
        userAccount: userAccountPropType,
        customerList: customerListPropType,
        repList: repListPropType,
        allowSelectReps: PropTypes.bool,
        currentCustomer: PropTypes.shape({
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
        }),
        rowsPerPage: PropTypes.number,
        documentTitle: PropTypes.string,

        fetchCustomerList: PropTypes.func.isRequired,
        fetchRepList: PropTypes.func.isRequired,
        setUserAccount: PropTypes.func.isRequired,
        setRowsPerPage: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
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
        customerList: {
            list: [],
            loading: false,
        },
        repList: [],
        allowSelectReps: false,
        rowsPerPage: 10,
        documentTitle: '',
    };

    state = {
        filter: '',
        page: 1,
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
        const {match, accounts, userAccount, setUserAccount, fetchCustomerList, customerList, documentTitle} = this.props;
        const id = Number(match.params.id || 0);
        if (!!id && userAccount.id !== id) {
            const [acct = userAccount] = accounts
                .filter(acct => acct.id === id);
            setUserAccount(acct);
        }
        if (customerList.list.length === 0) {
            fetchCustomerList();
        }
        const newDocumentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');
        if (documentTitle !== newDocumentTitle) {
            this.props.setDocumentTitle(newDocumentTitle);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {match, accounts, userAccount, setUserAccount, documentTitle} = this.props;
        const id = Number(match.params.id || 0);
        if (!!id && userAccount.id !== id) {
            const [acct = userAccount] = accounts
                .filter(acct => acct.id === id);
            setUserAccount(acct);
        }
        const newDocumentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');
        if (documentTitle !== newDocumentTitle) {
            this.props.setDocumentTitle(newDocumentTitle);
        }
    }


    onLoadAccountList() {
        const {userAccount, repList, fetchCustomerList, fetchRepList, allowSelectReps} = this.props;
        const {filterRep} = this.state;
        if (allowSelectReps) {
            const [rep = userAccount] = repList.list.filter(rep => longRepNo(rep) === filterRep);
            fetchCustomerList(rep);
            fetchRepList();
        } else {
            fetchCustomerList();
        }
    }


    onSelectRep({value}) {
        const {userAccount, repList, fetchCustomerList} = this.props;
        const [rep = userAccount] = repList.list.filter(rep => longRepNo(rep) === value);
        fetchCustomerList(rep);
        this.setState({filterRep: value});
    }

    setFilter({value}) {
        this.setState({filter: value, page: 1});
    }

    filterAccounts() {
        const {customerList} = this.props;
        const {filter} = this.state;
        try {
            const filterRegex = new RegExp('\\b' + filter, 'i');
            return customerList
                .list
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
            return customerList.list;
        }
    }

    render() {
        const {customerList, userAccount, repList, location, allowSelectReps, currentCustomer, rowsPerPage} = this.props;
        const filteredAccounts = this.filterAccounts();
        const {filter, page, filterRep} = this.state;
        const paths = [
            {title: 'Profile', pathname: PATH_PROFILE},
            {title: 'Account List', pathname: location.pathname}
        ];

        return (
            <div>
                <ErrorBoundary>
                    <Breadcrumb paths={paths}/>
                    <h2>Account List: {userAccount.SalespersonName}
                        <small>({longAccountNumber(userAccount)})</small>
                    </h2>
                    <div className="form-inline mb-1">
                        <FormGroupTextInput onChange={this.setFilter} value={filter} label="Filter Accounts"/>
                        {allowSelectReps && repList.list.length > 0
                        && (
                            <RepSelect reps={repList.list} value={filterRep} onSelect={this.onSelectRep}/>
                        )}
                        <button className="btn btn-sm btn-outline-primary" onClick={this.onLoadAccountList}>
                            Refresh List
                        </button>
                    </div>
                    {customerList.loading && <ProgressBar striped={true}/>}
                    <SortableTable data={filteredAccounts} fields={ACCOUNT_LIST_FIELDS} defaultSort={'CustomerName'}
                                   rowsPerPage={rowsPerPage}
                                   onChangeRowsPerPage={(rowsPerPage) => this.props.setRowsPerPage(rowsPerPage)}
                                   page={page} onChangePage={(page) => this.setState({page})}
                                   keyField={longAccountNumber}
                                   rowClassName={row => ({'table-active': compareCustomerAccountNumber(row, currentCustomer) === 0})}
                                   filtered={filteredAccounts.length < customerList.list.length}/>
                </ErrorBoundary>
            </div>
        );

    }
}


const mapStateToProps = ({user, app}) => {
    const {userAccount, customerList, repList, accounts, currentCustomer} = user;
    const allowSelectReps = /[%_]+/.test(userAccount.SalespersonNo);
    const {rowsPerPage, documentTitle} = app;
    return {userAccount, customerList, repList, accounts, allowSelectReps, currentCustomer, rowsPerPage, documentTitle};
};

const mapDispatchToProps = {
    fetchCustomerList,
    setUserAccount,
    fetchRepList,
    setRowsPerPage,
    setDocumentTitle,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountList);
