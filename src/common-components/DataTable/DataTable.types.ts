import React, {ReactNode, TableHTMLAttributes} from "react";
import classNames from "classnames";

export type BootstrapSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type TableSelected<T = any> = string | number | null | boolean | ((row: T) => boolean);

export interface DataTableProps<T = any> extends TableHTMLAttributes<HTMLTableElement> {
    fields: DataTableField<T>[],
    data: any[],
    keyField: string | number | ((row: T) => string | number),
    size?: BootstrapSize | '',
    rowClassName?: DataTableClassNames;
    renderRow?: (row: T) => React.ReactNode;
    onSelectRow?: (row: T) => any | void,
    selected?: TableSelected;
    tfoot?: React.ReactElement<HTMLTableSectionElement>,
    children?: ReactNode,
}

export type DataTableClassNames<T = any> =
    string
    | classNames.Argument
    | ((row: T) => (string | classNames.Argument));

export interface DataTableField<T = any> {
    id?: number | string;
    field: keyof T,
    title: ReactNode,
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => ReactNode,
    className?: DataTableClassNames<T>,
    colSpan?: number,
}

export interface SortableTableField<T = any> extends DataTableField<T> {
    sortable?: boolean,
}
