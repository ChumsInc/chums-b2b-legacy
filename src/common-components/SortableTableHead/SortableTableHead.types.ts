import {DataTableHeadProps} from "../DataTableHead";
import {SortableTableField} from "../DataTable";
import {SortProps} from "../../types/generic";

export interface SortableTableHeadProps<T = any> extends DataTableHeadProps {
    currentSort: SortProps<T>,
    fields: SortableTableField<T>[],
    onChangeSort: (sort: SortProps<T>) => void,
}

