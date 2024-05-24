import {SortableTableField} from "../../../common-components/DataTable";
import {Customer} from "b2b-types";
import {SxProps} from "@mui/system";
import CustomerLink from "../../../components/CustomerLink";
import CustomerNameField from "./CustomerNameField";
import {stateCountry} from "../../../utils/customer";
import TelephoneLink from "../../../components/TelephoneLink";
import React from "react";

interface ColumnData extends SortableTableField<Customer> {
    width: number;
    sx?: SxProps;
}

const hiddenXS: SxProps = {display: {xs: 'none', sm: 'table-cell'}};

export const accountListColumns: ColumnData[] = [
    {field: 'CustomerNo', title: 'Account', width: 50, render: (row) => <CustomerLink customer={row}/>, sortable: true},
    {
        field: 'CustomerName',
        title: "Name",
        width: 80,
        sortable: true,
        render: (row) => <CustomerNameField customer={row}/>
    },
    {field: 'AddressLine1', title: 'Address', width: 80, sortable: true, sx: hiddenXS},
    {field: 'City', title: 'City', width: 80, sortable: true},
    {field: 'State', title: 'State', width: 40, sortable: true, render: (row) => stateCountry(row)},
    {field: 'ZipCode', title: 'ZIP', width: 40, sortable: true, sx: hiddenXS},
    {
        field: 'TelephoneNo',
        title: 'Phone',
        width: 40,
        sortable: true,
        sx: hiddenXS,
        render: (row) => <TelephoneLink telephoneNo={row.TelephoneNo}/>
    },
]
