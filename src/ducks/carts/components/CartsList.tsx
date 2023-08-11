import React from 'react';
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectCartsList, selectCartsLoading} from "../selectors";
import {selectCartNo} from "../../cart/selectors";
import {newCart, setCurrentCart} from "../../cart/actions";
import {PATH_SALES_ORDER} from "@/constants/paths";
import {NEW_CART, ORDER_TYPE} from "@/constants/orders";
import OrdersList from "@/components/OrdersList";
import {fetchOpenOrders} from "../../../actions/salesOrder";
import {selectCurrentCustomer} from "../../user/selectors";
import {useNavigate} from "react-router";
import CartButton from "@/components/CartButton";
import OrderLink from "@/components/OrderLink";
import {DateString} from "@/components/DateString";
import numeral from "numeral";
import {SortableTableField} from "@/common-components/DataTable";
import {SalesOrderHeader} from "b2b-types";
import Decimal from "decimal.js";
import {generatePath, redirect} from "react-router-dom";
import {calcOrderType} from "@/utils/orders";

const cartFields: SortableTableField<SalesOrderHeader>[] = [
    {field: 'SalesOrderNo', title: 'Cart', render: (so) => <CartButton salesOrderNo={so.SalesOrderNo}/>},
    {field: 'SalesOrderNo', title: 'Order #', render: (so) => <OrderLink salesOrderNo={so.SalesOrderNo} orderType={calcOrderType(so)}/>, sortable: true},
    {field: 'CustomerPONo', title: 'PO #', sortable: true},
    {field: 'OrderDate', title: 'Ordered Created', render: (so) => <DateString date={so.OrderDate}/>, sortable: true},
    {field: 'ShipToName', title: 'Ship To', sortable: true},
    {field: 'ShipToCity', title: 'Location', render: (so) => `${so.ShipToCity}, ${so.ShipToState} ${so.ShipToZipCode}`, sortable: true},
    {
        field: 'NonTaxableAmt',
        title: 'Total',
        render: (so) => numeral(new Decimal(so.NonTaxableAmt).add(so.TaxableAmt)).format('0,0.00'),
        className: 'text-end',
        sortable: true,
    }
];

const CartsList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const cartsList = useSelector(selectCartsList);
    const cartsLoading = useSelector(selectCartsLoading);

    const newCartHandler = () => {
        dispatch(newCart());
        const path = generatePath(PATH_SALES_ORDER, {orderType: ORDER_TYPE.cart, salesOrderNo:NEW_CART});
        redirect(path);
    }

    const reloadHandler = () => {
        if (currentCustomer) {
            dispatch(fetchOpenOrders(currentCustomer));
        }
    }

    const selectHandler = (salesOrderNo: string) => {
        if (!salesOrderNo) {
            return;
        }
        dispatch(setCurrentCart(salesOrderNo));
    }

    if (!currentCustomer) {
        return null;
    }
    return (
        <div>
            <OrdersList list={cartsList} fields={cartFields}
                        loading={cartsLoading}
                        onNewCart={newCartHandler}
                        onReload={reloadHandler}/>
        </div>
    )
}

export default CartsList;
