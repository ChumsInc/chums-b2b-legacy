import React, {ChangeEvent, useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCurrentCustomer} from "../../user/selectors";
import {
    selectCurrentInvoiceNo,
    selectFilteredInvoicesList,
    selectInvoicesListLimit,
    selectInvoicesListLimitReached,
    selectInvoicesListOffset,
    selectInvoicesLoaded,
    selectInvoicesLoading,
    selectInvoicesSort
} from "../selectors";
import {loadInvoices, setInvoicesSort} from "../actions";
import {InvoiceLink} from "./InvoiceLink";
import {DateString} from "../../../components/DateString";
import OrderLink from "../../../components/OrderLink";
import numeral from "numeral";
import DataTable, {SortableTableField} from "../../../common-components/DataTable";
import {InvoiceHistoryHeader} from "b2b-types";
import Decimal from "decimal.js";
import {SortProps} from "../../../types/generic";
import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import {invoiceKey} from "../utils";
import localStore from "../../../utils/LocalStore";
import {STORE_INVOICES_ROWS_PER_PAGE} from "../../../constants/stores";
import Button from "@mui/material/Button";
import InvoiceListFilter from "./InvoiceListFilter";
import Box from "@mui/material/Box";


const invoiceFields: SortableTableField<InvoiceHistoryHeader>[] = [
    {
        field: 'InvoiceNo', title: 'Invoice #',
        render: (invoice) => <InvoiceLink invoice={invoice}/>, sortable: true
    },
    {
        field: 'InvoiceDate', title: 'Invoice Date',
        render: (so) => <DateString date={so.InvoiceDate}/>, sortable: true
    },
    {
        field: 'SalesOrderNo', title: 'Order #',
        render: (row) => <OrderLink salesOrderNo={row.SalesOrderNo} orderType="past"/>,
        sortable: true
    },
    {field: 'CustomerPONo', title: 'PO #', sortable: true},
    {field: 'OrderDate', title: 'Order Date', render: (so) => <DateString date={so.OrderDate}/>, sortable: true},
    {
        field: 'ShipToName', title: 'Ship To', className: 'hidden-xs', sortable: true, render: (row) => (
            <span>{!!row.ShipToCode && (<span>[{row.ShipToCode}]</span>)} {row.ShipToName}</span>
        )
    },
    {
        field: 'ShipToCity', title: 'Location', className: 'hidden-xs',
        render: (so) => `${so.ShipToCity ?? ''}, ${so.ShipToState ?? ''} ${so.ShipToZipCode ?? ''}`,
        sortable: true
    },
    {
        field: 'NonTaxableSalesAmt',
        title: 'Total',
        render: (so) => numeral(new Decimal(so.NonTaxableSalesAmt ?? 0).add(so.TaxableSalesAmt ?? 0).sub(so.DiscountAmt ?? 0)).format('($0,0.00)'),
        align: 'right',
        sortable: true
    },
    {
        field: 'Balance', title: 'Due', className: 'right',
        render: row => numeral(row.Balance).format('($0,0.00)'),
        sortable: true,
        align: 'right',
    },
    {
        field: 'InvoiceDueDate', title: 'Due Date', render: (so) => <DateString
            date={so.InvoiceDueDate}/>, sortable: true
    },
];

const InvoicesList = () => {
    const dispatch = useAppDispatch();
    const list = useSelector(selectFilteredInvoicesList);
    const limit = useAppSelector(selectInvoicesListLimit);
    const limitReached = useAppSelector(selectInvoicesListLimitReached);
    const offset = useAppSelector(selectInvoicesListOffset);
    const invoiceNo = useSelector(selectCurrentInvoiceNo);
    const loading = useSelector(selectInvoicesLoading);
    const loaded = useSelector(selectInvoicesLoaded);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const sort = useSelector(selectInvoicesSort);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(localStore.getItem<number>(STORE_INVOICES_ROWS_PER_PAGE, 10) ?? 10);

    useEffect(() => {
        if (!loading && !loaded && !!currentCustomer) {
            dispatch(loadInvoices({key: currentCustomer, start: 0, limit}))
            setPage(0);
        }
    }, [currentCustomer, loading, loaded]);

    useEffect(() => {
        setPage(0);
    }, [sort]);

    const rowsPerPageChangeHandler = (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const rowsPerPage = +(ev.target.value ?? 10);
        localStore.setItem(STORE_INVOICES_ROWS_PER_PAGE, rowsPerPage);
        setRowsPerPage(rowsPerPage);
    }

    const reloadHandler = () => {
        if (!currentCustomer) {
            return;
        }
        dispatch(loadInvoices({key: currentCustomer, start: 0, limit: 500}));
        setPage(0);
    }

    const loadMoreHandler = () => {
        if (!currentCustomer || limitReached) {
            return;
        }
        dispatch(loadInvoices({key: currentCustomer, start: offset + limit, limit}));
    }

    if (!currentCustomer || !currentCustomer.CustomerNo) {
        return null;
    }

    const sortChangeHandler = (sort: SortProps<InvoiceHistoryHeader>) => {
        dispatch(setInvoicesSort(sort));
    }

    return (
        <div>
            {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
            <InvoiceListFilter onReload={reloadHandler}/>
            <DataTable<InvoiceHistoryHeader> keyField={row => invoiceKey(row)}
                                             data={list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)}
                                             selected={invoiceNo}
                                             fields={invoiceFields} currentSort={sort}
                                             onChangeSort={sortChangeHandler}/>
            <Box display="flex" justifyContent="flex-end">
                <TablePagination component="div"
                                 count={list.length} page={page} onPageChange={(ev, page) => setPage(page)}
                                 rowsPerPage={rowsPerPage} onRowsPerPageChange={rowsPerPageChangeHandler}
                                 showFirstButton showLastButton/>
                <Button type="button" variant="text" onClick={loadMoreHandler} disabled={limitReached || loading}>
                    Load More
                </Button>
            </Box>
        </div>
    );
}

export default InvoicesList;
