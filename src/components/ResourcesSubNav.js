import React from 'react';
import SubNavColumn from "./SubNavColumn";
import {PATH_RESOURCES_BC_REPS, PATH_RESOURCES_CHUMS_REPS, PATH_RESOURCES_CUSTOMER,} from "../constants/paths";
import {useSelector} from "react-redux";
import {selectResourcesMenu} from "../ducks/menu";

const ResourcesSubNav = ({loggedIn = false}) => {
    const menu = useSelector(selectResourcesMenu);
    const _items = [
        {
            url: PATH_RESOURCES_CHUMS_REPS,
            title: 'Chums Reps',
            id: 'SUB_NAV_CHUMS_REPS',
            loggedIn: true
        },
        {
            url: PATH_RESOURCES_CUSTOMER,
            title: 'Customer Resources',
            id: 'SUB_NAV_RESOURCES',
            loggedIn: false
        },
    ];
    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav navbar-orders">
                {menu.items
                    .filter(item => !!item.status)
                    .filter(item => loggedIn === true || !item.requireLogin)
                    .map(item => (
                        <SubNavColumn key={item.id} url={item.url} title={item.title}/>
                    ))
                }
            </ul>
        </div>
    )
};

export default ResourcesSubNav;
