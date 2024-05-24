import React, {ReactNode, TableHTMLAttributes} from "react";
import {DataTableClassNames, DataTableField, TableSelected} from "../DataTable";

export interface DataTableTBodyProps<T = any> extends TableHTMLAttributes<HTMLTableSectionElement> {
    fields: DataTableField<T>[];
    data: T[];
    keyField: string | number | ((row: T) => string | number);
    rowClassName?: DataTableClassNames<T>;
    renderRow?: (row: T) => React.ReactNode;
    onSelectRow?: (row: T) => any | void;
    selected?: TableSelected;
    children?: ReactNode;
}

