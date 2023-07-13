import React, {useState} from 'react';
import UserIcon from "../UserIcon";
import {customerUserSorter} from "../../utils/customer";
import classNames from "classnames";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TablePagination from "../../common-components/TablePagination";
import BusinessIcon from '@mui/icons-material/Business';
import {useSelector} from "react-redux";
import {selectIsEmployee} from "../../ducks/user/selectors";


// export interface AccountUserTableProps {
//     users: CustomerUser[];
//     currentUser?: number;
//     onSelectUser: (user: CustomerUser) => void;
// }

const AccountUserTable = ({users, currentUser, onSelectUser}) => {
    const [page, setPage] = useState(0);
    const isEmployee = useSelector(selectIsEmployee);

    return (
        <div>
            <table className="table table-hover table-sm">
                {isEmployee && (<caption>Only users with explicitly assigned access are shown here.</caption>)}
                <thead>
                <tr>
                    <th/>
                    <th>Name</th>
                    <th>Email Address</th>
                    <th>Permissions</th>
                </tr>
                </thead>
                <tbody>
                {users
                    .filter(u => u.id !== 0)
                    .sort(customerUserSorter)
                    .slice(page * 10, page * 10 + 10)
                    .map(user => (
                        <tr key={`${user.id}:${user.shipToCode?.length}`} onClick={() => onSelectUser(user)}
                            className={classNames({'table-active': user.id === currentUser})}>
                            <td><UserIcon accountType={user.accountType}/></td>
                            <td>{user.name}</td>
                            <td><a href={`mailto:${user.email}`} target="_blank">{user.email}</a></td>
                            <td>
                                {!!user.shipToCode?.length && (
                                    <span title={`Locations: ${user.shipToCode.length}`}>
                                        <ShoppingCartIcon fontSize="small"/>
                                        {user.shipToCode.length > 1 && <>x{user.shipToCode.length}</>}
                                    </span>
                                )}
                                {!user.shipToCode?.length && (<span title="Complete Account"><BusinessIcon fontSize="small"/></span>)}
                            </td>
                        </tr>
                    ))
                }
                </tbody>
            </table>
            <TablePagination count={users.length} onChangePage={page => setPage(page)} page={page} rowsPerPage={10} />
        </div>
    )
}

export default AccountUserTable;
