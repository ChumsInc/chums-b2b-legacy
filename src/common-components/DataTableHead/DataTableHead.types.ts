import {TableHTMLAttributes} from "react";
import {DataTableField} from "../DataTable";

export interface DataTableHeadProps<T = any> extends TableHTMLAttributes<HTMLTableSectionElement> {
    fields: DataTableField<T>[];
}
