import {NavItemProps} from "../../../types/ui-features";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";
import {selectCustomerAccount} from "../../customer/selectors";
import {generatePath} from "react-router-dom";
import {customerBasePath} from "../../customer/constants";
import {customerPath} from "../../user/utils";
import ListItemLink from "../../../components/ListItemLink";
import React from "react";
import NavItemButtonLink from "./NavItemButtonLink";

export default function NavOrdersLink({inDrawer}: NavItemProps) {
    const isLoggedIn = useSelector(selectLoggedIn);
    const account = useSelector(selectCustomerAccount);

    if (!isLoggedIn) {
        return null;
    }

    const url = account
        ? generatePath(customerBasePath, {account: customerPath(account), section: 'orders'})
        : null;

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
