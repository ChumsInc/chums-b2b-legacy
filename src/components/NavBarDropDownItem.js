import React from 'react';
import {NavLink} from "react-router-dom";
import classNames from "classnames";

const NavBarDropDownItem = ({title, path, disabled = false}) => (
    <NavLink exact className={classNames('dropdown-item', {disabled: disabled})} to={path}>{title}</NavLink>
);

export default NavBarDropDownItem;
