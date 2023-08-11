import React from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectOpenOrdersList, selectOpenOrdersLoading} from "../ducks/open-orders/selectors";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import OrdersList from "./OrdersList";
import {fetchOpenOrders} from "../actions/salesOrder";
import OrderLink from "@/components/OrderLink";
import {DateString} from "@/components/DateString";
import numeral from "numeral";
import {SortableTableField} from "@/common-components/DataTable";
import Decimal from "decimal.js";
import {SalesOrderHeader} from "b2b-types";


const openOrderFields: SortableTableField<SalesOrderHeader>[] = [
    {
        field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink salesOrderNo={so.SalesOrderNo}
                                                                            orderType="open"/>
    },
    {field: 'CustomerPONo', title: 'PO #'},
    {field: 'OrderDate', title: 'Ordered', render: (so) => <DateString date={so.OrderDate}/>},
    {field: 'ShipExpireDate', title: 'Ship Date', render: (so) => <DateString date={so.ShipExpireDate}/>},
    {field: 'ShipToName', title: 'Ship To'},
    {field: 'ShipToCity', title: 'Location', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`},
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
    const list = useSelector(selectOpenOrdersList);
    const loading = useSelector(selectOpenOrdersLoading);
    const currentCustomer = useSelector(selectCurrentCustomer);

    const reloadHandler = () => {
        if (!currentCustomer) {
            return;
        }
        dispatch(fetchOpenOrders(currentCustomer));
    }

    if (!currentCustomer || !currentCustomer.CustomerNo) {
        return null;
    }

    return (
        <OrdersList list={list} fields={openOrderFields}
                    loading={loading}
                    onReload={reloadHandler}/>
    )
}

export default OpenOrdersList;
