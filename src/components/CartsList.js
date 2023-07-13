import React from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCartsList, selectCartsLoading} from "../ducks/carts/selectors";
import {selectCartNo} from "../ducks/cart/selectors";
import {newCart, setCurrentCart} from "../ducks/cart/actions";
import {PATH_SALES_ORDER} from "../constants/paths";
import {NEW_CART, ORDER_TYPE} from "../constants/orders";
import {useHistory} from "react-router-dom";
import OrdersList from "./OrdersList";
import {fetchOpenOrders} from "../actions/salesOrder";
import {selectCurrentCustomer} from "../ducks/user/selectors";

const CartsList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const cartsList = useSelector(selectCartsList);
    const cartsLoading = useSelector(selectCartsLoading);
    const cartNo = useSelector(selectCartNo);
    const history = useHistory();

    const newCartHandler = () => {
        dispatch(newCart());
        const path = PATH_SALES_ORDER
            .replace(':orderType', ORDER_TYPE.cart)
            .replace(':Company', 'chums')
            .replace(':SalesOrderNo', NEW_CART);
        history.push(path);
    }

    const reloadHandler = () => {
        dispatch(fetchOpenOrders(currentCustomer));
    }

    const selectHandler = (salesOrderNo) => {
        if (!salesOrderNo) {
            return;
        }
        dispatch(setCurrentCart({Company: 'chums', SalesOrderNo: salesOrderNo}));
    }

    if (!currentCustomer) {
        return null;
    }
    return (
        <OrdersList list={cartsList} loading={cartsLoading}
                    currentCart={cartNo} orderType={ORDER_TYPE.cart}
                    onNewCart={newCartHandler}
                    onReload={reloadHandler}
                    onSelect={selectHandler}/>
    )
}

export default CartsList;
