import React, {ReactNode, TableHTMLAttributes} from "react";
import classNames from "classnames";
import {KeyedObject, SortProps} from "../../types/generic";

export type TableSelected<T = KeyedObject> = string | number | null | boolean | ((row: T) => boolean);

export interface DataTableProps<T = KeyedObject> extends TableHTMLAttributes<HTMLTableElement> {
    fields: DataTableField<T>[],
    data: T[],
    keyField: string | number | ((row: T) => string | number),
    rowClassName?: DataTableClassNames;
    renderRow?: (row: T) => React.ReactNode;
    onSelectRow?: (row: T) => T | void,
    selected?: TableSelected<T>;
    tfoot?: React.ReactElement<HTMLTableSectionElement>,
    children?: ReactNode,
}

export type DataTableClassNames<T = KeyedObject> =
    string
    | classNames.Argument
    | ((row: T) => (string | classNames.Argument));

export interface DataTableField<T = KeyedObject> {
    id?: number | string;
    field: keyof T,
    title: ReactNode,
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => ReactNode,
    className?: DataTableClassNames<T>,
    colSpan?: number,
}

export interface SortableTableField<T = KeyedObject> extends DataTableField<T> {
    sortable?: boolean,
}


export interface DataTableRowProps<T = KeyedObject> extends Omit <TableHTMLAttributes<HTMLTableRowElement>, 'onClick'> {
    rowClassName?: string | classNames.Argument | ((row: T) => string | classNames.Argument),
    selected?: boolean,
    fields: DataTableField<T>[],
    row: T,
    trRef?: React.Ref<HTMLTableRowElement>,
    onClick?: (row?: T) => T|void,
}

export interface DataTableTBodyProps<T = KeyedObject> extends TableHTMLAttributes<HTMLTableSectionElement> {
    fields: DataTableField<T>[];
    data: T[];
    keyField: string | number | ((row: T) => string | number);
    rowClassName?: DataTableClassNames<T>;
    renderRow?: (row: T) => React.ReactNode;
    onSelectRow?: (row: T) => T | void;
    selected?: TableSelected<T>;
    children?: ReactNode;
}

export interface SortableTableProps<T = KeyedObject> extends DataTableProps<T> {
    currentSort: SortProps<T>,
    onChangeSort: (sort: SortProps<T>) => void,
}

export interface DataTableTHProps<T = KeyedObject> {
    field: DataTableField<T>,
    className?: string | classNames.Argument,
}

export interface SortableTableHeadProps<T = KeyedObject> extends DataTableHeadProps {
    currentSort: SortProps<T>,
    fields: SortableTableField<T>[],
    onChangeSort: (sort: SortProps<T>) => void,
}

export interface SortableTHProps<T = KeyedObject> extends DataTableTHProps {
    field: SortableTableField<T>,
    sorted?: boolean,
    ascending?: boolean,
    onClick: (sort: SortProps<T>) => void,
}

export interface DataTableHeadProps<T = KeyedObject> extends TableHTMLAttributes<HTMLTableSectionElement> {
    fields: DataTableField<T>[];
}
