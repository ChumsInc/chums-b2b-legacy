import React from 'react';
import {useSelector} from "react-redux";
import {selectLoggedIn} from "@/ducks/user/selectors";
import NavItemButtonLink from "@/ducks/menu/components/NavItemButtonLink";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import {selectCustomerAccount} from "@/ducks/customer/selectors";
import {selectCartNo} from "@/ducks/cart/selectors";
import {customerCartURL} from "@/ducks/user/utils";
import CustomerIndicator from "@/ducks/customer/components/CustomerIndicator";
import CartIcon from "@/ducks/menu/components/CartIcon";


const CartMenu = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const currentCustomer = useSelector(selectCustomerAccount);
    const currentCart = useSelector(selectCartNo);

    if (!isLoggedIn) {
        return null;
    }

    if (!currentCustomer) {
        return (
            <NavItemButtonLink to="/profile">
                <CustomerIndicator/>
                <ShoppingCartOutlinedIcon fontSize="medium"/>
            </NavItemButtonLink>
        )
    }

    return (
        <NavItemButtonLink to={customerCartURL(currentCustomer, currentCart)}>
            <CustomerIndicator/>
            <CartIcon/>
        </NavItemButtonLink>
    )
}
export default CartMenu;
