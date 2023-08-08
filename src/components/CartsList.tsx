import React from 'react';
import {useAppDispatch} from "../app/configureStore";
import {useSelector} from "react-redux";
import {selectCartsList, selectCartsLoading} from "../ducks/carts/selectors";
import {selectCartNo} from "../ducks/cart/selectors";
import {newCart, setCurrentCart} from "../ducks/cart/actions";
import {PATH_SALES_ORDER} from "../constants/paths";
import {NEW_CART, ORDER_TYPE} from "../constants/orders";
import OrdersList from "./OrdersList";
import {fetchOpenOrders} from "../actions/salesOrder";
import {selectCurrentCustomer} from "../ducks/user/selectors";
import {useNavigate} from "react-router";

const CartsList = () => {
    const dispatch = useAppDispatch();
    const currentCustomer = useSelector(selectCurrentCustomer);
    const cartsList = useSelector(selectCartsList);
    const cartsLoading = useSelector(selectCartsLoading);
    const cartNo = useSelector(selectCartNo);
    const navigate = useNavigate();

    const newCartHandler = () => {
        dispatch(newCart());
        const path = PATH_SALES_ORDER
            .replace(':orderType', ORDER_TYPE.cart)
            .replace(':Company', 'chums')
            .replace(':SalesOrderNo', NEW_CART);
        navigate(path);
    }

    const reloadHandler = () => {
        if (currentCustomer) {
            dispatch(fetchOpenOrders(currentCustomer));
        }
    }

    const selectHandler = (salesOrderNo:string) => {
        if (!salesOrderNo) {
            return;
        }
        dispatch(setCurrentCart(salesOrderNo));
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
