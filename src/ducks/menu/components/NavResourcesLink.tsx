import {NavItemProps} from "@/types/ui-features";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "@/ducks/user/selectors";
import ListItemLink from "@/components/ListItemLink";
import React from "react";
import NavItemButtonLink from "@/ducks/menu/components/NavItemButtonLink";

export default function NavResourcesLink({inDrawer}: NavItemProps) {
    const isLoggedIn = useSelector(selectLoggedIn);
    const to = isLoggedIn ? "/pages/chums-reps" : "/pages/customer-resources";
    if (inDrawer) {
        return (<ListItemLink to={to} primary="Resources"/>)
    }
    return (
        <NavItemButtonLink to={to}>Resources</NavItemButtonLink>
    )
}

