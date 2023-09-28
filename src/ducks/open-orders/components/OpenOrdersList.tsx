import React, {useEffect} from 'react';
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {
    selectCartsFilter,
    selectCartsList, selectOpenOrdersFilter,
    selectOpenOrdersList,
    selectOpenOrdersLoaded,
    selectOpenOrdersLoading
} from "../selectors";
import {selectCurrentCustomer} from "../../user/selectors";
import OrdersList from "./OrdersList";
import OrderLink from "../../../components/OrderLink";
import {DateString} from "../../../components/DateString";
import numeral from "numeral";
import {SortableTableField} from "../../../common-components/DataTable";
import Decimal from "decimal.js";
import {SalesOrderHeader} from "b2b-types";
import {loadOpenOrders, setCartsFilter, setOpenOrdersFilter} from "../actions";
import Alert from "@mui/material/Alert";
import OrderFilter from "./OrderFilter";
import LinearProgress from "@mui/material/LinearProgress";
import NoOpenOrdersAlert from "./NoOpenOrdersAlert";


const openOrderFields: SortableTableField<SalesOrderHeader>[] = [
    {
        field: 'SalesOrderNo', title: 'Order #',
        render: (so) => <OrderLink salesOrderNo={so.SalesOrderNo} orderType="open"/>,
        sortable: true,
    },
    {field: 'CustomerPONo', title: 'PO #', sortable: true},
    {field: 'OrderDate', title: 'Ordered', sortable: true,
        render: (so) => <DateString date={so.OrderDate}/>},
    {field: 'ShipExpireDate', title: 'Ship Date', sortable: true,
        render: (so) => <DateString date={so.ShipExpireDate}/>},
    {field: 'ShipToName', title: 'Ship To', sortable: true},
    {field: 'ShipToCity', title: 'Location', sortable: true,
        render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`},
    {
        field: 'NonTaxableAmt',
        title: 'Total',
        render: (so) => numeral(new Decimal(so.NonTaxableAmt).add(so.TaxableAmt)).format('0,0.00'),
        className: 'text-end',
        sortable: true,
    }
];

const OpenOrdersList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const list = useSelector(selectOpenOrdersList);
    const loading = useSelector(selectOpenOrdersLoading);
    const loaded = useSelector(selectOpenOrdersLoaded);
    const filter = useSelector(selectOpenOrdersFilter);

    useEffect(() => {
        if (!loading && !loaded && !!currentCustomer) {
            dispatch(loadOpenOrders(currentCustomer));
        }
    }, [loading, loaded, currentCustomer]);

    const reloadHandler = () => {
        if (currentCustomer) {
            dispatch(loadOpenOrders(currentCustomer));
        }
    }

    if (!currentCustomer || !currentCustomer.CustomerNo) {
        return null;
    }

    return (
        <>
            <OrderFilter value={filter} onChange={(ev) => dispatch(setOpenOrdersFilter(ev.target.value))}>
                <div className="col-auto">
                    <button type="button" className="btn btn-sm btn-outline-primary" onClick={reloadHandler}>
                        Reload
                    </button>
                </div>
            </OrderFilter>
            {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
            <OrdersList list={list} fields={openOrderFields}/>
            <NoOpenOrdersAlert />
        </>
    )
}

export default OpenOrdersList;
