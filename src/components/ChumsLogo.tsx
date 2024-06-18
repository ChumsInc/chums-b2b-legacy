import React from 'react';
import Box from "@mui/material/Box";
import {SxProps} from "@mui/system";

export default function ChumsLogo({sx}:{
    sx?: SxProps
}) {
    return (
        <Box component="img" width="1920" height="1080"
             sx={{maxWidth: {xs: '33vw', sm: '15vw'}, width: '150px', margin: {xs: '1rem', sm: '0', md: '0 1.5rem'}, ...sx}}
             src={"/images/logos/Chums-Logo-Badge-Red-RGB.png"} alt="Chums Logo"/>
    )
}
