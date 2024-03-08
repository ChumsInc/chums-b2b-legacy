import React, {ChangeEvent, ReactNode, useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {loadCustomerList} from '../actions';
import SortableTable from "../../../common-components/SortableTable";
import {compareCustomerAccountNumber, longAccountNumber, stateCountry} from "../../../utils/customer";
import RepSelect from "../../../ducks/reps/components/RepSelect";
import CustomerLink from "../../../components/CustomerLink";
import ErrorBoundary from "../../../common-components/ErrorBoundary";
import {selectCurrentCustomer, selectUserAccount,} from "../../user/selectors";
import {useAppDispatch} from "../../../app/configureStore";
import localStore from "../../../utils/LocalStore";
import {STORE_ACCOUNT_LIST_RPP} from "../../../constants/stores";
import {SortableTableField} from "../../../common-components/DataTable";
import {Customer} from "b2b-types";
import {SortProps} from "../../../types/generic";
import Alert from "@mui/material/Alert";
import LinearProgress from "@mui/material/LinearProgress";
import TablePagination from "@mui/material/TablePagination";
import {DOCUMENT_TITLES, PATH_PROFILE} from "../../../constants/paths";
import DocumentTitle from "../../../components/DocumentTitle";
import Breadcrumb from "../../../components/Breadcrumb";
import {useLocation, useMatch} from "react-router";
import {
    selectCustomersFilter,
    selectCustomersLoaded,
    selectCustomersLoading,
    selectCustomerSort,
    selectCustomersRepFilter,
    selectFilteredCustomerList
} from "../selectors";
import {setCustomersFilter, setCustomersRepFilter, setCustomersSort} from "../actions";
import TelephoneLink from "../../../components/TelephoneLink";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TextField
} from "@mui/material";
import {TableComponents, TableVirtuoso} from "react-virtuoso";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";
import {visuallyHidden} from "@mui/utils";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2";
import SearchIcon from '@mui/icons-material/Search';
import Stack from "@mui/material/Stack";

const hiddenXS:SxProps = {display: {xs: 'none', sm: 'table-cell'}};

const CustomerNameField = ({customer}:{customer: Customer}) => {
    if (!customer.ShipToCode) {
        return customer.CustomerName;
    }
    return (
        <Stack direction="column">
            <div>{customer.BillToName}</div>
            <div>{customer.CustomerName}</div>
        </Stack>
    )
}

const ACCOUNT_LIST_FIELDS: SortableTableField<Customer>[] = [
    {field: 'CustomerNo', title: 'Account', render: (row) => <CustomerLink customer={row}/>, sortable: true},
    {field: 'CustomerName', title: "Name", sortable: true},
    {field: 'AddressLine1', title: 'Address', sortable: true},
    {field: 'City', title: 'City', sortable: true},
    {field: 'State', title: 'State', sortable: true, render: (row) => stateCountry(row)},
    {field: 'ZipCode', title: 'ZIP', sortable: true},
    {field: 'TelephoneNo', title: 'Phone', sortable: true, render: (row) => <TelephoneLink telephoneNo={row.TelephoneNo}  />},
];

interface ColumnData extends SortableTableField<Customer> {
    width: number;
    sx?:SxProps;
}

const columns: ColumnData[] = [
    {field: 'CustomerNo', title: 'Account', width: 50, render: (row) => <CustomerLink customer={row}/>, sortable: true},
    {field: 'CustomerName', title: "Name", width: 80, sortable: true, render: (row) => <CustomerNameField customer={row} />} ,
    {field: 'AddressLine1', title: 'Address', width: 80, sortable: true, sx: hiddenXS},
    {field: 'City', title: 'City', width: 80, sortable: true},
    {field: 'State', title: 'State', width: 40, sortable: true, render: (row) => stateCountry(row)},
    {field: 'ZipCode', title: 'ZIP', width: 40, sortable: true, sx: hiddenXS},
    {field: 'TelephoneNo', title: 'Phone', width: 40, sortable: true, sx: hiddenXS, render: (row) => <TelephoneLink telephoneNo={row.TelephoneNo}  />},
]

const VirtuosoTableComponents:TableComponents<Customer> = {
    Scroller: React.forwardRef<HTMLDivElement>((props, ref) => (
        <TableContainer component={Paper} {...props} ref={ref} elevation={0}/>
    )),
    Table: (props) => (
        <Table {...props} sx={{borderCollapse: 'separate', tableLayout: 'fixed'}} />
    ),
    TableRow: ({item: _item, ...props}) => <TableRow {...props} />,
    TableBody: React.forwardRef<HTMLTableSectionElement>((props, ref) => (
        <TableBody {...props} ref={ref}/>
    ))
}

function fixedHeaderContent() {
    const dispatch = useAppDispatch();
    const sort = useSelector(selectCustomerSort);
    const sortDirection = sort.ascending ? 'asc' : 'desc';
    const sortHandler = (field: keyof Customer) => () => {
        if (field === sort.field) {
            dispatch(setCustomersSort({field, ascending: !sort.ascending}))
            return;
        }
        dispatch(setCustomersSort({field, ascending: true}));
    }

    return (
        <TableRow>
            {columns.map(col => (
                <TableCell key={col.id ?? col.field} variant="head"
                           sortDirection={col.field === sort.field ? sortDirection : false}
                           align={col.align} style={{width: col.width}} sx={{backgroundColor: 'background.paper', ...col.sx}}>
                    <TableSortLabel active={sort.field === col.field}
                                    direction={sort.field === col.field ? sortDirection : 'asc'}
                                    onClick={sortHandler(col.field)}>
                        {col.title}
                    </TableSortLabel>
                </TableCell>
            ))}
        </TableRow>
    )
}

function rowContent(_index: number, row: Customer) {
    return (
        <>
            {columns.map(column => (
                <TableCell key={column.id ?? column.field} align={column.align} sx={column.sx}>
                    {column.render ? column.render(row) : row[column.field]}
                </TableCell>
            ))}
        </>
    )
}

const AccountList = () => {
    const dispatch = useAppDispatch();
    const match = useMatch('/profile/:id');
    const location = useLocation();
    const userAccount = useSelector(selectUserAccount);
    const customers = useSelector(selectFilteredCustomerList);
    const loading = useSelector(selectCustomersLoading);
    const loaded = useSelector(selectCustomersLoaded);
    const currentCustomer = useSelector(selectCurrentCustomer);
    const sort = useSelector(selectCustomerSort);
    const repFilter = useSelector(selectCustomersRepFilter);
    const filter = useSelector(selectCustomersFilter);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const allowSelectReps = /[%_]+/.test(userAccount?.SalespersonNo ?? '');


    useEffect(() => {
        const rpp = localStore.getItem(STORE_ACCOUNT_LIST_RPP, rowsPerPage);
        setRowsPerPage(rpp);
    }, []);

    useEffect(() => {
        const profileId = +(match?.params.id ?? 0);
        if (!loading && !loaded && profileId === userAccount?.id) {
            dispatch(loadCustomerList(userAccount));
        }
    }, [loading, loaded, match, userAccount]);


    const rppChangeHandler = (rpp: number) => {
        localStore.setItem<number>(STORE_ACCOUNT_LIST_RPP, rpp);
        setRowsPerPage(rpp);
        setPage(0);
    }

    const filterChangeHandler = (ev: ChangeEvent<HTMLInputElement>) => {
        dispatch(setCustomersFilter(ev.target.value));
        setPage(0);
    }
    const repChangeHandler = (value: string | null) => {
        dispatch(setCustomersRepFilter(value));
        setPage(0);
    }
    const reloadHandler = () => {
        dispatch(loadCustomerList(userAccount));
    }

    const sortChangeHandler = (sort: SortProps<Customer>) => {
        dispatch(setCustomersSort(sort));
        setPage(0);
    }

    if (!userAccount) {
        return (
            <div>
                <Alert severity="info">Please select a valid profile.</Alert>
            </div>
        )
    }

    const documentTitle = DOCUMENT_TITLES.accountList.replace(':name', userAccount.SalespersonName || '');
    const paths = [
        {title: 'Profile', pathname: PATH_PROFILE},
        {title: 'Account List', pathname: location.pathname}
    ];

    return (
        <ErrorBoundary>
            <DocumentTitle documentTitle={documentTitle}/>
            <Breadcrumb paths={paths}/>
            <Typography variant="h1" component="h1">Account List</Typography>
            <Typography variant="h2" component="h2">
                {userAccount?.SalespersonName ?? ''} <small className="ms-3">({longAccountNumber(userAccount)})</small>
            </Typography>

            <Grid2 container spacing={2} alignContent="center" sx={{mt: 5, mb: 1}} justifyContent="space-between">
                <Grid2 sx={{flex: '1 1 auto'}}>
                    <Box sx={{display: 'flex', alignItems: 'flex-end'}}>
                        <SearchIcon sx={{color: 'action.active', mr: 1, my: 0.5}} />
                        <TextField variant="standard"
                                   value={filter} onChange={filterChangeHandler} label="Filter Customers" fullWidth/>
                    </Box>
                </Grid2>
                {allowSelectReps && (
                    <Grid2 sx={{flex: '1 1 auto'}}>
                        <RepSelect value={repFilter} onChange={repChangeHandler}/>
                    </Grid2>
                )}
                <Grid2 xs="auto" >
                    <Button variant="contained" onClick={reloadHandler}>Refresh List</Button>
                </Grid2>
            </Grid2>

            {loading && <LinearProgress variant="indeterminate" sx={{my: 1}}/>}

            <Box sx={{height: 600, maxHeight: '75vh', width: '100%', mb: 3}}>
                <TableVirtuoso data={customers} components={VirtuosoTableComponents}
                               fixedHeaderContent={fixedHeaderContent} itemContent={rowContent} />
            </Box>
        </ErrorBoundary>
    );
}

export default AccountList;
