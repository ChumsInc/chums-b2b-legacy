import {DataTableTHProps} from "../DataTableTH";
import {SortableTableField} from "../DataTable";
import {SortProps} from "@/types/generic";

export interface SortableTHProps<T = any> extends DataTableTHProps {
    field: SortableTableField<T>,
    sorted?: boolean,
    ascending?: boolean,
    onClick: (sort: SortProps<T>) => void,
}

