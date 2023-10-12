import {NavItemProps} from "../../../types/ui-features";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";
import ListItemLink from "../../../components/ListItemLink";
import React from "react";
import NavItemButtonLink from "./NavItemButtonLink";
import ResourcesMenu from "./ResourcesMenu";

export default function NavResourcesLink({inDrawer}: NavItemProps) {
    const url = '/resources';
    if (inDrawer) {
        return (<ListItemLink to={url} primary="Resources"/>)
    }
    return (
        <ResourcesMenu />
    )
}

