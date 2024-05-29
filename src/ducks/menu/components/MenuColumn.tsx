import React from 'react';
import {NavLink} from "react-router-dom";
import {defaultFormatter, defaultMenuSorter} from "../utils";
import SubNavItemList from "./SubNavItemList";
import {MenuItem} from "b2b-types";

export interface MenuColumnProps {
    item: MenuItem,
    urlFormatter?: (val: string) => string,
    itemSorter?: (a: MenuItem, b: MenuItem) => number,
    children?: React.ReactNode;
}

const MenuColumn: React.FC<MenuColumnProps> = ({
                                                   item,
                                                   urlFormatter = defaultFormatter,
                                                   itemSorter = defaultMenuSorter,
                                                   children
                                               }) => {
    return (
        <div className="nav-item nav-col-4">
            {item.url
                ? <NavLink to={urlFormatter(item.url)} className="nav-link">{item.title}</NavLink>
                : <span className="nav-link">{item.title}</span>
            }
            {!children && !!item.menu && !!item.menu.items && (
                <SubNavItemList items={item.menu.items} itemSorter={itemSorter} urlFormatter={urlFormatter}/>
            )}
            {children}
        </div>
    );
};

export default MenuColumn;
