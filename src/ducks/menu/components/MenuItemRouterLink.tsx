import React from 'react';
import {Link as RouterLink} from 'react-router-dom';
import MenuItem, {MenuItemProps} from "@mui/material/MenuItem";
import Link from "@mui/material/Link";

export interface MenuItemRouterLinkProps extends MenuItemProps {
    to: string;
    replace?: boolean;
    children: React.ReactNode;
}
export default function MenuItemRouterLink({to, replace, children, ...props}:MenuItemRouterLinkProps) {
    return (
        <Link component={RouterLink} to={to} replace={replace} underline="hover">
            <MenuItem {...props}>
                {children}
            </MenuItem>
        </Link>
    )
}
