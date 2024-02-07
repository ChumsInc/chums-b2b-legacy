import React from 'react';
import DataTableRow from "../DataTableRow/DataTableRow";
import {DataTableTBodyProps} from "./DataTableTBody.types";
import {noop} from "../../utils/general";
import {TableBody} from "@mui/material";


const DataTableTBody = ({
                            fields,
                            data,
                            keyField,
                            rowClassName,
                            renderRow,
                            onSelectRow = noop,
                            selected = null,
                            children,
                            ...rest
                        }: DataTableTBodyProps) => {

    return (
        <TableBody {...rest}>
        {data.map(row => {
            const keyValue = typeof keyField === "function" ? keyField(row) : row[keyField];
            const isSelected = typeof selected === 'function' ? selected(row) : keyValue === (selected ?? false);
            if (renderRow) {
                return renderRow(row);
            }
            return (
                <DataTableRow key={keyValue} onClick={() => onSelectRow(row)}
                              rowClassName={rowClassName}
                              fields={fields}
                              row={row} selected={isSelected}/>
            )
        })}
        {children}
        </TableBody>
    )
}

export default DataTableTBody;
