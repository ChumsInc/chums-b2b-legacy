import {NavItemProps} from "../../../types/ui-features";
import ListItemLink from "../../../components/ListItemLink";
import React from "react";
import ResourcesMenu from "./ResourcesMenu";

export default function NavResourcesLink({inDrawer}: NavItemProps) {
    const url = '/resources';
    if (inDrawer) {
        return (<ListItemLink to={url} primary="Resources"/>)
    }
    return (
        <ResourcesMenu/>
    )
}

