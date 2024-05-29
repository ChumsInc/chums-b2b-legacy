import React from "react";
import classNames from "classnames";
import {SortableTableHeadProps} from "./types";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import {KeyedObject} from "../../types/generic";


export const DataTableHead = <T = KeyedObject>({
                               currentSort,
                               fields,
                               onChangeSort,
                           }: SortableTableHeadProps<T>) => {
    const {field, ascending} = currentSort;
    const sortClickHandler = (sortField: keyof T) => () => {
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
export default DataTableHead;
