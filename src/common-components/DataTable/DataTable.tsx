import React from 'react';
import classNames from "classnames";
import DataTableHead from "../DataTableHead/DataTableHead";
import DataTableTBody from "../DataTableTBody/DataTableTBody";
import {DataTableProps} from "./DataTable.types";


const DataTable = ({
                       fields,
                       data,
                       keyField,
                       size = '',
                       rowClassName,
                       renderRow,
                       onSelectRow,
                       selected = '',
                       className = '',
                       tfoot,
                       children,
                       ...rest
                   }: DataTableProps) => {

    const tableClassName = classNames('table', className, {
        [`table-${size}`]: !!size,
    })

    return (
        <table className={tableClassName} {...rest}>
            <DataTableHead fields={fields}/>
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

export default DataTable;
