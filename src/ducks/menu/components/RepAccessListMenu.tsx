import React from 'react';
import {useSelector} from "react-redux";
import {selectRepAccessList} from "../../user/selectors";
import MenuItemRouterLink from "./MenuItemRouterLink";
import Box from "@mui/material/Box";
import {accessListURL, repAccessCode} from "../../user/utils";
import MenuLinkProfile from "./MenuLinkProfile";
import MenuItem from "@mui/material/MenuItem";

const RepAccessListMenu = ({onClick}: {
    onClick: () => void
}) => {
    const accessList = useSelector(selectRepAccessList);
    if (!accessList.length) {
        return null;
    }

    return (
        <div>
            <MenuItem>
                Rep Access List
            </MenuItem>
            <Box component="ul" sx={{padding: 0}}>
                {accessList.map(access => (
                    <MenuItemRouterLink key={access.id} to={accessListURL(access)} onClick={onClick}>
                        <MenuLinkProfile linkCode={repAccessCode(access)} linkName={access.SalespersonName ?? ''}/>
                    </MenuItemRouterLink>
                ))}
            </Box>
        </div>
    )
}

export default RepAccessListMenu;
