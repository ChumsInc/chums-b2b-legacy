import React, {TableHTMLAttributes} from "react";
import classNames from "classnames";
import {DataTableField} from "../DataTable";

export interface DataTableRowProps<T = any> extends Omit <TableHTMLAttributes<HTMLTableRowElement>, 'onClick'> {
    rowClassName?: string | classNames.Argument | ((row: T) => string | classNames.Argument),
    selected?: boolean,
    fields: DataTableField<T>[],
    row: T,
    trRef?: React.Ref<HTMLTableRowElement>,
    onClick?: (row?: T) => any|void,
}

