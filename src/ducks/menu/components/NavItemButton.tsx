import Button, {ButtonProps} from "@mui/material/Button";
import React from "react";
import {styled} from "@mui/material/styles";

export const navItemButtonStyle = {
    color: '#000',
    mx: 3,
}

export const StyledNavButton = styled(Button)(({theme}) => ({
    color: theme.palette.grey["900"],
}))
const NavItemButton = ({children, sx, ...props}: ButtonProps) => {
    return (
        <StyledNavButton size="large" sx={sx} {...props}>
            {children}
        </StyledNavButton>
    )
}
export default NavItemButton;
