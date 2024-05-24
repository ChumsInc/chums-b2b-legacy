import React from 'react';
import {NavLink} from "react-router-dom";
import {Menu, MenuItem} from "b2b-types";

const defaultFormatter = (val:string) => val;
const defaultSorter = (a:MenuItem, b:MenuItem) => a.title === b.title ? 0 : (a.title > b.title ? 1 : -1);


const SubNavItem = ({title, description, url}:{
    title: string;
    description?: string;
    url: string;
}) => (
    <li className="nav-item" title={description}>
        <NavLink to={url}>{title}</NavLink>
    </li>
);

const SubNavItemList = ({items = [], urlFormatter, itemSorter}:{
    items:MenuItem[];
    urlFormatter: (val:any) => string;
    itemSorter: (a:MenuItem, b:MenuItem) => number;
}) => {
    return (
        <ul className="navbar-nav">
            {items
                .sort(itemSorter)
                .map((item, index) => (
                    <SubNavItem key={item.id || index} title={item.title} description={item.description}
                                url={urlFormatter(item.url)}/>
                ))}
        </ul>
    )
};

const SubNavColumn = ({
                          title,
                          url = '',
                          subMenu = null,
                          urlFormatter = defaultFormatter,
                          itemSorter = defaultSorter
                      }:{
    title: string;
    url?: string;
    subMenu?:Menu|null;
    urlFormatter?: (val:any) => string;
    itemSorter?: (a:MenuItem, b:MenuItem) => number;
}) => {
    return (
        <div className="nav-item nav-col-4">
            {url
                ? <NavLink to={urlFormatter(url)} className="nav-link">{title}</NavLink>
                : <span className="nav-link">{title}</span>
            }
            {!!subMenu && !!subMenu.items?.length && (
                <SubNavItemList items={subMenu.items} itemSorter={itemSorter} urlFormatter={urlFormatter}/>
            )}
        </div>
    );
};

export default SubNavColumn;
