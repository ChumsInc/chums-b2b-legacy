import React, {useEffect, useState} from 'react';
import {SortableTableField} from "../../../common-components/DataTable";
import {ShipToCustomer} from "b2b-types";
import {billToCustomerSlug, customerShipToSorter, customerSlug, stateCountry} from "../../../utils/customer";
import {useSelector} from "react-redux";
import {
    selectCustomerLoading,
    selectPermittedShipToAddresses, selectPrimaryShipTo,
    selectPrimaryShipToCode
} from "../selectors";
import {SortProps} from "../../../types/generic";
import SortableTable from "../../../common-components/SortableTable";
import TablePagination from "@mui/material/TablePagination";
import LinearProgress from "@mui/material/LinearProgress";
import {generatePath, NavLink, redirect} from "react-router-dom";
import {PATH_CUSTOMER_DELIVERY} from "../../../constants/paths";
import classNames from "classnames";
import {useAppDispatch} from "../../../app/configureStore";
import {loadCustomer} from "../actions";
import {selectCurrentCustomer} from "../../user/selectors";

const ShipToLink = ({shipTo, children}: {shipTo:ShipToCustomer, children: React.ReactNode }) => {
    const path = generatePath(PATH_CUSTOMER_DELIVERY, {
        customerSlug: billToCustomerSlug(shipTo),
        code: shipTo.ShipToCode
        });
    return (
        <NavLink to={path}>{children}</NavLink>
    )
}
const fields: SortableTableField<ShipToCustomer>[] = [
    {field: 'ShipToCode', title: 'Code', sortable: true, render: (row) => <ShipToLink shipTo={row}>{row.ShipToCode}</ShipToLink>},
    {field: 'ShipToName', title: 'Name', sortable: true, render: (row) => <ShipToLink shipTo={row}>{row.ShipToName}</ShipToLink>},
    {field: 'ShipToAddress1', title: 'Address', sortable: true, className: 'hidden-xs'},
    {field: 'ShipToCity', title: 'City', sortable: true, className: 'hidden-xs'},
    {field: 'ShipToState', title: 'State', sortable: true, render: (row) => stateCountry(row), className: 'hidden-xs'},
    {field: 'ShipToZipCode', title: 'Postal Code', sortable: true, className: 'hidden-xs'},
    {
        field: 'EmailAddress', title: 'Email', sortable: true, render: (row) => <span>{!!row.EmailAddress && (
            <a href={`mailto:${row.EmailAddress}`} target="_blank">{row.EmailAddress}</a>)}</span>
    }
]
const ShipToList = () => {
    const dispatch = useAppDispatch();
    const customer = useSelector(selectCurrentCustomer)
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

    const reloadHandler = () => {
        dispatch(loadCustomer(customer));
    }

    const rowClassName = (row:ShipToCustomer) => {
        return classNames({'table-primary': row.ShipToCode === primaryShipTo?.ShipToCode});
    }
    return (
        <div>
            <div className="row g-3">
                <div className="col">
                    {primaryShipTo && (
                        <div>
                            <span className="text-muted me-3">Primary Ship To:</span>
                            <span className="me-1">[{primaryShipTo.ShipToCode}]</span>
                            {primaryShipTo.ShipToName}
                        </div>
                    )}
                    {!primaryShipTo && (
                        <h4><span className="text-muted me-3">Primary Ship To:</span>Delivery Address</h4>
                    )}
                </div>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={reloadHandler}>
                        Reload
                    </button>
                </div>
            </div>
            <LinearProgress variant="indeterminate" hidden={!loading}/>
            <SortableTable data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           rowClassName={rowClassName}
                           currentSort={sort} onChangeSort={setSort} fields={fields} keyField="ShipToCode"/>
            <TablePagination component="div" count={data.length}
                             page={page} onPageChange={(ev, page) => setPage(page)}
                             rowsPerPage={rowsPerPage} onRowsPerPageChange={(ev) => setRowsPerPage(+ev.target.value)}
                             showFirstButton showLastButton/>
        </div>
    )
}

export default ShipToList;
