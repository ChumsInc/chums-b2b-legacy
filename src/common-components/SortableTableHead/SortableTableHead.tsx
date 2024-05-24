import React from "react";
import SortableTH from "../SortableTH/SortableTH";
import classNames from "classnames";
import {SortableTableHeadProps} from "./SortableTableHead.types";
import {TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";


const SortableTableHead = ({
                               currentSort,
                               fields,
                               onChangeSort,
                           }: SortableTableHeadProps) => {
    const {field, ascending} = currentSort;
    const sortClickHandler = (sortField:any) => () => {
        if (sortField === field) {
            onChangeSort({...currentSort, ascending: !ascending});
            return;
        }
        onChangeSort({field: sortField, ascending: !ascending});
    }

    return (
        <TableHead>
        <TableRow>
            {fields.map((tableField, index) => (
                <TableCell key={index} align={tableField.align}
                            className={classNames(
                                typeof tableField.className === 'function'
                                    ? {[`text-${tableField.align}`]: !!tableField.align}
                                    : tableField.className
                            )}>
                    <TableSortLabel
                        active={currentSort.field === tableField.field}
                                    direction={(currentSort.ascending ? 'asc' : 'desc') ?? 'asc'}
                                    onClick={sortClickHandler(tableField.field)}>
                        {tableField.title}
                    </TableSortLabel>
                </TableCell>
            ))}
        </TableRow>
        </TableHead>
    )
}
export default SortableTableHead;
