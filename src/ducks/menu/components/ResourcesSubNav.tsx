import React from 'react';
import SubNavColumn from "./SubNavColumn";
import {PATH_RESOURCES_CHUMS_REPS, PATH_RESOURCES_CUSTOMER,} from "../../../constants/paths";
import {useSelector} from "react-redux";
import {selectLoggedIn} from "../../user/selectors";

const ResourcesSubNav: React.FC = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const items = [
        {
            url: PATH_RESOURCES_CHUMS_REPS,
            title: 'Chums Rep Resources',
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
                {items
                    .filter(item => isLoggedIn || !item.loggedIn)
                    .map(item => (
                        <SubNavColumn key={item.id} url={item.url} title={item.title}/>
                    ))
                }
            </ul>
        </div>
    )
};

export default ResourcesSubNav;
