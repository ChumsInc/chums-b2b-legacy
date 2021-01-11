import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {companyName, sortUserAccounts, longAccountNumber} from '../utils/customer';
import RepLink from "./RepLink";
import CustomerLink from "./CustomerLink";

const UserAccount = ({acct = {}, selected = 0}) => {
    const {id, Company, CustomerName, SalespersonName, isRepAccount} = acct;
    return (
        <tr>
            <td>
                {!!isRepAccount && <RepLink {...acct} selected={id === selected}/>}
                {!isRepAccount && <CustomerLink {...acct} selected={id === selected}/>}
            </td>
            <td>{companyName(Company)}</td>
            <td>{longAccountNumber(acct)}</td>
            <td>{isRepAccount ? SalespersonName : CustomerName}</td>
        </tr>
    )
};

export default class AccountSelector extends Component {
    static propTypes = {
        userAccounts: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            Company: PropTypes.string,
            ARDivisionNo: PropTypes.string,
            CustomerNo: PropTypes.string,
            CustomerName: PropTypes.string,
            SalespersonDivisionNo: PropTypes.string,
            SalespersonNo: PropTypes.string,
            SalespersonName: PropTypes.string,
            isRepAccount: PropTypes.oneOfType([PropTypes.number, PropTypes.bool])
        })),
        userAccount: PropTypes.object,
    };

    static defaultProps = {
        userAccounts: [],
        userAccount: {

        }
    };

    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
    }

    onSelect(acct) {
        this.props.onSelect(acct)
    }

    render() {
        const {userAccounts, userAccount} = this.props;
        return (
            <table className="table table-hover table-sm">
                <thead>
                <tr>
                    <th/>
                    <th>Company</th>
                    <th>Account</th>
                    <th>Name</th>
                </tr>
                </thead>
                <tbody>
                {userAccounts
                    .sort(sortUserAccounts)
                    .map(acct => <UserAccount key={acct.id} acct={acct} selected={userAccount.id}/>)}
                </tbody>
            </table>
        )
    }
}
