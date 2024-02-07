import React from 'react';
import classNames from "classnames";
import {DataTableRowProps} from "./DataTableRow.types";
import {noop} from "../../utils/general";
import {TableCell, TableRow} from "@mui/material";


const DataTableRow = ({
                          className,
                          rowClassName,
                          selected,
                          fields,
                          row,
                          trRef,
                          onClick = noop,
                          ...rest
                      }: DataTableRowProps) => {
    const clickHandler = () => {
        return onClick ? onClick() : noop();
    }

    const _className = typeof rowClassName === 'function' ? rowClassName(row) : rowClassName;

    return (
        <TableRow ref={trRef} className={classNames({'table-active': selected}, className, _className)}
            onClick={clickHandler} {...rest}>
            {fields.map((field, index) => {
                const fieldClassName = typeof field.className === 'function' ? field.className(row) : field.className;
                if (typeof field.render === 'function') {
                    return (
                        <TableCell key={index} align={field.align} className={classNames(fieldClassName)}
                            colSpan={field.colSpan}>{field.render(row)}</TableCell>
                    );
                }
                return (<TableCell key={index} align={field.align} className={classNames(fieldClassName)}
                            colSpan={field.colSpan}>{row[field.field]}</TableCell>);
            })}
        </TableRow>
    )
}

export default DataTableRow;
