import Button, {ButtonProps} from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";
import React from "react";
import {navItemButtonStyle} from "@/components/NavItemButton";


export interface NavItemButtonLinkProps extends ButtonProps {
    to?: string | null;
    replace?: string;
}

const NavItemButtonLink = ({to, replace, children, sx, ...props}: NavItemButtonLinkProps) => {
    return (
        <Button component={RouterLink as any} disabled={!to} to={to} replace={replace}
                sx={{...navItemButtonStyle, ...sx}} {...props}>
            {children}
        </Button>
    )
}
export default NavItemButtonLink;
