import React, {ChangeEvent, useEffect, useState} from 'react';
import DataTable, {SortableTableField} from "../../../common-components/DataTable";
import {SalesOrderHeader} from "b2b-types";
import {SortProps} from "../../../types/generic";
import TablePagination from "@mui/material/TablePagination";
import {useAppDispatch} from "../../../app/configureStore";
import {setSalesOrderSort} from "../actions";
import {selectOpenOrdersSort} from "../selectors";
import {useSelector} from "react-redux";

export default function OrdersList({
                                       list,
                                       fields,
                                   }: {
    list: SalesOrderHeader[];
    fields: SortableTableField<SalesOrderHeader>[];
}) {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectOpenOrdersSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        setPage(0);
    }, [list, sort]);

    const rowsPerPageChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+ev.target.value);
        setPage(0);
    }

    const sortChangeHandler = (sort: SortProps<SalesOrderHeader>) => {
        dispatch(setSalesOrderSort(sort));
    }

    return (
        <div>
            <DataTable<SalesOrderHeader> keyField="SalesOrderNo"
                                         data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                         fields={fields} currentSort={sort} onChangeSort={sortChangeHandler}/>
            <TablePagination component="div"
                             count={list.length} page={page} rowsPerPage={rowsPerPage}
                             onPageChange={(ev, page) => setPage(page)}
                             onRowsPerPageChange={rowsPerPageChangeHandler}
                             showFirstButton showLastButton/>
        </div>
    );
}

