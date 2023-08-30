import {NavItemProps} from "@/types/ui-features";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "@/ducks/user/selectors";
import ListItemLink from "@/components/ListItemLink";
import {PATH_LOGIN} from "@/constants/paths";
import React from "react";
import NavItemButtonLink from "@/ducks/menu/components/NavItemButtonLink";


export default function NavLoginLink({inDrawer}: NavItemProps) {
    const isLoggedIn = useSelector(selectLoggedIn);
    if (isLoggedIn) {
        return null;
    }
    if (inDrawer) {
        return (
            <ListItemLink to={PATH_LOGIN} primary="Login"/>
        )
    }
    return (
        <NavItemButtonLink to={PATH_LOGIN}>Login</NavItemButtonLink>
    )
}
