import classNames from "classnames";
import React from "react";
import {useSelector} from "react-redux";
import {selectCartNo} from "../ducks/cart/selectors";
import {useAppDispatch} from "../app/configureStore";
import {setCurrentCart} from "../ducks/cart/actions";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

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
        <IconButton color={currentCart === salesOrderNo ? 'primary' : 'default'}
                title={currentCart === salesOrderNo ? 'Current Cart' : 'Make this the current cart'}
                onClick={clickHandler}>
            <ShoppingCartIcon />
        </IconButton>);
};

export default CartButton;
