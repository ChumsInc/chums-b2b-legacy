import {NavLink} from "react-router-dom";
import React from "react";

export interface SubNavItemProps {
    title: string,
    description?: string,
    url: string,
}
const SubNavItem:React.FC<SubNavItemProps> = ({title, description, url}) => (
    <li className="nav-item" title={description || ''}>
        <NavLink to={url} className="nav-link">{title}</NavLink>
    </li>
);

export default SubNavItem;
