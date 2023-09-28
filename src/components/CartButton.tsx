import classNames from "classnames";
import React from "react";
import {useSelector} from "react-redux";
import {selectCartNo} from "../ducks/cart/selectors";
import {useAppDispatch} from "../app/configureStore";
import {setCurrentCart} from "../ducks/cart/actions";

export const CartButton = ({salesOrderNo}: {
    salesOrderNo: string;
}) => {
    const dispatch = useAppDispatch();
    const currentCart = useSelector(selectCartNo);

    const btnClassName = {
        'btn-outline-secondary': currentCart !== salesOrderNo,
        'btn-primary': currentCart === salesOrderNo,
    };

    const clickHandler = () => {
        dispatch(setCurrentCart(salesOrderNo));
    }
    return (
        <button type="button" className={classNames("btn btn-sm", btnClassName)}
                title={currentCart === salesOrderNo ? 'Current Cart' : 'Make this the current cart'}
                onClick={clickHandler}>
            <span className="material-icons">shopping_cart</span>
        </button>);
};

export default CartButton;
