import React, {useEffect} from 'react';
import {useAppDispatch} from "../../../app/configureStore";
import {useSelector} from "react-redux";
import {selectCartsFilter, selectCartsList, selectOpenOrdersLoaded, selectOpenOrdersLoading} from "../selectors";
import {newCart} from "../../cart/actions";
import {PATH_SALES_ORDER} from "../../../constants/paths";
import {NEW_CART, ORDER_TYPE} from "../../../constants/orders";
import OrdersList from "./OrdersList";
import {selectCurrentCustomer} from "../../user/selectors";
import CartButton from "../../../components/CartButton";
import OrderLink from "../../../components/OrderLink";
import {DateString} from "../../../components/DateString";
import numeral from "numeral";
import {SortableTableField} from "../../../common-components/DataTable";
import {SalesOrderHeader} from "b2b-types";
import Decimal from "decimal.js";
import {generatePath, redirect} from "react-router-dom";
import {calcOrderType} from "../../../utils/orders";
import {loadOpenOrders, setCartsFilter} from "../actions";
import OrderFilter from "./OrderFilter";
import LinearProgress from "@mui/material/LinearProgress";
import NoCartsAlert from "./NoCartsAlert";
import {Button} from "@mui/material";

const cartFields: SortableTableField<SalesOrderHeader>[] = [
    {field: 'SalesOrderNo', title: 'Cart', render: (so) => <CartButton salesOrderNo={so.SalesOrderNo}/>},
    {
        field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink salesOrderNo={so.SalesOrderNo}
                                                                            orderType={calcOrderType(so)}/>, sortable: true
    },
    {field: 'CustomerPONo', title: 'PO #', sortable: true},
    {field: 'OrderDate', title: 'Ordered Created', render: (so) => <DateString date={so.OrderDate}/>, sortable: true},
    {field: 'ShipToName', title: 'Ship To', sortable: true},
    {field: 'ShipToCity', title: 'Location', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`, sortable: true},
    {
        field: 'NonTaxableAmt',
        title: 'Total',
        render: (so) => numeral(new Decimal(so.NonTaxableAmt).add(so.TaxableAmt)).format('0,0.00'),
        align: 'right',
        sortable: true,
    }
];

const CartsList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const list = useSelector(selectCartsList);
    const loading = useSelector(selectOpenOrdersLoading);
    const loaded = useSelector(selectOpenOrdersLoaded);
    const filter = useSelector(selectCartsFilter);

    useEffect(() => {
        if (!loading && !loaded && !!currentCustomer) {
            dispatch(loadOpenOrders(currentCustomer));
        }
    }, [loading, loaded, currentCustomer]);

    const newCartHandler = () => {
        dispatch(newCart());
        const path = generatePath(PATH_SALES_ORDER, {orderType: ORDER_TYPE.cart, salesOrderNo: NEW_CART});
        redirect(path);
    }

    const reloadHandler = () => {
        if (currentCustomer) {
            dispatch(loadOpenOrders(currentCustomer));
        }
    }

    if (!currentCustomer || !currentCustomer.CustomerNo) {
        return null;
    }
    return (
        <div>
            <OrderFilter value={filter} onChange={(ev) => dispatch(setCartsFilter(ev.target.value))}>
                <Button variant="text" onClick={reloadHandler}>
                    Reload
                </Button>
            </OrderFilter>
            {loading && <LinearProgress variant="indeterminate" sx={{mb: 1}}/>}
            <OrdersList list={list} fields={cartFields}/>
            <NoCartsAlert/>
        </div>
    )
}

export default CartsList;
