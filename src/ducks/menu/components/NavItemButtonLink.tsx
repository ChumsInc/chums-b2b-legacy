import Button, {ButtonProps} from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";
import React from "react";
import {navItemButtonStyle, StyledNavButton} from "./NavItemButton";
import {styled} from "@mui/material/styles";
import {useTheme} from "@mui/material";


export interface NavItemButtonLinkProps extends ButtonProps {
    to?: string | null;
    replace?: string;
}

const NavItemButtonLink = ({to, replace, children, sx, ...props}: NavItemButtonLinkProps) => {
    const theme = useTheme();

    return (
        <Button component={RouterLink as any} size="large" disabled={!to} to={to} replace={replace}
                sx={{color: theme.palette.grey["900"], ...sx}} {...props}>
            {children}
        </Button>
    )
}
export default NavItemButtonLink;
