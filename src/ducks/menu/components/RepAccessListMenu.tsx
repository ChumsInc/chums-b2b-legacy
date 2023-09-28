import React from 'react';
import {useSelector} from "react-redux";
import {selectRepAccessList} from "../../user/selectors";
import MenuItemRouterLink from "./MenuItemRouterLink";
import Box from "@mui/material/Box";
import {accessListURL, repAccessCode} from "../../user/utils";
import MenuLinkProfile from "./MenuLinkProfile";
import MenuItem from "@mui/material/MenuItem";
import {generatePath} from "react-router-dom";

const RepAccessListMenu = ({open, onClick}: {
    open: boolean,
    onClick: () => void
}) => {
    const accessList = useSelector(selectRepAccessList);
    if (!accessList.length) {
        return null;
    }

    if (accessList.length === 1) {
        return (
            <MenuItemRouterLink to={generatePath('/profile/:id', {id: `${accessList[0].id}`})} onClick={onClick}>
                Account List
            </MenuItemRouterLink>
        )
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
