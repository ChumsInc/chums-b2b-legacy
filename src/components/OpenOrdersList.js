import React from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectOpenOrdersList, selectOpenOrdersLoading} from "../ducks/open-orders/selectors";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import {ORDER_TYPE} from "../constants/orders";
import OrdersList from "./OrdersList";
import {fetchOpenOrders} from "../actions/salesOrder";

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
        <OrdersList list={list} loading={loading}
                    onReload={reloadHandler}
                    orderType={ORDER_TYPE.open}/>
    )
}

export default OpenOrdersList;
