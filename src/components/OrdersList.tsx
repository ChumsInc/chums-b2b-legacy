import React, {useEffect, useState} from 'react';
import SortableTable from "../common-components/SortableTable";
import OrderFilter from "./OrderFilter";
import LinearProgress from "@mui/material/LinearProgress";
import {SalesOrderHeader} from "b2b-types";
import {SortProps} from "@/types/generic";
import {SortableTableField} from "@/common-components/DataTable";
import TablePagination from "@mui/material/TablePagination";
import {salesOrderSorter} from "@/ducks/salesOrder/utils";

export default function OrdersList({
                                       list,
                                       fields,
                                       loading,
                                       onReload,
                                       onNewCart
                                   }: {
    list: SalesOrderHeader[];
    fields: SortableTableField[];
    loading?: boolean;
    onReload: () => void;
    onNewCart?: () => void;
}) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sort, setSort] = useState<SortProps<SalesOrderHeader>>({field: 'SalesOrderNo', ascending: true});
    const [search, setSearch] = useState('');
    const [data, setData] = useState<SalesOrderHeader[]>([]);

    useEffect(() => {
        const data = list.filter(so => {
            return !search.trim()
                || so.SalesOrderNo.includes(search.trim().toUpperCase())
                || so.CustomerPONo?.toUpperCase()?.includes(search.trim().toUpperCase())
        })
            .sort(salesOrderSorter(sort));
        setData(data);
    }, [list, search, sort]);

    const sortChangeHandler = (sort: SortProps) => setSort(sort);
    return (
        <div>
            {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
            <OrderFilter value={search}
                         onChange={(ev) => setSearch(ev.target.value)}>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={onReload}>
                        Reload
                    </button>
                </div>
                {!!onNewCart && (
                    <div className="col-auto">
                        <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={onNewCart}>
                            New Cart
                        </button>
                    </div>
                )}
            </OrderFilter>
            <SortableTable keyField="SalesOrderNo"
                           data={data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                           fields={fields} currentSort={sort} onChangeSort={sortChangeHandler}/>
            <TablePagination component="div"
                             count={data.length} page={page} rowsPerPage={rowsPerPage}
                             onPageChange={(ev, page) => setPage(page)}
                             onRowsPerPageChange={(ev) => setRowsPerPage(+ev.target.value)}
                             showFirstButton showLastButton/>
        </div>
    );
}

