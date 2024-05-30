import React, {useEffect, useId} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentAccess, selectLoggedIn} from "../../user/selectors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItemRouterLink from "./MenuItemRouterLink";
import GoogleSignInOneTap from "../../user/components/GoogleSignInOneTap";
import UserAvatar from "../../user/components/UserAvatar";
import {generatePath} from "react-router-dom";


const UserMenu = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const currentAccess = useSelector(selectCurrentAccess);
    const buttonId = useId();
    const menuId = useId();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    useEffect(() => {
        if (open && !isLoggedIn) {
            setAnchorEl(null);
        }
    }, [isLoggedIn]);


    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    if (!isLoggedIn) {
        return (
            <>
                <IconButton onClick={handleClick}>
                    <UserAvatar/>
                </IconButton>
                <Menu id={menuId} open={open} onClose={handleClose} anchorEl={anchorEl}
                      MenuListProps={{'aria-labelledby': buttonId}}>
                    <MenuItemRouterLink to="/login">Login</MenuItemRouterLink>
                    <GoogleSignInOneTap onDone={handleClose}/>
                </Menu>
            </>
        )
    }

    return (
        <>
            <IconButton onClick={handleClick}>
                <UserAvatar/>
            </IconButton>
            <Menu id={menuId} open={open} onClose={handleClose} anchorEl={anchorEl}
                  MenuListProps={{'aria-labelledby': buttonId}}>
                <MenuItemRouterLink to="/profile">Profile</MenuItemRouterLink>
                {currentAccess && (
                    <MenuItemRouterLink to={generatePath('/profile/:id', {id: `${currentAccess.id}`})}>
                        Accounts
                    </MenuItemRouterLink>
                )}
                <MenuItemRouterLink to="/logout">Logout</MenuItemRouterLink>
            </Menu>
        </>
    )
}


export default UserMenu;
