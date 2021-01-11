import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {changeUser, fetchProfile, logout, setUserAccount} from "../actions/user";
import {setDocumentTitle} from "../actions/app";
import AccountSelector from "./AccountSelector";
import {userAccountPropType} from "../constants/myPropTypes";
import {isSameCustomer} from "../utils/customer";
import UserProfile from "./UserProfile";
import ProgressBar from "./ProgressBar";
import {DOCUMENT_TITLES} from '../constants/paths';



const mapStateToProps = ({user, app}) => {
    const {accounts, userAccount, currentCustomer, loading} = user;
    const {documentTitle} = app;
    return {accounts, userAccount, currentCustomer, loading, documentTitle};
};

const mapDispatchToProps = {
    logout,
    setUserAccount,
    fetchProfile,
    changeUser,
    setDocumentTitle,
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
        fetchProfile: PropTypes.func.isRequired,
        changeUser: PropTypes.func.isRequired,
        setDocumentTitle: PropTypes.func.isRequired,
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

    componentDidMount() {
        const {documentTitle} = this.props;
        if (documentTitle !== DOCUMENT_TITLES.profile) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.profile);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {documentTitle} = this.props;
        if (documentTitle !== DOCUMENT_TITLES.profile) {
            this.props.setDocumentTitle(DOCUMENT_TITLES.profile);
        }
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
