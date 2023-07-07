import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {companyName, sortUserAccounts, longAccountNumber} from '../utils/customer';
import RepLink from "./RepLink";
import CustomerLink from "./CustomerLink";

const UserAccount = ({acct = {}, selected = 0}) => {
    const {id, Company, CustomerName, SalespersonName, isRepAccount, ShipToName} = acct;
    return (
        <tr>
            <td>
                {!!isRepAccount && <RepLink {...acct} selected={id === selected}/>}
                {!isRepAccount && <CustomerLink {...acct} selected={id === selected}/>}
            </td>
            <td>{isRepAccount ? SalespersonName : (ShipToName ?? CustomerName)}</td>
        </tr>
    )
};

const AccountSelector = ({userAccounts, userAccount}) => {
    return (
        <table className="table table-hover table-sm">
            <thead>
            <tr>
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

export default AccountSelector
