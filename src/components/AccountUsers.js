import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {fetchCustomerAccount, createUser, changeUser, saveUser, selectAccountUser, cancelCreateUser} from '../actions/customer';
import {customerUserShape} from "../constants/myPropTypes";
import ProgressBar from "./ProgressBar";
import AddAccountUserForm from "./AddAccountUserForm";
import {noop} from '../utils/general';
import FormGroup from "../common-components/FormGroup";
import UserIcon from "./UserIcon";

const AccountUser = ({id, name, email, accountType, onClick = noop}) => {
    return (
        <tr onClick={() => onClick()}>
            <td onClick={() => onClick()}><UserIcon accountType={accountType} /></td>
            <td onClick={() => onClick()}>{name}</td>
            <td onClick={() => onClick()}>{email}</td>
        </tr>
    )
};


const mapStateToProps = ({customer}) => {
    const {users, loading} = customer;
    const [selectedUser = null] = users.filter(u => u.selected);
    const existingUsers = users.filter(u => u.id !== 0);
    return {users: existingUsers, selectedUser, loading};
};

const mapDispatchToProps = {
    cancelCreateUser,
    changeUser,
    createUser,
    fetchCustomerAccount,
    saveUser,
    selectAccountUser
};

class AccountUsers extends Component {
    static propTypes = {
        users: PropTypes.arrayOf(PropTypes.shape(customerUserShape)),
        selectedUser: PropTypes.shape(customerUserShape),
        loading: PropTypes.bool,

        cancelCreateUser: PropTypes.func.isRequired,
        changeUser: PropTypes.func.isRequired,
        createUser: PropTypes.func.isRequired,
        fetchCustomerAccount: PropTypes.func.isRequired,
        saveUser: PropTypes.func.isRequired,
        selectAccountUser: PropTypes.func.isRequired,
    };

    static defaultProps = {
        users: [],
        selectedUser: null,
        loading: false,
    };

    constructor(props) {
        super(props);
        this.onSaveUser = this.onSaveUser.bind(this);
        this.onChangeUser = this.onChangeUser.bind(this);
        this.onCreateUser = this.onCreateUser.bind(this);
        this.onSelectUser = this.onSelectUser.bind(this);
        this.onReload = this.onReload.bind(this);
    }

    onSelectUser({id}) {
        this.props.selectAccountUser(id);
    }

    onCreateUser() {
        this.props.createUser();
    }

    onSaveUser() {
        const {selectedUser} = this.props;
        this.props.saveUser(selectedUser);
    }

    onChangeUser({field, value}) {
        const {id} = this.props.selectedUser;
        this.props.changeUser(id, {[field]: value});
    }

    onReload() {
        this.props.fetchCustomerAccount({fetchOrders: false});
    }

    render() {
        const {users, selectedUser, loading} = this.props;
        return (
            <Fragment>
                {loading && <ProgressBar striped={true}/>}
                <div className="row">
                    <div className="col-sm-6">
                        <table className="table table-hover table-sm">
                            <thead>
                            <tr>
                                <th />
                                <th>Name</th>
                                <th>Email Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users
                                .filter(u => u.id !== 0)
                                .sort((a, b) => a.name === b.name
                                    ? (a.email > b.email ? 1 : -1)
                                    : (a.name > b.name ? 1 : -1))
                                .map(user => <AccountUser key={user.id} {...user} onClick={this.onSelectUser}/>)
                            }
                            </tbody>
                        </table>
                        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={this.onReload}>
                            Reload
                        </button>
                    </div>
                    <div className="col-sm-6">
                        {!!selectedUser && (
                            <AddAccountUserForm {...selectedUser} onSubmit={this.onSaveUser}
                                                onChange={this.onChangeUser}
                                                onCancel={this.props.cancelCreateUser} />
                        )}
                        {!selectedUser && (
                            <FormGroup colWidth={8}>
                                <button className="btn btn-sm btn-outline-secondary" onClick={this.onCreateUser}>
                                    Add New User
                                </button>
                            </FormGroup>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountUsers) 
