import React from 'react';
import {useSelector} from "react-redux";
import {selectRepAccessList} from "../../user/selectors";
import MenuItemRouterLink from "./MenuItemRouterLink";
import Box from "@mui/material/Box";
import {customerURL} from "../../user/utils";
import {selectRecentCustomers} from "../../customers/selectors";
import {customerNo, shortCustomerKey} from "../../../utils/customer";
import MenuLinkProfile from "./MenuLinkProfile";
import MenuItem from "@mui/material/MenuItem";

const RecentCustomersMenu = ({onClick}: { onClick: () => void }) => {
    const recentCustomers = useSelector(selectRecentCustomers);
    const repAccessList = useSelector(selectRepAccessList);
    if (!repAccessList.length) {
        return null;
    }

    return (
        <div>
            <MenuItem>
                Recent Customers
            </MenuItem>
            <Box component="ul" sx={{padding: 0}}>
                {recentCustomers.map(access => (
                    <MenuItemRouterLink key={shortCustomerKey(access)} to={customerURL(access)} onClick={onClick}>
                        <MenuLinkProfile linkCode={customerNo(access)} linkName={access.CustomerName ?? ''}/>
                    </MenuItemRouterLink>
                ))}
            </Box>
        </div>
    )
}

export default RecentCustomersMenu;
