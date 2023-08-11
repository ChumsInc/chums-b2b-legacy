import React from 'react';
import {sortUserAccounts} from '../utils/customer';
import RepLink from "./RepLink";
import CustomerLink from "./CustomerLink";
import {UserCustomerAccess} from "b2b-types";

const UserAccount = ({access, selected = 0}: {
    access: UserCustomerAccess;
    selected?: number;
}) => {
    const {id, CustomerName, SalespersonName, isRepAccount, ARDivisionNo, CustomerNo, ShipToCode} = access;
    return (
        <tr>
            <td>
                {!!isRepAccount && <RepLink id={access.id} SalespersonDivisionNo={access.SalespersonDivisionNo}
                                            SalespersonNo={access.SalespersonNo} selected={id === selected}/>}
                {!isRepAccount &&
                    <CustomerLink customer={{ARDivisionNo, CustomerNo, ShipToCode}} selected={id === selected}/>}
            </td>
            <td>{isRepAccount ? SalespersonName : CustomerName}</td>
        </tr>
    )
};

const AccountSelector = ({userAccounts, userAccount}: {
    userAccounts: UserCustomerAccess[],
    userAccount: UserCustomerAccess|null;
}) => {
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
                .map(acct => <UserAccount key={acct.id} access={acct} selected={userAccount?.id}/>)}
            </tbody>
        </table>
    )
}

export default AccountSelector
