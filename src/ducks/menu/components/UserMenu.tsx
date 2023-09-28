import React, {useEffect, useId, useRef, useState} from 'react';
import {useSelector} from "react-redux";
import {selectCurrentAccess, selectLoggedIn, selectLoginExpiry} from "../../user/selectors";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItemRouterLink from "./MenuItemRouterLink";
import GoogleSignInOneTap from "../../user/components/GoogleSignInOneTap";
import UserAvatar from "../../user/components/UserAvatar";
import {generatePath} from "react-router-dom";

const isExpired = (expires: number) => {
    if (!expires || expires < 0) {
        return true;
    }
    return new Date(expires * 1000).valueOf() <= new Date().valueOf();
}


const UserMenu = () => {
    const isLoggedIn = useSelector(selectLoggedIn);
    const currentAccess = useSelector(selectCurrentAccess);
    const expires = useSelector(selectLoginExpiry);
    const timerRef = useRef<number>(0);
    const buttonId = useId();
    const menuId = useId();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [expired, setExpired] = useState(isExpired(expires));

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }
        window.clearTimeout(timerRef.current);
        if (!isExpired(expires)) {
            timerRef.current = window.setInterval(() => {
                setExpired(isExpired(expires));
            })
        }
        return () => {
            if (typeof window === 'undefined') {
                return;
            }
            window.clearTimeout(timerRef.current);
        }
    }, [expires]);

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
            {(!isLoggedIn || expired) && typeof window !== 'undefined' && <GoogleSignInOneTap onSignIn={() => setAnchorEl(null)}/>}
        </>
    )
}


export default UserMenu;
