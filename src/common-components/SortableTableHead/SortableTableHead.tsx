import React from "react";
import SortableTH from "../SortableTH/SortableTH";
import classNames from "classnames";
import {SortableTableHeadProps} from "./SortableTableHead.types";


const SortableTableHead = ({
                               currentSort,
                               fields,
                               onChangeSort,
                           }: SortableTableHeadProps) => {
    const {field, ascending} = currentSort;
    return (
        <thead>
        <tr>
            {fields.map((tableField, index) => (
                <SortableTH key={index} field={tableField}
                            sorted={field === tableField.field} ascending={ascending}
                            className={classNames(
                                typeof tableField.className === 'function'
                                    ? {[`text-${tableField.align}`]: !!tableField.align}
                                    : tableField.className
                            )} onClick={onChangeSort}/>
            ))}
        </tr>
        </thead>
    )
}
export default SortableTableHead;
