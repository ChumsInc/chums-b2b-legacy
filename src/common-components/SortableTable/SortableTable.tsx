import React from 'react';
import classNames from "classnames";
import SortableTableHead from "../SortableTableHead";
import DataTableTBody from "../DataTableTBody";
import {SortableTableProps} from "./SortableTable.types";
import {Table} from "@mui/material";


const SortableTable = ({
                           fields,
                           data,
                           currentSort,
                           onChangeSort,
                           keyField,
                           size = '',
                           rowClassName,
                           renderRow,
                           onSelectRow,
                           selected = null,
                           className = '',
                           tfoot,
                           children,
                           ...rest
                       }: SortableTableProps) => {

    return (
        <Table className={className} {...rest}>
            <SortableTableHead currentSort={currentSort} fields={fields} onChangeSort={onChangeSort}/>
            {!!data.length && (
                <DataTableTBody fields={fields} data={data} keyField={keyField} rowClassName={rowClassName}
                                renderRow={renderRow}
                                onSelectRow={onSelectRow} selected={selected}/>
            )}
            {children}
            {tfoot}
        </Table>
    )
}

export default SortableTable;
