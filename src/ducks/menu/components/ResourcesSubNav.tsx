import React from 'react';
import SubNavColumn from "./SubNavColumn";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";
import {selectResourcesMenu} from "../index";

const ResourcesSubNav: React.FC = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const menu = useSelector(selectResourcesMenu);
    if (!menu || !menu.items) {
        return null;
    }
    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav navbar-orders">
                {menu.items
                    .filter(item => isLoggedIn || !item.requireLogin)
                    .map(item => (
                        <SubNavColumn key={item.id} url={item.url} title={item.title}/>
                    ))
                }
            </ul>
        </div>
    )
};

export default ResourcesSubNav;
