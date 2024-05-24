import React from 'react';
import Typography from "@mui/material/Typography";
import {Table, TableBody, TableCell, TableHead, TableRow} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {useSelector} from "react-redux";
import {selectCustomerUsers, selectPermittedShipToAddresses} from "../selectors";
import {useMatch} from "react-router";
import {customerUserPath} from "../../../utils/path-utils";

const AccountUserPermissions = () => {
    const users = useSelector(selectCustomerUsers);
    const shipToAddresses = useSelector(selectPermittedShipToAddresses);
    const match = useMatch(customerUserPath);
    const [user] = users.filter(u => u.id.toString() === match?.params?.id);

    if (!user) {
        return null;
    }

    return (
        <>
            <Typography variant="h4" component="h4">Access Permissions</Typography>
            <Table className="table table-sm" size="small">
                <TableHead>
                    <TableRow>
                        <TableCell/>
                        <TableCell>Ship To Code</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user.shipToCode?.length === 0 && (
                        <TableRow>
                            <TableCell><BusinessIcon/></TableCell>
                            <TableCell colSpan={3}>All Locations</TableCell>
                        </TableRow>
                    )}
                    {shipToAddresses
                        .filter(st => user.shipToCode?.includes(st.ShipToCode))
                        .map(shipTo => (
                            <TableRow key={shipTo.ShipToCode}>
                                <TableCell><ShoppingCartIcon/></TableCell>
                                <TableCell>{shipTo.ShipToCode}</TableCell>
                                <TableCell>{shipTo.ShipToName}</TableCell>
                                <TableCell>{shipTo.ShipToCity}, {shipTo.ShipToState} {shipTo.ShipToCountryCode}</TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </>
    )
}
export default AccountUserPermissions;
