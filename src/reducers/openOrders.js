import {combineReducers} from 'redux';
import {
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SET_USER_ACCOUNT
} from "../constants/actions";
import {isOpenOrder} from "../utils/orders";

const list = (state = [], action) => {
    const {type, status, orders, salesOrder} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
        return [];
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            return [...orders.filter(so => isOpenOrder(so))];
        }
        return state;
    case FETCH_SALES_ORDER:
        if (status === FETCH_SUCCESS) {
            return isOpenOrder(salesOrder)
                ? [
                    ...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo),
                    {...salesOrder}
                ]
                : state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo)
        }
        return state;
    case PROMOTE_CART:
        if (status === FETCH_SUCCESS) {
            return [
                ...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo),
                {...salesOrder}
            ];
        }
        return state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (type) {
    case FETCH_ORDERS:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    loading,
});
