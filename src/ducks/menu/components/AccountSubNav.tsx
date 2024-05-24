import React from 'react';
import {useSelector} from 'react-redux';
import MenuColumn from "./MenuColumn";
import {defaultMenuItem} from "../utils";
import SubNavItemList from "./SubNavItemList";
import {selectCustomerMenuItems, selectRepMenuItems} from "../index";
import {selectCurrentAccess} from "../../user/selectors";
import {accessListURL} from "../../user/utils";
import {MenuItem} from "b2b-types";

const profileMenuItem: MenuItem = {
    ...defaultMenuItem,
    title: 'User Profile',
    url: '/profile',
}

const repListMenuItem: MenuItem = {
    ...defaultMenuItem,
    title: 'Account List',
}

const customerListMenuItem: MenuItem = {
    ...defaultMenuItem,
    title: 'Customer Accounts',
}

const recentCustomersMenuItem: MenuItem = {
    ...defaultMenuItem,
    title: 'Recent Customers',
}

const logoutMenuItem: MenuItem = {
    ...defaultMenuItem,
    title: 'Logout',
    url: '/profile/logout',
}


const AccountSubNav: React.FC = () => {
    const customerMenuItems = useSelector(selectCustomerMenuItems);
    const repMenuItems = useSelector(selectRepMenuItems);
    const currentAccess = useSelector(selectCurrentAccess);
    if (currentAccess && repMenuItems.length) {
        repListMenuItem.url = accessListURL(currentAccess);
    }


    return (
        <div className="chums-subnavbar-collapse collapse show">
            <ul className="navbar-nav">
                {!!repMenuItems.length && (
                    <>
                        <MenuColumn item={profileMenuItem}>
                            <SubNavItemList items={repMenuItems}/>
                        </MenuColumn>
                        <MenuColumn item={recentCustomersMenuItem}>

                        </MenuColumn>
                    </>
                )}
                {!!customerMenuItems.length && (
                    <MenuColumn item={customerListMenuItem}>
                        <SubNavItemList items={customerMenuItems}/>
                    </MenuColumn>
                )}
                <MenuColumn item={logoutMenuItem}/>
            </ul>
        </div>
    );

}
export default AccountSubNav;
