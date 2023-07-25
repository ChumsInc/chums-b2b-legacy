import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {loadProfile, logout, setUserAccount} from "../ducks/user/actions";
import AccountSelector from "./AccountSelector";
import {userAccountPropType} from "../constants/myPropTypes";
import UserProfile from "./UserProfile";
import ProgressBar from "./ProgressBar";
import {DOCUMENT_TITLES} from '../constants/paths';
import DocumentTitle from "./DocumentTitle";


const mapStateToProps = ({user, app}) => {
    const {accounts, userAccount, currentCustomer, loading} = user;
    const {documentTitle} = app;
    return {accounts, userAccount, currentCustomer, loading, documentTitle};
};

const mapDispatchToProps = {
    logout,
    setUserAccount,
    loadProfile,
};


class ProfilePage extends Component {
    static propTypes = {
        accounts: PropTypes.array,
        userAccount: userAccountPropType,
        currentCustomer: PropTypes.shape({
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
        }),
        loading: PropTypes.bool,

        setUserAccount: PropTypes.func.isRequired,
        loadProfile: PropTypes.func.isRequired,

    };

    static defaultProps = {
        accounts: [],
        userAccount: {},
        currentCustomer: {},
        loading: false,
    };

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }


    onSelect(id) {
        this.props.setUserAccount(id);
    }

    render() {
        const {accounts, userAccount, loading} = this.props;
        const customerAccounts = accounts.filter(acct => !acct.isRepAccount);
        const repAccounts = accounts.filter(acct => !!acct.isRepAccount);

        return (
            <div className="profile-page">
                <DocumentTitle documentTitle={DOCUMENT_TITLES.profile}/>
                <UserProfile/>
                {loading && <ProgressBar striped label="Updating Profile"/>}
                {!!customerAccounts.length && <h4>Customer Accounts</h4>}
                {!!customerAccounts.length &&
                    <AccountSelector userAccounts={customerAccounts} userAccount={userAccount}/>}

                {!!repAccounts.length && <h4>Rep Accounts</h4>}
                {!!repAccounts.length && <AccountSelector userAccounts={repAccounts} userAccount={userAccount}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
