import {combineReducers} from 'redux';
import {
    CREATE_NEW_CART,
    FETCH_INIT,
    FETCH_ORDERS,
    FETCH_SALES_ORDER,
    FETCH_SUCCESS,
    PROMOTE_CART,
    SET_LOGGED_IN,
    SET_USER_ACCOUNT,
    UPDATE_CART
} from "../constants/actions";
import {isCartOrder} from "../utils/orders";


const list = (state = [], action) => {
    const {type, orders, salesOrder, status, isCart, props, cart, loggedIn} = action;
    switch (type) {
    case SET_USER_ACCOUNT:
        return [];
    case FETCH_ORDERS:
        if (status === FETCH_SUCCESS) {
            return [...orders.filter(so => isCartOrder(so))];
        }
        return state;
    case FETCH_SALES_ORDER:
        if (status === FETCH_SUCCESS && isCart) {
            return isCartOrder(salesOrder)
                ? [
                    ...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo),
                    {...salesOrder}
                ]
                : [...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo)];
        }
        return state;
    case PROMOTE_CART:
        if (status === FETCH_SUCCESS) {
            return [
                ...state.filter(so => so.SalesOrderNo !== salesOrder.SalesOrderNo),
            ];
        }
        return state;
    case UPDATE_CART:
        // update changing the name of the cart in the carts list.
        if (props.SalesOrderNo && props.CustomerPONo !== undefined) {
            return [
                ...state.filter(so => so.SalesOrderNo !== props.SalesOrderNo),
                ...state.filter(so => so.SalesOrderNo === props.SalesOrderNo)
                    .map(so => ({...so, ...props}))
            ]
        }
        return state;
    case CREATE_NEW_CART:
        return [
            ...state,
            {...cart}
        ];
    case SET_LOGGED_IN:
        return loggedIn === false ? [] : state;
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
