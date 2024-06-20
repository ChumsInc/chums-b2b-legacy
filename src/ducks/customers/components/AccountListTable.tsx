import React, {forwardRef} from "react";
import Box from "@mui/material/Box";
import {TableComponents, TableVirtuoso} from "react-virtuoso";
import {useSelector} from "react-redux";
import {selectCustomerSort, selectFilteredCustomerList} from "../selectors";
import {Customer} from "b2b-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import {useAppDispatch} from "../../../app/configureStore";
import {setCustomersSort} from "../actions";
import {accountListColumns} from "./AccountListColumns";


const VirtuosoTableComponents: TableComponents<Customer> = {
    Scroller: forwardRef<HTMLDivElement>(function VirtualTableScroller(props, ref) {
        return (<TableContainer component={Paper} {...props} ref={ref} elevation={0}/>)
    }),
    Table: (props) => (
        <Table {...props} sx={{borderCollapse: 'separate', tableLayout: 'fixed'}}/>
    ),
    // eslint-disable-next-line react/prop-types,@typescript-eslint/no-unused-vars
    TableRow: ({item, ...props}) => <TableRow {...props} />,
    TableBody: forwardRef<HTMLTableSectionElement>(function VirtualTableBody(props, ref) {
        return (<TableBody {...props} ref={ref}/>)
    })
}


const AccountListTable = () => {
    const customers = useSelector(selectFilteredCustomerList);
    return (
        <Box sx={{height: 600, maxHeight: '75vh', width: '100%', mb: 3}}>
            <TableVirtuoso data={customers} components={VirtuosoTableComponents}
                           fixedHeaderContent={fixedHeaderContent} itemContent={rowContent}/>
        </Box>
    )
}

export default AccountListTable;

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
            {accountListColumns.map(col => (
                <TableCell key={col.id ?? col.field} variant="head" component="th"
                           sortDirection={col.field === sort.field ? sortDirection : false}
                           align={col.align} style={{width: col.width}}
                           sx={{backgroundColor: 'background.paper', ...col.sx}}>
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
            {accountListColumns.map(column => (
                <TableCell key={column.id ?? column.field} align={column.align} sx={column.sx}>
                    {column.render ? column.render(row) : row[column.field]}
                </TableCell>
            ))}
        </>
    )
}
