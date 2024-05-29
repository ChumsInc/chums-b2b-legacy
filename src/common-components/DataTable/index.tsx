import {KeyedObject} from "../../types/generic";
import Table from "@mui/material/Table";
import React from "react";
import {SortableTableProps} from "./types";
import DataTableHead from "./DataTableHead";
import DataTableTBody from "./DataTableTBody";

export type {
    SortableTableField,
} from './types'

export const DataTable = <T = KeyedObject>({
                                               fields,
                                               data,
                                               currentSort,
                                               onChangeSort,
                                               keyField,
                                               rowClassName,
                                               renderRow,
                                               onSelectRow,
                                               selected = null,
                                               className = '',
                                               tfoot,
                                               children,
                                               ...rest
                                           }: SortableTableProps<T>) => {

    return (
        <Table className={className} {...rest}>
            <DataTableHead<T> currentSort={currentSort} fields={fields} onChangeSort={onChangeSort}/>
            {!!data.length && (
                <DataTableTBody<T> fields={fields} data={data} keyField={keyField} rowClassName={rowClassName}
                                   renderRow={renderRow}
                                   onSelectRow={onSelectRow} selected={selected}/>
            )}
            {children}
            {tfoot}
        </Table>
    )
}

export default DataTable;

