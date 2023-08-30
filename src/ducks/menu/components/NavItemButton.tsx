import Button, {ButtonProps} from "@mui/material/Button";
import React from "react";

export const navItemButtonStyle = {
    color: '#000',
    mx: 3,
}

const NavItemButton = ({children, sx, ...props}: ButtonProps) => {
    return (
        <Button size="large" sx={{...navItemButtonStyle, ...sx}} {...props}>
            {children}
        </Button>
    )
}
export default NavItemButton;
