import {NavItemProps} from "@/types/ui-features";
import {useAppDispatch} from "@/app/configureStore";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "@/ducks/user/selectors";
import {selectCustomerAccount} from "@/ducks/customer/selectors";
import {generatePath} from "react-router-dom";
import {customerBasePath} from "@/ducks/customer/constants";
import {customerPath} from "@/ducks/user/utils";
import ListItemLink from "@/components/ListItemLink";
import React from "react";
import NavItemButtonLink from "@/ducks/menu/components/NavItemButtonLink";

export default function NavOrdersLink({inDrawer}: NavItemProps) {
    const isLoggedIn = useSelector(selectLoggedIn);
    const account = useSelector(selectCustomerAccount);

    if (!isLoggedIn) {
        return null;
    }

    const url = !!account ? generatePath(customerBasePath, {account: customerPath(account), section: 'orders'}) : null;

    if (inDrawer && url) {
        return (
            <ListItemLink to={url} primary="Orders"/>
        )
    }
    return (
        <NavItemButtonLink to={url}>
            Orders
        </NavItemButtonLink>
    )
}
