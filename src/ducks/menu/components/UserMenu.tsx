import React, {useId} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentAccess, selectLoggedIn} from "@/ducks/user/selectors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItemRouterLink from "@/ducks/menu/components/MenuItemRouterLink";
import GoogleSignInOneTap from "@/ducks/user/components/GoogleSignInOneTap";
import UserAvatar from "@/ducks/user/components/UserAvatar";
import {generatePath} from "react-router-dom";

const UserMenu = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const currentAccess = useSelector(selectCurrentAccess);
    const buttonId = useId();
    const menuId = useId();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <IconButton onClick={handleClick}>
                <UserAvatar/>
            </IconButton>
            <Menu id={menuId} open={open} onClose={handleClose} anchorEl={anchorEl}
                  MenuListProps={{'aria-labelledby': buttonId}}>
                {!isLoggedIn && (<MenuItemRouterLink to="/login">Login</MenuItemRouterLink>)}
                <MenuItemRouterLink to="/profile">Profile</MenuItemRouterLink>
                {currentAccess && (
                    <MenuItemRouterLink to={generatePath('/profile/:id', {id: `${currentAccess.id}`})}>
                        Accounts
                    </MenuItemRouterLink>
                )}
                <MenuItemRouterLink to="/logout">Logout</MenuItemRouterLink>
            </Menu>
            {!isLoggedIn && <GoogleSignInOneTap/>}
        </>
    )
}


export default UserMenu;
