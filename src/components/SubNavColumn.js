import React from 'react';
import {NavLink} from "react-router-dom";

const defaultFormatter = (val) => val;
const defaultSorter = (a, b) => a.title === b.title ? 0 : (a.title > b.title ? 1 : -1);
const defaultSubMenu = {};


const SubNavItem = ({title, description, url}) => (
    <li className="nav-item" title={description}>
        <NavLink to={url}>{title}</NavLink>
    </li>
);

const SubNavItemList = ({items = [], urlFormatter, itemSorter}) => {
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
                          title, url = '', subMenu = defaultSubMenu,
                          urlFormatter = defaultFormatter,
                          itemSorter = defaultSorter
                      }) => {
    return (
        <div className="nav-item nav-col-4">
            {url
                ? <NavLink to={urlFormatter(url)} className="nav-link">{title}</NavLink>
                : <span className="nav-link">{title}</span>
            }
            {!!subMenu && !!subMenu.items && (
                <SubNavItemList items={subMenu.items} itemSorter={itemSorter} urlFormatter={urlFormatter}/>
            )}
        </div>
    );
};

export default SubNavColumn;
