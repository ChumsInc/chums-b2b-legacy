import React from 'react';
import UserIcon from "../UserIcon";
import {customerUserSorter} from "../../utils/customer";
import classNames from "classnames";

// export interface AccountUserTableProps {
//     users: CustomerUser[];
//     currentUser?: number;
//     onSelectUser: (user: CustomerUser) => void;
// }

const AccountUserTable = ({users, currentUser, onSelectUser}) => {
    return (
        <>
            <table className="table table-hover table-sm">
                <thead>
                <tr>
                    <th/>
                    <th>Name</th>
                    <th>Email Address</th>
                </tr>
                </thead>
                <tbody>
                {users
                    .filter(u => u.id !== 0)
                    .sort(customerUserSorter)
                    .map(user => (
                        <tr key={user.id} onClick={() => onSelectUser(user)}
                            className={classNames({'table-active': user.id === currentUser})}>
                            <td><UserIcon accountType={user.accountType}/></td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`} target="_blank">{user.email}</a></td>
                        </tr>
                    ))
                }
                </tbody>
            </table>

        </>
    )
}

export default AccountUserTable;
