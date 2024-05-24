import React, {useState} from 'react';
import UserIcon from "./UserIcon";
import {customerUserSorter} from "../../../utils/customer";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BusinessIcon from '@mui/icons-material/Business';
import {useSelector} from "react-redux";
import {selectIsEmployee} from "../../user/selectors";
import {CustomerUser} from "b2b-types";
import TablePagination from "@mui/material/TablePagination";
import Table from "@mui/material/Table";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Tooltip from "@mui/material/Tooltip";
import {generatePath, useMatch, useNavigate} from "react-router";
import {selectCustomerUsers} from "../selectors";
import {customerUserPath} from "../../../utils/path-utils";


const AccountUserTable = () => {
    const users = useSelector(selectCustomerUsers);
    const [page, setPage] = useState(0);
    const isEmployee = useSelector(selectIsEmployee);
    const match = useMatch(customerUserPath);
    const navigate = useNavigate();

    const userSelectHandler = (user: CustomerUser) => {
        if (match?.params?.customerSlug) {
            navigate(generatePath(customerUserPath, {
                customerSlug: match?.params?.customerSlug,
                id: user.id.toString()
            }))
        }
    }

    return (
        <div>
            <Table size="small">
                {isEmployee && (<caption>Only users with explicitly assigned access are shown here.</caption>)}
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Name</TableCell>
                        <TableCell>Email Address</TableCell>
                        <TableCell>Permissions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {users
                        .filter(u => u.id !== 0)
                        .sort(customerUserSorter)
                        .slice(page * 10, page * 10 + 10)
                        .map(user => (
                            <TableRow key={user.id}
                                      onClick={() => userSelectHandler(user)}
                                      selected={user.id.toString() === match?.params.id}>
                                <TableCell><UserIcon accountType={user.accountType}/></TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>
                                    <Link href={`mailto:${user.email}`} target="_blank">{user.email}</Link>
                                </TableCell>
                                <TableCell>
                                    {!!user.shipToCode?.length && (
                                        <Tooltip title={`Locations: ${user.shipToCode.length}`}>
                                            <Stack direction="row" spacing={2}>
                                                <ShoppingCartIcon fontSize="small"/>
                                                {user.shipToCode.length > 1 && <>x{user.shipToCode.length}</>}
                                            </Stack>
                                        </Tooltip>
                                    )}
                                    {!user.shipToCode?.length && (
                                        <Tooltip title="Complete Account"><BusinessIcon fontSize="small"/></Tooltip>)}
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            <TablePagination component="div"
                             count={users.length} onPageChange={(ev, page) => setPage(page)} page={page}
                             rowsPerPage={10}/>
        </div>
    )
}

export default AccountUserTable;
