import {combineReducers} from 'redux';
import {FETCH_INIT, FETCH_INVOICES, FETCH_SALES_ORDER, FETCH_SUCCESS, SET_USER_ACCOUNT} from "../constants/actions";
import {isPastOrder} from "../utils/orders";

const list = (state = [], action) => {
    const {type, status, orders, salesOrder, cart, list} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
        return [];
    case FETCH_INVOICES:
        if (status === FETCH_SUCCESS) {
            return [...list];
        }
        return state;
    case FETCH_SALES_ORDER:
        if (status === FETCH_SUCCESS) {
            const [so = {}] = state.filter(so => so.SalesOrderNo === salesOrder.SalesOrderNo);
            return isPastOrder(salesOrder)
                ? [
                    ...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo),
                    {...so, ...salesOrder}
                ]
                : state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo);
        }
        return state;
    default:
        return state;
    }
};

const loading = (state = false, action) => {
    const {type, status} = action;
    switch (action.type) {
    case FETCH_INVOICES:
        return status === FETCH_INIT;
    default:
        return state;
    }
};

export default combineReducers({
    list,
    loading,
});
