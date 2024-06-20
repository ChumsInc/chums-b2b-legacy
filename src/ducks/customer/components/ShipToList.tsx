import React, {useEffect, useState} from 'react';
import DataTable, {SortableTableField} from "../../../common-components/DataTable";
import {ShipToCustomer} from "b2b-types";
import {billToCustomerSlug, customerShipToSorter, stateCountry} from "../../../utils/customer";
import {useSelector} from "react-redux";
import {selectCustomerLoading, selectPermittedShipToAddresses, selectPrimaryShipTo} from "../selectors";
import {SortProps} from "../../../types/generic";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import {generatePath, NavLink} from "react-router-dom";
import {PATH_CUSTOMER_DELIVERY} from "../../../constants/paths";
import classNames from "classnames";

import Box from "@mui/material/Box";
import PrimaryShipToIcon from "./PrimaryShipToIcon";
import Link, {LinkProps} from "@mui/material/Link";
import Grid2 from "@mui/material/Unstable_Grid2";
import ReloadCustomerButton from "./ReloadCustomerButton";

export interface ShipToLinkProps extends Omit<LinkProps, 'to'> {
    shipTo: ShipToCustomer;
}


const ShipToLink = ({shipTo, children, ...rest}: ShipToLinkProps) => {
    const path = generatePath(PATH_CUSTOMER_DELIVERY, {
        customerSlug: billToCustomerSlug(shipTo),
        code: shipTo.ShipToCode
    });
    return (
        <Link component={NavLink} to={path} {...rest}>{children}</Link>
    )
}
const fields: SortableTableField<ShipToCustomer>[] = [
    {
        field: 'ShipToCode', title: 'Code', sortable: true, render: (row) => (
            <ShipToLink shipTo={row} sx={{display: 'flex', alignItems: 'center'}}>
                <Box sx={{mr: 1}} component="span">{row.ShipToCode}</Box>
                <PrimaryShipToIcon shipToCode={row.ShipToCode}/>
            </ShipToLink>)
    },
    {
        field: 'ShipToName',
        title: 'Name',
        sortable: true,
        render: (row) => <ShipToLink shipTo={row}>{row.ShipToName}</ShipToLink>
    },
    {field: 'ShipToAddress1', title: 'Address', sortable: true, className: 'hidden-xs'},
    {field: 'ShipToCity', title: 'City', sortable: true, className: 'hidden-xs'},
    {field: 'ShipToState', title: 'State', sortable: true, render: (row) => stateCountry(row), className: 'hidden-xs'},
    {field: 'ShipToZipCode', title: 'Postal Code', sortable: true, className: 'hidden-xs'},
    {
        field: 'EmailAddress', title: 'Email', sortable: true, render: (row) => <span>{!!row.EmailAddress && (
            <Link href={`mailto:${row.EmailAddress}`} target="_blank">{row.EmailAddress}</Link>)}</span>
    }
]
const ShipToList = () => {
    const list = useSelector(selectPermittedShipToAddresses);
    const loading = useSelector(selectCustomerLoading);
    const primaryShipTo = useSelector(selectPrimaryShipTo);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sort, setSort] = useState<SortProps<ShipToCustomer>>({field: 'ShipToCode', ascending: true});
    const [data, setData] = useState<ShipToCustomer[]>([...list].sort(customerShipToSorter(sort)));

    useEffect(() => {
        setData([...list].sort(customerShipToSorter(sort)));
    }, [list, sort]);

    const rowClassName = (row: ShipToCustomer) => {
        return classNames({'table-primary': row.ShipToCode === primaryShipTo?.ShipToCode});
    }
    return (
        <div>
            {loading && (<LinearProgress variant="indeterminate"/>)}
            <DataTable data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                       rowClassName={rowClassName}
                       currentSort={sort} onChangeSort={setSort} fields={fields} keyField="ShipToCode"/>
            <Grid2 container spacing={2} justifyContent="end">
                <TablePagination component="div" count={data.length}
                                 page={page} onPageChange={(ev, page) => setPage(page)}
                                 rowsPerPage={rowsPerPage}
                                 onRowsPerPageChange={(ev) => setRowsPerPage(+ev.target.value)}
                                 showFirstButton showLastButton/>
                <ReloadCustomerButton/>
            </Grid2>
        </div>
    )
}

export default ShipToList;
