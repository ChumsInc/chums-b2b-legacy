import React from 'react';
import {useSelector} from "react-redux";
import {selectRepAccessList} from "@/ducks/user/selectors";
import MenuItemRouterLink from "@/ducks/menu/components/MenuItemRouterLink";
import Box from "@mui/material/Box";
import {customerURL} from "@/ducks/user/utils";
import {selectRecentAccounts} from "@/ducks/user/selectors";
import {shortCustomerKey, customerNo} from "@/utils/customer";
import Typography from "@mui/material/Typography";
import MenuLinkProfile from "@/ducks/menu/components/MenuLinkProfile";
import MenuItem from "@mui/material/MenuItem";

const RecentCustomersMenu = ({onClick}: { onClick: () => void }) => {
    const recentCustomers = useSelector(selectRecentAccounts);
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
                        <MenuLinkProfile linkCode={customerNo(access)} linkName={access.CustomerName ?? ''} />
                    </MenuItemRouterLink>
                ))}
            </Box>
        </div>
    )
}

export default RecentCustomersMenu;
