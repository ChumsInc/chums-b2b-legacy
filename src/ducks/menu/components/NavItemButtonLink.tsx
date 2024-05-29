import Button, {ButtonProps} from "@mui/material/Button";
import {Link as RouterLink} from "react-router-dom";
import React from "react";
import {useTheme} from "@mui/material/styles";


export interface NavItemButtonLinkProps extends ButtonProps {
    to?: string | null;
    replace?: string;
}

const NavItemButtonLink = ({to, replace, children, sx, ...props}: NavItemButtonLinkProps) => {
    const theme = useTheme();

    return (
        <Button component={RouterLink} size="large" disabled={!to} to={to} replace={replace}
                sx={{color: theme.palette.grey["900"], ...sx}} {...props}>
            {children}
        </Button>
    )
}
export default NavItemButtonLink;
