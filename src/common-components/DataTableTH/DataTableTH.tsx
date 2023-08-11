import React from "react";
import classNames from "classnames";
import {DataTableTHProps} from "./DataTableTH.types";


const DataTableTH = ({
                         field,
                         className,
                     }: DataTableTHProps) => {
    const thClassName = classNames({[`text-${field.align}`]: !!field.align}, className);

    return (<th className={thClassName}>{field.title}</th>)
}

export default DataTableTH;
