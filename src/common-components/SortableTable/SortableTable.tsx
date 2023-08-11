import React from 'react';
import classNames from "classnames";
import SortableTableHead from "../SortableTableHead";
import DataTableTBody from "../DataTableTBody";
import {SortableTableProps} from "./SortableTable.types";


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

    const tableClassName = classNames('table', className, {
        [`table-${size}`]: !!size,
    })

    return (
        <table className={tableClassName} {...rest}>
            <SortableTableHead currentSort={currentSort} fields={fields} onChangeSort={onChangeSort}/>
            {!!data.length && (
                <DataTableTBody fields={fields} data={data} keyField={keyField} rowClassName={rowClassName}
                                renderRow={renderRow}
                                onSelectRow={onSelectRow} selected={selected}/>
            )}
            {children}
            {tfoot}
        </table>
    )
}

export default SortableTable;
